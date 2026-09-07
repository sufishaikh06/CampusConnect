import { QRCodeSVG } from 'qrcode.react'
import { useNavigate } from 'react-router-dom'
import { Scan, Smartphone, Navigation } from 'lucide-react'

const DEMO_URL = `${window.location.origin}/?start=node-main-gate`

export default function QRPage() {
  const navigate = useNavigate()
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-950 to-indigo-950 flex flex-col items-center justify-center text-white px-6 py-10 gap-8">
      <div className="text-center">
        <Scan className="w-10 h-10 text-blue-300 mx-auto mb-3" />
        <h1 className="text-2xl font-bold">Scan to Enter</h1>
        <p className="text-blue-300 text-sm mt-1">Place this QR code at the campus entrance</p>
      </div>

      <div className="bg-white p-6 rounded-3xl shadow-2xl">
        <QRCodeSVG value={DEMO_URL} size={220} level="H" includeMargin />
      </div>

      <div className="bg-white/10 backdrop-blur rounded-2xl p-4 text-center max-w-xs text-sm text-blue-200">
        <p className="font-medium text-white mb-1">Demo URL</p>
        <p className="break-all text-xs">{DEMO_URL}</p>
      </div>

      <div className="flex flex-col gap-3 items-center text-blue-200 text-sm">
        <div className="flex items-center gap-2"><Smartphone className="w-4 h-4" /> Scan with any smartphone camera</div>
        <div className="flex items-center gap-2"><Navigation className="w-4 h-4" /> No app installation required</div>
      </div>

      <button onClick={() => navigate('/')} className="bg-white text-blue-900 font-bold px-6 py-3 rounded-2xl hover:bg-blue-50 transition-colors">
        Open Application
      </button>
    </div>
  )
}
