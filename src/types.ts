export interface Feeding {
  id: string
  /** ISO timestamp of when the feeding happened */
  timestamp: string
  /** Amount in millilitres */
  amountMl: number
  burped: boolean
  spitUp: boolean
  fellAsleep: boolean
  unfinished: boolean
  note?: string
}

export type TimeFormat = '24h' | '12h'

export interface Settings {
  babyName: string
  birthDate: string // ISO date, no time
  defaultAmountMl: number
  defaultIntervalHours: number
  timeFormat: TimeFormat
  planColor: string
  actualColor: string
  theme: 'light' | 'dark' | 'system'
}

export const DEFAULT_SETTINGS: Settings = {
  babyName: 'Laura',
  birthDate: '2026-06-03',
  defaultAmountMl: 120,
  defaultIntervalHours: 3,
  timeFormat: '24h',
  planColor: '#5B7FDE',
  actualColor: '#F6749B',
  theme: 'system',
}

export const AMOUNT_STEPS: number[] = Array.from({ length: 16 }, (_, i) => 50 + i * 10) // 50..200
