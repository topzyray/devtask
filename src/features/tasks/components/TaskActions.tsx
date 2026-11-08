import { fieldClass, ghostButton } from '../../layout/styles.ts'
import { useUiStore } from '../../layout/ui-store.ts'
import { useTaskStore } from '../store.ts'
import { isTaskStatus, STATUS_LABELS, TASK_STATUSES, type Task } from '../types.ts'

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
      <div className="w-full sm:w-40">
        <label htmlFor={statusId} className="sr-only">
          Status for {task.title}
        </label>
        <select
          id={statusId}
          value={task.status}
          onChange={(event) => {
            const next = event.target.value
            if (isTaskStatus(next)) updateTaskStatus(task.id, next)
          }}
          className={fieldClass}
        >
          {TASK_STATUSES.map((status) => (
            <option key={status} value={status}>
              {STATUS_LABELS[status]}
            </option>
          ))}
        </select>
      </div>
      <button type="button" className={ghostButton} onClick={() => openEdit(task.id)} aria-label={`Edit ${task.title}`}>
        Edit
      </button>
      <button
        type="button"
        className={`${ghostButton} text-danger hover:opacity-80`}
        onClick={() => openDelete(task.id)}
        aria-label={`Delete ${task.title}`}
      >
        Delete
      </button>
    </div>
  )
}
