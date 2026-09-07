import { useState, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { ChevronLeft, MapPin, Building2, Layers, DoorOpen, Navigation, Loader2, AlertCircle, Route } from 'lucide-react'
import { campusAPI } from '../services/api'

function InfoRow({ icon: Icon, label, value }) {
  if (!value) return null
  return (
    <div className="flex items-start gap-3">
      <div className="w-8 h-8 rounded-xl bg-blue-50 flex items-center justify-center flex-shrink-0 mt-0.5">
        <Icon className="w-4 h-4 text-blue-600" />
      </div>
      <div>
        <p className="text-slate-500 text-xs">{label}</p>
        <p className="text-slate-800 font-medium text-sm">{value}</p>
      </div>
    </div>
  )
}

export default function DestinationPage() {
  const navigate        = useNavigate()
  const { state }       = useLocation()
  const destination     = state?.destination
  const startNode       = state?.startNode || 'node-main-gate'

  const [route, setRoute]     = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError]     = useState(null)

  useEffect(() => {
    if (!destination) return
    fetchRoute()
  }, [destination])

  async function fetchRoute() {
    setLoading(true)
    setError(null)
    try {
      const res = await campusAPI.getRoute({
        startNodeId: startNode,
        locationId: destination.id
      })
      setRoute(res)
    } catch (err) {
      setError(err.data?.error || 'Route not available for this destination.')
    } finally {
      setLoading(false)
    }
  }

  if (!destination) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-100 p-4">
        <div className="text-center">
          <AlertCircle className="w-12 h-12 text-slate-400 mx-auto mb-3" />
          <p className="text-slate-600 mb-4">No destination selected.</p>
          <button onClick={() => navigate('/assistant')} className="bg-blue-600 text-white px-6 py-3 rounded-2xl font-semibold">
            Go Back
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-100 max-w-md mx-auto flex flex-col">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-900 to-indigo-900 text-white px-4 py-4 flex items-center gap-3">
        <button onClick={() => navigate(-1)} className="p-1.5 rounded-xl hover:bg-white/10">
          <ChevronLeft className="w-5 h-5" />
        </button>
        <div>
          <p className="font-semibold text-sm">Destination Found</p>
          <p className="text-blue-300 text-xs">Sanjivani College of Engineering</p>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-4 py-4 flex flex-col gap-4">
        {/* Destination Card */}
        <div className="bg-white rounded-3xl p-5 shadow-sm">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-blue-600 rounded-2xl flex items-center justify-center">
              <MapPin className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="font-bold text-slate-800 text-lg leading-tight">{destination.name}</h2>
              <span className="text-xs bg-blue-100 text-blue-700 rounded-full px-2 py-0.5 font-medium capitalize">
                {destination.type}
              </span>
            </div>
          </div>

          {destination.description && (
            <p className="text-slate-500 text-sm mb-4 leading-relaxed">{destination.description}</p>
          )}

          <div className="flex flex-col gap-3">
            <InfoRow icon={Building2} label="Building" value={destination.buildingId?.replace('building-', '').replace(/-/g, ' ')} />
            <InfoRow icon={Layers}    label="Floor"    value={destination.floorId?.replace('floor-', '').replace(/-/g, ' ')} />
            <InfoRow icon={DoorOpen}  label="Room"     value={destination.roomNumber} />
          </div>

          {destination.aliases && destination.aliases.length > 0 && (
            <div className="mt-4 flex flex-wrap gap-1.5">
              {destination.aliases.slice(0, 4).map(a => (
                <span key={a} className="text-xs bg-slate-100 text-slate-500 rounded-full px-2 py-0.5">{a}</span>
              ))}
            </div>
          )}
        </div>

        {/* Route Card */}
        <div className="bg-white rounded-3xl p-5 shadow-sm">
          <div className="flex items-center gap-2 mb-4">
            <Route className="w-5 h-5 text-blue-600" />
            <h3 className="font-semibold text-slate-800">Navigation Route</h3>
          </div>

          {loading && (
            <div className="flex items-center gap-2 text-slate-500 text-sm">
              <Loader2 className="w-4 h-4 animate-spin" /> Calculating route...
            </div>
          )}

          {error && (
            <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4">
              <p className="text-amber-700 text-sm font-medium mb-1">360° Navigation Unavailable</p>
              <p className="text-amber-600 text-xs">{error}</p>
              <p className="text-amber-600 text-xs mt-2">
                Please ask at Reception for directions, or use the text information above.
              </p>
            </div>
          )}

          {route && !loading && (
            <>
              <div className="flex gap-4 mb-4 text-center">
                <div className="flex-1 bg-slate-50 rounded-2xl p-3">
                  <p className="text-2xl font-bold text-blue-600">{route.stepCount}</p>
                  <p className="text-slate-500 text-xs">Steps</p>
                </div>
                <div className="flex-1 bg-slate-50 rounded-2xl p-3">
                  <p className="text-2xl font-bold text-blue-600">{route.estimatedDistance}m</p>
                  <p className="text-slate-500 text-xs">Est. Distance</p>
                </div>
              </div>

              <div className="flex flex-col gap-2">
                {route.instructions.map((step, i) => (
                  <div key={i} className="flex gap-3 items-start">
                    <div className="w-6 h-6 bg-blue-600 text-white rounded-full text-xs flex items-center justify-center flex-shrink-0 font-bold">
                      {i + 1}
                    </div>
                    <p className="text-slate-700 text-sm leading-relaxed pt-0.5">{step}</p>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </div>

      {/* Action Button */}
      <div className="bg-white border-t border-slate-200 p-4">
        {route ? (
          <button
            onClick={() => navigate('/navigate', { state: { route, destination, startNode } })}
            className="w-full bg-blue-600 text-white font-bold py-4 rounded-2xl text-base hover:bg-blue-700 active:scale-95 transition-all flex items-center justify-center gap-3 shadow-lg"
          >
            <Navigation className="w-5 h-5" />
            Start 360° Navigation
          </button>
        ) : (
          <button
            onClick={() => navigate('/assistant', { state: { startNode } })}
            className="w-full bg-slate-200 text-slate-700 font-semibold py-4 rounded-2xl"
          >
            Back to Assistant
          </button>
        )}
      </div>
    </div>
  )
}
