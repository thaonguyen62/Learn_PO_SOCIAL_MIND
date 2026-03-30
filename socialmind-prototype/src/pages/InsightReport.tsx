import { useState } from 'react'
import Layout from '../components/Layout'
import { wnpData } from '../data/mock'
import { Share2, Printer, ExternalLink } from 'lucide-react'
import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from 'recharts'

type TabKey = 'wants' | 'needs' | 'pains'

const tabs: { key: TabKey; label: string; color: string; bg: string }[] = [
  { key: 'wants', label: 'Wants', color: 'text-brand-500', bg: 'bg-brand-50 border-brand-500' },
  { key: 'needs', label: 'Needs', color: 'text-emerald-600', bg: 'bg-emerald-50 border-emerald-500' },
  { key: 'pains', label: 'Pains', color: 'text-rose-600', bg: 'bg-rose-50 border-rose-500' },
]

const sourceBadgeColor: Record<string, string> = {
  'Facebook Groups': 'bg-blue-100 text-blue-700',
  TikTok: 'bg-slate-100 text-slate-700',
  Threads: 'bg-purple-100 text-purple-700',
  Reddit: 'bg-orange-100 text-orange-700',
  'Báo điện tử': 'bg-green-100 text-green-700',
}

export default function InsightReport() {
  const [activeTab, setActiveTab] = useState<TabKey>('wants')

  const handleExportPDF = () => {
    window.print()
  }

  const insights = wnpData[activeTab]

  return (
    <Layout>
      <div className="p-6 max-w-5xl mx-auto">
        {/* Header */}
        <div className="flex items-start justify-between mb-6">
          <div>
            <h1 className="text-xl font-bold text-slate-800">
              Báo cáo W-N-P — Highlands Coffee
            </h1>
            <div className="flex items-center gap-3 mt-1.5 text-xs text-slate-500">
              <span className="inline-flex items-center gap-1">
                <span className="w-1.5 h-1.5 bg-green-500 rounded-full" />
                247 posts
              </span>
              <span>5 platforms</span>
              <span>Tháng 3/2026</span>
            </div>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => {}}
              className="flex items-center gap-2 border border-slate-300 text-slate-600 hover:bg-slate-50 px-3 py-2 rounded-lg text-sm transition-colors"
            >
              <Share2 size={14} />
              Chia sẻ
            </button>
            <button
              onClick={handleExportPDF}
              className="flex items-center gap-2 bg-brand-500 hover:bg-brand-600 text-white px-3 py-2 rounded-lg text-sm font-medium transition-colors"
            >
              <Printer size={14} />
              Export PDF
            </button>
          </div>
        </div>

        {/* Charts row */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          {/* Donut chart */}
          <div className="bg-white border border-slate-200 rounded-xl p-5">
            <h3 className="text-sm font-semibold text-slate-700 mb-4">Phân bổ W-N-P</h3>
            <div className="flex items-center gap-4">
              <ResponsiveContainer width={160} height={160}>
                <PieChart>
                  <Pie
                    data={wnpData.distribution}
                    cx="50%"
                    cy="50%"
                    innerRadius={45}
                    outerRadius={70}
                    paddingAngle={3}
                    dataKey="value"
                  >
                    {wnpData.distribution.map((entry, index) => (
                      <Cell key={index} fill={entry.color} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
              <div className="space-y-3">
                {wnpData.distribution.map((d) => (
                  <div key={d.name} className="flex items-center gap-2">
                    <div
                      className="w-3 h-3 rounded-full flex-shrink-0"
                      style={{ backgroundColor: d.color }}
                    />
                    <span className="text-sm text-slate-700 font-medium w-14">{d.name}</span>
                    <span className="text-lg font-bold" style={{ color: d.color }}>
                      {d.value}%
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Bar chart */}
          <div className="bg-white border border-slate-200 rounded-xl p-5">
            <h3 className="text-sm font-semibold text-slate-700 mb-4">Volume theo Platform</h3>
            <ResponsiveContainer width="100%" height={140}>
              <BarChart data={wnpData.platformVolume} barSize={22}>
                <XAxis
                  dataKey="platform"
                  tick={{ fontSize: 11, fill: '#64748b' }}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis hide />
                <Tooltip
                  contentStyle={{ fontSize: 12, borderRadius: 8, border: '1px solid #e2e8f0' }}
                />
                <Bar dataKey="posts" fill="#4f6ef7" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white border border-slate-200 rounded-xl overflow-hidden">
          <div className="flex border-b border-slate-200">
            {tabs.map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`flex-1 py-3 text-sm font-semibold transition-colors border-b-2 ${
                  activeTab === tab.key
                    ? `${tab.color} border-current bg-slate-50`
                    : 'text-slate-500 border-transparent hover:text-slate-700 hover:bg-slate-50'
                }`}
              >
                {tab.label}
                <span className="ml-2 text-xs font-normal opacity-60">
                  {wnpData[tab.key].length} insights
                </span>
              </button>
            ))}
          </div>

          {/* Insight cards */}
          <div className="p-5 space-y-4">
            {insights.map((insight, idx) => (
              <div
                key={idx}
                className="border border-slate-200 rounded-xl p-4 hover:border-slate-300 transition-colors"
              >
                <div className="flex items-start justify-between gap-4 mb-3">
                  <div className="flex items-start gap-3">
                    <span className="text-xs font-bold text-slate-400 mt-0.5 w-5 flex-shrink-0">
                      #{idx + 1}
                    </span>
                    <p className="text-sm font-semibold text-slate-800">{insight.title}</p>
                  </div>
                  <span
                    className={`text-xs font-semibold px-2.5 py-1 rounded-full flex-shrink-0 ${
                      activeTab === 'wants'
                        ? 'bg-brand-50 text-brand-500'
                        : activeTab === 'needs'
                        ? 'bg-emerald-50 text-emerald-600'
                        : 'bg-rose-50 text-rose-600'
                    }`}
                  >
                    {insight.mentions} mentions
                  </span>
                </div>

                {/* Quotes */}
                <div className="ml-8 space-y-2">
                  {insight.quotes.map((quote, qi) => (
                    <div key={qi} className="flex items-start gap-2">
                      <span className="text-slate-300 text-lg leading-none flex-shrink-0 -mt-0.5">"</span>
                      <div className="flex-1">
                        <p className="text-xs text-slate-600 italic leading-relaxed">
                          {quote.text}
                        </p>
                        <span
                          className={`inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-full mt-1 ${
                            sourceBadgeColor[quote.source] || 'bg-slate-100 text-slate-600'
                          }`}
                        >
                          <ExternalLink size={9} />
                          {quote.source}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Layout>
  )
}
