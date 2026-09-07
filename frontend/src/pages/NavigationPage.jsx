import { useState, useEffect, useRef } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { X, ChevronLeft, ChevronRight, MapPin, Navigation2 } from 'lucide-react'

// Sample equirectangular panorama (a gradient placeholder that works as a demo)
// In production this will be replaced by actual 360° photos
const SAMPLE_PANOS = {
  outdoor:   '/panoramas/sample-outdoor.svg',
  indoor:    '/panoramas/sample-indoor.svg',
  corridor:  '/panoramas/sample-corridor.svg',
  office:    '/panoramas/sample-office.svg',
  staircase: '/panoramas/sample-staircase.svg',
}

function getPanoImage(imageUrl) {
  if (!imageUrl) return null
  const lower = imageUrl.toLowerCase()
  // Direct path — return as-is (works for svg and jpg)
  if (lower.startsWith('/panoramas/')) return imageUrl.replace('.jpg', '.svg')
  if (lower.includes('outdoor'))   return SAMPLE_PANOS.outdoor
  if (lower.includes('corridor'))  return SAMPLE_PANOS.corridor
  if (lower.includes('office'))    return SAMPLE_PANOS.office
  if (lower.includes('staircase')) return SAMPLE_PANOS.staircase
  return SAMPLE_PANOS.indoor
}

function DirectionArrow({ direction, label, onClick }) {
  const arrows = {
    forward:  { rotate: '0deg',    emoji: '↑' },
    back:     { rotate: '180deg',  emoji: '↓' },
    left:     { rotate: '-90deg',  emoji: '←' },
    right:    { rotate: '90deg',   emoji: '→' },
    up:       { rotate: '0deg',    emoji: '⬆' },
    down:     { rotate: '180deg',  emoji: '⬇' },
  }
  const arrow = arrows[direction] || { rotate: '0deg', emoji: '→' }

  return (
    <button
      onClick={onClick}
      className="flex flex-col items-center gap-1 bg-black/60 backdrop-blur text-white rounded-2xl px-4 py-3 hover:bg-blue-600/80 active:scale-95 transition-all border border-white/20"
    >
      <span className="text-2xl font-bold">{arrow.emoji}</span>
      <span className="text-xs font-medium max-w-[80px] text-center leading-tight">{label}</span>
    </button>
  )
}

