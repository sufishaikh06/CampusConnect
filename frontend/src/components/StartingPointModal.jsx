import { useState, useEffect } from 'react'
import { X, Search, MapPin, Check, Compass, Building, DoorOpen } from 'lucide-react'
import { campusAPI } from '../services/api'

// Quick-access visual landmarks
const QUICK_LANDMARKS = [
  { id: 'node-main-gate', name: 'Main Campus Gate', icon: '🏫', hint: 'Campus Entrance' },
  { id: 'node-main-building-entrance', name: 'Building Entrance Porch', icon: '🏛️', hint: 'Main Academic Porch' },
  { id: 'node-reception', name: 'Ground Floor Foyer / Reception', icon: '🏢', hint: 'Inside Main Entrance' },
  { id: 'node-library', name: 'Central Library', icon: '📚', hint: 'Ground Floor (M-010)' },
  { id: 'node-first-floor-corridor', name: '1st Floor Landing (Stairs)', icon: '🪜', hint: 'Top of Main Stairs' },
  { id: 'node-computer-dept', name: 'Computer Dept Entrance', icon: '💻', hint: '1st Floor Right Wing' },
  { id: 'node-comp-corridor-1', name: 'Corridor 1: Language & Physics Lab', icon: '🧪', hint: 'Rooms 138 & 134' },
  { id: 'node-comp-corridor-2', name: 'Corridor 2: Software Labs (101/102)', icon: '💻', hint: 'Software & HPC Labs' },
  { id: 'node-comp-corridor-3', name: 'Corridor 3: Unix Lab & HOD Office', icon: '👔', hint: 'Unix 103 & HOD 132' },
  { id: 'node-comp-water-cooler', name: 'Water Cooler & Washrooms', icon: '🚻', hint: 'Corridor Section 4' },
  { id: 'node-comp-corridor-5', name: 'Corridor 5: Celebal & Dr. Pawar', icon: '🏢', hint: 'Celebal 126 & Room 106' },
]

