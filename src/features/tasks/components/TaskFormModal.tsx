import { useId, useState, type FormEvent } from 'react'
import { cn } from '../../../lib/cn.ts'
import { Dialog } from '../../layout/Dialog.tsx'
import { fieldClass, labelClass, primaryButton, secondaryButton } from '../../layout/styles.ts'
import { useUiStore } from '../../layout/ui-store.ts'
import { inputErrors, taskInputSchema } from '../schema.ts'
import { useTaskStore } from '../store.ts'
import { taskToInput } from '../task-logic.ts'
import {
  EMPTY_TASK_INPUT,
  PRIORITY_LABELS,
  STATUS_LABELS,
  TASK_PRIORITIES,
  TASK_STATUSES,
  type TaskInput,
} from '../types.ts'

export function TaskFormModal() {
  const dialog = useUiStore((state) => state.dialog)
  if (dialog.kind !== 'create' && dialog.kind !== 'edit') return null
  const taskId = dialog.kind === 'edit' ? dialog.taskId : null
  return <TaskForm key={taskId ?? 'new'} taskId={taskId} />
}

function TaskForm({ taskId }: { taskId: string | null }) {
  const closeDialog = useUiStore((state) => state.closeDialog)
  const existing = useTaskStore((state) => state.tasks.find((task) => task.id === taskId) ?? null)
  const addTask = useTaskStore((state) => state.addTask)
  const updateTask = useTaskStore((state) => state.updateTask)
  const [values, setValues] = useState<TaskInput>(() => (existing ? taskToInput(existing) : EMPTY_TASK_INPUT))
  const [errors, setErrors] = useState<Partial<Record<keyof TaskInput, string>>>({})
  const [formError, setFormError] = useState<string | null>(null)
  const titleId = useId()
  const descriptionId = useId()
  const dueDateId = useId()
  const priorityId = useId()
  const statusId = useId()
  const editing = taskId !== null

  if (editing && !existing) {
    return (
      <Dialog title="Task unavailable" description="This task is no longer on your list." onClose={closeDialog}>
        <button type="button" className={primaryButton} onClick={closeDialog}>
          Close
        </button>
      </Dialog>
    )
  }

  function setField<K extends keyof TaskInput>(key: K, value: TaskInput[K]) {
    setValues((current) => ({ ...current, [key]: value }))
    setErrors((current) => ({ ...current, [key]: undefined }))
    setFormError(null)
  }

  function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const parsed = taskInputSchema.safeParse(values)
    if (!parsed.success) {
      const nextErrors = inputErrors(parsed.error)
      setErrors(nextErrors)
      const order = [
        ['title', titleId],
        ['description', descriptionId],
        ['priority', priorityId],
        ['status', statusId],
        ['dueDate', dueDateId],
      ] as const
      const firstInvalid = order.find(([key]) => nextErrors[key])
      if (firstInvalid) {
        const target = document.getElementById(firstInvalid[1])
        if (target instanceof HTMLInputElement || target instanceof HTMLTextAreaElement) target.focus()
        else target?.querySelector('input')?.focus()
      }
      return
    }

    const saved = taskId ? updateTask(taskId, parsed.data) : addTask(parsed.data)
    if (!saved) {
      setFormError('The task could not be saved.')
      return
    }
    closeDialog()
  }

  return (
    <Dialog
      title={editing ? 'Edit task' : 'New task'}
      description={editing ? 'Update the details for this task.' : 'Add a task to your engineering list.'}
      onClose={closeDialog}
    >
      <form onSubmit={onSubmit} className="space-y-4" noValidate>
        {formError ? (
          <p role="alert" className="rounded-lg bg-rose-50 px-3 py-2 text-sm text-rose-800">
            {formError}
          </p>
        ) : null}
        <div>
          <label htmlFor={titleId} className={labelClass}>
            Title
          </label>
          <input
            id={titleId}
            name="title"
            type="text"
            value={values.title}
            onChange={(event) => setField('title', event.target.value)}
            maxLength={120}
            required
            aria-required="true"
            aria-invalid={Boolean(errors.title)}
            aria-describedby={errors.title ? `${titleId}-error` : undefined}
            className={fieldClass}
            autoComplete="off"
          />
          {errors.title ? (
            <p id={`${titleId}-error`} className="mt-1.5 text-sm text-rose-700">
              {errors.title}
            </p>
          ) : null}
        </div>
        <div>
          <label htmlFor={descriptionId} className={labelClass}>
            Description
          </label>
          <textarea
            id={descriptionId}
            name="description"
            value={values.description}
            onChange={(event) => setField('description', event.target.value)}
            maxLength={2000}
            rows={4}
            aria-invalid={Boolean(errors.description)}
            aria-describedby={errors.description ? `${descriptionId}-error` : undefined}
            className={fieldClass}
          />
          {errors.description ? (
            <p id={`${descriptionId}-error`} className="mt-1.5 text-sm text-rose-700">
              {errors.description}
            </p>
          ) : null}
        </div>
        <ChoiceGroup
          id={priorityId}
          legend="Priority"
          name="priority"
          value={values.priority}
          options={TASK_PRIORITIES.map((priority) => ({ value: priority, label: PRIORITY_LABELS[priority] }))}
          onChange={(priority) => setField('priority', priority)}
          error={errors.priority}
        />
        <ChoiceGroup
          id={statusId}
          legend="Status"
          name="status"
          value={values.status}
          options={TASK_STATUSES.map((status) => ({ value: status, label: STATUS_LABELS[status] }))}
          onChange={(status) => setField('status', status)}
          error={errors.status}
        />
        <div>
          <label htmlFor={dueDateId} className={labelClass}>
            Due date <span className="font-normal text-muted">(optional)</span>
          </label>
          <input
            id={dueDateId}
            name="dueDate"
            type="date"
            value={values.dueDate}
            onChange={(event) => setField('dueDate', event.target.value)}
            aria-invalid={Boolean(errors.dueDate)}
            aria-describedby={errors.dueDate ? `${dueDateId}-error` : undefined}
            className={fieldClass}
          />
          {errors.dueDate ? (
            <p id={`${dueDateId}-error`} className="mt-1.5 text-sm text-rose-700">
              {errors.dueDate}
            </p>
          ) : null}
        </div>
        <div className="flex flex-wrap justify-end gap-2 pt-1">
          <button type="button" className={secondaryButton} onClick={closeDialog}>
            Cancel
          </button>
          <button type="submit" className={primaryButton}>
            {editing ? 'Save changes' : 'Create task'}
          </button>
        </div>
      </form>
    </Dialog>
  )
}

