import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import './styles/index.css'
import App from './App.jsx'
import Dashboard from './pages/Dashboard.jsx'
import AccountDetails from './pages/AccountDetails.jsx'
import Historique from './pages/Historique.jsx'
import RegisterPage from './Register.jsx'
import { Register } from './components/APIRequests.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/account/:id" element={<AccountDetails />} />
        <Route path="/transactions/:id" element={<Historique/>} />
      </Routes>
    </BrowserRouter>
  </StrictMode>
)
