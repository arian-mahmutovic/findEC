import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { BrowserRouter } from 'react-router'
import { initSessionTracking } from './services/session.js'
import { AuthProvider } from './context/AuthContext.jsx'
import { SavedCompetitionsProvider } from './context/SavedCompetitionsContext.jsx'
import { CounselorAuthProvider } from './context/CounselorAuthContext.jsx'

initSessionTracking()

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <SavedCompetitionsProvider>
          <CounselorAuthProvider>
            <App />
          </CounselorAuthProvider>
        </SavedCompetitionsProvider>
      </AuthProvider>
    </BrowserRouter>
  </StrictMode>,
)
