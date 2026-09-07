import { useState, useRef, useEffect } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { Send, Mic, ChevronLeft, Bot, User, Loader2, MapPin } from 'lucide-react'
import { campusAPI } from '../services/api'

const SUGGESTED = [
  'Where is the Admission Office?',
  'I want to pay fees.',
  'Where is the Computer Engineering HOD?',
  'Find the library.',
  'Where is the Examination Cell?',
  'How do I reach the Principal Office?'
]

function Message({ msg }) {
  const isBot = msg.role === 'bot'
  return (
    <div className={`flex gap-3 ${isBot ? '' : 'flex-row-reverse'}`}>
      <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${isBot ? 'bg-blue-600' : 'bg-slate-600'}`}>
        {isBot ? <Bot className="w-4 h-4 text-white" /> : <User className="w-4 h-4 text-white" />}
      </div>
      <div className={`max-w-[80%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${isBot ? 'bg-white text-slate-800 shadow-sm' : 'bg-blue-600 text-white'}`}>
        {msg.text}
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
          <button
            onClick={() => msg.onNavigate && msg.onNavigate(msg.destination)}
            className="mt-3 w-full bg-blue-600 text-white rounded-xl px-4 py-2 text-xs font-semibold hover:bg-blue-700 transition-colors"
          >
            📍 Navigate to {msg.destination.name}
          </button>
        )}
      </div>
    </div>
  )
}

export default function AssistantPage() {
  const navigate        = useNavigate()
  const [params]        = useSearchParams()
  const startNode       = params.get('start') || 'node-main-gate'
  const [messages, setMessages] = useState([
    {
      id: 0,
      role: 'bot',
      text: 'Welcome to Sanjivani College of Engineering! I\'m CampusConnect AI. How can I help you today? You can ask me where any office, department, or facility is located.'
    }
  ])
  const [input, setInput]     = useState('')
  const [loading, setLoading] = useState(false)
  const [listening, setListening]  = useState(false)
  const endRef = useRef(null)
  const recogRef = useRef(null)

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

      let botMsg = {
        role: 'bot',
        text: res.reply,
        results: res.results || [],
        destination: res.destination || null,
      }

      if (res.destination) {
        botMsg.onNavigate = (dest) => {
          navigate('/destination', { state: { destination: dest, startNode } })
        }
      }

      if (res.requiresClarification && res.results.length > 0) {
        botMsg.results = res.results
        botMsg.onSelect = (dest) => {
          navigate('/destination', { state: { destination: dest, startNode } })
        }
      }

      if (res.suggestions && res.suggestions.length > 0 && res.results.length === 0) {
        botMsg.text += '\n\nSuggestions: ' + res.suggestions.join(', ')
      }

      addMessage(botMsg)
    } catch (err) {
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
    <div className="min-h-screen flex flex-col bg-slate-100 max-w-md mx-auto">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-900 to-indigo-900 text-white px-4 py-4 flex items-center gap-3 sticky top-0 z-10">
        <button onClick={() => navigate('/')} className="p-1.5 rounded-xl hover:bg-white/10 transition-colors">
          <ChevronLeft className="w-5 h-5" />
        </button>
        <div className="w-9 h-9 bg-white/20 rounded-xl flex items-center justify-center">
          <Bot className="w-5 h-5" />
        </div>
        <div>
          <p className="font-semibold text-sm">CampusConnect AI</p>
          <p className="text-blue-300 text-xs flex items-center gap-1">
            <span className="inline-block w-1.5 h-1.5 bg-green-400 rounded-full"></span>
            Online · Sanjivani College
          </p>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-4 flex flex-col gap-4">
        {messages.map(msg => <Message key={msg.id} msg={msg} />)}
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
              className="flex-shrink-0 bg-white text-blue-700 rounded-full px-3 py-1.5 text-xs font-medium shadow-sm hover:bg-blue-50 transition-colors border border-blue-100 flex items-center gap-1"
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
            placeholder="Ask me anything about the campus..."
            className="flex-1 bg-slate-100 rounded-2xl px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-blue-500 resize-none"
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
            className="p-3 bg-blue-600 text-white rounded-2xl hover:bg-blue-700 disabled:opacity-50 transition-colors"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  )
}
