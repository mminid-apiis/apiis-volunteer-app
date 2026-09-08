-- 把自动通知 + 邮件文案(可用性提醒、补位征集、重新开放补位)翻译成印尼语。
-- 顺带修复 admin_reopen_coverage 里判断"周二班"的旧逻辑:原来用班级名含 "tuesday"
-- 判断(配 MMin 6L/7P 这类旧命名),restructure 到 MMin 2/3 Leadership/Pastoral 后已失效
-- (班级名不再含 "tuesday"),改成跟前端 weekdayOffsetForClass 一致的 "pastoral" 判断。

create or replace function public.run_weekly_availability_check(
  p_send_email boolean default false,
  p_curriculum text default null
)
returns integer
language plpgsql security definer set search_path = ''
as $$
declare
  wk          date := public.next_week_monday();
  s           public.app_settings;
  n           integer := 0;
  app_url     text;
  email_batch jsonb;
begin
  if (select auth.uid()) is not null and not public.is_admin() then
    raise exception '只有管理员可手动运行';
  end if;
  select * into s from public.app_settings where id;
  if s.reminders_enabled is distinct from true then return 0; end if;
  if not exists (
    select 1 from public.class_sessions
    where session_date = wk and (p_curriculum is null or curriculum = p_curriculum)
  ) then
    return 0;
  end if;

  insert into public.availability (volunteer_id, group_id, week_start_date, is_available)
  select distinct a.volunteer_id, a.group_id, wk, null::boolean
  from public.assignments a
  join public.groups g on g.id = a.group_id
  join public.cohorts c on c.id = g.cohort_id
  join public.profiles p on p.id = a.volunteer_id
  where p.role = 'volunteer' and a.coverage_week is null
    and (p_curriculum is null or c.name like p_curriculum || '%')
  on conflict (volunteer_id, group_id, week_start_date) do nothing;

  insert into public.notifications (recipient_id, type, title, body)
  select p.id, 'weekly_check', 'Apakah kamu tersedia minggu depan?',
         'Mohon konfirmasi, untuk setiap grup kamu, apakah kamu bisa mengawasi selama minggu '
         || to_char(wk, 'YYYY-MM-DD') || '.'
  from public.profiles p
  where p.role = 'volunteer'
    and (p_curriculum is null or exists (
      select 1 from public.assignments a
      join public.groups g on g.id = a.group_id
      join public.cohorts c on c.id = g.cohort_id
      where a.volunteer_id = p.id and c.name like p_curriculum || '%'
    ));
  get diagnostics n = row_count;

  if p_send_email then
    select decrypted_secret into app_url from vault.decrypted_secrets where name = 'app_url';
    select coalesce(jsonb_agg(jsonb_build_object(
             'to', u.email,
             'subject', 'APIIS OBS Volunteer — Apakah kamu tersedia minggu depan?',
             'html', '<p>Hai ' || coalesce(p.full_name, '') || ',</p>'
                     || '<p>Mohon konfirmasi apakah kamu bisa mengawasi grup berikut minggu depan (minggu <b>'
                     || to_char(wk, 'YYYY-MM-DD') || '</b>):</p>'
                     || '<ul>' || coalesce((
                          select string_agg('<li>' || c2.name || ' — ' || g2.name || '</li>', '' order by c2.name, g2.name)
                          from public.assignments a2
                          join public.groups g2 on g2.id = a2.group_id
                          join public.cohorts c2 on c2.id = g2.cohort_id
                          where a2.volunteer_id = p.id and a2.coverage_week is null
                            and (p_curriculum is null or c2.name like p_curriculum || '%')
                        ), '<li>grup yang ditugaskan ke kamu</li>') || '</ul>'
                     || '<p>Buka app untuk menjawab Ya/Tidak untuk tiap grup:</p>'
                     || case when app_url is not null then '<p><a href="' || app_url || '">Buka App APIIS Volunteer</a></p>' else '' end
           )), '[]'::jsonb)
      into email_batch
    from public.profiles p
    join auth.users u on u.id = p.id
    where p.role = 'volunteer' and u.email is not null
      and (p_curriculum is null or exists (
        select 1 from public.assignments a
        join public.groups g on g.id = a.group_id
        join public.cohorts c on c.id = g.cohort_id
        where a.volunteer_id = p.id and c.name like p_curriculum || '%'
      ));
    perform public.app_send_email_batch(email_batch);
  end if;

  return n;
end;
$$;
grant execute on function public.run_weekly_availability_check(boolean, text) to authenticated;

create or replace function public.run_summarize_coverage(
  p_send_email boolean default false,
  p_curriculum text default null
)
returns integer
language plpgsql security definer set search_path = ''
as $$
declare
  wk          date := public.next_week_monday();
  n           integer := 0;
  app_url     text;
  email_batch jsonb;
  has_open    boolean;
  open_html   text;
