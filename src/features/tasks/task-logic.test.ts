import { describe, expect, it } from 'vitest'
import { toDateOnly } from '../../lib/date.ts'
import { computeStats, createTask, isTaskOverdue, queryTasks, removeTask, updateTask } from './task-logic.ts'
import type { Task, TaskInput, TaskQuery } from './types.ts'

const now = new Date('2026-11-08T12:00:00.000Z')

function input(overrides: Partial<TaskInput> = {}): TaskInput {
  return {
    title: 'Write migration',
    description: 'Add the user index',
    priority: 'high',
    status: 'pending',
    dueDate: '2026-11-10',
    ...overrides,
  }
}

function query(overrides: Partial<TaskQuery> = {}): TaskQuery {
  return {
    search: '',
    status: 'all',
    priority: 'all',
    sort: 'createdAt-desc',
    ...overrides,
  }
}

describe('createTask', () => {
  it('creates a task with trimmed fields and timestamps', () => {
    const task = createTask(input({ title: '  Write migration  ', description: '  Add the user index  ', dueDate: '  ' }), now, 'task-1')

    expect(task).toEqual({
      id: 'task-1',
      title: 'Write migration',
      description: 'Add the user index',
      priority: 'high',
      status: 'pending',
      dueDate: null,
      createdAt: now.toISOString(),
      updatedAt: now.toISOString(),
    })
  })
})

describe('updateTask', () => {
  it('updates editable fields and keeps the original identity', () => {
    const original = createTask(input(), now, 'task-1')
    const later = new Date('2026-11-09T08:00:00.000Z')
    const updated = updateTask(
      original,
      input({
        title: 'Write migration v2',
        description: 'Ship the index',
        priority: 'low',
        status: 'in_progress',
        dueDate: '2026-12-01',
      }),
      later,
    )

    expect(updated.id).toBe(original.id)
    expect(updated.createdAt).toBe(original.createdAt)
    expect(updated.updatedAt).toBe(later.toISOString())
    expect(updated).toMatchObject({
      title: 'Write migration v2',
      description: 'Ship the index',
      priority: 'low',
      status: 'in_progress',
      dueDate: '2026-12-01',
    })
  })
})

describe('removeTask', () => {
  it('deletes a task by id and leaves the others in place', () => {
    const tasks = [createTask(input({ title: 'Keep' }), now, 'keep'), createTask(input({ title: 'Drop' }), now, 'drop')]
    expect(removeTask(tasks, 'drop').map((task) => task.id)).toEqual(['keep'])
  })

  it('returns the same tasks when the id does not exist', () => {
    const tasks = [createTask(input(), now, 'keep')]
    expect(removeTask(tasks, 'missing')).toEqual(tasks)
  })
})

describe('queryTasks', () => {
  const tasks: Task[] = [
    createTask(input({ title: 'Fix login bug', priority: 'high', status: 'pending', dueDate: '2026-11-09' }), new Date('2026-11-01T00:00:00.000Z'), '1'),
    createTask(input({ title: 'Review API', priority: 'low', status: 'in_progress', dueDate: '2026-11-12', description: 'login notes' }), new Date('2026-11-03T00:00:00.000Z'), '2'),
    createTask(input({ title: 'Login page copy', priority: 'medium', status: 'completed', dueDate: '' }), new Date('2026-11-02T00:00:00.000Z'), '3'),
  ]

  it('filters by title and ignores description text', () => {
    expect(queryTasks(tasks, query({ search: 'LOGIN' })).map((task) => task.id)).toEqual(['3', '1'])
    expect(queryTasks(tasks, query({ search: 'notes' }))).toEqual([])
  })

  it('filters by status and priority together', () => {
    expect(queryTasks(tasks, query({ status: 'pending', priority: 'high' })).map((task) => task.id)).toEqual(['1'])
    expect(queryTasks(tasks, query({ status: 'in_progress' })).map((task) => task.id)).toEqual(['2'])
  })

  it('sorts by due date and leaves undated tasks last', () => {
    expect(queryTasks(tasks, query({ sort: 'dueDate-asc' })).map((task) => task.id)).toEqual(['1', '2', '3'])
    expect(queryTasks(tasks, query({ sort: 'dueDate-desc' })).map((task) => task.id)).toEqual(['2', '1', '3'])
  })

  it('sorts by creation date', () => {
    expect(queryTasks(tasks, query({ sort: 'createdAt-asc' })).map((task) => task.id)).toEqual(['1', '3', '2'])
    expect(queryTasks(tasks, query({ sort: 'createdAt-desc' })).map((task) => task.id)).toEqual(['2', '3', '1'])
  })
})

describe('computeStats', () => {
  it('counts statuses, overdue work, and completion percentage', () => {
    const today = new Date(2026, 10, 8, 15, 0, 0)
    const tasks = [
      createTask(input({ status: 'pending', dueDate: '2026-11-07' }), today, '1'),
      createTask(input({ status: 'in_progress', dueDate: '2026-11-08' }), today, '2'),
      createTask(input({ status: 'completed', dueDate: '2026-11-01' }), today, '3'),
      createTask(input({ status: 'completed', dueDate: '' }), today, '4'),
    ]

    expect(computeStats(tasks, today)).toEqual({
      total: 4,
      pending: 1,
      inProgress: 1,
      completed: 2,
      overdue: 1,
      completionPercentage: 50,
    })
    expect(isTaskOverdue(tasks[2]!, toDateOnly(today))).toBe(false)
    expect(isTaskOverdue(tasks[1]!, toDateOnly(today))).toBe(false)
  })

  it('returns zero completion when there are no tasks', () => {
    expect(computeStats([], new Date())).toMatchObject({
      total: 0,
      completionPercentage: 0,
      overdue: 0,
    })
  })
})
