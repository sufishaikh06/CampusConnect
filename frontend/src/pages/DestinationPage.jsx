import { useState, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { ChevronLeft, MapPin, Building2, Layers, DoorOpen, Navigation, Loader2, AlertCircle, Route, Compass } from 'lucide-react'
import toast from 'react-hot-toast'
import { campusAPI } from '../services/api'
import StartingPointModal from '../components/StartingPointModal'

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
  
  const [startNode, setStartNode]         = useState(state?.startNode || 'node-main-gate')
  const [startNodeName, setStartNodeName] = useState(state?.startNodeName || 'Main Campus Gate')
  const [isStartModalOpen, setIsStartModalOpen] = useState(false)

  const [route, setRoute]     = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError]     = useState(null)

  useEffect(() => {
    if (!destination) return
    fetchRoute(startNode)
  }, [destination])

  async function fetchRoute(activeStartNode = startNode) {
    setLoading(true)
    setError(null)
    try {
      const res = await campusAPI.getRoute({
        startNodeId: activeStartNode,
        locationId: destination.id
      })
      setRoute(res)
      if (res.startName) {
        setStartNodeName(res.startName)
      }
    } catch (err) {
      setError(err.data?.error || 'Route not available for this starting location.')
    } finally {
      setLoading(false)
    }
  }

  function handleSelectNewStart(newNodeId, newNodeName) {
    setStartNode(newNodeId)
    setStartNodeName(newNodeName)
    fetchRoute(newNodeId)
    toast.success(`Route recalculated from: ${newNodeName}`, { icon: '🔄' })
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
    <div className="min-h-screen bg-slate-100 max-w-md mx-auto flex flex-col relative">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-900 to-indigo-900 text-white px-4 py-4 flex items-center gap-3 sticky top-0 z-10 shadow-md">
        <button onClick={() => navigate(-1)} className="p-1.5 rounded-xl hover:bg-white/10 active:scale-95 transition-all">
          <ChevronLeft className="w-5 h-5" />
        </button>
        <div>
          <p className="font-semibold text-sm">Destination & Route</p>
          <p className="text-blue-300 text-xs">Sanjivani College of Engineering</p>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-4 py-4 flex flex-col gap-4">
        {/* Destination Card */}
        <div className="bg-white rounded-3xl p-5 shadow-sm border border-slate-200/60">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-12 h-12 bg-blue-600 text-white rounded-2xl flex items-center justify-center shadow-md">
              <MapPin className="w-6 h-6" />
            </div>
            <div className="min-w-0">
              <h2 className="font-bold text-slate-800 text-lg leading-tight truncate">{destination.name}</h2>
              <span className="text-xs bg-blue-100 text-blue-700 rounded-full px-2.5 py-0.5 font-semibold capitalize inline-block mt-1">
                {destination.type}
              </span>
            </div>
          </div>

          {destination.description && (
            <p className="text-slate-500 text-xs mb-3.5 leading-relaxed">{destination.description}</p>
          )}

          <div className="flex flex-col gap-2.5 bg-slate-50 rounded-2xl p-3 border border-slate-100">
            <InfoRow icon={Building2} label="Building" value={destination.buildingId?.replace('building-', '').replace(/-/g, ' ')} />
            <InfoRow icon={Layers}    label="Floor"    value={destination.floorId?.replace('floor-', '').replace(/-/g, ' ')} />
            <InfoRow icon={DoorOpen}  label="Room Number" value={destination.roomNumber} />
          </div>
        </div>

        {/* Route Card with Dynamic Starting Point */}
        <div className="bg-white rounded-3xl p-5 shadow-sm border border-slate-200/60">
          <div className="flex items-center justify-between mb-3.5">
            <div className="flex items-center gap-2">
              <Route className="w-5 h-5 text-blue-600" />
              <h3 className="font-bold text-slate-800 text-base">Navigation Path</h3>
            </div>
            {route && !loading && (
              <span className="text-xs bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded-full">
                {route.stepCount} {route.stepCount === 1 ? 'Step' : 'Steps'}
              </span>
            )}
          </div>

          {/* Interactive Starting Location Box */}
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50/70 border border-blue-200/80 rounded-2xl p-3 mb-4 shadow-xs">
            <div className="flex items-center justify-between mb-1.5">
              <div className="flex items-center gap-1.5 text-blue-900 font-bold text-xs">
                <Compass className="w-3.5 h-3.5 text-blue-600" />
                <span>Your Starting Location</span>
              </div>
              <button
                onClick={() => setIsStartModalOpen(true)}
                className="text-[11px] bg-blue-600 hover:bg-blue-700 text-white font-bold px-2.5 py-1 rounded-lg transition-all active:scale-95 shadow-xs"
              >
                Change Start
              </button>
            </div>
            <div className="flex items-center gap-2 mt-1">
              <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 ring-2 ring-emerald-200 flex-shrink-0" />
              <p className="text-xs font-semibold text-slate-800 truncate">
                {startNodeName}
              </p>
            </div>
            <p className="text-[10px] text-slate-500 mt-1 pl-4.5">
              Not at {startNodeName}? Tap "Change Start" to tell us what you see around you.
            </p>
          </div>

          {loading && (
            <div className="flex items-center justify-center gap-2 text-slate-500 text-xs py-6">
              <Loader2 className="w-4 h-4 text-blue-600 animate-spin" /> 
              Calculating personalized walking route...
            </div>
          )}

          {error && (
            <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4">
              <p className="text-amber-800 text-xs font-bold mb-1">Route Not Available From Here</p>
              <p className="text-amber-700 text-xs leading-relaxed">{error}</p>
              <button
                onClick={() => handleSelectNewStart('node-main-gate', 'Main Campus Gate')}
                className="mt-3 text-xs bg-amber-600 hover:bg-amber-700 text-white px-3 py-1.5 rounded-xl font-semibold transition-all active:scale-95"
              >
                Switch to Main Gate
              </button>
            </div>
          )}

          {route && !loading && (
            <>
              <div className="grid grid-cols-2 gap-3 mb-4 text-center">
                <div className="bg-slate-50 rounded-2xl p-2.5 border border-slate-100">
                  <p className="text-xl font-bold text-blue-600">{route.stepCount}</p>
                  <p className="text-slate-400 text-[11px] font-medium uppercase tracking-wider">360° Steps</p>
                </div>
                <div className="bg-slate-50 rounded-2xl p-2.5 border border-slate-100">
                  <p className="text-xl font-bold text-blue-600">{route.estimatedDistance}m</p>
                  <p className="text-slate-400 text-[11px] font-medium uppercase tracking-wider">Est. Walking Distance</p>
                </div>
              </div>

              {/* Step By Step Instructions */}
              <div className="flex flex-col gap-2.5 max-h-[260px] overflow-y-auto pr-1">
                {route.instructions.map((step, i) => (
                  <div key={i} className="flex gap-2.5 items-start bg-slate-50/70 p-2 rounded-xl border border-slate-100">
                    <div className="w-5 h-5 bg-blue-600 text-white rounded-full text-[10px] flex items-center justify-center flex-shrink-0 font-bold mt-0.5">
                      {i + 1}
                    </div>
                    <p className="text-slate-700 text-xs leading-relaxed">{step}</p>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </div>

      {/* Action Footer */}
      <div className="bg-white border-t border-slate-200 p-4 sticky bottom-0 z-10 shadow-lg">
        {route ? (
          <button
            onClick={() => navigate('/navigate', { state: { route, destination, startNode } })}
            className="w-full bg-blue-600 text-white font-bold py-3.5 rounded-2xl text-sm hover:bg-blue-700 active:scale-95 transition-all flex items-center justify-center gap-2.5 shadow-lg shadow-blue-500/25"
          >
            <Navigation className="w-4 h-4" />
            Start 360° Navigation ({route.stepCount} Steps)
          </button>
        ) : (
          <button
            onClick={() => navigate('/assistant', { state: { startNode } })}
            className="w-full bg-slate-200 text-slate-700 font-semibold py-3.5 rounded-2xl text-sm"
          >
            Back to Assistant
          </button>
        )}
      </div>

      {/* Starting Location Picker Modal */}
      <StartingPointModal
        isOpen={isStartModalOpen}
        onClose={() => setIsStartModalOpen(false)}
        currentStartNodeId={startNode}
        onSelectStartNode={handleSelectNewStart}
      />
    </div>
  )
}
