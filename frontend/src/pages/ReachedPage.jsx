import { useNavigate, useLocation } from 'react-router-dom'
import { CheckCircle2, Navigation, RotateCcw, Home } from 'lucide-react'

export default function ReachedPage() {
  const navigate    = useNavigate()
  const { state }   = useLocation()
  const destination = state?.destination
  const startNode   = state?.startNode || 'node-main-gate'

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-900 via-emerald-900 to-teal-900 flex flex-col items-center justify-between text-white px-4 py-10 max-w-md mx-auto">
      {/* Top */}
      <div />

      {/* Center content */}
      <div className="flex flex-col items-center text-center gap-6 w-full">
        {/* Success animation */}
        <div className="relative">
          <div className="w-28 h-28 bg-white/15 rounded-full flex items-center justify-center backdrop-blur">
            <CheckCircle2 className="w-14 h-14 text-green-300" strokeWidth={1.5} />
          </div>
          <div className="absolute -top-1 -right-1 w-8 h-8 bg-yellow-400 rounded-full flex items-center justify-center text-lg">
            🎉
          </div>
        </div>

        <div>
          <h1 className="text-3xl font-bold">You've Arrived!</h1>
          <p className="text-green-200 mt-2">Destination Reached</p>
        </div>

        {destination && (
          <div className="bg-white/15 backdrop-blur rounded-3xl px-6 py-5 w-full">
            <p className="text-green-200 text-sm mb-1">You are now at</p>
            <p className="text-white font-bold text-xl">{destination.name}</p>
            {destination.roomNumber && (
              <p className="text-green-300 text-sm mt-1">Room {destination.roomNumber}</p>
            )}
            {destination.description && (
              <p className="text-white/60 text-xs mt-2 leading-relaxed">{destination.description}</p>
            )}
          </div>
        )}

        <p className="text-green-200 text-sm">
          Thank you for using CampusConnect AI. We hope you found your way easily!
        </p>
      </div>

      {/* Action buttons */}
      <div className="w-full flex flex-col gap-3">
        <button
          onClick={() => navigate(`/assistant?start=${startNode}`)}
          className="w-full bg-white text-green-900 font-bold py-4 rounded-2xl flex items-center justify-center gap-3 hover:bg-green-50 active:scale-95 transition-all"
        >
          <Navigation className="w-5 h-5" />
          Find Another Destination
        </button>
        <button
          onClick={() => navigate('/')}
          className="w-full bg-white/15 text-white font-semibold py-3.5 rounded-2xl flex items-center justify-center gap-3 hover:bg-white/20 transition-all"
        >
          <Home className="w-5 h-5" />
          Back to Home
        </button>
      </div>
    </div>
  )
}
