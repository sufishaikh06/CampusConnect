import { useState, useRef, useEffect } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { Send, Mic, ChevronLeft, Bot, User, Loader2, MapPin, Compass } from 'lucide-react'
import toast from 'react-hot-toast'
import { campusAPI } from '../services/api'
import StartingPointModal from '../components/StartingPointModal'

const SUGGESTED = [
  'Where is the Computer Engineering HOD?',
  'Where is Dr. Pawar Sir Cabin?',
  'I am at Reception, how do I reach HOD?',
  'From Software Lab 1, where is Celebal Lab?',
  'Where is the Language Lab?',
  'Find the Central Library.',
  'Where is the Admission Office?'
]

function Message({ msg, onOpenStartModal }) {
  const isBot = msg.role === 'bot'
  return (
    <div className={`flex gap-3 ${isBot ? '' : 'flex-row-reverse'}`}>
      <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${isBot ? 'bg-blue-600' : 'bg-slate-600'}`}>
        {isBot ? <Bot className="w-4 h-4 text-white" /> : <User className="w-4 h-4 text-white" />}
      </div>
      <div className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${isBot ? 'bg-white text-slate-800 shadow-sm' : 'bg-blue-600 text-white'}`}>
        <p className="whitespace-pre-line">{msg.text}</p>

        {msg.results && msg.results.length > 1 && (
          <div className="mt-3 flex flex-col gap-2">
            {msg.results.map(r => (
              <button
                key={r.id}
                onClick={() => msg.onSelect && msg.onSelect(r)}
                className="text-left bg-blue-50 rounded-xl px-3 py-2 text-blue-800 hover:bg-blue-100 transition-colors text-xs font-medium"
              >
                📍 {r.name}
                {r.roomNumber && <span className="text-blue-500 ml-1">· Room {r.roomNumber}</span>}
              </button>
            ))}
          </div>
        )}

        {msg.destination && (
          <div className="mt-3.5 pt-3 border-t border-slate-100 flex flex-col gap-2">
            <div className="bg-slate-50 border border-slate-200/80 rounded-xl px-3 py-2 flex items-center justify-between text-[11px]">
              <div className="flex items-center gap-1.5 text-slate-600 truncate">
                <Compass className="w-3.5 h-3.5 text-blue-600 flex-shrink-0" />
                <span className="text-slate-500">From:</span>
                <span className="font-bold text-slate-800 truncate">{msg.startNodeName || 'Main Campus Gate'}</span>
              </div>
              <button
                onClick={onOpenStartModal}
                className="text-blue-600 font-bold hover:underline ml-2 flex-shrink-0"
              >
                Change
              </button>
            </div>

            <button
              onClick={() => msg.onNavigate && msg.onNavigate(msg.destination)}
              className="w-full bg-blue-600 hover:bg-blue-700 active:scale-95 text-white rounded-xl px-4 py-2.5 text-xs font-bold transition-all shadow-md flex items-center justify-center gap-2"
            >
              <MapPin className="w-3.5 h-3.5" />
              <span>Start Route to {msg.destination.name}</span>
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

export default function AssistantPage() {
  const navigate        = useNavigate()
  const [params]        = useSearchParams()
  
  const [startNode, setStartNode] = useState(params.get('start') || 'node-main-gate')
  const [startNodeName, setStartNodeName] = useState('Main Campus Gate')
  const [isStartModalOpen, setIsStartModalOpen] = useState(false)

  const [messages, setMessages] = useState([
    {
      id: 0,
      role: 'bot',
      text: "Welcome to Sanjivani College of Engineering! I'm CampusConnect AI. How can I help you today? You can ask where any room or lab is, or tell me where you are standing right now!"
    }
  ])
  const [input, setInput]     = useState('')
  const [loading, setLoading] = useState(false)
  const [listening, setListening]  = useState(false)
  const endRef = useRef(null)
  const recogRef = useRef(null)

  // Resolve start node name from nav nodes
  useEffect(() => {
    async function loadNodeName() {
      try {
        const res = await campusAPI.getNavNodes()
        const node = res.data?.find(n => n.id === startNode)
        if (node) setStartNodeName(node.name)
      } catch (e) {
        console.error('Error fetching start node name:', e)
      }
    }
    loadNodeName()
  }, [startNode])

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  function addMessage(msg) {
    setMessages(prev => [...prev, { id: Date.now() + Math.random(), ...msg }])
  }

  async function sendMessage(text) {
    if (!text.trim() || loading) return
    setLoading(true)
    addMessage({ role: 'user', text })
    setInput('')

    try {
      const res = await campusAPI.chat(text.trim(), startNode)

      let currentStart = startNode
      let currentStartName = startNodeName

      // If user mentioned where they are, AI auto-updates starting location!
      if (res.origin && res.startNodeId) {
        currentStart = res.startNodeId
        currentStartName = res.origin.name
        setStartNode(currentStart)
        setStartNodeName(currentStartName)
        toast.success(`Starting point detected: ${currentStartName}`, { icon: '📍' })
      }

      let botMsg = {
        role: 'bot',
        text: res.reply,
        results: res.results || [],
        destination: res.destination || null,
        startNode: currentStart,
        startNodeName: currentStartName
      }

      if (res.destination) {
        botMsg.onNavigate = (dest) => {
          navigate('/destination', { 
            state: { 
              destination: dest, 
              startNode: currentStart, 
              startNodeName: currentStartName 
            } 
          })
        }
      }

      if (res.requiresClarification && res.results.length > 0) {
        botMsg.results = res.results
        botMsg.onSelect = (dest) => {
          navigate('/destination', { 
            state: { 
              destination: dest, 
              startNode: currentStart, 
              startNodeName: currentStartName 
            } 
          })
        }
      }

      if (res.suggestions && res.suggestions.length > 0 && res.results.length === 0) {
        botMsg.text += '\n\nSuggestions: ' + res.suggestions.join(', ')
      }

      addMessage(botMsg)
    } catch (err) {
      console.error(err)
      addMessage({
        role: 'bot',
        text: 'Sorry, I encountered an error. Please try again or use the search suggestions below.'
      })
    } finally {
      setLoading(false)
    }
  }

  function handleSubmit(e) {
    e.preventDefault()
    sendMessage(input)
  }

  function handleVoice() {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
    if (!SpeechRecognition) {
      addMessage({ role: 'bot', text: 'Voice input is not supported in this browser. Please type your question.' })
      return
    }
    if (listening) {
      recogRef.current?.stop()
      setListening(false)
      return
    }
    const recog = new SpeechRecognition()
    recogRef.current = recog
    recog.lang = 'en-IN'
    recog.interimResults = false
    recog.onstart  = () => setListening(true)
    recog.onend    = () => setListening(false)
    recog.onerror  = () => { setListening(false); addMessage({ role: 'bot', text: 'Microphone access denied or unavailable.' }) }
    recog.onresult = (e) => {
      const transcript = e.results[0][0].transcript
      setInput(transcript)
      sendMessage(transcript)
    }
    recog.start()
  }

  return (
    <div className="min-h-screen flex flex-col bg-slate-100 max-w-md mx-auto relative">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-900 to-indigo-900 text-white px-4 py-3.5 flex items-center justify-between sticky top-0 z-20 shadow-md">
        <div className="flex items-center gap-3">
          <button onClick={() => navigate('/')} className="p-1.5 rounded-xl hover:bg-white/10 transition-colors">
            <ChevronLeft className="w-5 h-5" />
          </button>
          <div className="w-9 h-9 bg-white/20 rounded-xl flex items-center justify-center">
            <Bot className="w-5 h-5" />
          </div>
          <div>
            <p className="font-semibold text-sm">CampusConnect AI</p>
            <p className="text-blue-300 text-xs flex items-center gap-1">
              <span className="inline-block w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse"></span>
              Online · Sanjivani College
            </p>
          </div>
        </div>
      </div>

      {/* Starting Location Quick Selector Banner */}
      <div className="bg-slate-900 text-white px-4 py-2.5 flex items-center justify-between border-b border-slate-800 text-xs sticky top-[57px] z-10 shadow-xs">
        <div className="flex items-center gap-2 min-w-0">
          <div className="w-2 h-2 rounded-full bg-emerald-400 ring-4 ring-emerald-400/20 flex-shrink-0 animate-ping-slow" />
          <span className="text-slate-400 text-[11px]">Starting at:</span>
          <span className="font-bold text-white truncate text-xs">{startNodeName}</span>
        </div>
        <button
          onClick={() => setIsStartModalOpen(true)}
          className="flex items-center gap-1 bg-blue-600/90 hover:bg-blue-600 active:scale-95 text-white px-2.5 py-1 rounded-xl text-[11px] font-semibold transition-all ml-2 flex-shrink-0 border border-blue-400/30 shadow-xs"
        >
          <Compass className="w-3 h-3 text-blue-200" />
          <span>Change</span>
        </button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-4 flex flex-col gap-4">
        {messages.map(msg => (
          <Message 
            key={msg.id} 
            msg={msg} 
            onOpenStartModal={() => setIsStartModalOpen(true)} 
          />
        ))}
        {loading && (
          <div className="flex gap-3">
            <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center">
              <Bot className="w-4 h-4 text-white" />
            </div>
            <div className="bg-white rounded-2xl px-4 py-3 shadow-sm flex gap-1.5 items-center">
              <Loader2 className="w-4 h-4 text-blue-600 animate-spin" />
              <span className="text-slate-500 text-sm">Finding your destination...</span>
            </div>
          </div>
        )}
        <div ref={endRef} />
      </div>

      {/* Suggestions */}
      <div className="px-4 pb-2">
        <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
          {SUGGESTED.map((s, i) => (
            <button
              key={i}
              onClick={() => sendMessage(s)}
              className="flex-shrink-0 bg-white text-blue-700 rounded-full px-3 py-1.5 text-xs font-medium shadow-sm hover:bg-blue-50 transition-colors border border-blue-100 flex items-center gap-1 active:scale-95"
            >
              <MapPin className="w-3 h-3" /> {s}
            </button>
          ))}
        </div>
      </div>

      {/* Input */}
      <div className="bg-white border-t border-slate-200 px-4 py-3">
        <form onSubmit={handleSubmit} className="flex gap-2 items-end">
          <input
            type="text"
            value={input}
            onChange={e => setInput(e.target.value)}
            placeholder='Ask: "Where is HOD?" or "I see Software Lab 1..."'
            className="flex-1 bg-slate-100 rounded-2xl px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-blue-500 resize-none text-slate-800 placeholder-slate-400"
            disabled={loading}
          />
          <button
            type="button"
            onClick={handleVoice}
            className={`p-3 rounded-2xl transition-colors ${listening ? 'bg-red-500 text-white' : 'bg-slate-200 text-slate-600 hover:bg-slate-300'}`}
          >
            <Mic className="w-4 h-4" />
          </button>
          <button
            type="submit"
            disabled={!input.trim() || loading}
            className="p-3 bg-blue-600 text-white rounded-2xl hover:bg-blue-700 disabled:opacity-50 transition-colors shadow-sm"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>

      {/* Starting Location Picker Modal */}
      <StartingPointModal
        isOpen={isStartModalOpen}
        onClose={() => setIsStartModalOpen(false)}
        currentStartNodeId={startNode}
        onSelectStartNode={(nodeId, nodeName) => {
          setStartNode(nodeId)
          setStartNodeName(nodeName)
          toast.success(`Starting point set to: ${nodeName}`, { icon: '📍' })
        }}
      />
    </div>
  )
}
