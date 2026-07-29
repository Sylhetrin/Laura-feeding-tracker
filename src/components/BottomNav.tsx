import { NavLink } from 'react-router-dom'
import { Home, History, LineChart, BarChart3, Settings } from 'lucide-react'

const tabs = [
  { to: '/', label: 'Dziś', icon: Home, end: true },
  { to: '/history', label: 'Historia', icon: History, end: false },
  { to: '/chart', label: 'Wykres', icon: LineChart, end: false },
  { to: '/stats', label: 'Statystyki', icon: BarChart3, end: false },
  { to: '/settings', label: 'Ustawienia', icon: Settings, end: false },
]

export function BottomNav() {
  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-30 safe-bottom border-t"
      style={{ background: 'var(--bg-elevated)', borderColor: 'var(--card-border)' }}
    >
      <div className="mx-auto flex max-w-md items-stretch justify-between px-1">
        {tabs.map(({ to, label, icon: Icon, end }) => (
          <NavLink
            key={to}
            to={to}
            end={end}
            className={({ isActive }) =>
              `flex flex-1 flex-col items-center gap-1 py-2 tap-target transition-colors ${
                isActive ? '' : ''
              }`
            }
            style={({ isActive }) => ({
              color: isActive ? 'var(--accent-actual)' : 'var(--text-tertiary)',
            })}
          >
            <Icon size={22} strokeWidth={2.2} />
            <span className="text-[10.5px] font-medium">{label}</span>
          </NavLink>
        ))}
      </div>
    </nav>
  )
}