export default function StartingPointModal({
  isOpen,
  onClose,
  currentStartNodeId = 'node-main-gate',
  onSelectStartNode
}) {
  const [search, setSearch] = useState('')
  const [navNodes, setNavNodes] = useState([])
  const [locations, setLocations] = useState([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (!isOpen) return
    async function loadData() {
      setLoading(true)
      try {
        const [nodesRes, locsRes] = await Promise.all([
          campusAPI.getNavNodes(),
          campusAPI.getLocations()
        ])
        setNavNodes(nodesRes.data || [])
        setLocations(locsRes.data || [])
      } catch (e) {
        console.error('Error loading navigation nodes:', e)
      } finally {
        setLoading(false)
      }
    }
    loadData()
  }, [isOpen])

  if (!isOpen) return null

  // Build searchable list
  const query = search.toLowerCase().trim()

  // Match locations that have navigation nodes
  const availableItems = navNodes.map(node => {
    const matchedLoc = locations.find(l => l.navigationNodeId === node.id)
    return {
      nodeId: node.id,
      name: matchedLoc?.name || node.name,
      roomNumber: matchedLoc?.roomNumber || null,
      description: matchedLoc?.description || null,
      aliases: matchedLoc?.aliases || [],
      floor: matchedLoc?.floorId?.replace('floor-', '').replace(/-/g, ' ') || null
    }
  })

  const filteredItems = availableItems.filter(item => {
    if (!query) return true
    const nameMatch = item.name.toLowerCase().includes(query)
    const roomMatch = item.roomNumber && String(item.roomNumber).toLowerCase().includes(query)
    const descMatch = item.description && item.description.toLowerCase().includes(query)
    const aliasMatch = item.aliases && item.aliases.some(a => a.toLowerCase().includes(query))
    return nameMatch || roomMatch || descMatch || aliasMatch
  })

  function handleSelect(nodeId, nodeName) {
    onSelectStartNode(nodeId, nodeName)
    onClose()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/70 backdrop-blur-sm animate-fade-in">
      <div 
        className="w-full max-w-md bg-white rounded-t-3xl sm:rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[88vh] animate-slide-up"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-900 to-indigo-900 text-white p-4 pb-3 flex items-start justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-white/15 flex items-center justify-center">
              <Compass className="w-5 h-5 text-blue-200 animate-spin-slow" />
            </div>
            <div>
              <h3 className="font-bold text-base leading-tight">Where are you right now?</h3>
              <p className="text-blue-200 text-xs mt-0.5">Tell us what you see around you</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white/80 hover:text-white transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Search Bar */}
        <div className="p-3 bg-slate-50 border-b border-slate-200">
          <div className="relative flex items-center">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 pointer-events-none" />
            <input
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search door name, room number, or lab..."
              className="w-full bg-white border border-slate-200 rounded-xl pl-9 pr-8 py-2 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm"
              autoFocus
            />
            {search && (
              <button 
                onClick={() => setSearch('')}
                className="absolute right-2.5 text-slate-400 hover:text-slate-600"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-3 space-y-3">
          {/* Quick Landmarks Section */}
          {!search && (
            <div>
              <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider px-1 mb-2">
                Popular Starting Landmarks
              </p>
              <div className="grid grid-cols-2 gap-2">
                {QUICK_LANDMARKS.map(item => {
                  const isSelected = currentStartNodeId === item.id
                  return (
                    <button
                      key={item.id}
                      onClick={() => handleSelect(item.id, item.name)}
                      className={`text-left p-2.5 rounded-2xl border transition-all flex flex-col justify-between ${
                        isSelected 
                          ? 'bg-blue-50 border-blue-500 ring-2 ring-blue-400/30' 
                          : 'bg-white hover:bg-slate-50 border-slate-200 shadow-sm'
                      }`}
                    >
                      <div className="flex items-center justify-between w-full mb-1">
                        <span className="text-base">{item.icon}</span>
                        {isSelected && <Check className="w-3.5 h-3.5 text-blue-600 font-bold" />}
                      </div>
                      <div>
                        <p className={`text-xs font-semibold leading-tight line-clamp-1 ${isSelected ? 'text-blue-900' : 'text-slate-800'}`}>
                          {item.name}
                        </p>
                        <p className="text-[10px] text-slate-500 mt-0.5 line-clamp-1">
                          {item.hint}
                        </p>
                      </div>
                    </button>
                  )
                })}
              </div>
            </div>
          )}

          {/* Full List / Search Results */}
          <div>
            <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider px-1 mb-2">
              {search ? `Search Results (${filteredItems.length})` : 'All Campus Locations'}
            </p>

            {filteredItems.length === 0 ? (
              <div className="text-center py-8 px-4">
                <MapPin className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                <p className="text-xs font-semibold text-slate-600">No matching location found</p>
                <p className="text-[11px] text-slate-400 mt-0.5">Try searching for "Reception", "Porch", "Software Lab", or "Stairs"</p>
              </div>
            ) : (
              <div className="space-y-1.5">
                {filteredItems.map(item => {
                  const isSelected = currentStartNodeId === item.nodeId
                  return (
                    <button
                      key={item.nodeId}
                      onClick={() => handleSelect(item.nodeId, item.name)}
                      className={`w-full text-left p-2.5 rounded-xl border transition-all flex items-center justify-between gap-3 ${
                        isSelected
                          ? 'bg-blue-50 border-blue-400 text-blue-900 font-semibold shadow-sm'
                          : 'bg-white hover:bg-slate-50 border-slate-150 text-slate-700 shadow-xs'
                      }`}
                    >
                      <div className="flex items-start gap-2.5 min-w-0">
                        <div className={`w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5 ${
                          isSelected ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-500'
                        }`}>
                          {item.roomNumber ? <DoorOpen className="w-3.5 h-3.5" /> : <MapPin className="w-3.5 h-3.5" />}
                        </div>
                        <div className="min-w-0">
                          <p className="text-xs font-medium truncate leading-tight">
                            {item.name}
                            {item.roomNumber && <span className="ml-1.5 font-bold text-blue-600">Room {item.roomNumber}</span>}
                          </p>
                          {item.description && (
                            <p className="text-[10px] text-slate-400 truncate mt-0.5">
                              {item.description}
                            </p>
                          )}
                        </div>
                      </div>
                      {isSelected ? (
                        <div className="w-5 h-5 rounded-full bg-blue-600 text-white flex items-center justify-center flex-shrink-0">
                          <Check className="w-3 h-3" />
                        </div>
                      ) : (
                        <span className="text-[10px] text-blue-600 font-semibold flex-shrink-0 px-2 py-0.5 rounded-md bg-blue-50">
                          Set Start
                        </span>
                      )}
                    </button>
                  )
                })}
              </div>
            )}
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-3 bg-slate-50 border-t border-slate-200 flex justify-between items-center text-xs">
          <span className="text-[11px] text-slate-500">
            Selected: <strong className="text-slate-800">{availableItems.find(i => i.nodeId === currentStartNodeId)?.name || 'Main Gate'}</strong>
          </span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl active:scale-95 transition-all text-xs"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  )
}
