import './App.css'
import LandingPage from './pages/landing/LandingPage'
import HomePage from './pages/home/HomePage'
import CompetitionListPage from './pages/competition-list/CompetitionListPage'
import { Routes, Route } from 'react-router'
import CompetitionPage from './pages/competition/CompetitionPage'
import CompetitionGuidePage from './pages/competition-guide/CompetitionGuidePage'
import UserSettingsPage from './pages/settings/UserSettingsPage'

function App() {

  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/home" element={<HomePage />} />
      <Route path="/settings" element={<UserSettingsPage />} />
      <Route path="/competitions" element={<CompetitionListPage />} />
      <Route path="/competition" element={<CompetitionPage />} /> 
      <Route path="/competition-guide" element={<CompetitionGuidePage />} /> 
    </Routes>
  )
}

export default App
