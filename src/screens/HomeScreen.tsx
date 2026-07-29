import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Info, RotateCcw } from 'lucide-react'
import { useAppState } from '../context/AppState'
import { RingCountdown } from '../components/RingCountdown'
import { getLastFeeding } from '../utils/stats'
import { formatTime } from '../utils/time'

export function HomeScreen() {
  const { feedings, settings, addFeeding } = useAppState()
  const navigate = useNavigate()
  const [now, setNow] = useState(() => new Date())

  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 15000)
    return () => clearInterval(id)
  }, [])

  const last = getLastFeeding(feedings)
  const lastTime = last ? new Date(last.timestamp) : null
  const intervalMs = settings.defaultIntervalHours * 60 * 60 * 1000
  const nextTime = lastTime ? new Date(lastTime.getTime() + intervalMs) : null
  const hoursSinceLast = lastTime ? (now.getTime() - lastTime.getTime()) / 3_600_000 : null
  const overdueBy4h = hoursSinceLast !== null && hoursSinceLast >= 4
  const lowAmount = last !== null && last.amountMl < 60

  function repeatLastFeeding() {
    addFeeding({
      timestamp: new Date().toISOString(),
      amountMl: last?.amountMl ?? settings.defaultAmountMl,
      burped: false,
      spitUp: false,
      fellAsleep: false,
      unfinished: false,
    })
  }

  return (
    <div className="flex min-h-full flex-col px-5 pt-[calc(env(safe-area-inset-top)+20px)] pb-40">
      <header className="mb-6 flex items-center justify-between">
        <h1 className="font-display text-3xl font-bold" style={{ color: 'var(--text-primary)' }}>
          {settings.babyName}
        </h1>
        <button
          onClick={() => navigate('/info')}
          aria-label="Informacje o WHO i aplikacji"
          className="tap-target flex items-center justify-center rounded-full"
          style={{ color: 'var(--text-tertiary)' }}
        >
          <Info size={24} />
        </button>
      </header>

      <section
        className="rounded-3xl p-5 mb-4"
        style={{
          background: 'var(--card)',
          boxShadow: 'var(--shadow-card)',
          border: '1px solid var(--card-border)',
        }}
      >
        <p
          className="text-xs font-semibold uppercase tracking-wide"
          style={{ color: 'var(--text-tertiary)' }}
        >
          Ostatnie karmienie
        </p>
        <div className="mt-1 flex items-baseline gap-3">
          <span
            className="font-display text-5xl font-bold tabular-nums"
            style={{ color: 'var(--text-primary)' }}
          >
            {lastTime ? formatTime(lastTime, settings.timeFormat) : '—'}
          </span>
          <span className="text-2xl font-semibold" style={{ color: 'var(--accent-actual)' }}>
            {last ? `${last.amountMl} ml` : ''}
          </span>
        </div>
      </section>

      {(overdueBy4h || lowAmount) && (
        <div className="mb-4 flex flex-col gap-2">
          {overdueBy4h && (
            <div
              className="rounded-2xl px-4 py-3 text-sm font-medium"
              style={{
                background: 'color-mix(in srgb, var(--accent-danger) 14%, transparent)',
                color: 'var(--accent-danger)',
              }}
            >
              Czas sprawdzić, czy {settings.babyName} nie jest głodna.
            </div>
          )}
          {lowAmount && (
            <div
              className="rounded-2xl px-4 py-3 text-sm font-medium"
              style={{
                background: 'color-mix(in srgb, var(--accent-amber) 16%, transparent)',
                color: 'var(--accent-amber)',
              }}
            >
              Warto obserwować kolejne karmienie.
            </div>
          )}
        </div>
      )}

      <div className="flex flex-1 flex-col items-center justify-center py-4">
        <RingCountdown lastFeedingTime={lastTime} intervalHours={settings.defaultIntervalHours} />
        <p className="mt-4 text-sm" style={{ color: 'var(--text-secondary)' }}>
          Następne sugerowane karmienie{' '}
          <span className="font-semibold" style={{ color: 'var(--text-primary)' }}>
            {nextTime ? formatTime(nextTime, settings.timeFormat) : '—'}
          </span>
        </p>
      </div>

      {last && (
        <button
          onClick={repeatLastFeeding}
          className="mb-3 flex items-center justify-center gap-2 rounded-2xl py-3 text-sm font-semibold tap-target"
          style={{
            background: 'var(--card)',
            border: '1px solid var(--card-border)',
            color: 'var(--text-secondary)',
          }}
        >
          <RotateCcw size={16} />
          Powtórz ostatnie karmienie ({last.amountMl} ml)
        </button>
      )}

      {/* Fixed, thumb-reachable primary action */}
      <div
        className="fixed bottom-0 left-0 right-0 z-20 px-5 pb-[calc(env(safe-area-inset-bottom)+84px)] pt-4"
        style={{ background: 'linear-gradient(to top, var(--bg) 55%, transparent)' }}
      >
        <button
          onClick={() => navigate('/add')}
          className="mx-auto block w-full max-w-md rounded-full py-5 text-xl font-bold text-white shadow-lg active:scale-[0.98] transition-transform"
          style={{ background: 'var(--accent-actual)' }}
        >
          Nakarmiono
        </button>
      </div>
    </div>
  )
}
