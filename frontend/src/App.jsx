import { Routes, Route, Navigate } from 'react-router-dom'
import WelcomePage      from './pages/WelcomePage'
import AssistantPage    from './pages/AssistantPage'
import DestinationPage  from './pages/DestinationPage'
import NavigationPage   from './pages/NavigationPage'
import ReachedPage      from './pages/ReachedPage'
import AdminLoginPage   from './pages/AdminLoginPage'
import AdminDashboard   from './pages/AdminDashboard'
import QRPage           from './pages/QRPage'

export default function App() {
  return (
    <div className="min-h-screen bg-slate-50">
      <Routes>
        <Route path="/"            element={<WelcomePage />} />
        <Route path="/assistant"   element={<AssistantPage />} />
        <Route path="/destination" element={<DestinationPage />} />
        <Route path="/navigate"    element={<NavigationPage />} />
        <Route path="/reached"     element={<ReachedPage />} />
        <Route path="/qr"          element={<QRPage />} />
        <Route path="/admin"       element={<AdminLoginPage />} />
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
        <Route path="*"            element={<Navigate to="/" replace />} />
      </Routes>
    </div>
  )
}
