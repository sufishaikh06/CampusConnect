import { useState, useEffect, useRef } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { 
  X, 
  ChevronLeft, 
  ChevronRight, 
  MapPin, 
  Navigation2, 
  Sliders, 
  Check, 
  Save, 
  RotateCcw, 
  AlertCircle,
  Crosshair
} from 'lucide-react'
import toast from 'react-hot-toast'
import 'pannellum'
import 'pannellum/build/pannellum.css'

const DIRECTION_EMOJIS = {
  left: '⬅',
  right: '➡',
  forward: '⬆',
  up: '⏫',
  down: '⬇',
  back: '↩'
}

function getPanoImage(imageUrl) {
  if (!imageUrl) return null
  const lower = imageUrl.toLowerCase()
  if (lower.endsWith('.jpg') || lower.endsWith('.jpeg') || lower.endsWith('.png') || lower.endsWith('.svg')) {
    return imageUrl
  }
  return '/panoramas/first-floor-landing.jpg'
}

function DirectionArrow({ direction, label, onClick }) {
  const emoji = DIRECTION_EMOJIS[direction] || '➔'
  return (
    <button
      onClick={onClick}
      className="flex flex-col items-center gap-1 bg-black/70 backdrop-blur text-white rounded-2xl px-5 py-3.5 hover:bg-blue-600/90 active:scale-95 transition-all border border-white/20 min-w-[100px] shadow-lg shadow-black/40"
    >
      <span className="text-2xl font-bold leading-none">{emoji}</span>
      <span className="text-xs font-semibold max-w-[110px] text-center leading-tight truncate mt-0.5">{label}</span>
    </button>
  )
}

