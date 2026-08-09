import './App.css'
import LandingPage from './pages/landing/LandingPage'
import HomePage from './pages/home/HomePage'
import CompetitionListPage from './pages/competition-list/CompetitionListPage'
import { Routes, Route } from 'react-router'
import CompetitionPage from './pages/competition/CompetitionPage'
import CompetitionGuidePage from './pages/competition-guide/CompetitionGuidePage'
import GuideArticlePage from './pages/guide-article/GuideArticlePage'
import ResetPasswordPage from './pages/reset-password/ResetPasswordPage'
import NotFoundPage from './pages/not-found/NotFoundPage'
import RequireAuth from './components/RequireAuth'

function App() {

  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/reset-password" element={<ResetPasswordPage />} />

      <Route element={<RequireAuth />}>
        <Route path="/home" element={<HomePage />} />
        <Route path="/competitions" element={<CompetitionListPage />} />
        <Route path="/competition" element={<CompetitionPage />} />
        <Route path="/competitions/:slug" element={<CompetitionGuidePage />} />
        <Route path="/articles/:slug" element={<GuideArticlePage />} />
      </Route>

      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  )
}

export default App
