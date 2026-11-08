import { cn } from '../../../lib/cn.ts'
import type { TaskPriority, TaskStatus } from '../types.ts'
import { PRIORITY_LABELS, STATUS_LABELS } from '../types.ts'

const PRIORITY_CLASS: Record<TaskPriority, string> = {
  low: 'bg-stone-200 text-stone-800',
  medium: 'bg-amber-200 text-amber-950',
  high: 'bg-rose-200 text-rose-950',
}

const STATUS_CLASS: Record<TaskStatus, string> = {
  pending: 'bg-stone-200 text-stone-800',
  in_progress: 'bg-sky-200 text-sky-950',
  completed: 'bg-emerald-200 text-emerald-950',
}

export function PriorityBadge({ priority }: { priority: TaskPriority }) {
  return (
    <span className={cn('inline-flex rounded-full px-2 py-0.5 text-xs font-semibold', PRIORITY_CLASS[priority])}>
      {PRIORITY_LABELS[priority]}
    </span>
  )
}

export function StatusBadge({ status }: { status: TaskStatus }) {
  return (
    <span className={cn('inline-flex rounded-full px-2 py-0.5 text-xs font-semibold', STATUS_CLASS[status])}>
      {STATUS_LABELS[status]}
    </span>
  )
}

export function OverdueBadge() {
  return <span className="inline-flex rounded-full bg-rose-700 px-2 py-0.5 text-xs font-semibold text-white">Overdue</span>
}
