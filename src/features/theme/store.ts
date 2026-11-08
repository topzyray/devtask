import { create } from 'zustand'
import { applyTheme, detectInitialTheme, writeTheme, type Theme } from './theme.ts'

type ThemeState = {
  theme: Theme
  setTheme: (theme: Theme) => void
  toggleTheme: () => void
}

export const useThemeStore = create<ThemeState>()((set, get) => ({
  theme: detectInitialTheme(),
  setTheme: (theme) => {
    applyTheme(theme)
    try {
      writeTheme(localStorage, theme)
    } catch {
      // The chosen theme still applies for this session if storage is blocked.
    }
    set({ theme })
  },
  toggleTheme: () => {
    get().setTheme(get().theme === 'dark' ? 'light' : 'dark')
  },
}))
