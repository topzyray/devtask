import { useTaskStore } from '../store.ts'
import { ghostButton } from '../../layout/styles.ts'

export function StorageNotice() {
  const tasks = useTaskStore((state) => state.tasks)
  const corrupted = useTaskStore((state) => state.corrupted)
  const persistenceError = useTaskStore((state) => state.persistenceError)
  const dismiss = useTaskStore((state) => state.dismissStorageWarning)

  if (!corrupted && !persistenceError) return null

  const message =
    persistenceError ??
    (tasks.length > 0
      ? 'Some saved tasks were invalid and were removed. The rest of your list was kept.'
      : 'Saved tasks could not be read, so DevTask started with an empty list. New tasks will be saved in this browser.')

  return (
    <div
      role="alert"
      className="mb-4 flex flex-wrap items-center justify-between gap-3 rounded-xl border border-amber-700/40 bg-surface px-4 py-3 text-sm text-ink"
    >
      <p>{message}</p>
      <button type="button" className={ghostButton} onClick={dismiss}>
        Dismiss
      </button>
    </div>
  )
}
