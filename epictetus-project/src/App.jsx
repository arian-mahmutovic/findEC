import './App.css'
import LandingPage from './pages/landing/LandingPage'
import HomePage from './pages/home/HomePage'
import CompetitionListPage from './pages/competition-list/CompetitionListPage'
import { Routes, Route } from 'react-router'
import CompetitionGuidePage from './pages/competition-guide/CompetitionGuidePage'
import GuideArticlePage from './pages/guide-article/GuideArticlePage'
import ResetPasswordPage from './pages/reset-password/ResetPasswordPage'
import NotFoundPage from './pages/not-found/NotFoundPage'
import RequireAuth from './components/RequireAuth'
import RequireCounselorAuth from './components/RequireCounselorAuth'
import CounselorLoginPage from './pages/counselor/CounselorLoginPage'
import CounselorHomePage from './pages/counselor/CounselorHomePage'
import CounselorCompetitionsPage from './pages/counselor/CounselorCompetitionsPage'
import CounselorArticlePage from './pages/counselor/CounselorArticlePage'
import GoRedirectPage from './pages/go/GoRedirectPage'
import QrCodesPage from './pages/qr-codes/QrCodesPage'
import PrivacyPolicyPage from './pages/legal/PrivacyPolicyPage'
import TermsOfServicePage from './pages/legal/TermsOfServicePage'

function App() {

  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/reset-password" element={<ResetPasswordPage />} />
      <Route path="/go/:slug" element={<GoRedirectPage />} />
      <Route path="/qr-codes" element={<QrCodesPage />} />
      <Route path="/privacy" element={<PrivacyPolicyPage />} />
      <Route path="/terms" element={<TermsOfServicePage />} />

      <Route element={<RequireAuth />}>
        <Route path="/home" element={<HomePage />} />
        <Route path="/competitions" element={<CompetitionListPage />} />
        <Route path="/competitions/:slug" element={<CompetitionGuidePage />} />
        <Route path="/articles/:slug" element={<GuideArticlePage />} />
      </Route>

      <Route path="/counselor" element={<CounselorLoginPage />} />

      <Route element={<RequireCounselorAuth />}>
        <Route path="/counselor/dashboard" element={<CounselorHomePage />} />
        <Route path="/counselor/competitions" element={<CounselorCompetitionsPage />} />
        <Route path="/counselor/articles/:slug" element={<CounselorArticlePage />} />
      </Route>

      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  )
}

export default App
