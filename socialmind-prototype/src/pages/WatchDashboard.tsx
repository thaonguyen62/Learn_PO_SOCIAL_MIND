import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Layout from '../components/Layout'
import { watchAlerts } from '../data/mock'
import {
  Pause,
  AlertTriangle,
  TrendingUp,
  Clock,
  BarChart2,
  MessageSquare,
  Zap,
  X,
  ArrowRight,
} from 'lucide-react'

export default function WatchDashboard() {
  const navigate = useNavigate()
  const [showModal, setShowModal] = useState(false)
  const [selectedAlert, setSelectedAlert] = useState<(typeof watchAlerts)[0] | null>(null)
  const [isPaused, setIsPaused] = useState(false)

  const openDeepDive = (alert: (typeof watchAlerts)[0]) => {
    setSelectedAlert(alert)
    setShowModal(true)
  }

  const stats = [
    {
      label: 'Mentions hôm nay',
      value: '47',
      icon: <MessageSquare size={18} className="text-brand-500" />,
      bg: 'bg-brand-50',
    },
    {
      label: 'Sentiment hôm nay',
      value: '58% Pos',
      sub: '24% Neu · 18% Neg',
      icon: <TrendingUp size={18} className="text-green-500" />,
      bg: 'bg-green-50',
    },
    {
      label: 'Alerts tuần này',
      value: '2',
      icon: <Zap size={18} className="text-yellow-500" />,
      bg: 'bg-yellow-50',
    },
    {
      label: 'Last scrape',
      value: '5 phút trước',
      icon: <Clock size={18} className="text-slate-500" />,
      bg: 'bg-slate-50',
    },
  ]

  return (
    <Layout>
      <div className="p-6 max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
              <h1 className="text-xl font-bold text-slate-800">Monitor: Highlands Coffee</h1>
              {isPaused && (
                <span className="text-xs bg-yellow-100 text-yellow-700 px-2 py-0.5 rounded-full font-medium">
                  Paused
                </span>
              )}
            </div>
            <p className="text-sm text-slate-500">
              Active since: 25/03/2026 · Scrapes every 60 min
            </p>
          </div>
          <button
            onClick={() => setIsPaused(!isPaused)}
            className={`flex items-center gap-2 border px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              isPaused
                ? 'border-green-300 text-green-600 hover:bg-green-50'
                : 'border-slate-300 text-slate-600 hover:bg-slate-50'
            }`}
          >
            <Pause size={14} />
            {isPaused ? 'Resume' : 'Pause Monitor'}
          </button>
        </div>

        {/* Stats row */}
        <div className="grid grid-cols-4 gap-4 mb-6">
          {stats.map((s) => (
            <div key={s.label} className="bg-white border border-slate-200 rounded-xl p-4">
              <div className={`w-8 h-8 rounded-lg ${s.bg} flex items-center justify-center mb-3`}>
                {s.icon}
              </div>
              <p className="text-xl font-bold text-slate-800">{s.value}</p>
              {s.sub && <p className="text-xs text-slate-500 mt-0.5">{s.sub}</p>}
              <p className="text-xs text-slate-500 mt-0.5">{s.label}</p>
            </div>
          ))}
        </div>

        {/* Alert History */}
        <div className="bg-white border border-slate-200 rounded-xl mb-6 overflow-hidden">
          <div className="px-5 py-4 border-b border-slate-100 flex items-center gap-2">
            <AlertTriangle size={16} className="text-slate-600" />
            <h2 className="text-sm font-semibold text-slate-800">Alert History</h2>
          </div>
          <div className="divide-y divide-slate-100">
            {watchAlerts.map((alert) => (
              <div key={alert.id} className="flex items-center gap-4 px-5 py-4">
                {/* Severity icon */}
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                    alert.severity === 'critical'
                      ? 'bg-red-100 text-red-500'
                      : 'bg-yellow-100 text-yellow-500'
                  }`}
                >
                  {alert.severity === 'critical' ? '🚨' : '⚠️'}
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-xs text-slate-500">
                      {alert.date} {alert.time}
                    </span>
                    <span
                      className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
                        alert.severity === 'critical'
                          ? 'bg-red-50 text-red-600'
                          : 'bg-yellow-50 text-yellow-600'
                      }`}
                    >
                      {alert.severity === 'critical' ? 'Spike phát hiện' : 'Spike nhẹ'}:{' '}
                      {alert.spikeRatio}x volume
                    </span>
                  </div>
                  <p className="text-sm text-slate-700 mt-1">
                    Top issue: <span className="font-medium">"{alert.topIssue}"</span>
                  </p>
                </div>

                {/* Deep dive button */}
                <button
                  onClick={() => openDeepDive(alert)}
                  className="flex items-center gap-1 text-xs text-brand-500 font-medium hover:text-brand-600 flex-shrink-0"
                >
                  Deep Dive
                  <ArrowRight size={12} />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Daily Briefing */}
        <div className="bg-white border border-slate-200 rounded-xl p-5">
          <div className="flex items-center gap-2 mb-4">
            <BarChart2 size={16} className="text-brand-500" />
            <h2 className="text-sm font-semibold text-slate-800">Briefing hôm nay · 08:00</h2>
            <span className="ml-auto text-xs text-green-600 bg-green-50 px-2 py-0.5 rounded-full">
              Mới nhất
            </span>
          </div>

          <div className="grid grid-cols-3 gap-3 mb-4">
            {[
              { label: 'Mentions', value: '47' },
              { label: 'Positive', value: '58%' },
              { label: 'Trend', value: '↑ +12%' },
            ].map((s) => (
              <div key={s.label} className="bg-slate-50 rounded-lg p-3 text-center">
                <p className="text-lg font-bold text-slate-800">{s.value}</p>
                <p className="text-xs text-slate-500">{s.label}</p>
              </div>
            ))}
          </div>

          <div className="space-y-2">
            <div className="flex items-start gap-2">
              <span className="text-slate-400 text-xs mt-0.5 flex-shrink-0">Top post</span>
              <p className="text-xs text-slate-700 leading-relaxed">
                "Highlands Nguyễn Huệ vừa refurb xong, không gian mới đẹp hơn hẳn..."
              </p>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-slate-400 text-xs mt-0.5 flex-shrink-0">Notable</span>
              <p className="text-xs text-slate-700 leading-relaxed">
                Trend tăng mentions về workspace quality (+23% so tuần trước)
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Deep Dive Modal */}
      {showModal && selectedAlert && (
        <div
          className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4"
          onClick={() => setShowModal(false)}
        >
          <div
            className="bg-white rounded-2xl p-6 max-w-md w-full shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-base font-bold text-slate-800">Khởi chạy Insight Analysis?</h3>
              <button
                onClick={() => setShowModal(false)}
                className="text-slate-400 hover:text-slate-600"
              >
                <X size={18} />
              </button>
            </div>

            <p className="text-sm text-slate-600 mb-4">
              Context phân tích đã được điền sẵn từ alert:
            </p>

            <div className="bg-slate-50 rounded-xl p-4 mb-5 space-y-2">
              <div className="flex gap-3">
                <span className="text-xs text-slate-400 w-28 flex-shrink-0">Brand</span>
                <span className="text-xs font-medium text-slate-700">Highlands Coffee</span>
              </div>
              <div className="flex gap-3">
                <span className="text-xs text-slate-400 w-28 flex-shrink-0">Trigger</span>
                <span className="text-xs font-medium text-slate-700">
                  Spike {selectedAlert.spikeRatio}x volume
                </span>
              </div>
              <div className="flex gap-3">
                <span className="text-xs text-slate-400 w-28 flex-shrink-0">Top Issue</span>
                <span className="text-xs font-medium text-slate-700">"{selectedAlert.topIssue}"</span>
              </div>
              <div className="flex gap-3">
                <span className="text-xs text-slate-400 w-28 flex-shrink-0">Ngày phát hiện</span>
                <span className="text-xs font-medium text-slate-700">
                  {selectedAlert.date} {selectedAlert.time}
                </span>
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setShowModal(false)}
                className="flex-1 border border-slate-300 text-slate-600 py-2.5 rounded-lg text-sm font-medium hover:bg-slate-50 transition-colors"
              >
                Hủy
              </button>
              <button
                onClick={() => { setShowModal(false); navigate('/insight/progress') }}
                className="flex-1 flex items-center justify-center gap-2 bg-brand-500 hover:bg-brand-600 text-white py-2.5 rounded-lg text-sm font-semibold transition-colors"
              >
                Xác nhận
                <ArrowRight size={14} />
              </button>
            </div>
          </div>
        </div>
      )}
    </Layout>
  )
}
