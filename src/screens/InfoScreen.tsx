import { useNavigate } from 'react-router-dom'
import { ChevronLeft, ExternalLink } from 'lucide-react'
import { useAppState } from '../context/AppState'

export function InfoScreen() {
  const navigate = useNavigate()
  const { settings } = useAppState()

  return (
    <div className="min-h-full px-5 pt-[calc(env(safe-area-inset-top)+16px)] pb-28">
      <header className="mb-5 flex items-center gap-2">
        <button
          onClick={() => navigate(-1)}
          aria-label="Wstecz"
          className="tap-target flex items-center justify-center rounded-full"
          style={{ color: 'var(--text-tertiary)' }}
        >
          <ChevronLeft size={26} />
        </button>
        <h1 className="font-display text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>
          Informacje
        </h1>
      </header>

      <div
        className="rounded-3xl p-5"
        style={{ background: 'var(--card)', border: '1px solid var(--card-border)' }}
      >
        <p className="text-sm leading-relaxed" style={{ color: 'var(--text-primary)' }}>
          Światowa Organizacja Zdrowia (WHO) zaleca przede wszystkim karmienie niemowląt zgodnie z ich
          sygnałami głodu i sytości — tzw. <em>responsive feeding</em> — a nie według sztywnego, jednakowego
          dla wszystkich harmonogramu.
        </p>
        <p className="mt-3 text-sm leading-relaxed" style={{ color: 'var(--text-primary)' }}>
          Ustawiony w tej aplikacji odstęp <strong>{settings.defaultIntervalHours} godzin</strong> to plan
          wybrany przez rodziców {settings.babyName}, często ustalony wspólnie z pediatrą — nie jest to
          oficjalny harmonogram WHO. Traktuj go jako punkt odniesienia, a nie sztywną regułę.
        </p>
        <p className="mt-3 text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
          Aplikacja pomaga jedynie zapisywać i wizualizować karmienia. Nie zastępuje ona konsultacji z
          lekarzem lub położną — w razie wątpliwości dotyczących apetytu, wagi lub zachowania dziecka
          skontaktuj się ze specjalistą.
        </p>
        <a
          href="https://www.who.int/news-room/fact-sheets/detail/infant-and-young-child-feeding"
          target="_blank"
          rel="noopener noreferrer"
          className="mt-4 flex items-center gap-1.5 text-sm font-semibold"
          style={{ color: 'var(--accent-plan)' }}
        >
          Oficjalne zalecenia WHO <ExternalLink size={14} />
        </a>
      </div>

      <p className="mt-4 px-1 text-xs" style={{ color: 'var(--text-tertiary)' }}>
        Ostrzeżenia w aplikacji (np. o wydłużonej przerwie lub niskiej ilości mleka) to wyłącznie
        przypomnienia, a nie diagnoza medyczna.
      </p>
    </div>
  )
}
