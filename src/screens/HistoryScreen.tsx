import { useMemo, useState } from 'react'
import { Trash2, Pencil, Check, X } from 'lucide-react'
import { useAppState } from '../context/AppState'
import { sortDescending } from '../utils/stats'
import { formatDateShort, formatTime } from '../utils/time'
import { isSameDay } from '../utils/time'

const FLAG_EMOJI: Record<string, string> = {
  burped: '💨',
  spitUp: '🫗',
  fellAsleep: '😴',
  unfinished: '🍼',
}

function dayLabelFor(timestamp: string): string {
  const date = new Date(timestamp)
  return isSameDay(date, new Date()) ? 'Dziś' : formatDateShort(date)
}

export function HistoryScreen() {
  const { feedings, settings, updateFeeding, deleteFeeding } = useAppState()
  const [editingId, setEditingId] = useState<string | null>(null)
  const [draftAmount, setDraftAmount] = useState(0)
  const [draftTime, setDraftTime] = useState('')
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null)

  const sorted = sortDescending(feedings)

  const rows = useMemo(
    () =>
      sorted.map((f, index) => {
        const dayLabel = dayLabelFor(f.timestamp)
        const showDayHeader = index === 0 || dayLabelFor(sorted[index - 1].timestamp) !== dayLabel
        return { feeding: f, dayLabel, showDayHeader }
      }),
    [sorted],
  )

  function startEdit(id: string, amount: number, timestamp: string) {
    setEditingId(id)
    setDraftAmount(amount)
    // datetime-local expects "YYYY-MM-DDTHH:mm"
    const d = new Date(timestamp)
    const pad = (n: number) => String(n).padStart(2, '0')
    setDraftTime(
      `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`,
    )
  }

  function saveEdit(id: string) {
    updateFeeding(id, { amountMl: draftAmount, timestamp: new Date(draftTime).toISOString() })
    setEditingId(null)
  }

  return (
    <div className="min-h-full px-5 pt-[calc(env(safe-area-inset-top)+20px)] pb-28">
      <h1 className="mb-5 font-display text-3xl font-bold" style={{ color: 'var(--text-primary)' }}>
        Historia
      </h1>

      {sorted.length === 0 && (
        <p className="mt-10 text-center text-sm" style={{ color: 'var(--text-tertiary)' }}>
          Brak zapisanych karmień.
        </p>
      )}

      <div className="flex flex-col gap-2.5">
        {rows.map(({ feeding: f, dayLabel, showDayHeader }) => {
          const date = new Date(f.timestamp)
          const isEditing = editingId === f.id
          const activeFlags = (['burped', 'spitUp', 'fellAsleep', 'unfinished'] as const).filter((k) => f[k])

          return (
            <div key={f.id}>
              {showDayHeader && (
                <p
                  className="mb-1.5 mt-3 text-xs font-semibold uppercase tracking-wide"
                  style={{ color: 'var(--text-tertiary)' }}
                >
                  {dayLabel}
                </p>
              )}
              <div
                className="rounded-2xl p-4"
                style={{ background: 'var(--card)', border: '1px solid var(--card-border)' }}
              >
                {!isEditing ? (
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="flex items-baseline gap-2">
                        <span
                          className="font-display text-2xl font-bold tabular-nums"
                          style={{ color: 'var(--text-primary)' }}
                        >
                          {formatTime(date, settings.timeFormat)}
                        </span>
                        <span className="font-semibold" style={{ color: 'var(--accent-actual)' }}>
                          {f.amountMl} ml
                        </span>
                      </div>
                      {activeFlags.length > 0 && (
                        <div className="mt-1 flex gap-1 text-sm">
                          {activeFlags.map((k) => (
                            <span key={k}>{FLAG_EMOJI[k]}</span>
                          ))}
                        </div>
                      )}
                    </div>
                    <div className="flex gap-1">
                      <button
                        onClick={() => startEdit(f.id, f.amountMl, f.timestamp)}
                        className="tap-target flex items-center justify-center rounded-full"
                        style={{ color: 'var(--text-tertiary)' }}
                        aria-label="Edytuj"
                      >
                        <Pencil size={18} />
                      </button>
                      {confirmDeleteId === f.id ? (
                        <button
                          onClick={() => {
                            deleteFeeding(f.id)
                            setConfirmDeleteId(null)
                          }}
                          className="tap-target flex items-center justify-center rounded-full text-sm font-semibold"
                          style={{ color: 'var(--accent-danger)' }}
                        >
                          Usuń?
                        </button>
                      ) : (
                        <button
                          onClick={() => setConfirmDeleteId(f.id)}
                          className="tap-target flex items-center justify-center rounded-full"
                          style={{ color: 'var(--text-tertiary)' }}
                          aria-label="Usuń"
                        >
                          <Trash2 size={18} />
                        </button>
                      )}
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col gap-3">
                    <div className="flex items-center gap-3">
                      <input
                        type="datetime-local"
                        value={draftTime}
                        onChange={(e) => setDraftTime(e.target.value)}
                        className="flex-1 rounded-xl px-3 py-2 text-sm"
                        style={{
                          background: 'var(--bg)',
                          border: '1px solid var(--card-border)',
                          color: 'var(--text-primary)',
                        }}
                      />
                      <input
                        type="number"
                        value={draftAmount}
                        onChange={(e) => setDraftAmount(Number(e.target.value))}
                        className="w-20 rounded-xl px-3 py-2 text-sm"
                        style={{
                          background: 'var(--bg)',
                          border: '1px solid var(--card-border)',
                          color: 'var(--text-primary)',
                        }}
                      />
                      <span className="text-sm" style={{ color: 'var(--text-tertiary)' }}>
                        ml
                      </span>
                    </div>
                    <div className="flex justify-end gap-2">
                      <button
                        onClick={() => setEditingId(null)}
                        className="tap-target flex items-center justify-center rounded-full"
                        style={{ color: 'var(--text-tertiary)' }}
                      >
                        <X size={20} />
                      </button>
                      <button
                        onClick={() => saveEdit(f.id)}
                        className="tap-target flex items-center justify-center rounded-full"
                        style={{ color: 'var(--accent-sage)' }}
                      >
                        <Check size={20} />
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
