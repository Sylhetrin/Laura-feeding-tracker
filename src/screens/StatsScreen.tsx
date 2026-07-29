import { useAppState } from '../context/AppState'
import { computeTodayStats } from '../utils/stats'
import { formatDuration } from '../utils/time'

function StatCard({ label, value, accent }: { label: string; value: string; accent?: string }) {
  return (
    <div
      className="rounded-2xl p-4"
      style={{ background: 'var(--card)', border: '1px solid var(--card-border)' }}
    >
      <p className="text-xs font-semibold uppercase tracking-wide" style={{ color: 'var(--text-tertiary)' }}>
        {label}
      </p>
      <p
        className="mt-1 font-display text-2xl font-bold tabular-nums"
        style={{ color: accent ?? 'var(--text-primary)' }}
      >
        {value}
      </p>
    </div>
  )
}

export function StatsScreen() {
  const { feedings } = useAppState()
  const stats = computeTodayStats(feedings)

  return (
    <div className="min-h-full px-5 pt-[calc(env(safe-area-inset-top)+20px)] pb-28">
      <h1 className="mb-1 font-display text-3xl font-bold" style={{ color: 'var(--text-primary)' }}>
        Statystyki
      </h1>
      <p className="mb-5 text-sm" style={{ color: 'var(--text-secondary)' }}>
        Dzisiaj
      </p>

      <div className="grid grid-cols-2 gap-3">
        <StatCard label="Karmień dzisiaj" value={String(stats.count)} accent="var(--accent-actual)" />
        <StatCard label="Suma mleka" value={`${stats.totalMl} ml`} accent="var(--accent-plan)" />
        <StatCard label="Średnia porcja" value={`${stats.avgMl} ml`} />
        <StatCard
          label="Najdłuższa przerwa"
          value={stats.longestGapMs !== null ? formatDuration(stats.longestGapMs) : '—'}
        />
        <StatCard
          label="Najkrótsza przerwa"
          value={stats.shortestGapMs !== null ? formatDuration(stats.shortestGapMs) : '—'}
        />
        <StatCard
          label="Średni odstęp"
          value={stats.avgIntervalMs !== null ? formatDuration(stats.avgIntervalMs) : '—'}
        />
      </div>
    </div>
  )
}
