// 按班级区分的配色，用于 Admin Console 里需要一眼分清班级的地方
// （Groups & Assignments 的分区表头、Records 的分区表头、Students 的选中班级横幅、
// Volunteers 的「所属组」徽章）。未来新增班级落到灰色兜底，不需要改这里以外的代码。

export interface CohortAccent {
  bar: string
  bg: string
  text: string
  border: string
  badge: string // 用于紧凑徽章（如 Volunteers 表的 "2P · Group 5"）
}

const COHORT_ACCENTS: { match: RegExp; accent: CohortAccent }[] = [
  {
    match: /MMin\s*2.*Leadership/i,
    accent: {
      bar: 'bg-blue-600',
      bg: 'bg-blue-50',
      text: 'text-blue-900',
      border: 'border-blue-200',
      badge: 'border-blue-200 bg-blue-50 text-blue-900',
    },
  },
  {
    match: /MMin\s*2.*Pastoral/i,
    accent: {
      bar: 'bg-emerald-600',
      bg: 'bg-emerald-50',
      text: 'text-emerald-900',
      border: 'border-emerald-200',
      badge: 'border-emerald-200 bg-emerald-50 text-emerald-900',
    },
  },
  {
    match: /MMin\s*3.*Leadership/i,
    accent: {
      bar: 'bg-purple-600',
      bg: 'bg-purple-50',
      text: 'text-purple-900',
      border: 'border-purple-200',
      badge: 'border-purple-200 bg-purple-50 text-purple-900',
    },
  },
  {
    match: /MMin\s*3.*Pastoral/i,
    accent: {
      bar: 'bg-amber-600',
      bg: 'bg-amber-50',
      text: 'text-amber-900',
      border: 'border-amber-200',
      badge: 'border-amber-200 bg-amber-50 text-amber-900',
    },
  },
]

const FALLBACK_ACCENT: CohortAccent = {
  bar: 'bg-slate-500',
  bg: 'bg-slate-50',
  text: 'text-slate-900',
  border: 'border-slate-200',
  badge: 'border-slate-200 bg-slate-50 text-slate-900',
}

export function cohortAccent(cohortName: string | null | undefined): CohortAccent {
  if (!cohortName) return FALLBACK_ACCENT
  return COHORT_ACCENTS.find((a) => a.match.test(cohortName))?.accent ?? FALLBACK_ACCENT
}

/**
 * 把已按 cohort 排好序的列表（如 useAllGroups() 的结果）按相邻 cohort_id 分段，
 * 保留原有顺序，不必再排序一次。
 */
export function groupByCohort<T extends { cohort_id: string; cohort?: { name: string } | null }>(
  items: T[],
): { cohortId: string; cohortName: string; items: T[] }[] {
  const sections: { cohortId: string; cohortName: string; items: T[] }[] = []
  for (const item of items) {
    const last = sections[sections.length - 1]
    if (last && last.cohortId === item.cohort_id) {
      last.items.push(item)
    } else {
      sections.push({
        cohortId: item.cohort_id,
        cohortName: item.cohort?.name ?? 'Unassigned',
        items: [item],
      })
    }
  }
  return sections
}
