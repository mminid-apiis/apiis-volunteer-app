// 每套课程 0~66 周的上课日期（均为周一，week 0 = Orientation）。
// 真实日历中两套课程日期不同、各有多个 term break（break = 被跳过的周一）。

export type Curriculum = 'MMin 2' | 'MMin 3'

export interface WeekDate {
  week: number
  date: string // 'YYYY-MM-DD'（周一）
}

export const CALENDAR: Record<Curriculum, WeekDate[]> = {
  'MMin 2': [
    { week: 0, date: '2026-02-02' },
    { week: 1, date: '2026-02-09' },
    { week: 2, date: '2026-02-16' },
    { week: 3, date: '2026-02-23' },
    { week: 4, date: '2026-03-02' },
    { week: 5, date: '2026-03-09' },
    { week: 6, date: '2026-03-16' },
    { week: 7, date: '2026-03-23' },
    { week: 8, date: '2026-04-13' },
    { week: 9, date: '2026-04-20' },
    { week: 10, date: '2026-04-27' },
    { week: 11, date: '2026-05-04' },
    { week: 12, date: '2026-05-11' },
    { week: 13, date: '2026-05-18' },
    { week: 14, date: '2026-05-25' },
    { week: 15, date: '2026-06-01' },
    { week: 16, date: '2026-06-08' },
    { week: 17, date: '2026-06-29' },
    { week: 18, date: '2026-07-06' },
    { week: 19, date: '2026-07-13' },
    { week: 20, date: '2026-07-20' },
    { week: 21, date: '2026-07-27' },
    { week: 22, date: '2026-08-03' },
    { week: 23, date: '2026-08-10' },
    { week: 24, date: '2026-08-17' },
    { week: 25, date: '2026-08-24' },
    { week: 26, date: '2026-09-14' },
    { week: 27, date: '2026-09-21' },
    { week: 28, date: '2026-09-28' },
    { week: 29, date: '2026-10-05' },
    { week: 30, date: '2026-10-12' },
    { week: 31, date: '2026-10-19' },
    { week: 32, date: '2026-10-26' },
    { week: 33, date: '2027-02-08' },
    { week: 34, date: '2027-02-15' },
    { week: 35, date: '2027-02-22' },
    { week: 36, date: '2027-03-01' },
    { week: 37, date: '2027-03-08' },
    { week: 38, date: '2027-03-15' },
    { week: 39, date: '2027-03-22' },
    { week: 40, date: '2027-03-29' },
    { week: 41, date: '2027-04-12' },
    { week: 42, date: '2027-04-19' },
    { week: 43, date: '2027-04-26' },
    { week: 44, date: '2027-05-03' },
    { week: 45, date: '2027-05-10' },
    { week: 46, date: '2027-05-17' },
    { week: 47, date: '2027-05-24' },
    { week: 48, date: '2027-05-31' },
    { week: 49, date: '2027-06-07' },
    { week: 50, date: '2027-06-21' },
    { week: 51, date: '2027-06-28' },
    { week: 52, date: '2027-07-05' },
    { week: 53, date: '2027-07-12' },
    { week: 54, date: '2027-07-19' },
    { week: 55, date: '2027-07-26' },
    { week: 56, date: '2027-08-02' },
    { week: 57, date: '2027-08-09' },
    { week: 58, date: '2027-08-16' },
    { week: 59, date: '2027-08-23' },
    { week: 60, date: '2027-08-30' },
    { week: 61, date: '2027-09-06' },
    { week: 62, date: '2027-09-20' },
    { week: 63, date: '2027-09-27' },
    { week: 64, date: '2027-10-04' },
    { week: 65, date: '2027-10-11' },
    { week: 66, date: '2027-10-18' },
  ],
  'MMin 3': [
    { week: 0, date: '2027-02-01' },
    { week: 1, date: '2027-02-08' },
    { week: 2, date: '2027-02-15' },
    { week: 3, date: '2027-02-22' },
    { week: 4, date: '2027-03-01' },
    { week: 5, date: '2027-03-08' },
    { week: 6, date: '2027-03-15' },
    { week: 7, date: '2027-03-22' },
    { week: 8, date: '2027-03-29' },
    { week: 9, date: '2027-04-12' },
    { week: 10, date: '2027-04-19' },
    { week: 11, date: '2027-04-26' },
    { week: 12, date: '2027-05-03' },
    { week: 13, date: '2027-05-10' },
    { week: 14, date: '2027-05-17' },
    { week: 15, date: '2027-05-24' },
    { week: 16, date: '2027-05-31' },
    { week: 17, date: '2027-06-07' },
    { week: 18, date: '2027-06-21' },
    { week: 19, date: '2027-06-28' },
    { week: 20, date: '2027-07-05' },
    { week: 21, date: '2027-07-12' },
    { week: 22, date: '2027-07-19' },
    { week: 23, date: '2027-07-26' },
    { week: 24, date: '2027-08-02' },
    { week: 25, date: '2027-08-09' },
    { week: 26, date: '2027-08-16' },
    { week: 27, date: '2027-08-23' },
    { week: 28, date: '2027-08-30' },
    { week: 29, date: '2027-09-06' },
    { week: 30, date: '2027-09-20' },
    { week: 31, date: '2027-09-27' },
    { week: 32, date: '2027-10-04' },
    { week: 33, date: '2027-10-11' },
    { week: 34, date: '2027-10-18' },
    { week: 35, date: '2028-02-07' },
    { week: 36, date: '2028-02-14' },
    { week: 37, date: '2028-02-21' },
    { week: 38, date: '2028-02-28' },
    { week: 39, date: '2028-03-06' },
    { week: 40, date: '2028-03-13' },
    { week: 41, date: '2028-03-20' },
    { week: 42, date: '2028-03-27' },
    { week: 43, date: '2028-04-17' },
    { week: 44, date: '2028-04-24' },
    { week: 45, date: '2028-05-01' },
    { week: 46, date: '2028-05-08' },
    { week: 47, date: '2028-05-15' },
    { week: 48, date: '2028-05-22' },
    { week: 49, date: '2028-05-29' },
    { week: 50, date: '2028-06-05' },
    { week: 51, date: '2028-06-26' },
    { week: 52, date: '2028-07-03' },
    { week: 53, date: '2028-07-10' },
    { week: 54, date: '2028-07-17' },
    { week: 55, date: '2028-07-24' },
    { week: 56, date: '2028-07-31' },
    { week: 57, date: '2028-08-07' },
    { week: 58, date: '2028-08-14' },
    { week: 59, date: '2028-08-21' },
    { week: 60, date: '2028-08-28' },
    { week: 61, date: '2028-09-18' },
    { week: 62, date: '2028-09-25' },
    { week: 63, date: '2028-10-02' },
    { week: 64, date: '2028-10-09' },
    { week: 65, date: '2028-10-16' },
    { week: 66, date: '2028-10-23' },
  ],
}

