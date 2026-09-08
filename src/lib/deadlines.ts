// 可用性 / 补位的截止时间。全部按组织时区 UTC+7（WIB）的“墙上时间”定义，
// 计算成 UTC 毫秒瞬间，便于与 Date.now() 比较（与浏览器所在时区无关）。

import { curriculumForClass } from '@/lib/calendar'

const TZ = 7 // UTC+7（WIB）

/** 以「该周周一(ISO)+ 天数偏移」的那一天、UTC+7 的 hour:minute，返回 UTC 毫秒瞬间。 */
function instant(weekMondayISO: string, dayOffset: number, hour: number, minute: number): number {
  const [y, m, d] = weekMondayISO.split('-').map(Number)
  const day = new Date(Date.UTC(y, m - 1, d + dayOffset)) // 规整加减天数(跨月/跨年安全)
  return Date.UTC(day.getUTCFullYear(), day.getUTCMonth(), day.getUTCDate(), hour - TZ, minute)
}

/** 可用性回复截止：该周周六 22:59（UTC+7）。 */
export function availabilityDeadline(weekMondayISO: string): number {
  return instant(weekMondayISO, -2, 22, 59)
}

/**
 * 补位认领截止（按班级，UTC+7/WIB，课前几小时）：
 *   MMin 2 Leadership（周一 19:00 上课）→ 周一 15:00
 *   MMin 2 Pastoral（周二 08:00 上课）→ 前一晚周一 22:00
 *   MMin 3 Leadership（周一 08:00 上课）→ 前一晚周日 22:00
 *   MMin 3 Pastoral（周二 19:00 上课）→ 周二 15:00
 * 识别不到班级返回 null（不设截止）。
 */
export function coverageDeadline(weekMondayISO: string, className: string): number | null {
  const curriculum = curriculumForClass(className)
  if (!curriculum) return null
  const isPastoral = className.toLowerCase().includes('pastoral')
  if (curriculum === 'MMin 2') {
    return isPastoral
      ? instant(weekMondayISO, 0, 22, 0) // MMin 2 Pastoral: Monday 10pm
      : instant(weekMondayISO, 0, 15, 0) // MMin 2 Leadership: Monday 3pm
  }
  return isPastoral
    ? instant(weekMondayISO, 1, 15, 0) // MMin 3 Pastoral: Tuesday 3pm
    : instant(weekMondayISO, -1, 22, 0) // MMin 3 Leadership: Sunday 10pm
}

export function isPast(deadlineMs: number): boolean {
  return Date.now() > deadlineMs
}

const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
const pad = (n: number) => String(n).padStart(2, '0')

/** 把截止瞬间格式化成 UTC+7 墙上时间标签，如 "Sat 06-27 19:59"。 */
export function formatDeadline(deadlineMs: number): string {
  const d = new Date(deadlineMs + TZ * 3600 * 1000) // 偏到 UTC+8 后用 UTC 取值
  return `${DAYS[d.getUTCDay()]} ${pad(d.getUTCMonth() + 1)}-${pad(d.getUTCDate())} ${pad(d.getUTCHours())}:${pad(d.getUTCMinutes())}`
}
