-- 提前建立 MMin 3 两班（先各 10 组占位，之后用 Admin Console 的 "Add group" 按钮按实际人数增补）。
-- 课程日历（class_sessions）已在上一个迁移里预先写好，这里不需要再动。

insert into public.cohorts (id, name, is_active) values
  ('00000000-0000-0000-0000-000000003100', 'MMin 3 Leadership', true),
  ('00000000-0000-0000-0000-000000003200', 'MMin 3 Pastoral',   true)
on conflict (id) do nothing;

insert into public.groups (cohort_id, name, meeting_day)
select c.cid, 'Group ' || g, c.day
from (values
  ('00000000-0000-0000-0000-000000003100'::uuid, 10, 'Monday'),
  ('00000000-0000-0000-0000-000000003200'::uuid, 10, 'Tuesday')
) as c(cid, n, day)
cross join lateral generate_series(1, c.n) as g
on conflict (cohort_id, name) do nothing;
