import type { ZodError } from 'zod'
import { z } from 'zod'
import { isValidDateOnly } from '../../lib/date.ts'
import { TASK_PRIORITIES, TASK_STATUSES, type Task, type TaskInput } from './types.ts'

const timestampSchema = z
  .string()
  .regex(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/, 'Invalid timestamp')

const storedDueDateSchema = z
  .string()
  .refine((value) => isValidDateOnly(value), 'Invalid due date')
  .nullable()

export const taskSchema = z.object({
  id: z.string().min(1),
  title: z.string().trim().min(1).max(120),
  description: z.string().max(2000),
  priority: z.enum(TASK_PRIORITIES),
  status: z.enum(TASK_STATUSES),
  dueDate: storedDueDateSchema,
  createdAt: timestampSchema,
  updatedAt: timestampSchema,
})

export const taskListSchema: z.ZodType<Task[]> = z.array(taskSchema)

export const taskInputSchema = z.object({
  title: z.string().trim().min(1, 'Title is required').max(120, 'Title must be 120 characters or fewer'),
  description: z.string().trim().max(2000, 'Description must be 2000 characters or fewer'),
  priority: z.enum(TASK_PRIORITIES, 'Choose a priority'),
  status: z.enum(TASK_STATUSES, 'Choose a status'),
  dueDate: z
    .string()
    .trim()
    .refine((value) => value === '' || isValidDateOnly(value), 'Enter a valid due date'),
})

const INPUT_KEYS = ['title', 'description', 'priority', 'status', 'dueDate'] as const

function isInputKey(value: unknown): value is keyof TaskInput {
  return typeof value === 'string' && INPUT_KEYS.some((key) => key === value)
}

export function inputErrors(error: ZodError): Partial<Record<keyof TaskInput, string>> {
  const messages: Partial<Record<keyof TaskInput, string>> = {}
  for (const issue of error.issues) {
    const key = issue.path[0]
    if (!isInputKey(key) || messages[key]) continue
    messages[key] = issue.message
  }
  return messages
}
