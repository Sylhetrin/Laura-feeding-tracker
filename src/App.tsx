import { HashRouter, Routes, Route, useLocation } from 'react-router-dom'
import { AppStateProvider } from './context/AppState'
import { BottomNav } from './components/BottomNav'
import { HomeScreen } from './screens/HomeScreen'
import { AddFeedingScreen } from './screens/AddFeedingScreen'
import { HistoryScreen } from './screens/HistoryScreen'
import { ChartScreen } from './screens/ChartScreen'
import { StatsScreen } from './screens/StatsScreen'
import { SettingsScreen } from './screens/SettingsScreen'
import { InfoScreen } from './screens/InfoScreen'

function Shell() {
  const location = useLocation()
  // The add-feeding flow and info screen are full-screen overlays without the tab bar,
  // so the primary action stays reachable with zero visual clutter.
  const hideNav = location.pathname === '/add' || location.pathname === '/info'

  return (
    <div className="min-h-dvh" style={{ background: 'var(--bg)' }}>
      <Routes>
        <Route path="/" element={<HomeScreen />} />
        <Route path="/add" element={<AddFeedingScreen />} />
        <Route path="/history" element={<HistoryScreen />} />
        <Route path="/chart" element={<ChartScreen />} />
        <Route path="/stats" element={<StatsScreen />} />
        <Route path="/settings" element={<SettingsScreen />} />
        <Route path="/info" element={<InfoScreen />} />
      </Routes>
      {!hideNav && <BottomNav />}
    </div>
  )
}

function App() {
  return (
    <AppStateProvider>
      <HashRouter>
        <Shell />
      </HashRouter>
    </AppStateProvider>
  )
}

export default App
