import type { Feeding } from '../types'
import { isSameDay } from './time'

export interface DayStats {
  count: number
  totalMl: number
  avgMl: number
  longestGapMs: number | null
  shortestGapMs: number | null
  avgIntervalMs: number | null
}

/** Feedings sorted ascending by timestamp */
export function sortAscending(feedings: Feeding[]): Feeding[] {
  return [...feedings].sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime())
}

/** Feedings sorted descending (most recent first) */
export function sortDescending(feedings: Feeding[]): Feeding[] {
  return [...feedings].sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
}

export function computeTodayStats(feedings: Feeding[], reference: Date = new Date()): DayStats {
  const todays = sortAscending(feedings.filter((f) => isSameDay(new Date(f.timestamp), reference)))

  const count = todays.length
  const totalMl = todays.reduce((sum, f) => sum + f.amountMl, 0)
  const avgMl = count > 0 ? Math.round(totalMl / count) : 0

  const gaps: number[] = []
  for (let i = 1; i < todays.length; i++) {
    gaps.push(new Date(todays[i].timestamp).getTime() - new Date(todays[i - 1].timestamp).getTime())
  }

  const longestGapMs = gaps.length > 0 ? Math.max(...gaps) : null
  const shortestGapMs = gaps.length > 0 ? Math.min(...gaps) : null
  const avgIntervalMs = gaps.length > 0 ? gaps.reduce((a, b) => a + b, 0) / gaps.length : null

  return { count, totalMl, avgMl, longestGapMs, shortestGapMs, avgIntervalMs }
}

export function getLastFeeding(feedings: Feeding[]): Feeding | null {
  if (feedings.length === 0) return null
  return sortDescending(feedings)[0]
}
