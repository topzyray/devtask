import { useRef, useState, type DragEvent } from 'react'
import { formatDueDate } from '../../../lib/date.ts'
import { cn } from '../../../lib/cn.ts'
import { GripIcon } from '../../layout/icons.tsx'
import { useTaskStore } from '../store.ts'
import { isTaskOverdue } from '../task-logic.ts'
import { STATUS_LABELS, TASK_STATUSES, type Task, type TaskStatus } from '../types.ts'
import { OverdueBadge, PriorityBadge } from './badges.tsx'
import { TaskActions } from './TaskActions.tsx'

type KanbanBoardProps = {
  tasks: readonly Task[]
}

export function KanbanBoard({ tasks }: KanbanBoardProps) {
  const updateTaskStatus = useTaskStore((state) => state.updateTaskStatus)
  const draggedIdRef = useRef<string | null>(null)
  const [draggedId, setDraggedId] = useState<string | null>(null)
  const [dropStatus, setDropStatus] = useState<TaskStatus | null>(null)

  function clearDrag() {
    draggedIdRef.current = null
    setDraggedId(null)
    setDropStatus(null)
  }

  function onDragStart(event: DragEvent<HTMLButtonElement>, taskId: string) {
    draggedIdRef.current = taskId
    event.dataTransfer.setData('text/plain', taskId)
    event.dataTransfer.effectAllowed = 'move'
    setDraggedId(taskId)
  }

  function onDrop(event: DragEvent<HTMLElement>, status: TaskStatus) {
    event.preventDefault()
    const taskId = event.dataTransfer.getData('text/plain') || draggedIdRef.current
    if (taskId) updateTaskStatus(taskId, status)
    clearDrag()
  }

  return (
    <div className="grid gap-4 lg:grid-cols-3">
      {TASK_STATUSES.map((status) => {
        const columnTasks = tasks.filter((task) => task.status === status)
        const activeDrop = dropStatus === status
        return (
          <section
            key={status}
            aria-label={STATUS_LABELS[status]}
            className={cn(
              'flex min-h-36 flex-col rounded-2xl border border-line bg-canvas/70 p-3 lg:min-h-64',
              activeDrop && 'border-accent bg-brand-soft',
            )}
            onDragOver={(event) => {
              event.preventDefault()
              event.dataTransfer.dropEffect = 'move'
              setDropStatus((current) => (current === status ? current : status))
            }}
            onDragLeave={(event) => {
              if (event.currentTarget.contains(event.relatedTarget as Node | null)) return
              setDropStatus((current) => (current === status ? null : current))
            }}
            onDrop={(event) => onDrop(event, status)}
          >
            <header className="mb-3 flex items-center justify-between gap-2 px-1">
              <h2 className="text-sm font-semibold text-ink">{STATUS_LABELS[status]}</h2>
              <span className="rounded-full bg-surface px-2 py-0.5 font-mono text-xs text-muted">{columnTasks.length}</span>
            </header>
            <div className="flex flex-1 flex-col gap-3">
              {columnTasks.length === 0 ? (
                <p className="rounded-xl border border-dashed border-line px-3 py-6 text-center text-sm text-muted">
                  {draggedId ? 'Drop a task here' : 'No tasks'}
                </p>
              ) : (
                columnTasks.map((task) => (
                  <article key={task.id} className="rounded-xl border border-line bg-surface p-3 shadow-sm">
                    <div className="flex items-start gap-2">
                      <button
                        type="button"
                        draggable
                        onDragStart={(event) => onDragStart(event, task.id)}
                        onDragEnd={clearDrag}
                        aria-label={`Drag ${task.title}`}
                        className="mt-0.5 hidden cursor-grab rounded-md p-1 text-muted hover:bg-canvas active:cursor-grabbing lg:inline-flex"
                      >
                        <GripIcon className="h-4 w-4" />
                      </button>
                      <div className="min-w-0 flex-1">
                        <h3 className="text-sm font-semibold text-ink">{task.title}</h3>
                        {task.description ? <p className="mt-1 line-clamp-3 text-sm text-muted">{task.description}</p> : null}
                        <div className="mt-2 flex flex-wrap items-center gap-2">
                          <PriorityBadge priority={task.priority} />
                          {isTaskOverdue(task) ? <OverdueBadge /> : null}
                        </div>
                        <p className="mt-2 font-mono text-xs text-muted">Due {formatDueDate(task.dueDate)}</p>
                      </div>
                    </div>
                    <div className="mt-3">
                      <TaskActions task={task} />
                    </div>
                  </article>
                ))
              )}
            </div>
          </section>
        )
      })}
    </div>
  )
}
