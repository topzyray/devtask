import { useTaskStore } from '../store.ts'
import { queryTasks } from '../task-logic.ts'
import { primaryButton, secondaryButton } from '../../layout/styles.ts'
import { useUiStore } from '../../layout/ui-store.ts'
import { TaskFilters } from '../components/TaskFilters.tsx'
import { TaskList } from '../components/TaskList.tsx'
import { downloadTasksCsv } from '../csv-export.ts'

export function TasksPage() {
  const tasks = useTaskStore((state) => state.tasks)
  const search = useTaskStore((state) => state.search)
  const status = useTaskStore((state) => state.status)
  const priority = useTaskStore((state) => state.priority)
  const sort = useTaskStore((state) => state.sort)
  const openCreate = useUiStore((state) => state.openCreate)
  const visible = queryTasks(tasks, { search, status, priority, sort })

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <button type="button" className={secondaryButton} onClick={() => downloadTasksCsv(tasks)}>
          Export CSV
        </button>
      </div>
      <TaskFilters />
      <p className="text-sm text-muted" aria-live="polite">
        Showing {visible.length} of {tasks.length} {tasks.length === 1 ? 'task' : 'tasks'}
      </p>
      {tasks.length === 0 ? (
        <section className="rounded-2xl border border-dashed border-line bg-surface px-6 py-12 text-center">
          <h2 className="text-lg font-semibold text-ink">Your list is empty</h2>
          <p className="mt-2 text-sm text-muted">Add a task to start organising today&apos;s engineering work.</p>
          <button type="button" className={`${primaryButton} mt-4`} onClick={openCreate}>
            New task
          </button>
        </section>
      ) : visible.length === 0 ? (
        <section className="rounded-2xl border border-dashed border-line bg-surface px-6 py-12 text-center">
          <h2 className="text-lg font-semibold text-ink">No matching tasks</h2>
          <p className="mt-2 text-sm text-muted">Try a different title, status, or priority.</p>
        </section>
      ) : (
        <TaskList tasks={visible} />
      )}
    </div>
  )
}
