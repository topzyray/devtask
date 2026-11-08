import { create, type StoreApi, type UseBoundStore } from 'zustand'
import { readTasks, writeTasks } from './persistence.ts'
import { taskInputSchema } from './schema.ts'
import { changeTaskStatus, createTask, removeTask, updateTask } from './task-logic.ts'
import type { PriorityFilter, StatusFilter, Task, TaskInput, TaskSort, TaskStatus } from './types.ts'
import { DEFAULT_TASK_QUERY, isPriorityFilter, isStatusFilter, isTaskSort, isTaskStatus } from './types.ts'

export type TaskState = {
  tasks: Task[]
  corrupted: boolean
  persistenceError: string | null
  search: string
  status: StatusFilter
  priority: PriorityFilter
  sort: TaskSort
  setSearch: (search: string) => void
  setStatus: (status: StatusFilter) => void
  setPriority: (priority: PriorityFilter) => void
  setSort: (sort: TaskSort) => void
  resetFilters: () => void
  dismissStorageWarning: () => void
  addTask: (input: TaskInput) => boolean
  updateTask: (id: string, input: TaskInput) => boolean
  updateTaskStatus: (id: string, status: TaskStatus) => void
  deleteTask: (id: string) => void
}

function persistTasks(
  storage: Storage,
  tasks: Task[],
  set: (partial: Partial<TaskState>) => void,
): void {
  set({ tasks, persistenceError: null })
  try {
    writeTasks(storage, tasks)
  } catch {
    set({ persistenceError: 'Tasks could not be saved in this browser.' })
  }
}

export function createTaskStore(storage: Storage): UseBoundStore<StoreApi<TaskState>> {
  const loaded = readTasks(storage)

  return create<TaskState>()((set, get) => ({
    tasks: loaded.tasks,
    corrupted: loaded.corrupted,
    persistenceError: null,
    search: DEFAULT_TASK_QUERY.search,
    status: DEFAULT_TASK_QUERY.status,
    priority: DEFAULT_TASK_QUERY.priority,
    sort: DEFAULT_TASK_QUERY.sort,
    setSearch: (search) => set({ search }),
    setStatus: (status) => {
      if (!isStatusFilter(status)) return
      set({ status })
    },
    setPriority: (priority) => {
      if (!isPriorityFilter(priority)) return
      set({ priority })
    },
    setSort: (sort) => {
      if (!isTaskSort(sort)) return
      set({ sort })
    },
    resetFilters: () =>
      set({
        search: DEFAULT_TASK_QUERY.search,
        status: DEFAULT_TASK_QUERY.status,
        priority: DEFAULT_TASK_QUERY.priority,
        sort: DEFAULT_TASK_QUERY.sort,
      }),
    dismissStorageWarning: () => set({ corrupted: false, persistenceError: null }),
    addTask: (input) => {
      const parsed = taskInputSchema.safeParse(input)
      if (!parsed.success) return false
      persistTasks(storage, [...get().tasks, createTask(parsed.data)], set)
      return true
    },
    updateTask: (id, input) => {
      const parsed = taskInputSchema.safeParse(input)
      if (!parsed.success) return false
      const current = get().tasks
      if (!current.some((task) => task.id === id)) return false
      persistTasks(
        storage,
        current.map((task) => (task.id === id ? updateTask(task, parsed.data) : task)),
        set,
      )
      return true
    },
    updateTaskStatus: (id, status) => {
      if (!isTaskStatus(status)) return
      const current = get().tasks
      const existing = current.find((task) => task.id === id)
      if (!existing || existing.status === status) return
      persistTasks(
        storage,
        current.map((task) => (task.id === id ? changeTaskStatus(task, status) : task)),
        set,
      )
    },
    deleteTask: (id) => {
      const current = get().tasks
      const tasks = removeTask(current, id)
      if (tasks.length === current.length) return
      persistTasks(storage, tasks, set)
    },
  }))
}

export const useTaskStore = createTaskStore(localStorage)
