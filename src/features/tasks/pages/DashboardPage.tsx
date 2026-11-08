import { formatDueDate, formatLongDate, toDateOnly } from '../../../lib/date.ts'
import { primaryButton } from '../../layout/styles.ts'
import { useUiStore } from '../../layout/ui-store.ts'
import { useTaskStore } from '../store.ts'
import { computeStats, isTaskOverdue } from '../task-logic.ts'
import { DashboardStats } from '../components/DashboardStats.tsx'
import { PriorityBadge } from '../components/badges.tsx'

export function DashboardPage() {
  const tasks = useTaskStore((state) => state.tasks)
  const openCreate = useUiStore((state) => state.openCreate)
  const openEdit = useUiStore((state) => state.openEdit)
  const stats = computeStats(tasks)
  const today = toDateOnly(new Date())
  const overdue = tasks
    .filter((task) => isTaskOverdue(task, today))
    .sort((left, right) => (left.dueDate ?? '').localeCompare(right.dueDate ?? ''))
  const recent = [...tasks].sort((left, right) => right.createdAt.localeCompare(left.createdAt)).slice(0, 5)

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <p className="text-sm text-muted">{formatLongDate(new Date())}</p>
        {tasks.length === 0 ? (
          <button type="button" className={primaryButton} onClick={openCreate}>
            Create your first task
          </button>
        ) : null}
      </div>
      <DashboardStats stats={stats} />
      {tasks.length === 0 ? (
        <section className="rounded-2xl border border-dashed border-line bg-surface px-6 py-12 text-center">
          <h2 className="text-lg font-semibold text-ink">No tasks yet</h2>
          <p className="mx-auto mt-2 max-w-md text-sm text-muted">
            Create a task with a priority, status, and due date. It stays in this browser and comes back after a refresh.
          </p>
        </section>
      ) : (
        <div className="grid gap-4 lg:grid-cols-2">
          <section className="rounded-2xl border border-line bg-surface p-4">
            <h2 className="text-base font-semibold text-ink">Overdue</h2>
            {overdue.length === 0 ? (
              <p className="mt-3 text-sm text-muted">Nothing is past its due date.</p>
            ) : (
              <ul className="mt-3 divide-y divide-line">
                {overdue.map((task) => (
                  <li key={task.id}>
                    <button
                      type="button"
                      onClick={() => openEdit(task.id)}
                      className="flex w-full items-start justify-between gap-3 py-3 text-left hover:text-accent"
                    >
                      <span>
                        <span className="block font-medium text-ink">{task.title}</span>
                        <span className="mt-1 block font-mono text-xs text-danger">Due {formatDueDate(task.dueDate)}</span>
                      </span>
                      <PriorityBadge priority={task.priority} />
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </section>
          <section className="rounded-2xl border border-line bg-surface p-4">
            <h2 className="text-base font-semibold text-ink">Recently added</h2>
            <ul className="mt-3 divide-y divide-line">
              {recent.map((task) => (
                <li key={task.id}>
                  <button
                    type="button"
                    onClick={() => openEdit(task.id)}
                    className="flex w-full items-start justify-between gap-3 py-3 text-left"
                  >
                    <span>
                      <span className="block font-medium text-ink">{task.title}</span>
                      <span className="mt-1 block font-mono text-xs text-muted">Due {formatDueDate(task.dueDate)}</span>
                    </span>
                    <PriorityBadge priority={task.priority} />
                  </button>
                </li>
              ))}
            </ul>
          </section>
        </div>
      )}
    </div>
  )
}
