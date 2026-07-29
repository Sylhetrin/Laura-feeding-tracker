import { useRef, useState } from 'react'
import { useAppState } from '../context/AppState'
import { exportCsv, parseCsv } from '../utils/storage'
import type { TimeFormat } from '../types'

const INTERVAL_OPTIONS = [2, 2.5, 3, 3.5, 4]

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <p
      className="mb-2 mt-6 text-xs font-semibold uppercase tracking-wide"
      style={{ color: 'var(--text-tertiary)' }}
    >
      {children}
    </p>
  )
}

function Row({ children }: { children: React.ReactNode }) {
  return (
    <div
      className="flex items-center justify-between gap-3 rounded-2xl px-4 py-3"
      style={{ background: 'var(--card)', border: '1px solid var(--card-border)' }}
    >
      {children}
    </div>
  )
}

export function SettingsScreen() {
  const { settings, updateSettings, feedings, replaceAllFeedings, clearHistory } = useAppState()
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [confirmClear, setConfirmClear] = useState(false)
  const [importMessage, setImportMessage] = useState<string | null>(null)

  function handleExport() {
    const csv = exportCsv(feedings)
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `karmienia-${settings.babyName.toLowerCase()}-${new Date().toISOString().slice(0, 10)}.csv`
    a.click()
    URL.revokeObjectURL(url)
  }

  function handleImportClick() {
    fileInputRef.current?.click()
  }

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = () => {
      try {
        const parsed = parseCsv(String(reader.result))
        replaceAllFeedings(parsed)
        setImportMessage(`Zaimportowano ${parsed.length} karmień.`)
      } catch {
        setImportMessage('Nie udało się wczytać pliku CSV.')
      }
    }
    reader.readAsText(file)
    e.target.value = ''
  }

  return (
    <div className="min-h-full px-5 pt-[calc(env(safe-area-inset-top)+20px)] pb-28">
      <h1 className="mb-1 font-display text-3xl font-bold" style={{ color: 'var(--text-primary)' }}>
        Ustawienia
      </h1>

      <SectionLabel>Dziecko</SectionLabel>
      <Row>
        <label className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>
          Imię
        </label>
        <input
          type="text"
          value={settings.babyName}
          onChange={(e) => updateSettings({ babyName: e.target.value })}
          className="w-32 rounded-xl px-3 py-2 text-right text-sm"
          style={{
            background: 'var(--bg)',
            border: '1px solid var(--card-border)',
            color: 'var(--text-primary)',
          }}
        />
      </Row>

      <SectionLabel>Domyślne wartości</SectionLabel>
      <div className="flex flex-col gap-2.5">
        <Row>
          <label className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>
            Domyślna porcja
          </label>
          <input
            type="number"
            value={settings.defaultAmountMl}
            onChange={(e) => updateSettings({ defaultAmountMl: Number(e.target.value) })}
            className="w-24 rounded-xl px-3 py-2 text-right text-sm"
            style={{
              background: 'var(--bg)',
              border: '1px solid var(--card-border)',
              color: 'var(--text-primary)',
            }}
          />
        </Row>
        <Row>
          <label className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>
            Domyślny odstęp
          </label>
          <div className="flex flex-wrap justify-end gap-1.5">
            {INTERVAL_OPTIONS.map((h) => {
              const active = settings.defaultIntervalHours === h
              return (
                <button
                  key={h}
                  onClick={() => updateSettings({ defaultIntervalHours: h })}
                  className="rounded-full px-3 py-1.5 text-sm font-semibold tap-target"
                  style={{
                    background: active ? 'var(--accent-plan)' : 'var(--bg)',
                    color: active ? '#fff' : 'var(--text-secondary)',
                    border: `1px solid ${active ? 'var(--accent-plan)' : 'var(--card-border)'}`,
                  }}
                >
                  {h}h
                </button>
              )
            })}
          </div>
        </Row>
      </div>

      <SectionLabel>Wygląd</SectionLabel>
      <div className="flex flex-col gap-2.5">
        <Row>
          <label className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>
            Motyw
          </label>
          <div className="flex gap-1.5">
            {(['light', 'dark', 'system'] as const).map((mode) => {
              const active = settings.theme === mode
              const labels: Record<string, string> = { light: 'Jasny', dark: 'Ciemny', system: 'Auto' }
              return (
                <button
                  key={mode}
                  onClick={() => updateSettings({ theme: mode })}
                  className="rounded-full px-3 py-1.5 text-sm font-semibold tap-target"
                  style={{
                    background: active ? 'var(--accent-plan)' : 'var(--bg)',
                    color: active ? '#fff' : 'var(--text-secondary)',
                    border: `1px solid ${active ? 'var(--accent-plan)' : 'var(--card-border)'}`,
                  }}
                >
                  {labels[mode]}
                </button>
              )
            })}
          </div>
        </Row>
        <Row>
          <label className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>
            Format czasu
          </label>
          <div className="flex gap-1.5">
            {(['24h', '12h'] as TimeFormat[]).map((fmt) => {
              const active = settings.timeFormat === fmt
              return (
                <button
                  key={fmt}
                  onClick={() => updateSettings({ timeFormat: fmt })}
                  className="rounded-full px-3 py-1.5 text-sm font-semibold tap-target"
                  style={{
                    background: active ? 'var(--accent-plan)' : 'var(--bg)',
                    color: active ? '#fff' : 'var(--text-secondary)',
                    border: `1px solid ${active ? 'var(--accent-plan)' : 'var(--card-border)'}`,
                  }}
                >
                  {fmt}
                </button>
              )
            })}
          </div>
        </Row>
        <Row>
          <label className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>
            Kolor: Plan
          </label>
          <input
            type="color"
            value={settings.planColor}
            onChange={(e) => updateSettings({ planColor: e.target.value })}
            className="h-9 w-14 rounded-lg tap-target"
          />
        </Row>
        <Row>
          <label className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>
            Kolor: Rzeczywiste
          </label>
          <input
            type="color"
            value={settings.actualColor}
            onChange={(e) => updateSettings({ actualColor: e.target.value })}
            className="h-9 w-14 rounded-lg tap-target"
          />
        </Row>
      </div>

      <SectionLabel>Dane</SectionLabel>
      <div className="flex flex-col gap-2.5">
        <button
          onClick={handleExport}
          className="rounded-2xl px-4 py-3 text-left text-sm font-semibold tap-target"
          style={{
            background: 'var(--card)',
            border: '1px solid var(--card-border)',
            color: 'var(--text-primary)',
          }}
        >
          Eksportuj dane do CSV
        </button>
        <button
          onClick={handleImportClick}
          className="rounded-2xl px-4 py-3 text-left text-sm font-semibold tap-target"
          style={{
            background: 'var(--card)',
            border: '1px solid var(--card-border)',
            color: 'var(--text-primary)',
          }}
        >
          Importuj dane z CSV
        </button>
        <input ref={fileInputRef} type="file" accept=".csv" className="hidden" onChange={handleFileChange} />
        {importMessage && (
          <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>
            {importMessage}
          </p>
        )}

        {!confirmClear ? (
          <button
            onClick={() => setConfirmClear(true)}
            className="rounded-2xl px-4 py-3 text-left text-sm font-semibold tap-target"
            style={{
              background: 'var(--card)',
              border: '1px solid var(--card-border)',
              color: 'var(--accent-danger)',
            }}
          >
            Wyczyść historię
          </button>
        ) : (
          <div
            className="rounded-2xl px-4 py-3"
            style={{ background: 'var(--card)', border: `1px solid var(--accent-danger)` }}
          >
            <p className="mb-2 text-sm font-medium" style={{ color: 'var(--text-primary)' }}>
              Usunąć wszystkie zapisane karmienia? Tej operacji nie można cofnąć.
            </p>
            <div className="flex gap-2">
              <button
                onClick={() => setConfirmClear(false)}
                className="flex-1 rounded-xl py-2 text-sm font-semibold tap-target"
                style={{ background: 'var(--bg)', color: 'var(--text-secondary)' }}
              >
                Anuluj
              </button>
              <button
                onClick={() => {
                  clearHistory()
                  setConfirmClear(false)
                }}
                className="flex-1 rounded-xl py-2 text-sm font-semibold tap-target text-white"
                style={{ background: 'var(--accent-danger)' }}
              >
                Usuń wszystko
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
