import { create } from 'zustand'

export type AppView = 'dashboard' | 'tasks' | 'board'

export type DialogState =
  | { kind: 'none' }
  | { kind: 'create' }
  | { kind: 'edit'; taskId: string }
  | { kind: 'delete'; taskId: string }

type UiState = {
  view: AppView
  mobileNavOpen: boolean
  dialog: DialogState
  setView: (view: AppView) => void
  setMobileNavOpen: (open: boolean) => void
  openCreate: () => void
  openEdit: (taskId: string) => void
  openDelete: (taskId: string) => void
  closeDialog: () => void
}

export const useUiStore = create<UiState>()((set) => ({
  view: 'dashboard',
  mobileNavOpen: false,
  dialog: { kind: 'none' },
  setView: (view) => set({ view, mobileNavOpen: false }),
  setMobileNavOpen: (mobileNavOpen) => set({ mobileNavOpen }),
  openCreate: () => set({ dialog: { kind: 'create' }, mobileNavOpen: false }),
  openEdit: (taskId) => set({ dialog: { kind: 'edit', taskId }, mobileNavOpen: false }),
  openDelete: (taskId) => set({ dialog: { kind: 'delete', taskId } }),
  closeDialog: () => set({ dialog: { kind: 'none' } }),
}))
