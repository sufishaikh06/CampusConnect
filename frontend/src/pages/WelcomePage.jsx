import { useNavigate, useSearchParams } from 'react-router-dom'
import { MapPin, Bot, Navigation } from 'lucide-react'

export default function WelcomePage() {
  const navigate      = useNavigate()
  const [params]      = useSearchParams()
  const startNode     = params.get('start') || 'node-main-gate'

  function handleStart() {
    navigate(`/assistant?start=${startNode}`)
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-between bg-gradient-to-br from-blue-950 via-blue-900 to-indigo-900 text-white px-4 py-10">
      {/* Top badge */}
      <div className="flex items-center gap-2 bg-white/10 rounded-full px-4 py-2 text-sm font-medium backdrop-blur">
        <MapPin className="w-4 h-4 text-blue-300" />
        Sanjivani College of Engineering, Kopargaon
      </div>

      {/* Center content */}
      <div className="flex flex-col items-center text-center gap-6 max-w-sm w-full">
        {/* Logo / Icon */}
        <div className="w-24 h-24 bg-white/15 rounded-3xl flex items-center justify-center backdrop-blur shadow-2xl">
          <Bot className="w-12 h-12 text-blue-200" />
        </div>

        <div>
          <h1 className="text-4xl font-bold tracking-tight">CampusConnect</h1>
          <p className="text-blue-300 text-lg font-medium mt-1">AI</p>
        </div>

        <p className="text-blue-100 text-base leading-relaxed">
          Intelligent Visitor Assistance &amp; 360° Indoor Campus Navigation
        </p>

        <div className="bg-white/10 backdrop-blur rounded-2xl px-6 py-4 w-full">
          <p className="text-blue-200 text-sm">Welcome to</p>
          <p className="text-white font-semibold text-lg">Sanjivani College of Engineering</p>
        </div>

        {/* Feature pills */}
        <div className="flex flex-wrap justify-center gap-2 text-xs">
          {['AI Chat', '360° Navigation', 'Campus Guide', 'No App Needed'].map(f => (
            <span key={f} className="bg-white/10 rounded-full px-3 py-1 text-blue-200">{f}</span>
          ))}
        </div>
      </div>

      {/* Start button */}
      <div className="w-full max-w-sm flex flex-col gap-3">
        <button
          onClick={handleStart}
          className="w-full bg-white text-blue-950 font-bold text-lg py-4 rounded-2xl shadow-xl hover:bg-blue-50 active:scale-95 transition-all flex items-center justify-center gap-3"
        >
          <Navigation className="w-5 h-5" />
          Start Navigation
        </button>
        <a
          href="/admin"
          className="text-center text-blue-300 text-sm hover:text-white transition-colors"
        >
          Admin Panel
        </a>
        <a
          href="/qr"
          className="text-center text-blue-400/60 text-xs hover:text-blue-300 transition-colors"
        >
          QR Code (for placement at entrance)
        </a>
      </div>
    </div>
  )
}
