import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import './styles/index.css'
import App from './App.jsx'
import Dashboard from './pages/Dashboard.jsx'
import Register from './Register.jsx'
import Historique from './pages/Historique.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/register" element={<Register />} />
        <Route path="/transactions" element={<Historique/>} />
      </Routes>
    </BrowserRouter>
  </StrictMode>
)
