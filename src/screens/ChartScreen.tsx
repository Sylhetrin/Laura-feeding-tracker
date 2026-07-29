import { useEffect, useMemo, useState } from 'react'
import { ComposedChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { useAppState } from '../context/AppState'
import { formatTime } from '../utils/time'

interface Point {
  time: number
  amount: number
}

export function ChartScreen() {
  const { feedings, settings } = useAppState()

  const [now, setNow] = useState(() => Date.now())
  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 60_000)
    return () => clearInterval(id)
  }, [])

  const from = now - 24 * 60 * 60 * 1000

  const actualPoints: Point[] = useMemo(
    () =>
      feedings
        .map((f) => ({ time: new Date(f.timestamp).getTime(), amount: f.amountMl }))
        .filter((p) => p.time >= from && p.time <= now)
        .sort((a, b) => a.time - b.time),
    [feedings, from, now],
  )

  const planPoints: Point[] = useMemo(() => {
    const intervalMs = settings.defaultIntervalHours * 60 * 60 * 1000
    const points: Point[] = []
    // Anchor the plan grid to the most recent feeding if available, otherwise to "now".
    const anchor = actualPoints.length > 0 ? actualPoints[actualPoints.length - 1].time : now
    let t = anchor
    while (t > from) t -= intervalMs
    while (t <= now + intervalMs) {
      if (t >= from) points.push({ time: t, amount: settings.defaultAmountMl })
      t += intervalMs
    }
    return points
  }, [actualPoints, from, now, settings.defaultIntervalHours, settings.defaultAmountMl])

  const maxAmount = Math.max(
    settings.defaultAmountMl + 20,
    ...actualPoints.map((p) => p.amount + 20),
    ...planPoints.map((p) => p.amount + 20),
  )

  return (
    <div className="min-h-full px-5 pt-[calc(env(safe-area-inset-top)+20px)] pb-28">
      <h1 className="mb-1 font-display text-3xl font-bold" style={{ color: 'var(--text-primary)' }}>
        Ostatnie 24h
      </h1>
      <p className="mb-4 text-sm" style={{ color: 'var(--text-secondary)' }}>
        Plan rodziców kontra rzeczywiste karmienia
      </p>

      <div className="mb-4 flex items-center gap-4 text-sm">
        <span className="flex items-center gap-1.5">
          <span className="h-2.5 w-2.5 rounded-full" style={{ background: 'var(--accent-plan)' }} />
          Plan ({settings.defaultIntervalHours}h · {settings.defaultAmountMl} ml)
        </span>
        <span className="flex items-center gap-1.5">
          <span className="h-2.5 w-2.5 rounded-full" style={{ background: 'var(--accent-actual)' }} />
          Rzeczywiste
        </span>
      </div>

      <div
        className="overflow-x-auto no-scrollbar rounded-3xl p-3"
        style={{ background: 'var(--card)', border: '1px solid var(--card-border)' }}
      >
        <div style={{ width: 720, height: 320 }}>
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart margin={{ top: 12, right: 16, bottom: 4, left: -12 }}>
              <CartesianGrid stroke="var(--card-border)" strokeDasharray="3 3" vertical={false} />
              <XAxis
                dataKey="time"
                type="number"
                domain={[from, now]}
                tickFormatter={(t) => formatTime(new Date(t), settings.timeFormat)}
                stroke="var(--text-tertiary)"
                fontSize={11}
                tickCount={7}
              />
              <YAxis
                dataKey="amount"
                type="number"
                domain={[0, maxAmount]}
                stroke="var(--text-tertiary)"
                fontSize={11}
                width={42}
                label={{ value: 'ml', position: 'insideTopLeft', fill: 'var(--text-tertiary)', fontSize: 11 }}
              />
              <Tooltip
                labelFormatter={(t) => formatTime(new Date(t as number), settings.timeFormat)}
                formatter={(value, name) => [`${value} ml`, String(name)]}
                contentStyle={{
                  background: 'var(--bg-elevated)',
                  border: '1px solid var(--card-border)',
                  borderRadius: 12,
                  fontSize: 12,
                }}
              />
              <Line
                data={planPoints}
                dataKey="amount"
                name="Plan"
                stroke="var(--accent-plan)"
                strokeWidth={2}
                strokeDasharray="5 4"
                dot={{ r: 3, fill: 'var(--accent-plan)' }}
                connectNulls
                isAnimationActive={false}
              />
              <Line
                data={actualPoints}
                dataKey="amount"
                name="Rzeczywiste"
                stroke="var(--accent-actual)"
                strokeWidth={2.5}
                dot={{ r: 4, fill: 'var(--accent-actual)' }}
                activeDot={{ r: 6 }}
                connectNulls
                isAnimationActive={false}
              />
            </ComposedChart>
          </ResponsiveContainer>
        </div>
      </div>
      <p className="mt-2 text-xs" style={{ color: 'var(--text-tertiary)' }}>
        Przewiń poziomo, aby przybliżyć wykres.
      </p>
    </div>
  )
}
