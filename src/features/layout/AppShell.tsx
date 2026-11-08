import { ConfirmDeleteDialog } from '../tasks/components/ConfirmDeleteDialog.tsx'
import { StorageNotice } from '../tasks/components/StorageNotice.tsx'
import { TaskFormModal } from '../tasks/components/TaskFormModal.tsx'
import { BoardPage } from '../tasks/pages/BoardPage.tsx'
import { DashboardPage } from '../tasks/pages/DashboardPage.tsx'
import { TasksPage } from '../tasks/pages/TasksPage.tsx'
import { Sidebar } from './Sidebar.tsx'
import { TopBar } from './TopBar.tsx'
import { useUiStore } from './ui-store.ts'

export function AppShell() {
  const view = useUiStore((state) => state.view)

  return (
    <div className="min-h-svh bg-canvas text-ink">
      <a
        href="#main"
        className="absolute top-4 left-4 z-50 -translate-y-24 rounded-lg bg-surface px-3 py-2 text-sm font-medium text-ink focus:translate-y-0"
      >
        Skip to content
      </a>
      <Sidebar />
      <div className="lg:pl-64">
        <TopBar />
        <main id="main" className="mx-auto w-full max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
          <StorageNotice />
          {view === 'dashboard' ? <DashboardPage /> : null}
          {view === 'tasks' ? <TasksPage /> : null}
          {view === 'board' ? <BoardPage /> : null}
        </main>
      </div>
      <TaskFormModal />
      <ConfirmDeleteDialog />
    </div>
  )
}
