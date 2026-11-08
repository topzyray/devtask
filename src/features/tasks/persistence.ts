import { taskSchema } from './schema.ts'
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
  if (raw.trim() === '') {
    clearTasks(storage)
    return { tasks: [], corrupted: true }
  }

  let parsed: unknown
  try {
    parsed = JSON.parse(raw)
  } catch {
    clearTasks(storage)
    return { tasks: [], corrupted: true }
  }

  if (!Array.isArray(parsed)) {
    clearTasks(storage)
    return { tasks: [], corrupted: true }
  }

  const tasks: Task[] = []
  const seenIds = new Set<string>()
  let dropped = false

  for (const item of parsed) {
    const result = taskSchema.safeParse(item)
    if (!result.success || seenIds.has(result.data.id)) {
      dropped = true
      continue
    }
    seenIds.add(result.data.id)
    tasks.push(result.data)
  }

  if (!dropped) return { tasks, corrupted: false }

  try {
    if (tasks.length === 0) clearTasks(storage)
    else writeTasks(storage, tasks)
  } catch {
    // The repaired list is still returned for this session.
  }

  return { tasks, corrupted: true }
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
