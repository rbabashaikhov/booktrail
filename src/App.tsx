import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { LibraryPage } from './pages/LibraryPage'
import { AddBookPage } from './pages/AddBookPage'
import { BookDetailsPage } from './pages/BookDetailsPage'
import { StatsPage } from './pages/StatsPage'
import { SettingsPage } from './pages/SettingsPage'
import { BottomNav } from './components/ui/BottomNav'

const navItems = [
  { to: '/', label: 'Library', icon: <span aria-hidden>📚</span> },
  { to: '/add', label: 'Add', icon: <span aria-hidden>➕</span> },
  { to: '/stats', label: 'Stats', icon: <span aria-hidden>📊</span> },
  { to: '/settings', label: 'Settings', icon: <span aria-hidden>⚙️</span> },
]

export default function App() {
  return (
    <BrowserRouter>
      <div className="flex flex-col flex-1 min-h-screen">
        <main className="flex-1 overflow-auto">
          <Routes>
            <Route path="/" element={<LibraryPage />} />
            <Route path="/add" element={<AddBookPage />} />
            <Route path="/book/:id" element={<BookDetailsPage />} />
            <Route path="/stats" element={<StatsPage />} />
            <Route path="/settings" element={<SettingsPage />} />
          </Routes>
        </main>
        <BottomNav items={navItems} />
      </div>
    </BrowserRouter>
  )
}
