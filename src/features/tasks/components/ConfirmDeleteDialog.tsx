import { Dialog } from '../../layout/Dialog.tsx'
import { dangerButton, secondaryButton } from '../../layout/styles.ts'
import { useUiStore } from '../../layout/ui-store.ts'
import { useTaskStore } from '../store.ts'

export function ConfirmDeleteDialog() {
  const dialog = useUiStore((state) => state.dialog)
  const closeDialog = useUiStore((state) => state.closeDialog)
  const deleteTask = useTaskStore((state) => state.deleteTask)
  const task = useTaskStore((state) =>
    dialog.kind === 'delete' ? (state.tasks.find((item) => item.id === dialog.taskId) ?? null) : null,
  )

  if (dialog.kind !== 'delete') return null

  return (
    <Dialog
      title="Delete task"
      description={
        task
          ? `Delete “${task.title}”? This cannot be undone.`
          : 'This task is no longer on your list.'
      }
      onClose={closeDialog}
    >
      <div className="flex flex-wrap justify-end gap-2">
        <button type="button" className={secondaryButton} onClick={closeDialog}>
          {task ? 'Cancel' : 'Close'}
        </button>
        {task ? (
          <button
            type="button"
            className={dangerButton}
            onClick={() => {
              deleteTask(task.id)
              closeDialog()
            }}
          >
            Delete task
          </button>
        ) : null}
      </div>
    </Dialog>
  )
}
