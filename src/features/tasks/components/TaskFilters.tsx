import {
  DEFAULT_TASK_QUERY,
  isPriorityFilter,
  isStatusFilter,
  isTaskSort,
  PRIORITY_LABELS,
  SORT_LABELS,
  STATUS_LABELS,
  TASK_PRIORITIES,
  TASK_SORTS,
  TASK_STATUSES,
} from '../types.ts'
import { useTaskStore } from '../store.ts'
import { fieldClass, ghostButton, labelClass } from '../../layout/styles.ts'

export function TaskFilters() {
  const search = useTaskStore((state) => state.search)
  const status = useTaskStore((state) => state.status)
  const priority = useTaskStore((state) => state.priority)
  const sort = useTaskStore((state) => state.sort)
  const setSearch = useTaskStore((state) => state.setSearch)
  const setStatus = useTaskStore((state) => state.setStatus)
  const setPriority = useTaskStore((state) => state.setPriority)
  const setSort = useTaskStore((state) => state.setSort)
  const resetFilters = useTaskStore((state) => state.resetFilters)
  const filtersActive =
    search !== DEFAULT_TASK_QUERY.search ||
    status !== DEFAULT_TASK_QUERY.status ||
    priority !== DEFAULT_TASK_QUERY.priority ||
    sort !== DEFAULT_TASK_QUERY.sort

  return (
    <div className="grid gap-3 rounded-2xl border border-line bg-surface p-4 sm:grid-cols-2 xl:grid-cols-[minmax(0,1.4fr)_repeat(3,minmax(0,1fr))_auto] xl:items-end">
      <div>
        <label htmlFor="task-search" className={labelClass}>
          Search
        </label>
        <input
          id="task-search"
          type="search"
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          placeholder="Search by title"
          autoComplete="off"
          className={fieldClass}
        />
      </div>
      <div>
        <label htmlFor="task-status-filter" className={labelClass}>
          Status
        </label>
        <select
          id="task-status-filter"
          value={status}
          onChange={(event) => {
            const next = event.target.value
            if (isStatusFilter(next)) setStatus(next)
          }}
          className={fieldClass}
        >
          <option value="all">All statuses</option>
          {TASK_STATUSES.map((item) => (
            <option key={item} value={item}>
              {STATUS_LABELS[item]}
            </option>
          ))}
        </select>
      </div>
      <div>
        <label htmlFor="task-priority-filter" className={labelClass}>
          Priority
        </label>
        <select
          id="task-priority-filter"
          value={priority}
          onChange={(event) => {
            const next = event.target.value
            if (isPriorityFilter(next)) setPriority(next)
          }}
          className={fieldClass}
        >
          <option value="all">All priorities</option>
          {TASK_PRIORITIES.map((item) => (
            <option key={item} value={item}>
              {PRIORITY_LABELS[item]}
            </option>
          ))}
        </select>
      </div>
      <div>
        <label htmlFor="task-sort" className={labelClass}>
          Sort
        </label>
        <select
          id="task-sort"
          value={sort}
          onChange={(event) => {
            const next = event.target.value
            if (isTaskSort(next)) setSort(next)
          }}
          className={fieldClass}
        >
          {TASK_SORTS.map((item) => (
            <option key={item} value={item}>
              {SORT_LABELS[item]}
            </option>
          ))}
        </select>
      </div>
      <button type="button" className={ghostButton} onClick={resetFilters} disabled={!filtersActive}>
        Clear filters
      </button>
    </div>
  )
}
