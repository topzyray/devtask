import { taskListSchema } from './schema.ts'
import type { Task } from './types.ts'

export const TASKS_STORAGE_KEY = 'devtask.tasks'

export type ReadTasksResult = {
  tasks: Task[]
  corrupted: boolean
}

export function readTasks(storage: Storage): ReadTasksResult {
  let raw: string | null
  try {
    raw = storage.getItem(TASKS_STORAGE_KEY)
  } catch {
    return { tasks: [], corrupted: true }
  }

  if (raw === null) return { tasks: [], corrupted: false }

  try {
    const parsed: unknown = JSON.parse(raw)
    const result = taskListSchema.safeParse(parsed)
    if (!result.success) {
      clearTasks(storage)
      return { tasks: [], corrupted: true }
    }
    return { tasks: result.data, corrupted: false }
  } catch {
    clearTasks(storage)
    return { tasks: [], corrupted: true }
  }
}

export function writeTasks(storage: Storage, tasks: readonly Task[]): void {
  storage.setItem(TASKS_STORAGE_KEY, JSON.stringify(tasks))
}

function clearTasks(storage: Storage): void {
  try {
    storage.removeItem(TASKS_STORAGE_KEY)
  } catch {
    // Reading already failed or the payload was unusable. Ignore cleanup errors.
  }
}
