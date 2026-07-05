import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import type { Theme } from '@/types'

interface ThemeState {
  theme: Theme
  fontSize: number
  animationsEnabled: boolean
  selfLearning: boolean
  autoKnowledge: boolean
  workflowSpeed: number
  setTheme: (theme: Theme) => void
  setFontSize: (size: number) => void
  toggleAnimations: () => void
  toggleSelfLearning: () => void
  toggleAutoKnowledge: () => void
  setWorkflowSpeed: (speed: number) => void
}

export const useThemeStore = create<ThemeState>()(
  persist(
    (set) => ({
      theme: 'cyber',
      fontSize: 14,
      animationsEnabled: true,
      selfLearning: true,
      autoKnowledge: true,
      workflowSpeed: 2,
      setTheme: (theme) => set({ theme }),
      setFontSize: (fontSize) => set({ fontSize }),
      toggleAnimations: () =>
        set((state) => ({ animationsEnabled: !state.animationsEnabled })),
      toggleSelfLearning: () =>
        set((state) => ({ selfLearning: !state.selfLearning })),
      toggleAutoKnowledge: () =>
        set((state) => ({ autoKnowledge: !state.autoKnowledge })),
      setWorkflowSpeed: (speed) => set({ workflowSpeed: speed }),
    }),
    {
      name: 'hopeai-theme-store',
      storage: createJSONStorage(() => localStorage),
    }
  )
)
