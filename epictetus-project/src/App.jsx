import './App.css'
import HomePage from './pages/home/LandingPage'
import CompetitionListPage from './pages/competition-list/CompetitionListPage'
import { Routes, Route } from 'react-router'
import CompetitionPage from './pages/competition/CompetitionPage'

function App() {

  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/competitions" element={<CompetitionListPage />} />
      <Route path="/competition" element={<CompetitionPage />} /> 
    </Routes>
  )
}

export default App