const DATE_TO_WEEK: Record<Curriculum, Record<string, number>> = {
  'MMin 2': Object.fromEntries(CALENDAR['MMin 2'].map((w) => [w.date, w.week])),
  'MMin 3': Object.fromEntries(CALENDAR['MMin 3'].map((w) => [w.date, w.week])),
}

/** ISO 日期加 n 天（按 UTC 计算，避开时区偏移）。 */
function addDaysISO(iso: string, n: number): string {
  const [y, m, d] = iso.split('-').map(Number)
  const dt = new Date(Date.UTC(y, m - 1, d))
  dt.setUTCDate(dt.getUTCDate() + n)
  return dt.toISOString().slice(0, 10)
}

/** 把任意日期规整到所在自然周的周一（ISO）。 */
function mondayOfWeekISO(iso: string): string {
  const [y, m, d] = iso.split('-').map(Number)
  const dow = new Date(Date.UTC(y, m - 1, d)).getUTCDay() // 0=周日 … 6=周六
  return addDaysISO(iso, -((dow + 6) % 7))
}

/** 班级名 → 课程体系（名字含 "MMin 3"/"MMin 2"）。无法识别返回 null。 */
export function curriculumForClass(className: string | null | undefined): Curriculum | null {
  if (!className) return null
  if (className.includes('MMin 3')) return 'MMin 3'
  if (className.includes('MMin 2')) return 'MMin 2'
  return null
}

export function weeksForCurriculum(c: Curriculum): WeekDate[] {
  return CALENDAR[c]
}

/** 周次 → 该课程的上课日期（周一锚点）。 */
export function dateForWeek(c: Curriculum, week: number): string | undefined {
  return CALENDAR[c].find((w) => w.week === week)?.date
}

/** 班级名 → 上课日相对周一的天数偏移：名字含 "Pastoral" 的班（周二上课）+1，其余（含 Leadership，周一上课）0。 */
export function weekdayOffsetForClass(className: string | null | undefined): number {
  return className && className.toLowerCase().includes('pastoral') ? 1 : 0
}

/** 某班某周的实际上课日期：课程周一锚点 + 班级星期偏移（Pastoral 班 +1 天）。 */
export function sessionDateForWeek(
  c: Curriculum,
  week: number,
  className: string | null | undefined,
): string | undefined {
  const monday = dateForWeek(c, week)
  return monday ? addDaysISO(monday, weekdayOffsetForClass(className)) : undefined
}

/** 上课日期 → 周次：先规整到所在周的周一再查，兼容周一/周二班与历史数据。不在课表内返回 null。 */
export function weekForDate(c: Curriculum, dateISO: string): number | null {
  return DATE_TO_WEEK[c][mondayOfWeekISO(dateISO)] ?? null
}

/** 标签：week 0 显示 Orientasi，其余 Minggu N。 */
export function weekLabel(week: number): string {
  return week === 0 ? 'Orientasi' : `Minggu ${week}`
}

/** 当前/最近一周：日期 <= today 的最大周次（用作下拉默认值）。 */
export function currentWeek(c: Curriculum, todayISO: string): number {
  let chosen = CALENDAR[c][0].week
  for (const w of CALENDAR[c]) {
    if (w.date <= todayISO) chosen = w.week
    else break
  }
  return chosen
}
