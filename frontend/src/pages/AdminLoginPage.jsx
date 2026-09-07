import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Lock, User, Eye, EyeOff, Bot } from 'lucide-react'
import { campusAPI } from '../services/api'
import toast from 'react-hot-toast'

export default function AdminLoginPage() {
  const navigate  = useNavigate()
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [showPass, setShowPass] = useState(false)
  const [loading, setLoading]   = useState(false)

  async function handleLogin(e) {
    e.preventDefault()
    if (!username || !password) { toast.error('Enter username and password.'); return }
    setLoading(true)
    try {
      const res = await campusAPI.login(username, password)
      localStorage.setItem('adminToken', res.token)
      toast.success('Login successful!')
      navigate('/admin/dashboard')
    } catch (err) {
      toast.error(err.data?.error || 'Invalid credentials.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 to-blue-950 px-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Bot className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-white text-2xl font-bold">Admin Panel</h1>
          <p className="text-slate-400 text-sm mt-1">CampusConnect AI</p>
        </div>

        <div className="bg-white rounded-3xl p-6 shadow-2xl">
          <form onSubmit={handleLogin} className="flex flex-col gap-4">
            <div>
              <label className="text-slate-600 text-sm font-medium mb-1.5 block">Username</label>
              <div className="flex items-center bg-slate-100 rounded-2xl px-4 gap-3">
                <User className="w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  value={username}
                  onChange={e => setUsername(e.target.value)}
                  placeholder="admin"
                  className="flex-1 bg-transparent py-3 text-sm outline-none"
                />
              </div>
            </div>

            <div>
              <label className="text-slate-600 text-sm font-medium mb-1.5 block">Password</label>
              <div className="flex items-center bg-slate-100 rounded-2xl px-4 gap-3">
                <Lock className="w-4 h-4 text-slate-400" />
                <input
                  type={showPass ? 'text' : 'password'}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="flex-1 bg-transparent py-3 text-sm outline-none"
                />
                <button type="button" onClick={() => setShowPass(!showPass)} className="text-slate-400">
                  {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="bg-blue-600 text-white font-bold py-3.5 rounded-2xl hover:bg-blue-700 disabled:opacity-60 transition-colors mt-2"
            >
              {loading ? 'Logging in...' : 'Login'}
            </button>
          </form>

          <p className="text-slate-400 text-xs text-center mt-4">
            Default: admin / campusconnect2026
          </p>
        </div>

        <button onClick={() => navigate('/')} className="text-slate-400 text-sm mt-4 block text-center hover:text-white transition-colors">
          ← Back to visitor portal
        </button>
      </div>
    </div>
  )
}
