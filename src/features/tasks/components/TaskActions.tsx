import { fieldClass, ghostButton } from '../../layout/styles.ts'
import { useUiStore } from '../../layout/ui-store.ts'
import { useTaskStore } from '../store.ts'
import { STATUS_LABELS, TASK_STATUSES, type Task, type TaskStatus } from '../types.ts'

type TaskActionsProps = {
  task: Task
}

export function TaskActions({ task }: TaskActionsProps) {
  const updateTaskStatus = useTaskStore((state) => state.updateTaskStatus)
  const openEdit = useUiStore((state) => state.openEdit)
  const openDelete = useUiStore((state) => state.openDelete)
  const statusId = `status-${task.id}`

  return (
    <div className="flex flex-wrap items-center gap-2">
      <div className="min-w-36 flex-1 sm:flex-none">
        <label htmlFor={statusId} className="sr-only">
          Status for {task.title}
        </label>
        <select
          id={statusId}
          value={task.status}
          onChange={(event) => updateTaskStatus(task.id, event.target.value as TaskStatus)}
          className={fieldClass}
        >
          {TASK_STATUSES.map((status) => (
            <option key={status} value={status}>
              {STATUS_LABELS[status]}
            </option>
          ))}
        </select>
      </div>
      <button type="button" className={ghostButton} onClick={() => openEdit(task.id)}>
        Edit
      </button>
      <button type="button" className={`${ghostButton} text-rose-700 hover:text-rose-800`} onClick={() => openDelete(task.id)}>
        Delete
      </button>
    </div>
  )
}