export default function NavigationPage() {
  const navigate    = useNavigate()
  const { state }   = useLocation()
  const route       = state?.route
  const destination = state?.destination
  const startNode   = state?.startNode || 'node-main-gate'

  const [currentStepIndex, setCurrentStepIndex] = useState(0)
  const [viewerLoading, setViewerLoading] = useState(true)
  const [viewerError, setViewerError] = useState(false)
  
  // Hotspot calibration / adjuster state
  const [isCalibrating, setIsCalibrating] = useState(false)
  const [calibPitch, setCalibPitch] = useState(-5)
  const [calibYaw, setCalibYaw] = useState(0)
  const [calibDirection, setCalibDirection] = useState('forward')
  const [calibLabel, setCalibLabel] = useState('')
  const [isSaving, setIsSaving] = useState(false)

  const panoramaRef = useRef(null)
  const viewerInstanceRef = useRef(null)

  const panoramaChain = route?.panoramaChain || []
  const currentNode   = panoramaChain[currentStepIndex]
  const isLast        = currentStepIndex === panoramaChain.length - 1

  const nextNode     = panoramaChain[currentStepIndex + 1]
  const prevNode     = panoramaChain[currentStepIndex - 1]

  useEffect(() => {
    if (!route) navigate('/')
  }, [route, navigate])

  function toggleCalibration() {
    if (!isCalibrating && currentNode) {
      setCalibPitch(currentNode.hotspotPitch ?? -5)
      setCalibYaw(currentNode.hotspotYaw ?? 0)
      setCalibDirection(currentNode.hotspotDirection || 'forward')
      setCalibLabel(currentNode.hotspotLabel || (nextNode?.nodeName ? `➔ ${nextNode.nodeName}` : 'Next Step'))
    }
    setIsCalibrating(c => !c)
  }

  function handleNextStep() {
    if (isLast) {
      navigate('/reached', { state: { destination, route, startNode } })
    } else {
      setIsCalibrating(false)
      setCurrentStepIndex(s => s + 1)
    }
  }

  function goPrev() {
    if (currentStepIndex > 0) {
      setIsCalibrating(false)
      setCurrentStepIndex(s => s - 1)
    }
  }

  function exitNavigation() {
    navigate('/assistant')
  }

  const panoRaw = currentNode?.panoramaUrl || currentNode?.imageUrl
  const panoSource = panoRaw ? (getPanoImage(panoRaw) || panoRaw) : '/panoramas/first-floor-landing.jpg'

  // Initialize Pannellum viewer only when step or image source changes
  useEffect(() => {
    let viewer = null
    let isCancelled = false

    setViewerLoading(true)
    setViewerError(false)

    const initViewer = () => {
      if (!panoramaRef.current || typeof window === 'undefined' || isCancelled) return

      panoramaRef.current.innerHTML = ''

      if (!window.pannellum) {
        if (!isCancelled) {
          setViewerError(true)
          setViewerLoading(false)
        }
        return
      }

      const activePitch = currentNode?.hotspotPitch ?? -5
      const activeYaw   = currentNode?.hotspotYaw ?? 0
      const activeDir   = currentNode?.hotspotDirection || 'forward'
      const activeLabel = currentNode?.hotspotLabel || (nextNode?.nodeName ? `➔ ${nextNode.nodeName}` : 'Next Step')
      const arrowEmoji  = DIRECTION_EMOJIS[activeDir] || '➔'

      try {
        viewer = window.pannellum.viewer(panoramaRef.current, {
          type: 'equirectangular',
          panorama: panoSource,
          autoLoad: true,
          showZoomCtrl: false,
          showFullscreenCtrl: false,
          hfov: 100,
          minHfov: 45,
          maxHfov: 120,
          pitch: activePitch,
          yaw: activeYaw,
          hotSpots: [
            {
              id: 'nav-hotspot',
              pitch: activePitch,
              yaw: activeYaw,
              type: 'info',
              cssClass: 'custom-nav-hotspot',
              createTooltipFunc: (hotSpotDiv) => {
                hotSpotDiv.innerHTML = `
                  <div class="nav-arrow-bubble">
                    <span class="nav-arrow-icon">${arrowEmoji}</span>
                    <span>${isLast ? 'Destination Reached' : activeLabel}</span>
                  </div>
                  <div class="nav-arrow-pointer"></div>
                `
                hotSpotDiv.onclick = (e) => {
                  e.stopPropagation()
                  handleNextStep()
                }
              }
            }
          ]
        })

        viewerInstanceRef.current = viewer

        viewer.on('load', () => {
          if (!isCancelled) {
            setViewerLoading(false)
            setViewerError(false)
          }
        })

        viewer.on('error', (err) => {
          console.warn('Pannellum error:', err)
          if (!isCancelled) {
            setViewerError(true)
            setViewerLoading(false)
          }
        })

        // In calibration mode, clicking anywhere in the 360 photo moves the arrow there
        viewer.on('mousedown', (event) => {
          try {
            const coords = viewer.mouseEventToCoords(event)
            if (coords && coords.length >= 2) {
              const clickedPitch = Math.round(coords[0] * 10) / 10
              const clickedYaw   = Math.round(coords[1] * 10) / 10
              setCalibPitch(clickedPitch)
              setCalibYaw(clickedYaw)
            }
          } catch (e) {
            console.error('Error capturing coordinates:', e)
          }
        })

      } catch (err) {
        console.error('Error initializing Pannellum:', err)
        if (!isCancelled) {
          setViewerError(true)
          setViewerLoading(false)
        }
      }
    }

    const timer = setTimeout(initViewer, 80)

    return () => {
      isCancelled = true
      clearTimeout(timer)
      if (viewer) {
        try {
          viewer.destroy()
        } catch (e) {}
      }
      viewerInstanceRef.current = null
      if (panoramaRef.current) {
        panoramaRef.current.innerHTML = ''
      }
    }
  }, [currentStepIndex, panoSource])

  // Live hotspot repositioning during calibration without destroying WebGL context
  useEffect(() => {
    if (!isCalibrating || !viewerInstanceRef.current) return
    const viewer = viewerInstanceRef.current
    try {
      viewer.removeHotSpot('nav-hotspot')
      const arrowEmoji = DIRECTION_EMOJIS[calibDirection] || '➔'
      viewer.addHotSpot({
        id: 'nav-hotspot',
        pitch: calibPitch,
        yaw: calibYaw,
        type: 'info',
        cssClass: 'custom-nav-hotspot',
        createTooltipFunc: (hotSpotDiv) => {
          hotSpotDiv.innerHTML = `
            <div class="nav-arrow-bubble">
              <span class="nav-arrow-icon">${arrowEmoji}</span>
              <span>${calibLabel || 'Next Step'}</span>
            </div>
            <div class="nav-arrow-pointer"></div>
          `
        }
      })
    } catch (e) {
      console.warn('Live hotspot update error:', e)
    }
  }, [isCalibrating, calibPitch, calibYaw, calibDirection, calibLabel])

  // Save calibrated hotspot to backend
  async function handleSaveCalibration() {
    if (!currentNode?.panoramaId || !currentNode?.targetNodeId) {
      toast.error('Cannot save: No target node on this step.')
      return
    }

    setIsSaving(true)
    try {
      const res = await fetch('http://localhost:5000/api/navigation/panoramas/hotspot', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          panoramaId: currentNode.panoramaId,
          targetNodeId: currentNode.targetNodeId,
          pitch: calibPitch,
          yaw: calibYaw,
          label: calibLabel,
          direction: calibDirection
        })
      })

      const data = await res.json()
      if (res.ok && data.success) {
        toast.success('Arrow angle saved permanently!')
        // Update local object
        currentNode.hotspotPitch = calibPitch
        currentNode.hotspotYaw = calibYaw
        currentNode.hotspotDirection = calibDirection
        currentNode.hotspotLabel = calibLabel
        setIsCalibrating(false)
      } else {
        toast.error(data.error || 'Failed to save hotspot.')
      }
    } catch (err) {
      console.error(err)
      toast.error('Network error saving hotspot.')
    } finally {
      setIsSaving(false)
    }
  }

  if (!route) return null

  const progress = ((currentStepIndex + 1) / Math.max(panoramaChain.length, 1)) * 100

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col max-w-md mx-auto relative overflow-hidden text-slate-100 select-none">
      {/* Header HUD */}
      <div className="absolute top-0 left-0 right-0 z-30 safe-top">
        <div className="flex items-center justify-between px-4 py-3 bg-gradient-to-b from-black/90 via-black/60 to-transparent">
          <button
            onClick={exitNavigation}
            className="w-9 h-9 bg-black/60 rounded-full flex items-center justify-center text-white backdrop-blur border border-white/20 active:scale-95 transition-all"
            title="Exit Navigation"
          >
            <X className="w-4 h-4" />
          </button>

          <div className="text-center px-2 flex-1">
            <p className="text-white/80 text-[11px] font-medium tracking-wide uppercase">Navigating to</p>
            <p className="text-blue-300 text-sm font-bold truncate max-w-[200px] mx-auto">{destination?.name}</p>
          </div>

          {/* Calibrate / Adjust Arrow Toggle */}
          <button
            onClick={toggleCalibration}
            className={`px-3 py-1.5 rounded-full text-xs font-semibold flex items-center gap-1.5 transition-all shadow-md ${
              isCalibrating 
                ? 'bg-amber-500 text-slate-950 font-bold ring-2 ring-amber-300 animate-pulse' 
                : 'bg-white/10 hover:bg-white/20 text-white backdrop-blur border border-white/20'
            }`}
            title="Click to adjust the arrow position in this photo"
          >
            <Sliders className="w-3.5 h-3.5" />
            <span>{isCalibrating ? 'Editing Arrow' : 'Adjust Arrow'}</span>
          </button>
        </div>

        {/* Progress bar */}
        <div className="mx-4 bg-white/20 rounded-full h-1.5 overflow-hidden">
          <div
            className="bg-blue-400 h-1.5 rounded-full transition-all duration-500 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>
        <p className="text-white/70 text-xs text-center mt-1.5 font-medium drop-shadow-md">
          Step {currentStepIndex + 1} of {panoramaChain.length}
        </p>
      </div>

      {/* 360° Viewer Container */}
      <div className="flex-1 relative w-full h-full min-h-[55vh] bg-slate-900 overflow-hidden flex items-center justify-center">
        {/* Pannellum Mount Element */}
        <div 
          ref={panoramaRef} 
          className="absolute inset-0 w-full h-full z-10" 
          style={{ minHeight: '360px' }}
        />

        {/* Calibration Target Reticle overlay */}
        {isCalibrating && (
          <div className="absolute inset-0 z-20 pointer-events-none flex items-center justify-center">
            <div className="w-10 h-10 border border-amber-400/50 rounded-full flex items-center justify-center">
              <Crosshair className="w-5 h-5 text-amber-400/70" />
            </div>
            <div className="absolute top-24 bg-amber-500/90 text-slate-950 px-3 py-1 rounded-full text-[11px] font-bold shadow-lg">
              Click anywhere on the door/corridor to place arrow
            </div>
          </div>
        )}

        {/* Fallback Static 360 Photo View if WebGL fails */}
        {viewerError && (
          <div className="absolute inset-0 z-15 flex flex-col items-center justify-center bg-slate-950">
            <img
              src={panoSource}
              alt={currentNode?.nodeName || 'Campus 360 view'}
              className="w-full h-full object-cover"
            />
            <div className="absolute top-20 left-4 right-4 bg-black/80 backdrop-blur rounded-xl p-3 border border-amber-500/30 text-amber-200 text-xs flex items-center justify-between gap-2 shadow-xl">
              <div className="flex items-start gap-2">
                <AlertCircle className="w-4 h-4 flex-shrink-0 text-amber-400 mt-0.5" />
                <div>
                  <p className="font-semibold text-white">Campus 360 Photo Loaded</p>
                  <p className="text-slate-300 text-[11px] mt-0.5">Showing camera photo view.</p>
                </div>
              </div>
              <button
                onClick={() => {
                  setViewerError(false)
                  setViewerLoading(true)
                  setCurrentStepIndex(i => i)
                }}
                className="px-2.5 py-1 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-[11px] font-semibold active:scale-95 transition-all"
              >
                Retry 360
              </button>
            </div>
          </div>
        )}

        {/* Loading Spinner */}
        {viewerLoading && !viewerError && (
          <div className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-slate-900/80 backdrop-blur-sm">
            <div className="w-10 h-10 border-3 border-blue-400 border-t-transparent rounded-full animate-spin mb-3 shadow-lg" />
            <p className="text-xs text-blue-200 font-medium tracking-wide">Loading 360° Campus View...</p>
          </div>
        )}

        {/* Current Location & Direction Instruction Card */}
        {!isCalibrating && (
          <div className="absolute bottom-4 left-4 right-4 z-25 pointer-events-none">
            <div className="bg-black/80 backdrop-blur-md rounded-2xl px-4 py-3 border border-white/15 pointer-events-auto shadow-2xl">
              <div className="flex items-start gap-3">
                <div className="w-7 h-7 rounded-full bg-blue-500/20 flex items-center justify-center flex-shrink-0 mt-0.5 border border-blue-400/30">
                  <MapPin className="w-4 h-4 text-blue-400" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-white font-semibold text-sm leading-snug truncate">
                    {currentNode?.nodeName || 'Current Location'}
                  </p>
                  {currentStepIndex < panoramaChain.length - 1 && route.instructions?.[currentStepIndex] ? (
                    <p className="text-slate-300 text-xs mt-1 leading-relaxed">
                      {route.instructions[currentStepIndex]}
                    </p>
                  ) : (
                    <p className="text-emerald-400 text-xs mt-1 font-medium">
                      You have reached your destination!
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Interactive Arrow Calibration Control Drawer */}
        {isCalibrating && (
          <div className="absolute bottom-4 left-3 right-3 z-30 bg-slate-900/95 backdrop-blur-lg border border-amber-400/40 rounded-2xl p-4 shadow-2xl">
            <div className="flex items-center justify-between mb-3 border-b border-white/10 pb-2">
              <span className="text-xs font-bold text-amber-400 flex items-center gap-1.5">
                <Sliders className="w-3.5 h-3.5" /> Adjust Arrow Angle
              </span>
              <span className="text-[11px] text-slate-400">
                Yaw: <b className="text-white">{calibYaw}°</b> | Pitch: <b className="text-white">{calibPitch}°</b>
              </span>
            </div>

            {/* Sliders for fine-tuning */}
            <div className="space-y-3 mb-3 text-xs">
              <div>
                <div className="flex justify-between text-slate-300 mb-1">
                  <span>Horizontal Turn (Yaw)</span>
                  <span className="text-amber-300 font-mono">{calibYaw}°</span>
                </div>
                <input 
                  type="range" 
                  min="-180" 
                  max="180" 
                  value={calibYaw} 
                  onChange={(e) => setCalibYaw(Number(e.target.value))}
                  className="w-full accent-amber-400 h-1.5 bg-slate-700 rounded-lg cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-slate-500 mt-0.5">
                  <span>← 90° Left</span>
                  <span>Center 0°</span>
                  <span>90° Right →</span>
                </div>
              </div>

              <div>
                <div className="flex justify-between text-slate-300 mb-1">
                  <span>Vertical Tilt (Pitch)</span>
                  <span className="text-amber-300 font-mono">{calibPitch}°</span>
                </div>
                <input 
                  type="range" 
                  min="-45" 
                  max="45" 
                  value={calibPitch} 
                  onChange={(e) => setCalibPitch(Number(e.target.value))}
                  className="w-full accent-amber-400 h-1.5 bg-slate-700 rounded-lg cursor-pointer"
                />
              </div>

              {/* Direction selector */}
              <div>
                <span className="text-slate-300 block mb-1.5">Arrow Direction Icon</span>
                <div className="grid grid-cols-5 gap-1 text-center">
                  {[
                    { id: 'left', label: 'Left', icon: '⬅' },
                    { id: 'forward', label: 'Ahead', icon: '⬆' },
                    { id: 'right', label: 'Right', icon: '➡' },
                    { id: 'up', label: 'Stairs ↑', icon: '⏫' },
                    { id: 'back', label: 'Back', icon: '⬇' }
                  ].map((dir) => (
                    <button
                      key={dir.id}
                      onClick={() => setCalibDirection(dir.id)}
                      className={`p-1.5 rounded-xl border text-xs flex flex-col items-center gap-0.5 transition-all ${
                        calibDirection === dir.id
                          ? 'bg-amber-500 text-slate-950 font-bold border-amber-300'
                          : 'bg-slate-800 text-slate-300 border-white/10 hover:bg-slate-700'
                      }`}
                    >
                      <span>{dir.icon}</span>
                      <span className="text-[9px]">{dir.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Label text input */}
              <div>
                <span className="text-slate-300 block mb-1">Badge Text</span>
                <input
                  type="text"
                  value={calibLabel}
                  onChange={(e) => setCalibLabel(e.target.value)}
                  placeholder="e.g. Turn Left: Computer Dept"
                  className="w-full bg-slate-800 border border-white/15 rounded-xl px-3 py-1.5 text-xs text-white focus:outline-none focus:border-amber-400"
                />
              </div>
            </div>

            {/* Action buttons */}
            <div className="flex gap-2">
              <button
                onClick={() => setIsCalibrating(false)}
                className="flex-1 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs py-2 rounded-xl border border-white/10"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveCalibration}
                disabled={isSaving}
                className="flex-1 bg-amber-500 hover:bg-amber-400 active:scale-95 text-slate-950 font-bold text-xs py-2 rounded-xl flex items-center justify-center gap-1.5 shadow-lg transition-all"
              >
                {isSaving ? <RotateCcw className="w-3.5 h-3.5 animate-spin" /> : <Save className="w-3.5 h-3.5" />}
                <span>Save Arrow Position</span>
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Navigation Controls HUD (Bottom) */}
      {!isCalibrating && (
        <div className="bg-black/95 border-t border-white/10 px-4 py-4 flex flex-col gap-4 z-30">
          {/* Direction buttons */}
          <div className="flex justify-center gap-3 items-center">
            {currentStepIndex > 0 && (
              <DirectionArrow direction="back" label="Go Back" onClick={goPrev} />
            )}

            {isLast ? (
              <button
                onClick={handleNextStep}
                className="bg-emerald-600 hover:bg-emerald-500 text-white rounded-2xl px-8 py-3.5 font-bold active:scale-95 transition-all flex items-center gap-2 shadow-lg shadow-emerald-900/40"
              >
                <span>✓</span> Arrived at Destination
              </button>
            ) : (
              <DirectionArrow
                direction={currentNode?.hotspotDirection || 'forward'}
                label={nextNode?.nodeName || 'Next Step'}
                onClick={handleNextStep}
              />
            )}
          </div>

          {/* Step indicator dots */}
          <div className="flex gap-1.5 justify-center items-center">
            {panoramaChain.map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrentStepIndex(i)}
                title={`Jump to step ${i + 1}`}
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  i === currentStepIndex ? 'w-6 bg-blue-400' :
                  i < currentStepIndex  ? 'w-2.5 bg-blue-700 hover:bg-blue-600' :
                  'w-2.5 bg-white/20 hover:bg-white/40'
                }`}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
