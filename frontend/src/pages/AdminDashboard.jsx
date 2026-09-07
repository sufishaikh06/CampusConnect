import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Building2, MapPin, Users, Globe, Plus, Trash2, LogOut, Bot, RefreshCw } from 'lucide-react'
import { campusAPI } from '../services/api'
import toast from 'react-hot-toast'

function StatCard({ icon: Icon, label, value, color }) {
  return (
    <div className="bg-white rounded-2xl p-4 shadow-sm flex items-center gap-3">
      <div className={`w-11 h-11 rounded-xl ${color} flex items-center justify-center`}>
        <Icon className="w-5 h-5 text-white" />
      </div>
      <div>
        <p className="text-2xl font-bold text-slate-800">{value ?? '—'}</p>
        <p className="text-slate-500 text-xs">{label}</p>
      </div>
    </div>
  )
}

export default function AdminDashboard() {
  const navigate = useNavigate()
  const [stats,     setStats]     = useState(null)
  const [locations, setLocations] = useState([])
  const [faculty,   setFaculty]   = useState([])
  const [tab, setTab]             = useState('locations')
  const [loading, setLoading]     = useState(true)
  const [showAddLoc, setShowAddLoc] = useState(false)
  const [newLoc, setNewLoc]       = useState({ name: '', type: 'office', buildingId: 'building-admin', floorId: 'floor-admin-ground', roomNumber: '', description: '', aliases: '' })

  useEffect(() => {
    const token = localStorage.getItem('adminToken')
    if (!token) { navigate('/admin'); return }
    loadData()
  }, [])

  async function loadData() {
    setLoading(true)
    try {
      const [s, l, f] = await Promise.all([
        campusAPI.adminStats(),
        campusAPI.adminLocations(),
        campusAPI.adminFaculty()
      ])
      setStats(s)
      setLocations(l)
      setFaculty(f)
    } catch (err) {
      if (err.status === 401) { navigate('/admin'); return }
      toast.error('Failed to load data.')
    } finally {
      setLoading(false)
    }
  }

  async function handleDeleteLocation(id, name) {
    if (!confirm(`Delete "${name}"?`)) return
    try {
      await campusAPI.adminDeleteLocation(id)
      toast.success('Location deleted.')
      loadData()
    } catch (err) {
      toast.error(err.data?.error || 'Delete failed.')
    }
  }

  async function handleAddLocation(e) {
    e.preventDefault()
    try {
      const payload = {
        ...newLoc,
        aliases: newLoc.aliases ? newLoc.aliases.split(',').map(a => a.trim()).filter(Boolean) : []
      }
      await campusAPI.adminAddLocation(payload)
      toast.success(`"${newLoc.name}" added successfully!`)
      setShowAddLoc(false)
      setNewLoc({ name: '', type: 'office', buildingId: 'building-admin', floorId: 'floor-admin-ground', roomNumber: '', description: '', aliases: '' })
      loadData()
    } catch (err) {
      toast.error(err.data?.error || 'Failed to add location.')
    }
  }

  function logout() {
    localStorage.removeItem('adminToken')
    navigate('/admin')
  }

  return (
    <div className="min-h-screen bg-slate-100">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-900 to-indigo-900 text-white px-4 py-4">
        <div className="max-w-2xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-white/20 rounded-xl flex items-center justify-center">
              <Bot className="w-5 h-5" />
            </div>
            <div>
              <p className="font-semibold text-sm">CampusConnect Admin</p>
              <p className="text-blue-300 text-xs">Sanjivani College of Engineering</p>
            </div>
          </div>
          <div className="flex gap-2">
            <button onClick={loadData} className="p-2 hover:bg-white/10 rounded-xl transition-colors" title="Refresh">
              <RefreshCw className="w-4 h-4" />
            </button>
            <button onClick={logout} className="p-2 hover:bg-white/10 rounded-xl transition-colors" title="Logout">
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 py-4">
        {/* Stats */}
        <div className="grid grid-cols-2 gap-3 mb-4">
          <StatCard icon={Building2} label="Buildings"  value={stats?.buildings} color="bg-blue-600" />
          <StatCard icon={MapPin}    label="Locations"  value={stats?.locations}  color="bg-indigo-600" />
          <StatCard icon={Users}     label="Faculty"    value={stats?.faculty}    color="bg-violet-600" />
          <StatCard icon={Globe}     label="Nav Nodes"  value={stats?.navNodes}   color="bg-purple-600" />
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-4">
          {['locations', 'faculty'].map(t => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors capitalize ${tab === t ? 'bg-blue-600 text-white' : 'bg-white text-slate-600 hover:bg-slate-200'}`}
            >
              {t}
            </button>
          ))}
        </div>

        {/* Locations tab */}
        {tab === 'locations' && (
          <div className="bg-white rounded-3xl shadow-sm overflow-hidden">
            <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
              <h3 className="font-semibold text-slate-800">Campus Locations</h3>
              <button
                onClick={() => setShowAddLoc(!showAddLoc)}
                className="flex items-center gap-1.5 bg-blue-600 text-white px-3 py-2 rounded-xl text-xs font-medium hover:bg-blue-700 transition-colors"
              >
                <Plus className="w-3.5 h-3.5" /> Add Location
              </button>
            </div>

            {/* Add location form */}
            {showAddLoc && (
              <form onSubmit={handleAddLocation} className="p-5 bg-blue-50 border-b border-blue-100 flex flex-col gap-3">
                <h4 className="font-semibold text-slate-700 text-sm">Add New Location</h4>
                <div className="grid grid-cols-2 gap-2">
                  <input required value={newLoc.name} onChange={e => setNewLoc({...newLoc, name: e.target.value})}
                    placeholder="Location name *" className="col-span-2 input-field" />
                  <select value={newLoc.type} onChange={e => setNewLoc({...newLoc, type: e.target.value})}
                    className="input-field">
                    {['office','department','facility','entrance','service','corridor'].map(t => <option key={t}>{t}</option>)}
                  </select>
                  <input value={newLoc.roomNumber} onChange={e => setNewLoc({...newLoc, roomNumber: e.target.value})}
                    placeholder="Room number" className="input-field" />
                  <input value={newLoc.description} onChange={e => setNewLoc({...newLoc, description: e.target.value})}
                    placeholder="Description" className="col-span-2 input-field" />
                  <input value={newLoc.aliases} onChange={e => setNewLoc({...newLoc, aliases: e.target.value})}
                    placeholder="Aliases (comma separated)" className="col-span-2 input-field" />
                </div>
                <div className="flex gap-2">
                  <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded-xl text-sm font-medium hover:bg-blue-700">Save</button>
                  <button type="button" onClick={() => setShowAddLoc(false)} className="bg-white border border-slate-200 text-slate-600 px-4 py-2 rounded-xl text-sm">Cancel</button>
                </div>
              </form>
            )}

            {loading ? (
              <div className="p-8 text-center text-slate-400 text-sm">Loading...</div>
            ) : (
              <div className="divide-y divide-slate-100">
                {locations.map(loc => (
                  <div key={loc.id} className="flex items-start gap-3 px-5 py-4 hover:bg-slate-50">
                    <div className="w-8 h-8 bg-blue-100 rounded-xl flex items-center justify-center flex-shrink-0 mt-0.5">
                      <MapPin className="w-4 h-4 text-blue-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-slate-800 text-sm">{loc.name}</p>
                      <p className="text-slate-400 text-xs capitalize">{loc.type} · {loc.roomNumber || 'No room'}</p>
                      {loc.aliases?.length > 0 && (
                        <p className="text-slate-400 text-xs mt-0.5 truncate">Aliases: {loc.aliases.slice(0, 3).join(', ')}</p>
                      )}
                    </div>
                    <button
                      onClick={() => handleDeleteLocation(loc.id, loc.name)}
                      className="p-1.5 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-colors flex-shrink-0"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Faculty tab */}
        {tab === 'faculty' && (
          <div className="bg-white rounded-3xl shadow-sm overflow-hidden">
            <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
              <h3 className="font-semibold text-slate-800">Faculty Members</h3>
            </div>
            {loading ? (
              <div className="p-8 text-center text-slate-400 text-sm">Loading...</div>
            ) : (
              <div className="divide-y divide-slate-100">
                {faculty.map(f => (
                  <div key={f.id} className="flex items-start gap-3 px-5 py-4 hover:bg-slate-50">
                    <div className="w-8 h-8 bg-violet-100 rounded-xl flex items-center justify-center flex-shrink-0 mt-0.5">
                      <Users className="w-4 h-4 text-violet-600" />
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-slate-800 text-sm">{f.name}</p>
                      <p className="text-slate-400 text-xs">{f.designation} · Cabin {f.cabin}</p>
                      <p className="text-orange-400 text-xs mt-0.5 italic">{f.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        <p className="text-center text-slate-400 text-xs mt-6">
          CampusConnect AI Admin · v1.0 · Demo Data
        </p>
      </div>

      <style>{`
        .input-field {
          background: white;
          border: 1px solid #e2e8f0;
          border-radius: 12px;
          padding: 8px 12px;
          font-size: 13px;
          outline: none;
          width: 100%;
        }
        .input-field:focus { border-color: #3b82f6; box-shadow: 0 0 0 2px rgba(59,130,246,0.1); }
      `}</style>
    </div>
  )
}
