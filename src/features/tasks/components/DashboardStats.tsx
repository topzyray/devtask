import type { TaskStats } from '../types.ts'
import { cn } from '../../../lib/cn.ts'

type DashboardStatsProps = {
  stats: TaskStats
}

export function DashboardStats({ stats }: DashboardStatsProps) {
  const cards = [
    { label: 'Total tasks', value: String(stats.total), hint: 'Everything on your list' },
    { label: 'Pending', value: String(stats.pending), hint: 'Not started' },
    { label: 'In progress', value: String(stats.inProgress), hint: 'Currently being worked' },
    { label: 'Completed', value: String(stats.completed), hint: 'Finished work' },
    {
      label: 'Overdue',
      value: String(stats.overdue),
      hint: 'Open tasks past their due date',
      danger: stats.overdue > 0,
    },
    {
      label: 'Completion',
      value: `${stats.completionPercentage}%`,
      hint: stats.total === 0 ? 'No tasks yet' : `${stats.completed} of ${stats.total} tasks completed`,
      meter: true,
    },
  ]

  return (
    <section aria-label="Task summary" className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
      {cards.map((card) => (
        <article key={card.label} className="rounded-2xl border border-line bg-surface px-4 py-4 shadow-sm">
          <p className="font-mono text-[11px] tracking-[0.14em] text-muted uppercase">{card.label}</p>
          <p className={cn('mt-2 text-3xl font-semibold tracking-tight', card.danger && 'text-danger')}>{card.value}</p>
          <p className="mt-1 text-sm text-muted">{card.hint}</p>
          {card.meter ? (
            <div
              className="mt-3 h-2 overflow-hidden rounded-full bg-line"
              role="meter"
              aria-label="Completion percentage"
              aria-valuemin={0}
              aria-valuemax={100}
              aria-valuenow={stats.completionPercentage}
              aria-valuetext={`${stats.completionPercentage} percent`}
            >
              <div className="h-full rounded-full bg-brand" style={{ width: `${stats.completionPercentage}%` }} />
            </div>
          ) : null}
        </article>
      ))}
    </section>
  )
}
