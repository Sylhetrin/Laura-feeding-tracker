import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { X, Minus, Plus } from 'lucide-react'
import { useAppState } from '../context/AppState'
import { AMOUNT_STEPS } from '../types'

const TOGGLES: Array<{
  key: 'burped' | 'spitUp' | 'fellAsleep' | 'unfinished'
  label: string
  emoji: string
}> = [
  { key: 'burped', label: 'Odbiła', emoji: '💨' },
  { key: 'spitUp', label: 'Ulewała', emoji: '🫗' },
  { key: 'fellAsleep', label: 'Zasnęła', emoji: '😴' },
  { key: 'unfinished', label: 'Niedokończona', emoji: '🍼' },
]

export function AddFeedingScreen() {
  const { settings, addFeeding } = useAppState()
  const navigate = useNavigate()
  const [amount, setAmount] = useState(settings.defaultAmountMl)
  const [flags, setFlags] = useState<Record<string, boolean>>({})

  function save() {
    addFeeding({
      timestamp: new Date().toISOString(),
      amountMl: amount,
      burped: !!flags.burped,
      spitUp: !!flags.spitUp,
      fellAsleep: !!flags.fellAsleep,
      unfinished: !!flags.unfinished,
    })
    navigate('/')
  }

  function toggle(key: string) {
    setFlags((prev) => ({ ...prev, [key]: !prev[key] }))
  }

  return (
    <div className="flex min-h-full flex-col px-5 pt-[calc(env(safe-area-inset-top)+16px)] pb-8">
      <header className="mb-4 flex items-center justify-between">
        <h1 className="font-display text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>
          Nowe karmienie
        </h1>
        <button
          onClick={() => navigate(-1)}
          aria-label="Anuluj"
          className="tap-target flex items-center justify-center rounded-full"
          style={{ color: 'var(--text-tertiary)' }}
        >
          <X size={26} />
        </button>
      </header>

      <div className="mb-5 flex items-center justify-center gap-4">
        <button
          onClick={() => setAmount((a) => Math.max(0, a - 5))}
          className="tap-target flex items-center justify-center rounded-full"
          style={{ background: 'var(--card)', border: '1px solid var(--card-border)' }}
          aria-label="Minus 5 ml"
        >
          <Minus size={20} style={{ color: 'var(--text-secondary)' }} />
        </button>
        <div
          className="font-display text-6xl font-bold tabular-nums"
          style={{ color: 'var(--accent-actual)' }}
        >
          {amount}
          <span className="ml-1 text-2xl font-semibold" style={{ color: 'var(--text-tertiary)' }}>
            ml
          </span>
        </div>
        <button
          onClick={() => setAmount((a) => a + 5)}
          className="tap-target flex items-center justify-center rounded-full"
          style={{ background: 'var(--card)', border: '1px solid var(--card-border)' }}
          aria-label="Plus 5 ml"
        >
          <Plus size={20} style={{ color: 'var(--text-secondary)' }} />
        </button>
      </div>

      <div className="grid grid-cols-4 gap-2.5">
        {AMOUNT_STEPS.map((step) => {
          const active = step === amount
          return (
            <button
              key={step}
              onClick={() => setAmount(step)}
              className="tap-target rounded-2xl py-3 text-lg font-bold transition-colors"
              style={{
                background: active ? 'var(--accent-actual)' : 'var(--card)',
                color: active ? '#fff' : 'var(--text-primary)',
                border: `1px solid ${active ? 'var(--accent-actual)' : 'var(--card-border)'}`,
              }}
            >
              {step}
            </button>
          )
        })}
      </div>

      <div className="mt-6">
        <p
          className="mb-2 text-xs font-semibold uppercase tracking-wide"
          style={{ color: 'var(--text-tertiary)' }}
        >
          Dodatkowe (opcjonalnie)
        </p>
        <div className="flex flex-wrap gap-2">
          {TOGGLES.map(({ key, label, emoji }) => {
            const active = !!flags[key]
            return (
              <button
                key={key}
                onClick={() => toggle(key)}
                className="flex items-center gap-1.5 rounded-full px-3 py-2 text-sm font-medium tap-target"
                style={{
                  background: active
                    ? 'color-mix(in srgb, var(--accent-plan) 16%, transparent)'
                    : 'var(--card)',
                  color: active ? 'var(--accent-plan)' : 'var(--text-secondary)',
                  border: `1px solid ${active ? 'var(--accent-plan)' : 'var(--card-border)'}`,
                }}
              >
                <span>{emoji}</span>
                {label}
              </button>
            )
          })}
        </div>
      </div>

      <div className="flex-1" />

      <button
        onClick={save}
        className="mt-6 w-full rounded-full py-5 text-xl font-bold text-white shadow-lg active:scale-[0.98] transition-transform"
        style={{ background: 'var(--accent-sage)' }}
      >
        ✅ Zapisz karmienie
      </button>
    </div>
  )
}
