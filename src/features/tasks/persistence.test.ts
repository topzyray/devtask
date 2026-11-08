import { describe, expect, it } from 'vitest'
import { readTasks, TASKS_STORAGE_KEY, writeTasks } from './persistence.ts'
import { createTask } from './task-logic.ts'
import { createMemoryStorage } from './test-support.ts'
import type { TaskInput } from './types.ts'

const now = new Date('2026-11-08T12:00:00.000Z')

function input(overrides: Partial<TaskInput> = {}): TaskInput {
  return {
    title: 'Ship the patch',
    description: 'Cover the regression',
    priority: 'medium',
    status: 'pending',
    dueDate: '2026-11-12',
    ...overrides,
  }
}

describe('task persistence', () => {
  it('returns an empty list when nothing is stored', () => {
    expect(readTasks(createMemoryStorage())).toEqual({ tasks: [], corrupted: false })
    const storage = createMemoryStorage({ [TASKS_STORAGE_KEY]: '[]' })
    expect(readTasks(storage)).toEqual({ tasks: [], corrupted: false })
  })

  it('saves tasks and restores them', () => {
    const storage = createMemoryStorage()
    const tasks = [
      createTask(input(), now, 'task-1'),
      createTask(input({ title: 'No date', dueDate: '', status: 'completed', description: '' }), now, 'task-2'),
    ]

    writeTasks(storage, tasks)

    expect(readTasks(storage)).toEqual({ tasks, corrupted: false })
  })

  it('ignores invalid JSON and clears it', () => {
    const storage = createMemoryStorage({ [TASKS_STORAGE_KEY]: '{not json' })

    expect(readTasks(storage)).toEqual({ tasks: [], corrupted: true })
    expect(storage.getItem(TASKS_STORAGE_KEY)).toBeNull()
  })

  it('rejects stored data that does not match the task schema', () => {
    const storage = createMemoryStorage()
    const valid = createTask(input(), now, 'task-1')
    const cases = [
      { version: 1 },
      [1, 2, 3],
      [{ ...valid, priority: 'urgent' }],
      [{ ...valid, dueDate: '08-11-2026' }],
      [{ ...valid, id: '' }],
      null,
    ]

    for (const payload of cases) {
      storage.setItem(TASKS_STORAGE_KEY, JSON.stringify(payload))
      expect(readTasks(storage)).toEqual({ tasks: [], corrupted: true })
      expect(storage.getItem(TASKS_STORAGE_KEY)).toBeNull()
    }
  })

  it('treats a storage read failure as unusable data', () => {
    const storage = createMemoryStorage({ [TASKS_STORAGE_KEY]: '[]' })
    storage.getItem = () => {
      throw new Error('storage blocked')
    }

    expect(readTasks(storage)).toEqual({ tasks: [], corrupted: true })
  })
})
