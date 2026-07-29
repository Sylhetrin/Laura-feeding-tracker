import type { Feeding, Settings } from '../types'
import { DEFAULT_SETTINGS } from '../types'

const FEEDINGS_KEY = 'laura-tracker:feedings'
const SETTINGS_KEY = 'laura-tracker:settings'

export function loadFeedings(): Feeding[] {
  try {
    const raw = localStorage.getItem(FEEDINGS_KEY)
    if (!raw) return []
    const parsed = JSON.parse(raw) as Feeding[]
    if (!Array.isArray(parsed)) return []
    return parsed
  } catch {
    return []
  }
}

export function saveFeedings(feedings: Feeding[]): void {
  localStorage.setItem(FEEDINGS_KEY, JSON.stringify(feedings))
}

export function loadSettings(): Settings {
  try {
    const raw = localStorage.getItem(SETTINGS_KEY)
    if (!raw) return DEFAULT_SETTINGS
    const parsed = JSON.parse(raw)
    return { ...DEFAULT_SETTINGS, ...parsed }
  } catch {
    return DEFAULT_SETTINGS
  }
}

export function saveSettings(settings: Settings): void {
  localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings))
}

export function exportCsv(feedings: Feeding[]): string {
  const header = 'id,timestamp,amountMl,burped,spitUp,fellAsleep,unfinished,note'
  const rows = feedings.map((f) =>
    [
      f.id,
      f.timestamp,
      f.amountMl,
      f.burped,
      f.spitUp,
      f.fellAsleep,
      f.unfinished,
      (f.note ?? '').replace(/[",\n]/g, ' '),
    ].join(','),
  )
  return [header, ...rows].join('\n')
}

export function parseCsv(text: string): Feeding[] {
  const lines = text.trim().split('\n')
  const [, ...dataLines] = lines
  return dataLines
    .filter((l) => l.trim().length > 0)
    .map((line) => {
      const cols = line.split(',')
      return {
        id: cols[0],
        timestamp: cols[1],
        amountMl: Number(cols[2]),
        burped: cols[3] === 'true',
        spitUp: cols[4] === 'true',
        fellAsleep: cols[5] === 'true',
        unfinished: cols[6] === 'true',
        note: cols[7] ?? '',
      }
    })
    .filter((f) => f.id && f.timestamp && !Number.isNaN(f.amountMl))
}
