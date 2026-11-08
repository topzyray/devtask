import { useTaskStore } from '../store.ts'
import { queryTasks } from '../task-logic.ts'
import { primaryButton } from '../../layout/styles.ts'
import { useUiStore } from '../../layout/ui-store.ts'
import { KanbanBoard } from '../components/KanbanBoard.tsx'
import { TaskFilters } from '../components/TaskFilters.tsx'

export function BoardPage() {
  const tasks = useTaskStore((state) => state.tasks)
  const search = useTaskStore((state) => state.search)
  const status = useTaskStore((state) => state.status)
  const priority = useTaskStore((state) => state.priority)
  const sort = useTaskStore((state) => state.sort)
  const openCreate = useUiStore((state) => state.openCreate)
  const visible = queryTasks(tasks, { search, status, priority, sort })

  return (
    <div className="space-y-4">
      <TaskFilters />
      <p className="text-sm text-muted" aria-live="polite">
        Showing {visible.length} of {tasks.length} {tasks.length === 1 ? 'task' : 'tasks'}. Change a status to move a
        task. On a wide screen you can also drag a card between columns.
      </p>
      {tasks.length === 0 ? (
        <section className="rounded-2xl border border-dashed border-line bg-surface px-6 py-12 text-center">
          <h2 className="text-lg font-semibold text-ink">The board is empty</h2>
          <p className="mt-2 text-sm text-muted">Create a task and move it across the three columns.</p>
          <button type="button" className={`${primaryButton} mt-4`} onClick={openCreate}>
            New task
          </button>
        </section>
      ) : (
        <KanbanBoard tasks={visible} />
      )}
    </div>
  )
}
