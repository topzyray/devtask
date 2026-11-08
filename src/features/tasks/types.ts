export const TASK_STATUSES = ['pending', 'in_progress', 'completed'] as const
export type TaskStatus = (typeof TASK_STATUSES)[number]

export const TASK_PRIORITIES = ['low', 'medium', 'high'] as const
export type TaskPriority = (typeof TASK_PRIORITIES)[number]

export const TASK_SORTS = ['dueDate-asc', 'dueDate-desc', 'createdAt-desc', 'createdAt-asc'] as const
export type TaskSort = (typeof TASK_SORTS)[number]

export type Task = {
  id: string
  title: string
  description: string
  priority: TaskPriority
  status: TaskStatus
  dueDate: string | null
  createdAt: string
  updatedAt: string
}

export type TaskInput = {
  title: string
  description: string
  priority: TaskPriority
  status: TaskStatus
  dueDate: string
}

export type StatusFilter = 'all' | TaskStatus
export type PriorityFilter = 'all' | TaskPriority

export type TaskQuery = {
  search: string
  status: StatusFilter
  priority: PriorityFilter
  sort: TaskSort
}

export type TaskStats = {
  total: number
  pending: number
  inProgress: number
  completed: number
  overdue: number
  completionPercentage: number
}

export const EMPTY_TASK_INPUT: TaskInput = {
  title: '',
  description: '',
  priority: 'medium',
  status: 'pending',
  dueDate: '',
}

export const DEFAULT_TASK_QUERY: TaskQuery = {
  search: '',
  status: 'all',
  priority: 'all',
  sort: 'dueDate-asc',
}

export const STATUS_LABELS: Record<TaskStatus, string> = {
  pending: 'Pending',
  in_progress: 'In progress',
  completed: 'Completed',
}

export const PRIORITY_LABELS: Record<TaskPriority, string> = {
  low: 'Low',
  medium: 'Medium',
  high: 'High',
}

export function isTaskStatus(value: string): value is TaskStatus {
  return TASK_STATUSES.some((status) => status === value)
}

export function isTaskPriority(value: string): value is TaskPriority {
  return TASK_PRIORITIES.some((priority) => priority === value)
}

export function isTaskSort(value: string): value is TaskSort {
  return TASK_SORTS.some((sort) => sort === value)
}

export function isStatusFilter(value: string): value is StatusFilter {
  return value === 'all' || isTaskStatus(value)
}

export function isPriorityFilter(value: string): value is PriorityFilter {
  return value === 'all' || isTaskPriority(value)
}

export const SORT_LABELS: Record<TaskSort, string> = {
  'dueDate-asc': 'Due date (soonest)',
  'dueDate-desc': 'Due date (latest)',
  'createdAt-desc': 'Creation date (newest)',
  'createdAt-asc': 'Creation date (oldest)',
}
