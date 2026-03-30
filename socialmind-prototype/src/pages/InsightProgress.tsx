import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import Layout from '../components/Layout'
import { CheckCircle, Loader2, X, Sparkles } from 'lucide-react'

interface Platform {
  name: string
  icon: string
  color: string
}

const platforms: Platform[] = [
  { name: 'Facebook Groups', icon: 'f', color: '#1877F2' },
  { name: 'TikTok', icon: 'T', color: '#000000' },
  { name: 'Threads', icon: '@', color: '#000000' },
  { name: 'Reddit', icon: 'R', color: '#FF4500' },
  { name: 'Báo điện tử', icon: 'N', color: '#059669' },
]

const targetPosts = [98, 67, 34, 28, 20]

export default function InsightProgress() {
  const navigate = useNavigate()
  const [progress, setProgress] = useState<number[]>([0, 0, 0, 0, 0])
  const [postCounts, setPostCounts] = useState<number[]>([0, 0, 0, 0, 0])
  const [phase, setPhase] = useState<'scraping' | 'analyzing' | 'done'>('scraping')
  const [eta, setEta] = useState(120)

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => {
        const next = prev.map((p, i) => {
          const speed = [3.5, 2.8, 1.5, 1.2, 0.9][i]
          return Math.min(100, p + speed + Math.random() * 2)
        })
        return next
      })
      setPostCounts((prev) =>
        prev.map((c, i) => Math.min(targetPosts[i], c + Math.floor(Math.random() * 3 + 1)))
      )
      setEta((prev) => Math.max(0, prev - 2))
    }, 200)

    const analyzeTimer = setTimeout(() => {
      setProgress([100, 100, 100, 100, 100])
      setPostCounts(targetPosts)
      setEta(0)
      setPhase('analyzing')
    }, 3000)

    const doneTimer = setTimeout(() => {
      setPhase('done')
      navigate('/insight/report')
    }, 5500)

    return () => {
      clearInterval(interval)
      clearTimeout(analyzeTimer)
      clearTimeout(doneTimer)
    }
  }, [navigate])

  const totalPosts = postCounts.reduce((a, b) => a + b, 0)
  const formatEta = (seconds: number) => {
    if (seconds <= 0) return 'Sắp xong...'
    const m = Math.floor(seconds / 60)
    const s = seconds % 60
    return m > 0 ? `Khoảng ${m} phút ${s} giây còn lại` : `Khoảng ${s} giây còn lại`
  }

  return (
    <Layout>
      <div className="p-6 max-w-2xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-xl font-bold text-slate-800">
            {phase === 'analyzing'
              ? 'Đang phân tích với AI...'
              : 'Đang thu thập data từ 5 platforms...'}
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Brand: <span className="font-medium text-slate-700">Highlands Coffee</span>
          </p>
        </div>

        {/* Stats row */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="bg-white border border-slate-200 rounded-xl p-4">
            <p className="text-2xl font-bold text-slate-800">{totalPosts}</p>
            <p className="text-xs text-slate-500 mt-0.5">posts đã thu thập</p>
          </div>
          <div className="bg-white border border-slate-200 rounded-xl p-4">
            <p className="text-sm font-medium text-slate-700">{formatEta(eta)}</p>
            <div className="mt-2 h-1.5 bg-slate-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-brand-500 rounded-full transition-all duration-300"
                style={{ width: `${Math.min(100, (120 - eta) / 1.2)}%` }}
              />
            </div>
          </div>
        </div>

        {/* Platforms */}
        <div className="bg-white border border-slate-200 rounded-xl overflow-hidden mb-6">
          {platforms.map((platform, i) => {
            const pct = Math.round(progress[i])
            const done = pct >= 100
            return (
              <div key={platform.name} className={`flex items-center gap-4 px-5 py-4 ${i < platforms.length - 1 ? 'border-b border-slate-100' : ''}`}>
                {/* Icon */}
                <div
                  className="w-9 h-9 rounded-lg flex items-center justify-center text-white text-sm font-bold flex-shrink-0"
                  style={{ backgroundColor: platform.color }}
                >
                  {platform.icon}
                </div>

                {/* Name + bar */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-sm font-medium text-slate-700">{platform.name}</span>
                    <span className="text-xs text-slate-500">
                      {done
                        ? `${targetPosts[i]} posts`
                        : postCounts[i] > 0
                        ? `${postCounts[i]} posts`
                        : '—'}
                    </span>
                  </div>
                  <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-300"
                      style={{
                        width: `${pct}%`,
                        backgroundColor: done ? '#10b981' : platform.color,
                      }}
                    />
                  </div>
                </div>

                {/* Status */}
                <div className="flex-shrink-0 w-24 text-right">
                  {done ? (
                    <span className="inline-flex items-center gap-1 text-xs text-green-600 font-medium">
                      <CheckCircle size={12} />
                      Hoàn thành
                    </span>
                  ) : pct > 0 ? (
                    <span className="inline-flex items-center gap-1 text-xs text-brand-500 font-medium">
                      <Loader2 size={12} className="animate-spin" />
                      Đang scrape
                    </span>
                  ) : (
                    <span className="text-xs text-slate-400">Chờ...</span>
                  )}
                </div>
              </div>
            )
          })}
        </div>

        {/* AI analyzing overlay */}
        {phase === 'analyzing' && (
          <div className="bg-brand-50 border border-brand-100 rounded-xl p-5 mb-6 flex items-center gap-4">
            <div className="w-10 h-10 bg-brand-500 rounded-xl flex items-center justify-center flex-shrink-0">
              <Sparkles size={20} className="text-white animate-pulse" />
            </div>
            <div>
              <p className="text-sm font-semibold text-slate-800">Claude AI đang phân tích...</p>
              <p className="text-xs text-slate-500 mt-0.5">
                Phân loại {totalPosts} posts theo framework W-N-P · Trích xuất insights
              </p>
            </div>
            <Loader2 size={20} className="text-brand-500 animate-spin ml-auto flex-shrink-0" />
          </div>
        )}

        {/* Cancel button */}
        {phase === 'scraping' && (
          <button
            onClick={() => navigate('/insight/chat')}
            className="flex items-center gap-2 text-sm text-slate-500 hover:text-slate-700 transition-colors"
          >
            <X size={14} />
            Hủy và quay lại
          </button>
        )}
      </div>
    </Layout>
  )
}
