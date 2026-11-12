import { describe, expect, it } from 'vitest'
import { taskCsvFilename, tasksToCsv } from './csv-export.ts'
import type { Task } from './types.ts'

function task(overrides: Partial<Task> = {}): Task {
  return {
    id: 'task-1',
    title: 'Ship the patch',
    description: 'Cover the regression',
    priority: 'medium',
    status: 'pending',
    dueDate: '2026-11-12',
    createdAt: '2026-11-08T12:00:00.000Z',
    updatedAt: '2026-11-08T12:00:00.000Z',
    ...overrides,
  }
}

describe('tasksToCsv', () => {
  it('exports all requested fields and uses headers for an empty list', () => {
    expect(tasksToCsv([])).toBe('Title,Description,Status,Priority,Due date,Creation date')
    expect(tasksToCsv([task()])).toBe(
      'Title,Description,Status,Priority,Due date,Creation date\r\n' +
        'Ship the patch,Cover the regression,Pending,Medium,2026-11-12,2026-11-08T12:00:00.000Z',
    )
  })

  it('escapes commas, quotes, and newlines while preserving UTF-8 text', () => {
    const csv = tasksToCsv([
      task({
        title: 'Review, "résumé"',
        description: 'First line\r\n第二行',
        status: 'in_progress',
        priority: 'high',
        dueDate: null,
      }),
    ])

    expect(csv).toBe(
      'Title,Description,Status,Priority,Due date,Creation date\r\n' +
        '"Review, ""résumé""","First line\r\n第二行",In progress,High,,2026-11-08T12:00:00.000Z',
    )
  })
})

describe('taskCsvFilename', () => {
  it('includes the export date in a meaningful filename', () => {
    expect(taskCsvFilename(new Date(2026, 10, 12, 12))).toBe('devtask-tasks-2026-11-12.csv')
  })
})
