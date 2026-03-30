import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Layout from '../components/Layout'
import { X, CheckCircle, ChevronRight, Bell, Radio, LayoutDashboard } from 'lucide-react'

type Step = 1 | 2 | 3

export default function WatchSetup() {
  const navigate = useNavigate()
  const [step, setStep] = useState<Step>(1)

  // Step 1 state
  const [keywords, setKeywords] = useState<string[]>(['Highlands Coffee', 'highlands', 'highlandscoffee'])
  const [keyInput, setKeyInput] = useState('')
  const [sensitivity, setSensitivity] = useState<'high' | 'medium' | 'low'>('medium')
  const platforms = [
    { id: 'facebook', label: 'Facebook Page', enabled: true },
    { id: 'tiktok', label: 'TikTok', enabled: true },
    { id: 'threads', label: 'Threads', enabled: false },
    { id: 'reddit', label: 'Reddit', enabled: false },
    { id: 'news', label: 'Báo điện tử', enabled: false },
  ]

  // Step 2 state
  const [chatId, setChatId] = useState('')
  const [testSent, setTestSent] = useState(false)
  const [confirmed, setConfirmed] = useState(false)

  const addKeyword = () => {
    const kw = keyInput.trim()
    if (kw && !keywords.includes(kw)) {
      setKeywords([...keywords, kw])
    }
    setKeyInput('')
  }

  const removeKeyword = (kw: string) => {
    setKeywords(keywords.filter((k) => k !== kw))
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') { e.preventDefault(); addKeyword() }
  }

  const handleSendTest = () => {
    setTestSent(true)
  }

  const stepLabels = ['Keywords & Platforms', 'Telegram', 'Kích hoạt']

  return (
    <Layout>
      <div className="p-6 max-w-2xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-xl font-bold text-slate-800">Thiết lập Watch Monitor</h1>
          <p className="text-sm text-slate-500 mt-1">Theo dõi brand liên tục 24/7</p>
        </div>

        {/* Stepper */}
        <div className="flex items-center gap-0 mb-8">
          {stepLabels.map((label, idx) => {
            const stepNum = (idx + 1) as Step
            const done = step > stepNum
            const active = step === stepNum
            return (
              <div key={label} className="flex items-center">
                <div className="flex flex-col items-center">
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold transition-colors ${
                      done
                        ? 'bg-green-500 text-white'
                        : active
                        ? 'bg-brand-500 text-white'
                        : 'bg-slate-200 text-slate-500'
                    }`}
                  >
                    {done ? '✓' : stepNum}
                  </div>
                  <span
                    className={`text-xs mt-1.5 ${
                      active ? 'text-brand-500 font-medium' : done ? 'text-green-600' : 'text-slate-400'
                    }`}
                  >
                    {label}
                  </span>
                </div>
                {idx < stepLabels.length - 1 && (
                  <div
                    className={`w-20 h-0.5 mb-5 mx-1 ${done ? 'bg-green-400' : 'bg-slate-200'}`}
                  />
                )}
              </div>
            )
          })}
        </div>

        {/* STEP 1 */}
        {step === 1 && (
          <div className="bg-white border border-slate-200 rounded-xl p-6">
            <h2 className="text-base font-semibold text-slate-800 mb-5">Keywords & Platforms</h2>

            {/* Keywords */}
            <div className="mb-5">
              <label className="block text-sm font-medium text-slate-700 mb-2">Keywords theo dõi</label>
              <div className="flex flex-wrap gap-2 mb-2">
                {keywords.map((kw) => (
                  <span
                    key={kw}
                    className="inline-flex items-center gap-1.5 bg-brand-50 text-brand-600 text-xs font-medium px-3 py-1.5 rounded-full"
                  >
                    {kw}
                    <button onClick={() => removeKeyword(kw)} className="hover:text-brand-800">
                      <X size={11} />
                    </button>
                  </span>
                ))}
              </div>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={keyInput}
                  onChange={(e) => setKeyInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Thêm keyword... (Enter để thêm)"
                  className="flex-1 border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
                />
                <button
                  onClick={addKeyword}
                  className="bg-brand-500 hover:bg-brand-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                >
                  Thêm
                </button>
              </div>
            </div>

            {/* Platforms */}
            <div className="mb-5">
              <label className="block text-sm font-medium text-slate-700 mb-2">Platforms</label>
              <div className="space-y-2">
                {platforms.map((p) => (
                  <label
                    key={p.id}
                    className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-colors ${
                      p.enabled
                        ? 'border-brand-200 bg-brand-50'
                        : 'border-slate-200 bg-slate-50 opacity-60 cursor-not-allowed'
                    }`}
                  >
                    <input
                      type="checkbox"
                      defaultChecked={p.enabled}
                      disabled={!p.enabled}
                      className="accent-brand-500"
                    />
                    <span className="text-sm text-slate-700">{p.label}</span>
                    {!p.enabled && (
                      <span className="ml-auto text-xs text-slate-400">V2 — sắp ra mắt</span>
                    )}
                  </label>
                ))}
              </div>
            </div>

            {/* Sensitivity */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Độ nhạy Alert
              </label>
              <div className="flex gap-3">
                {(['high', 'medium', 'low'] as const).map((s) => (
                  <label
                    key={s}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg border cursor-pointer text-sm transition-colors ${
                      sensitivity === s
                        ? 'border-brand-500 bg-brand-50 text-brand-600 font-medium'
                        : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    <input
                      type="radio"
                      name="sensitivity"
                      value={s}
                      checked={sensitivity === s}
                      onChange={() => setSensitivity(s)}
                      className="hidden"
                    />
                    {s === 'high' ? 'Cao' : s === 'medium' ? 'Trung bình' : 'Thấp'}
                  </label>
                ))}
              </div>
              <p className="text-xs text-slate-400 mt-2">
                {sensitivity === 'high'
                  ? 'Alert khi volume tăng 1.5x bình thường'
                  : sensitivity === 'medium'
                  ? 'Alert khi volume tăng 3x bình thường (khuyến nghị)'
                  : 'Alert khi volume tăng 5x bình thường'}
              </p>
            </div>

            <button
              onClick={() => setStep(2)}
              className="w-full flex items-center justify-center gap-2 bg-brand-500 hover:bg-brand-600 text-white font-semibold py-3 rounded-xl text-sm transition-colors"
            >
              Tiếp theo: Kết nối Telegram
              <ChevronRight size={16} />
            </button>
          </div>
        )}

        {/* STEP 2 */}
        {step === 2 && (
          <div className="bg-white border border-slate-200 rounded-xl p-6">
            <div className="flex items-center gap-2 mb-5">
              <Bell size={18} className="text-brand-500" />
              <h2 className="text-base font-semibold text-slate-800">Kết nối Telegram</h2>
            </div>

            {/* Instructions */}
            <div className="bg-slate-50 rounded-xl p-4 mb-5">
              <p className="text-sm font-medium text-slate-700 mb-3">Hướng dẫn:</p>
              <ol className="space-y-2">
                {[
                  'Mở Telegram và tìm kiếm @SocialMindBot',
                  'Gửi lệnh /start cho bot',
                  'Bot sẽ reply Chat ID của bạn — copy vào ô bên dưới',
                ].map((step, i) => (
                  <li key={i} className="flex items-start gap-2.5 text-sm text-slate-600">
                    <span className="w-5 h-5 bg-brand-500 text-white rounded-full text-xs font-bold flex items-center justify-center flex-shrink-0 mt-0.5">
                      {i + 1}
                    </span>
                    {step}
                  </li>
                ))}
              </ol>
            </div>

            {/* Chat ID input */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Chat ID</label>
              <input
                type="text"
                value={chatId}
                onChange={(e) => setChatId(e.target.value)}
                placeholder="VD: -100123456789"
                className="w-full border border-slate-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
              />
            </div>

            {/* Test message */}
            <button
              onClick={handleSendTest}
              disabled={!chatId.trim()}
              className="w-full border border-brand-500 text-brand-500 hover:bg-brand-50 disabled:opacity-40 disabled:cursor-not-allowed font-medium py-2.5 rounded-lg text-sm transition-colors mb-4"
            >
              Gửi test message
            </button>

            {testSent && (
              <div className="flex items-center gap-2 bg-green-50 border border-green-200 rounded-lg p-3 mb-4">
                <CheckCircle size={16} className="text-green-500 flex-shrink-0" />
                <p className="text-sm text-green-700">
                  Test message đã được gửi! Kiểm tra Telegram của bạn.
                </p>
              </div>
            )}

            {/* Confirmation checkbox */}
            <label className="flex items-center gap-2.5 mb-5 cursor-pointer">
              <input
                type="checkbox"
                checked={confirmed}
                onChange={(e) => setConfirmed(e.target.checked)}
                className="w-4 h-4 accent-brand-500"
                disabled={!testSent}
              />
              <span className={`text-sm ${testSent ? 'text-slate-700' : 'text-slate-400'}`}>
                Tôi đã nhận được test message
              </span>
            </label>

            <button
              onClick={() => setStep(3)}
              disabled={!confirmed}
              className="w-full flex items-center justify-center gap-2 bg-brand-500 hover:bg-brand-600 disabled:opacity-40 disabled:cursor-not-allowed text-white font-semibold py-3 rounded-xl text-sm transition-colors"
            >
              Kích hoạt Monitor
              <Radio size={15} />
            </button>
          </div>
        )}

        {/* STEP 3 */}
        {step === 3 && (
          <div className="bg-white border border-slate-200 rounded-xl p-8 text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle size={32} className="text-green-500" />
            </div>
            <h2 className="text-xl font-bold text-slate-800 mb-1">Monitor đang hoạt động!</h2>
            <p className="text-sm text-slate-500 mb-6">Chúng tôi sẽ cảnh báo bạn ngay khi có spike</p>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-3 mb-7">
              {[
                { label: 'Scrape mỗi', value: '60 phút' },
                { label: 'Daily briefing', value: '8:00 AM' },
                { label: 'Alert threshold', value: '3x volume' },
              ].map((s) => (
                <div key={s.label} className="bg-slate-50 rounded-xl p-3">
                  <p className="text-sm font-bold text-slate-800">{s.value}</p>
                  <p className="text-xs text-slate-500 mt-0.5">{s.label}</p>
                </div>
              ))}
            </div>

            <button
              onClick={() => navigate('/watch/dashboard')}
              className="inline-flex items-center gap-2 bg-brand-500 hover:bg-brand-600 text-white font-semibold px-6 py-3 rounded-xl text-sm transition-colors"
            >
              <LayoutDashboard size={16} />
              Xem Dashboard
            </button>
          </div>
        )}
      </div>
    </Layout>
  )
}