export default function NavigationPage() {
  const navigate    = useNavigate()
  const { state }   = useLocation()
  const route       = state?.route
  const destination = state?.destination
  const startNode   = state?.startNode || 'node-main-gate'

  const [currentStep, setCurrentStep] = useState(0)
  const [panoLoaded, setPanoLoaded]   = useState(false)
  const panoRef = useRef()

  const panoramaChain = route?.panoramaChain || []
  const currentNode   = panoramaChain[currentStep]
  const isLast        = currentStep === panoramaChain.length - 1

  // Get valid hotspots for current step — only forward in route
  const nextNode     = panoramaChain[currentStep + 1]
  const prevNode     = panoramaChain[currentStep - 1]

  useEffect(() => {
    if (!route) navigate('/')
  }, [])

  useEffect(() => {
    setPanoLoaded(false)
    const timer = setTimeout(() => setPanoLoaded(true), 500)
    return () => clearTimeout(timer)
  }, [currentStep])

  function goNext() {
    if (isLast) {
      navigate('/reached', { state: { destination, route, startNode } })
    } else {
      setCurrentStep(s => s + 1)
    }
  }

  function goPrev() {
    if (currentStep > 0) setCurrentStep(s => s - 1)
  }

  function exitNavigation() {
    navigate('/assistant')
  }

  if (!route) return null

  const imageUrl = getPanoImage(currentNode?.imageUrl)
  const progress = ((currentStep + 1) / panoramaChain.length) * 100

  return (
    <div className="min-h-screen bg-black flex flex-col max-w-md mx-auto relative overflow-hidden">
      {/* Header HUD */}
      <div className="absolute top-0 left-0 right-0 z-20 safe-top">
        <div className="flex items-center justify-between px-4 py-3 bg-gradient-to-b from-black/80 to-transparent">
          <button
            onClick={exitNavigation}
            className="w-9 h-9 bg-black/60 rounded-full flex items-center justify-center text-white backdrop-blur border border-white/20"
          >
            <X className="w-4 h-4" />
          </button>

          <div className="text-center">
            <p className="text-white text-xs font-medium">Navigating to</p>
            <p className="text-blue-300 text-sm font-bold">{destination?.name}</p>
          </div>

          <div className="w-9 h-9 bg-blue-600/80 rounded-full flex items-center justify-center backdrop-blur">
            <Navigation2 className="w-4 h-4 text-white" />
          </div>
        </div>

        {/* Progress bar */}
        <div className="mx-4 bg-white/20 rounded-full h-1.5">
          <div
            className="bg-blue-400 h-1.5 rounded-full transition-all duration-500"
            style={{ width: `${progress}%` }}
          />
        </div>
        <p className="text-white/60 text-xs text-center mt-1.5">
          Step {currentStep + 1} of {panoramaChain.length}
        </p>
      </div>

      {/* 360° Viewer / Panorama */}
      <div className="flex-1 relative flex items-center justify-center bg-slate-900">
        {imageUrl ? (
          <>
            <img
              src={imageUrl}
              alt={currentNode?.nodeName}
              className={`w-full h-full object-cover transition-opacity duration-500 ${panoLoaded ? 'opacity-100' : 'opacity-0'}`}
              onLoad={() => setPanoLoaded(true)}
              style={{ minHeight: '60vh' }}
            />
            {!panoLoaded && (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-8 h-8 border-2 border-blue-400 border-t-transparent rounded-full animate-spin" />
              </div>
            )}
          </>
        ) : (
          <div className="flex flex-col items-center justify-center gap-4 text-white p-8 text-center">
            <div className="w-20 h-20 bg-slate-700 rounded-3xl flex items-center justify-center">
              <MapPin className="w-10 h-10 text-slate-400" />
            </div>
            <div>
              <p className="font-semibold text-lg">{currentNode?.nodeName}</p>
              <p className="text-slate-400 text-sm mt-1">360° image not available for this location</p>
              <p className="text-slate-500 text-xs mt-2">Use the text directions below to navigate</p>
            </div>
          </div>
        )}

        {/* Current location label */}
        <div className="absolute bottom-4 left-4 right-4">
          <div className="bg-black/70 backdrop-blur rounded-2xl px-4 py-3 border border-white/10">
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-blue-400 flex-shrink-0" />
              <div>
                <p className="text-white font-semibold text-sm">{currentNode?.nodeName || 'Current Location'}</p>
                {currentStep < panoramaChain.length - 1 && route.instructions[currentStep] && (
                  <p className="text-slate-300 text-xs mt-0.5">{route.instructions[currentStep]}</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Controls */}
      <div className="bg-black/90 px-4 py-5 flex flex-col gap-4">
        {/* Direction arrows */}
        <div className="flex justify-center gap-3 flex-wrap">
          {currentStep > 0 && (
            <DirectionArrow direction="back" label="Go Back" onClick={goPrev} />
          )}
          {isLast ? (
            <button
              onClick={goNext}
              className="bg-green-600 text-white rounded-2xl px-8 py-3 font-bold hover:bg-green-700 active:scale-95 transition-all flex items-center gap-2"
            >
              ✓ Arrived
            </button>
          ) : (
            <DirectionArrow
              direction={route.panoramaChain[currentStep + 1] ? 'forward' : 'forward'}
              label={nextNode?.nodeName || 'Next'}
              onClick={goNext}
            />
          )}
        </div>

        {/* Step counter and mini route */}
        <div className="flex gap-1.5 justify-center">
          {panoramaChain.map((_, i) => (
            <div
              key={i}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                i === currentStep ? 'w-6 bg-blue-400' :
                i < currentStep  ? 'w-3 bg-blue-700' :
                'w-3 bg-white/20'
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  )
}