begin
  if (select auth.uid()) is not null and not public.is_admin() then
    raise exception '只有管理员可手动运行';
  end if;
  if not exists (select 1 from public.class_sessions where session_date = wk) then
    return 0;
  end if;

  -- 缺口:某组的原负责人本周标了不可用 → 建补位(仅那周有课的组)
  insert into public.coverage_requests (group_id, week_start_date, reason, status)
  select distinct av.group_id, wk, 'Volunteer yang ditugaskan tidak tersedia', 'open'
  from public.availability av
  join public.groups g on g.id = av.group_id
  join public.cohorts c on c.id = g.cohort_id
  where av.week_start_date = wk and av.is_available = false
    and exists (select 1 from public.class_sessions cs where cs.session_date = wk and cs.curriculum = left(c.name, 6))
  on conflict (group_id, week_start_date) do nothing;

  select exists (select 1 from public.coverage_requests where week_start_date = wk and status = 'open') into has_open;

  if has_open then
    -- 收件人:本周至少有一个组标了 available 的志愿者(+ 可选课程过滤)
    insert into public.notifications (recipient_id, type, title, body)
    select p.id, 'coverage_request', 'Butuh coverage',
           'Beberapa grup butuh coverage untuk minggu ' || to_char(wk, 'YYYY-MM-DD') || '. Bisakah kamu membantu?'
    from public.profiles p
    where p.role = 'volunteer'
      and exists (
        select 1 from public.availability av
        where av.volunteer_id = p.id and av.week_start_date = wk and av.is_available = true
      )
      and (p_curriculum is null or exists (
        select 1 from public.assignments a
        join public.groups g on g.id = a.group_id
        join public.cohorts c on c.id = g.cohort_id
        where a.volunteer_id = p.id and c.name like p_curriculum || '%'
      ));

    if p_send_email then
      select decrypted_secret into app_url from vault.decrypted_secrets where name = 'app_url';

      select coalesce(string_agg('<li>' || c.name || ' — ' || g.name || '</li>', '' order by c.name, g.name), '')
        into open_html
      from public.coverage_requests cr
      join public.groups g on g.id = cr.group_id
      join public.cohorts c on c.id = g.cohort_id
      where cr.week_start_date = wk and cr.status = 'open';

      select coalesce(jsonb_agg(jsonb_build_object(
               'to', u.email,
               'subject', 'APIIS OBS Volunteer — Butuh coverage',
               'html', '<p>Hai ' || coalesce(p.full_name, '') || ',</p>'
                       || '<p>Grup-grup berikut butuh coverage untuk minggu <b>' || to_char(wk, 'YYYY-MM-DD') || '</b>. Bisakah kamu membantu?</p>'
                       || '<ul>' || open_html || '</ul>'
                       || case when app_url is not null then '<p><a href="' || app_url || '">Buka App APIIS Volunteer untuk klaim</a></p>' else '' end
             )), '[]'::jsonb)
        into email_batch
      from public.profiles p
      join auth.users u on u.id = p.id
      where p.role = 'volunteer' and u.email is not null
        and exists (
          select 1 from public.availability av
          where av.volunteer_id = p.id and av.week_start_date = wk and av.is_available = true
        )
        and (p_curriculum is null or exists (
          select 1 from public.assignments a
          join public.groups g on g.id = a.group_id
          join public.cohorts c on c.id = g.cohort_id
          where a.volunteer_id = p.id and c.name like p_curriculum || '%'
        ));
      perform public.app_send_email_batch(email_batch);
    end if;
  end if;

  select count(*) into n from public.coverage_requests where week_start_date = wk and status = 'open';
  return n;
end;
$$;
grant execute on function public.run_summarize_coverage(boolean, text) to authenticated;

create or replace function public.admin_reopen_coverage(p_request_id uuid)
returns void
language plpgsql
security definer
set search_path = ''
as $$
declare
  req       public.coverage_requests;
  grp_name  text;
  cls_name  text;
  sess_date date;
begin
  if not public.is_admin() then
    raise exception 'Admins only';
  end if;

  select * into req from public.coverage_requests where id = p_request_id for update;
  if not found then
    raise exception 'Coverage request not found';
  end if;

  -- 释放原认领人的临时补位分配
  if req.covered_by is not null then
    delete from public.assignments
    where group_id = req.group_id
      and volunteer_id = req.covered_by
      and coverage_week = req.week_start_date;
  end if;

  -- 请求改回 open
  update public.coverage_requests
    set status = 'open', covered_by = null
    where id = p_request_id;

  -- 组名 / 班名 / 实际上课日(Pastoral 班 = 周一 +1;与前端 weekdayOffsetForClass 一致)
  select g.name, c.name into grp_name, cls_name
  from public.groups g
  join public.cohorts c on c.id = g.cohort_id
  where g.id = req.group_id;
  sess_date := req.week_start_date + case when cls_name ilike '%pastoral%' then 1 else 0 end;

  -- 主动站内通知本周 available 的志愿者(不发邮件)
  insert into public.notifications (recipient_id, type, title, body)
  select p.id, 'general', 'Kembali butuh coverage',
         coalesce(grp_name, 'Sebuah grup') || ' · ' || coalesce(cls_name, '')
         || ' butuh coverage pada ' || to_char(sess_date, 'YYYY-MM-DD')
         || '. Buka APIIS Volunteer untuk klaim.'
  from public.profiles p
  where p.role = 'volunteer'
    and exists (
      select 1 from public.availability av
      where av.volunteer_id = p.id
        and av.week_start_date = req.week_start_date
        and av.is_available = true
    );
end;
$$;
grant execute on function public.admin_reopen_coverage(uuid) to authenticated;
