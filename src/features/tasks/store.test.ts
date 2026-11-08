import { describe, expect, it } from 'vitest'
import { TASKS_STORAGE_KEY } from './persistence.ts'
import { createTaskStore } from './store.ts'
import { createMemoryStorage } from './test-support.ts'
import type { TaskInput } from './types.ts'

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

describe('task store', () => {
  it('creates, updates, moves, and deletes tasks', () => {
    const store = createTaskStore(createMemoryStorage())

    expect(store.getState().addTask(input({ title: '  Write migration  ' }))).toBe(true)
    const created = store.getState().tasks[0]
    expect(created?.title).toBe('Write migration')
    expect(created?.dueDate).toBe('2026-11-10')

    expect(
      store.getState().updateTask(created!.id, input({ title: 'Updated migration', status: 'in_progress', priority: 'low' })),
    ).toBe(true)
    expect(store.getState().tasks[0]).toMatchObject({
      id: created!.id,
      title: 'Updated migration',
      status: 'in_progress',
      priority: 'low',
      createdAt: created!.createdAt,
    })

    store.getState().updateTaskStatus(created!.id, 'completed')
    expect(store.getState().tasks[0]?.status).toBe('completed')

    store.getState().deleteTask(created!.id)
    expect(store.getState().tasks).toEqual([])
    expect(store.getState().deleteTask('missing')).toBeUndefined()
    expect(store.getState().updateTask('missing', input())).toBe(false)
  })

  it('rejects invalid task input', () => {
    const store = createTaskStore(createMemoryStorage())

    expect(store.getState().addTask(input({ title: '   ' }))).toBe(false)
    expect(store.getState().addTask(input({ dueDate: '2026-02-31' }))).toBe(false)
    expect(store.getState().tasks).toEqual([])
  })

  it('persists tasks so a new store can restore them', () => {
    const storage = createMemoryStorage()
    const store = createTaskStore(storage)
    expect(store.getState().addTask(input({ title: 'Persisted task' }))).toBe(true)

    const restored = createTaskStore(storage)
    expect(restored.getState().corrupted).toBe(false)
    expect(restored.getState().tasks.map((task) => task.title)).toEqual(['Persisted task'])
    expect(restored.getState().tasks[0]?.status).toBe('pending')
  })

  it('starts empty when stored data is invalid, then saves new tasks', () => {
    const storage = createMemoryStorage({ [TASKS_STORAGE_KEY]: '{bad json' })
    const store = createTaskStore(storage)

    expect(store.getState().tasks).toEqual([])
    expect(store.getState().corrupted).toBe(true)
    expect(storage.getItem(TASKS_STORAGE_KEY)).toBeNull()

    expect(store.getState().addTask(input({ title: 'Recovered task' }))).toBe(true)
    const restored = createTaskStore(storage)
    expect(restored.getState().corrupted).toBe(false)
    expect(restored.getState().tasks[0]?.title).toBe('Recovered task')
  })

  it('keeps the task in memory when saving fails', () => {
    const storage = createMemoryStorage()
    storage.setItem = () => {
      throw new Error('quota')
    }
    const store = createTaskStore(storage)

    expect(store.getState().addTask(input())).toBe(true)
    expect(store.getState().tasks).toHaveLength(1)
    expect(store.getState().persistenceError).toMatch(/could not be saved/i)
  })

  it('filters from store state through the query fields', () => {
    const store = createTaskStore(createMemoryStorage())
    store.getState().addTask(input({ title: 'Alpha bug', priority: 'high', status: 'pending' }))
    store.getState().addTask(input({ title: 'Beta docs', priority: 'low', status: 'completed' }))
    store.getState().setSearch('beta')
    store.getState().setPriority('low')
    store.getState().setStatus('completed')

    expect(store.getState().search).toBe('beta')
    expect(store.getState().tasks).toHaveLength(2)
    store.getState().resetFilters()
    expect(store.getState().search).toBe('')
    expect(store.getState().status).toBe('all')
    expect(store.getState().priority).toBe('all')
  })
})
