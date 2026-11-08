import { useEffect, useRef, useState } from 'react'
import { useTaskStore } from '../tasks/store.ts'
import { BoardIcon, CloseIcon, DashboardIcon, ListIcon } from './icons.tsx'
import { useUiStore, type AppView } from './ui-store.ts'
import { cn } from '../../lib/cn.ts'

function useNarrowScreen(): boolean {
  const [isNarrow, setIsNarrow] = useState(() =>
    typeof window !== 'undefined' ? window.matchMedia('(max-width: 1023px)').matches : false,
  )

  useEffect(() => {
    const media = window.matchMedia('(max-width: 1023px)')
    const onChange = () => setIsNarrow(media.matches)
    media.addEventListener('change', onChange)
    return () => media.removeEventListener('change', onChange)
  }, [])

  return isNarrow
}

const NAV_ITEMS: Array<{ id: AppView; label: string; icon: typeof DashboardIcon }> = [
  { id: 'dashboard', label: 'Dashboard', icon: DashboardIcon },
  { id: 'tasks', label: 'Tasks', icon: ListIcon },
  { id: 'board', label: 'Board', icon: BoardIcon },
]

export function Sidebar() {
  const view = useUiStore((state) => state.view)
  const setView = useUiStore((state) => state.setView)
  const mobileNavOpen = useUiStore((state) => state.mobileNavOpen)
  const setMobileNavOpen = useUiStore((state) => state.setMobileNavOpen)
  const taskCount = useTaskStore((state) => state.tasks.length)
  const isNarrow = useNarrowScreen()
  const drawerHidden = isNarrow && !mobileNavOpen
  const closeButtonRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    if (!isNarrow || !mobileNavOpen) return
    const previouslyFocused = document.activeElement instanceof HTMLElement ? document.activeElement : null
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    closeButtonRef.current?.focus()

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') setMobileNavOpen(false)
    }
    document.addEventListener('keydown', onKeyDown)
    return () => {
      document.removeEventListener('keydown', onKeyDown)
      document.body.style.overflow = previousOverflow
      previouslyFocused?.focus()
    }
  }, [isNarrow, mobileNavOpen, setMobileNavOpen])

  return (
    <>
      {mobileNavOpen ? (
        <button
          type="button"
          className="fixed inset-0 z-30 bg-[#141816]/50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white lg:hidden"
          aria-label="Close navigation"
          onClick={() => setMobileNavOpen(false)}
        />
      ) : null}
      <aside
        id="primary-nav"
        inert={drawerHidden}
        aria-hidden={drawerHidden || undefined}
        className={cn(
          'fixed inset-y-0 left-0 z-40 flex w-64 flex-col bg-sidebar text-stone-200 transition-transform lg:translate-x-0',
          mobileNavOpen ? 'translate-x-0' : '-translate-x-full',
        )}
      >
        <div className="flex items-center justify-between px-4 py-5">
          <div className="flex items-center gap-3">
            <span className="grid h-10 w-10 place-items-center rounded-xl bg-brand font-mono text-sm font-semibold text-white">
              DT
            </span>
            <span>
              <span className="block text-sm font-semibold tracking-tight text-white">DevTask</span>
              <span className="block font-mono text-[11px] tracking-wide text-stone-300">Engineering desk</span>
            </span>
          </div>
          <button
            ref={closeButtonRef}
            type="button"
            className="inline-flex rounded-lg p-2 text-stone-300 hover:bg-white/10 hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-200 lg:hidden"
            onClick={() => setMobileNavOpen(false)}
            aria-label="Close navigation"
          >
            <CloseIcon className="h-4 w-4" />
          </button>
        </div>
        <nav aria-label="Primary" className="flex flex-1 flex-col gap-1 px-3">
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon
            const active = view === item.id
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => setView(item.id)}
                aria-current={active ? 'page' : undefined}
                className={cn(
                  'flex items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm font-medium transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-200',
                  active ? 'bg-white/10 text-white' : 'text-stone-300 hover:bg-white/5 hover:text-white',
                )}
              >
                <Icon className="h-4 w-4" />
                {item.label}
              </button>
            )
          })}
        </nav>
        <p className="px-5 py-5 font-mono text-[11px] leading-5 text-stone-300">
          {taskCount === 1 ? '1 task stored in this browser' : `${taskCount} tasks stored in this browser`}
        </p>
      </aside>
    </>
  )
}
