import { formatDueDate } from '../../../lib/date.ts'
import { cn } from '../../../lib/cn.ts'
import { isTaskOverdue } from '../task-logic.ts'
import type { Task, TaskPriority } from '../types.ts'
import { OverdueBadge, PriorityBadge } from './badges.tsx'
import { TaskActions } from './TaskActions.tsx'

const STRIPE: Record<TaskPriority, string> = {
  low: 'border-l-stone-400',
  medium: 'border-l-amber-500',
  high: 'border-l-rose-600',
}

type TaskListProps = {
  tasks: readonly Task[]
}

export function TaskList({ tasks }: TaskListProps) {
  return (
    <ul className="space-y-3">
      {tasks.map((task) => {
        const overdue = isTaskOverdue(task)
        return (
          <li key={task.id}>
            <article className={cn('rounded-2xl border border-line border-l-4 bg-surface p-4 shadow-sm', STRIPE[task.priority])}>
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <h2 className="text-base font-semibold text-ink">{task.title}</h2>
                    <PriorityBadge priority={task.priority} />
                    {overdue ? <OverdueBadge /> : null}
                  </div>
                  {task.description ? <p className="mt-1 line-clamp-2 text-sm text-muted">{task.description}</p> : null}
                  <p className="mt-2 font-mono text-xs text-muted">Due {formatDueDate(task.dueDate)}</p>
                </div>
                <TaskActions task={task} />
              </div>
            </article>
          </li>
        )
      })}
    </ul>
  )
}
