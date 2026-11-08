import { isValidDateOnly, toDateOnly } from '../../lib/date.ts'
import type { Task, TaskInput, TaskQuery, TaskSort, TaskStats, TaskStatus } from './types.ts'

export function createId(): string {
  return crypto.randomUUID()
}

export function createTask(input: TaskInput, now = new Date(), id = createId()): Task {
  const timestamp = now.toISOString()
  return {
    id,
    title: input.title.trim(),
    description: input.description.trim(),
    priority: input.priority,
    status: input.status,
    dueDate: blankToNull(input.dueDate),
    createdAt: timestamp,
    updatedAt: timestamp,
  }
}

export function updateTask(task: Task, input: TaskInput, now = new Date()): Task {
  return {
    ...task,
    title: input.title.trim(),
    description: input.description.trim(),
    priority: input.priority,
    status: input.status,
    dueDate: blankToNull(input.dueDate),
    updatedAt: now.toISOString(),
  }
}

export function changeTaskStatus(task: Task, status: TaskStatus, now = new Date()): Task {
  if (task.status === status) return task
  return {
    ...task,
    status,
    updatedAt: now.toISOString(),
  }
}

export function removeTask(tasks: readonly Task[], id: string): Task[] {
  return tasks.filter((task) => task.id !== id)
}

export function isTaskOverdue(task: Task, today = toDateOnly(new Date())): boolean {
  if (task.status === 'completed' || task.dueDate === null) return false
  if (!isValidDateOnly(task.dueDate) || !isValidDateOnly(today)) return false
  return task.dueDate < today
}

export function computeStats(tasks: readonly Task[], now = new Date()): TaskStats {
  const today = toDateOnly(now)
  let pending = 0
  let inProgress = 0
  let completed = 0
  let overdue = 0

  for (const task of tasks) {
    if (task.status === 'pending') pending += 1
    else if (task.status === 'in_progress') inProgress += 1
    else completed += 1
    if (isTaskOverdue(task, today)) overdue += 1
  }

  const total = tasks.length
  return {
    total,
    pending,
    inProgress,
    completed,
    overdue,
    completionPercentage: total === 0 ? 0 : Math.round((completed / total) * 100),
  }
}

export function queryTasks(tasks: readonly Task[], query: TaskQuery): Task[] {
  const search = query.search.trim().toLowerCase()
  const filtered = tasks.filter((task) => {
    if (search.length > 0 && !task.title.toLowerCase().includes(search)) return false
    if (query.status !== 'all' && task.status !== query.status) return false
    if (query.priority !== 'all' && task.priority !== query.priority) return false
    return true
  })
  return [...filtered].sort((left, right) => compareTasks(left, right, query.sort))
}

export function taskToInput(task: Task): TaskInput {
  return {
    title: task.title,
    description: task.description,
    priority: task.priority,
    status: task.status,
    dueDate: task.dueDate ?? '',
  }
}

function blankToNull(value: string): string | null {
  const trimmed = value.trim()
  if (trimmed === '' || !isValidDateOnly(trimmed)) return null
  return trimmed
}

function compareTasks(left: Task, right: Task, sort: TaskSort): number {
  switch (sort) {
    case 'dueDate-asc':
      return compareDueDate(left, right, 1)
    case 'dueDate-desc':
      return compareDueDate(left, right, -1)
    case 'createdAt-asc':
      return compareCreatedAt(left, right, 1)
    case 'createdAt-desc':
      return compareCreatedAt(left, right, -1)
  }
}

function compareDueDate(left: Task, right: Task, direction: 1 | -1): number {
  if (left.dueDate === null && right.dueDate === null) return 0
  if (left.dueDate === null) return 1
  if (right.dueDate === null) return -1
  return left.dueDate.localeCompare(right.dueDate) * direction
}

function compareCreatedAt(left: Task, right: Task, direction: 1 | -1): number {
  return left.createdAt.localeCompare(right.createdAt) * direction
}
