import { useEffect, useState } from 'react'
import { formatDuration } from '../utils/time'

interface RingCountdownProps {
  lastFeedingTime: Date | null
  intervalHours: number
  size?: number
}

/**
 * A radial "ring" that fills as time elapses since the last feeding,
 * echoing Apple Health's activity rings. It shifts from calm blue,
 * to warm amber near the due time, to red once overdue — the ring
 * closing early is a *warning* here, not an achievement.
 */
export function RingCountdown({ lastFeedingTime, intervalHours, size = 240 }: RingCountdownProps) {
  const [now, setNow] = useState(() => new Date())

  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 1000)
    return () => clearInterval(id)
  }, [])

  const intervalMs = intervalHours * 60 * 60 * 1000
  const stroke = size * 0.065
  const radius = (size - stroke) / 2
  const circumference = 2 * Math.PI * radius

  let progress = 0
  let remainingMs = intervalMs
  let overdue = false

  if (lastFeedingTime) {
    const elapsed = now.getTime() - lastFeedingTime.getTime()
    remainingMs = intervalMs - elapsed
    overdue = remainingMs < 0
    progress = overdue ? 1 : Math.min(1, elapsed / intervalMs)
  }

  const color = overdue
    ? 'var(--accent-danger)'
    : progress > 0.85
      ? 'var(--accent-amber)'
      : 'var(--accent-plan)'

  const dashOffset = circumference * (1 - progress)

  return (
    <div className="relative flex items-center justify-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="var(--card-border)"
          strokeWidth={stroke}
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={dashOffset}
          style={{ transition: 'stroke-dashoffset 0.6s ease, stroke 0.6s ease' }}
        />
      </svg>
      <div className="absolute flex flex-col items-center justify-center text-center px-4">
        <span
          className="text-xs font-medium tracking-wide uppercase"
          style={{ color: 'var(--text-tertiary)' }}
        >
          {overdue ? 'Po czasie' : 'Pozostało'}
        </span>
        <span
          className="font-display font-bold tabular-nums leading-none mt-1"
          style={{ fontSize: size * 0.155, color: overdue ? 'var(--accent-danger)' : 'var(--text-primary)' }}
        >
          {lastFeedingTime ? formatDuration(remainingMs).replace('-', '') : '—'}
        </span>
        {lastFeedingTime && overdue && (
          <span className="text-xs mt-1 font-medium" style={{ color: 'var(--accent-danger)' }}>
            za długo
          </span>
        )}
      </div>
    </div>
  )
}