type ChoiceGroupProps<T extends string> = {
  id: string
  legend: string
  name: string
  value: T
  options: Array<{ value: T; label: string }>
  onChange: (value: T) => void
  error?: string
}

function ChoiceGroup<T extends string>({ id, legend, name, value, options, onChange, error }: ChoiceGroupProps<T>) {
  const errorId = `${id}-error`
  return (
    <fieldset id={id} aria-describedby={error ? errorId : undefined}>
      <legend className={labelClass}>{legend}</legend>
      <div className="grid grid-cols-3 gap-2">
        {options.map((option) => {
          const selected = value === option.value
          return (
            <label
              key={option.value}
              className={cn(
                'cursor-pointer rounded-lg border px-2 py-2 text-center text-sm font-medium has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-brand',
                selected ? 'border-accent bg-brand-soft text-accent' : 'border-line bg-surface text-ink hover:bg-canvas',
              )}
            >
              <input
                className="sr-only"
                type="radio"
                name={name}
                value={option.value}
                checked={selected}
                onChange={() => onChange(option.value)}
              />
              {option.label}
            </label>
          )
        })}
      </div>
      {error ? (
        <p id={errorId} className="mt-1.5 text-sm text-rose-700">
          {error}
        </p>
      ) : null}
    </fieldset>
  )
}
