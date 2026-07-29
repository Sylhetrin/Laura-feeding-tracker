import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react'
import type { Feeding, Settings } from '../types'
import { loadFeedings, saveFeedings, loadSettings, saveSettings } from '../utils/storage'

interface AppStateValue {
  feedings: Feeding[]
  settings: Settings
  addFeeding: (data: Omit<Feeding, 'id'>) => void
  updateFeeding: (id: string, data: Partial<Feeding>) => void
  deleteFeeding: (id: string) => void
  replaceAllFeedings: (feedings: Feeding[]) => void
  clearHistory: () => void
  updateSettings: (data: Partial<Settings>) => void
}

const AppStateContext = createContext<AppStateValue | null>(null)

function makeId(): string {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`
}

export function AppStateProvider({ children }: { children: ReactNode }) {
  const [feedings, setFeedings] = useState<Feeding[]>(() => loadFeedings())
  const [settings, setSettings] = useState<Settings>(() => loadSettings())

  useEffect(() => {
    saveFeedings(feedings)
  }, [feedings])

  useEffect(() => {
    saveSettings(settings)
  }, [settings])

  // Apply dark/light/system theme to the document root.
  useEffect(() => {
    const root = document.documentElement
    const apply = () => {
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
      const isDark = settings.theme === 'dark' || (settings.theme === 'system' && prefersDark)
      root.classList.toggle('dark', isDark)
    }
    apply()
    if (settings.theme === 'system') {
      const mq = window.matchMedia('(prefers-color-scheme: dark)')
      mq.addEventListener('change', apply)
      return () => mq.removeEventListener('change', apply)
    }
  }, [settings.theme])

  const value = useMemo<AppStateValue>(
    () => ({
      feedings,
      settings,
      addFeeding: (data) => setFeedings((prev) => [...prev, { ...data, id: makeId() }]),
      updateFeeding: (id, data) =>
        setFeedings((prev) => prev.map((f) => (f.id === id ? { ...f, ...data } : f))),
      deleteFeeding: (id) => setFeedings((prev) => prev.filter((f) => f.id !== id)),
      replaceAllFeedings: (next) => setFeedings(next),
      clearHistory: () => setFeedings([]),
      updateSettings: (data) => setSettings((prev) => ({ ...prev, ...data })),
    }),
    [feedings, settings],
  )

  return <AppStateContext.Provider value={value}>{children}</AppStateContext.Provider>
}

export function useAppState(): AppStateValue {
  const ctx = useContext(AppStateContext)
  if (!ctx) throw new Error('useAppState must be used within AppStateProvider')
  return ctx
}
