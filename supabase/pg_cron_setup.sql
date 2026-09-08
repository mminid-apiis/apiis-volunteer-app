-- pg_cron 定时任务（在 Supabase SQL Editor 运行一次；时间为 UTC）
-- 依赖 20260620110000_per_curriculum_reminders 里的 run_*(boolean, text) 函数。
-- 组织时区为 WIB（UTC+7）。当前只有 MMin 2 一个在读课程（Leadership 周一、Pastoral 周二共用同一
-- 可用性提醒）；补位征集（coverage-all）本就覆盖全部课程缺口，MMin 3 启用后无需改动此文件。

create extension if not exists pg_cron;

-- 幂等：取消所有同名旧任务（含早期的全量任务与 APIIS 原始 MMin 6/7 任务）
do $$
declare j text;
begin
  foreach j in array array[
    'weekly-availability-check', 'summarize-coverage',
    'availability-mmin6', 'availability-mmin7', 'coverage-mmin6', 'coverage-mmin7',
    'expire-coverage'
  ] loop
    if exists (select 1 from cron.job where jobname = j) then perform cron.unschedule(j); end if;
  end loop;
end $$;

-- 可用性提醒（true = 同时发邮件）：周四 20:00 WIB = UTC 13:00
select cron.schedule('availability-mmin2', '0 13 * * 4',
  $$ select public.run_weekly_availability_check(true, 'MMin 2'); $$);

-- 补位征集（覆盖全部课程缺口，任何人可认领；true = 同时发邮件）：
-- 周六 23:00 WIB（在可用性截止 22:59 之后）= UTC 16:00
select cron.schedule('coverage-all', '0 16 * * 6',
  $$ select public.run_summarize_coverage(true, null); $$);

-- 每周三清除上周的临时补位分配（被补周一已过去的）：周三 09:00 WIB = UTC 02:00
select cron.schedule('expire-coverage', '0 2 * * 3',
  $$ select public.expire_coverage_assignments(); $$);

-- 每周三清空「原负责志愿者到没到」的临时管理标记：周三 09:00 WIB = UTC 02:00
select cron.schedule('clear-group-checkmarks', '0 2 * * 3',
  $$ select public.clear_group_check_marks(); $$);

-- 每周三清空「管理员手动指派」的分配(只留导入的原负责人)：周三 09:00 WIB = UTC 02:00
select cron.schedule('clear-manual-assignments', '0 2 * * 3',
  $$ select public.clear_manual_assignments(); $$);

-- 查看：select jobname, schedule, active from cron.job order by jobname;
-- 取消单个：select cron.unschedule('availability-mmin6');
