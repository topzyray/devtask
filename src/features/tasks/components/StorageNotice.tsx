import { useTaskStore } from '../store.ts'
import { ghostButton } from '../../layout/styles.ts'

export function StorageNotice() {
  const corrupted = useTaskStore((state) => state.corrupted)
  const persistenceError = useTaskStore((state) => state.persistenceError)
  const dismiss = useTaskStore((state) => state.dismissStorageWarning)

  if (!corrupted && !persistenceError) return null

  return (
    <div
      role="alert"
      className="mb-4 flex flex-wrap items-center justify-between gap-3 rounded-xl border border-amber-300 bg-amber-50 px-4 py-3 text-sm text-amber-950"
    >
      <p>
        {persistenceError ??
          'Saved tasks could not be read, so DevTask started with an empty list. New tasks will be saved in this browser.'}
      </p>
      <button type="button" className={ghostButton} onClick={dismiss}>
        Dismiss
      </button>
    </div>
  )
}
