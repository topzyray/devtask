import { toDateOnly } from '../../lib/date.ts'
import { PRIORITY_LABELS, STATUS_LABELS } from './types.ts'
import type { Task } from './types.ts'

const CSV_HEADERS = ['Title', 'Description', 'Status', 'Priority', 'Due date', 'Creation date']

function escapeCsvField(value: string): string {
  if (/[",\r\n]/.test(value)) {
    return `"${value.replaceAll('"', '""')}"`
  }
  return value
}

export function tasksToCsv(tasks: readonly Task[]): string {
  const rows = tasks.map((task) =>
    [
      task.title,
      task.description,
      STATUS_LABELS[task.status],
      PRIORITY_LABELS[task.priority],
      task.dueDate ?? '',
      task.createdAt,
    ]
      .map(escapeCsvField)
      .join(','),
  )

  return [CSV_HEADERS.join(','), ...rows].join('\r\n')
}

export function taskCsvFilename(date: Date = new Date()): string {
  return `devtask-tasks-${toDateOnly(date)}.csv`
}

export function downloadTasksCsv(tasks: readonly Task[]): void {
  const blob = new Blob([`\uFEFF${tasksToCsv(tasks)}`], { type: 'text/csv;charset=utf-8' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = taskCsvFilename()
  document.body.append(link)

  try {
    link.click()
  } finally {
    link.remove()
    URL.revokeObjectURL(url)
  }
}
