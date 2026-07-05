import { create } from 'zustand'
import type { Theme } from '@/types'

interface ThemeState {
  theme: Theme
  fontSize: number
  animationsEnabled: boolean
  setTheme: (theme: Theme) => void
  setFontSize: (size: number) => void
  toggleAnimations: () => void
}

export const useThemeStore = create<ThemeState>((set) => ({
  theme: 'cyber',
  fontSize: 14,
  animationsEnabled: true,
  setTheme: (theme) => set({ theme }),
  setFontSize: (fontSize) => set({ fontSize }),
  toggleAnimations: () =>
    set((state) => ({ animationsEnabled: !state.animationsEnabled })),
}))
