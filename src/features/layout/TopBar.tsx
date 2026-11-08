import { MenuIcon, MoonIcon, PlusIcon, SunIcon } from './icons.tsx'
import { ghostButton, primaryButton } from './styles.ts'
import { useThemeStore } from '../theme/store.ts'
import { useUiStore, type AppView } from './ui-store.ts'

const VIEW_META: Record<AppView, { title: string; description: string }> = {
  dashboard: { title: 'Dashboard', description: 'Daily engineering overview' },
  tasks: { title: 'Tasks', description: 'Search, filter, and update work' },
  board: { title: 'Board', description: 'Move tasks across statuses' },
}

export function TopBar() {
  const view = useUiStore((state) => state.view)
  const setMobileNavOpen = useUiStore((state) => state.setMobileNavOpen)
  const mobileNavOpen = useUiStore((state) => state.mobileNavOpen)
  const openCreate = useUiStore((state) => state.openCreate)
  const theme = useThemeStore((state) => state.theme)
  const toggleTheme = useThemeStore((state) => state.toggleTheme)
  const meta = VIEW_META[view]
  const nextTheme = theme === 'dark' ? 'light' : 'dark'

  return (
    <header className="sticky top-0 z-20 flex items-center gap-3 border-b border-line bg-canvas/90 px-4 py-3 backdrop-blur sm:px-6 lg:px-8">
      <button
        type="button"
        className={`${ghostButton} lg:hidden`}
        aria-label="Open navigation"
        aria-expanded={mobileNavOpen}
        aria-controls="primary-nav"
        onClick={() => setMobileNavOpen(true)}
      >
        <MenuIcon className="h-5 w-5" />
      </button>
      <div className="min-w-0 flex-1">
        <h1 className="truncate text-lg font-semibold tracking-tight text-ink">{meta.title}</h1>
        <p className="hidden truncate text-sm text-muted sm:block">{meta.description}</p>
      </div>
      <button
        type="button"
        className={ghostButton}
        onClick={toggleTheme}
        aria-label={nextTheme === 'dark' ? 'Switch to dark theme' : 'Switch to light theme'}
      >
        {theme === 'dark' ? <SunIcon className="h-4 w-4" /> : <MoonIcon className="h-4 w-4" />}
        <span className="hidden sm:inline">{theme === 'dark' ? 'Light' : 'Dark'}</span>
      </button>
      <button type="button" className={`${primaryButton} px-3 sm:px-3.5`} onClick={openCreate} aria-label="New task">
        <PlusIcon className="h-4 w-4" />
        <span className="sm:hidden">New</span>
        <span className="hidden sm:inline">New task</span>
      </button>
    </header>
  )
}
