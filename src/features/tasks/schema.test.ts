import { describe, expect, it } from 'vitest'
import { inputErrors, taskInputSchema } from './schema.ts'
import type { TaskInput } from './types.ts'

function input(overrides: Partial<TaskInput> = {}): TaskInput {
  return {
    title: 'Write the migration',
    description: 'Add the index',
    priority: 'medium',
    status: 'pending',
    dueDate: '2026-11-12',
    ...overrides,
  }
}

describe('taskInputSchema', () => {
  it('trims text and accepts an empty due date', () => {
    const parsed = taskInputSchema.safeParse(input({ title: '  Write the migration  ', dueDate: '  ' }))
    expect(parsed.success).toBe(true)
    if (!parsed.success) return
    expect(parsed.data.title).toBe('Write the migration')
    expect(parsed.data.dueDate).toBe('')
  })

  it('reports a required title, a long description, and an impossible due date', () => {
    const parsed = taskInputSchema.safeParse(
      input({ title: '   ', description: 'x'.repeat(2001), dueDate: '2026-02-31' }),
    )
    expect(parsed.success).toBe(false)
    if (parsed.success) return
    const errors = inputErrors(parsed.error)
    expect(errors.title).toBe('Title is required')
    expect(errors.description).toMatch(/2000/)
    expect(errors.dueDate).toBe('Enter a valid due date')
  })

  it('rejects a title longer than 120 characters', () => {
    const parsed = taskInputSchema.safeParse(input({ title: 'a'.repeat(121) }))
    expect(parsed.success).toBe(false)
  })
})
