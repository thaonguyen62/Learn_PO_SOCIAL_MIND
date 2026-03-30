import Layout from '../components/Layout'
import { usageStats } from '../data/mock'
import { Star, Bell, Monitor, CreditCard, Zap, ArrowUpRight } from 'lucide-react'

interface MeterProps {
  label: string
  used: number | string
  limit: number | string
  unit?: string
  percentage: number
  icon: React.ReactNode
}

function UsageMeter({ label, used, limit, unit = '', percentage, icon }: MeterProps) {
  const color =
    percentage >= 80
      ? 'bg-rose-500'
      : percentage >= 60
      ? 'bg-yellow-400'
      : 'bg-green-500'

  const textColor =
    percentage >= 80 ? 'text-rose-600' : percentage >= 60 ? 'text-yellow-600' : 'text-green-600'

  return (
    <div className="bg-white border border-slate-200 rounded-xl p-5">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 bg-slate-100 rounded-lg flex items-center justify-center">
            {icon}
          </div>
          <span className="text-sm font-medium text-slate-700">{label}</span>
        </div>
        <span className={`text-sm font-bold ${textColor}`}>{percentage}%</span>
      </div>

      {/* Bar */}
      <div className="h-2 bg-slate-100 rounded-full overflow-hidden mb-2">
        <div
          className={`h-full rounded-full transition-all duration-500 ${color}`}
          style={{ width: `${Math.min(100, percentage)}%` }}
        />
      </div>

      <div className="flex items-center justify-between">
        <span className="text-xs text-slate-500">
          {used}{unit} đã dùng
        </span>
        <span className="text-xs text-slate-400">
          / {limit === 'unlimited' ? 'Không giới hạn' : `${limit}${unit}`}
        </span>
      </div>
    </div>
  )
}

export default function UsageDashboard() {
  const tokenPct = Math.round((usageStats.claudeTokens.used / usageStats.claudeTokens.limit) * 100)
  const creditPct = Math.round((usageStats.apifyCredits.used / usageStats.apifyCredits.limit) * 100)

  return (
    <Layout>
      <div className="p-6 max-w-3xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-xl font-bold text-slate-800">Sử dụng & Billing</h1>
          <p className="text-sm text-slate-500 mt-1">Theo dõi quota và chi phí</p>
        </div>

        {/* Plan card */}
        <div className="bg-gradient-to-br from-brand-500 to-brand-700 rounded-2xl p-6 mb-6 text-white">
          <div className="flex items-start justify-between mb-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <Star size={18} className="fill-yellow-300 text-yellow-300" />
                <span className="text-lg font-bold">Growth Plan</span>
              </div>
              <p className="text-brand-100 text-sm">Chu kỳ: {usageStats.billingPeriod}</p>
            </div>
            <div className="text-right">
              <p className="text-2xl font-bold">$59</p>
              <p className="text-brand-200 text-xs">/tháng</p>
            </div>
          </div>
          <div className="flex items-center gap-2 pt-4 border-t border-white/20">
            <CreditCard size={14} className="text-brand-200" />
            <span className="text-sm text-brand-100">Thanh toán tự động vào 01/04/2026</span>
          </div>
        </div>

        {/* Usage meters */}
        <div className="space-y-4 mb-6">
          {/* Scans — unlimited */}
          <div className="bg-white border border-slate-200 rounded-xl p-5">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 bg-slate-100 rounded-lg flex items-center justify-center">
                  <Zap size={14} className="text-brand-500" />
                </div>
                <span className="text-sm font-medium text-slate-700">Insight Scans</span>
              </div>
              <span className="text-xs font-semibold text-green-600 bg-green-50 px-2.5 py-1 rounded-full">
                Unlimited
              </span>
            </div>
            <div className="h-2 bg-green-100 rounded-full overflow-hidden mb-2">
              <div className="h-full w-full bg-green-400 rounded-full" />
            </div>
            <p className="text-xs text-slate-500">{usageStats.scans.used} scans đã dùng tháng này</p>
          </div>

          {/* Claude Tokens */}
          <UsageMeter
            label="Claude AI Tokens"
            used={usageStats.claudeTokens.used.toLocaleString()}
            limit={usageStats.claudeTokens.limit.toLocaleString()}
            percentage={tokenPct}
            icon={<span className="text-xs font-bold text-slate-600">AI</span>}
          />

          {/* Apify Credits */}
          <UsageMeter
            label="Apify Scraping Credits"
            used={`$${usageStats.apifyCredits.used.toFixed(2)}`}
            limit={`$${usageStats.apifyCredits.limit.toFixed(2)}`}
            percentage={creditPct}
            icon={<span className="text-xs font-bold text-slate-600">⚡</span>}
          />
        </div>

        {/* Watch monitors */}
        <div className="bg-white border border-slate-200 rounded-xl p-5 mb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Monitor size={16} className="text-slate-600" />
              <span className="text-sm font-medium text-slate-700">Watch Monitors</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-500 rounded-full" />
              <span className="text-sm font-semibold text-slate-800">
                {usageStats.watchMonitors.active} / {usageStats.watchMonitors.limit}
              </span>
            </div>
          </div>
          <div className="mt-3 h-2 bg-slate-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-green-500 rounded-full"
              style={{
                width: `${(usageStats.watchMonitors.active / usageStats.watchMonitors.limit) * 100}%`,
              }}
            />
          </div>
          <p className="text-xs text-slate-500 mt-2">
            {usageStats.watchMonitors.active} monitor đang hoạt động
          </p>
        </div>

        {/* Alert settings */}
        <div className="bg-white border border-slate-200 rounded-xl p-5 mb-6">
          <div className="flex items-center gap-2 mb-3">
            <Bell size={16} className="text-slate-600" />
            <span className="text-sm font-semibold text-slate-800">Cài đặt Cảnh báo</span>
          </div>
          <label className="flex items-center gap-3 cursor-pointer">
            <div className="relative">
              <input type="checkbox" defaultChecked className="sr-only" />
              <div className="w-10 h-5 bg-brand-500 rounded-full" />
              <div className="absolute top-0.5 left-5 w-4 h-4 bg-white rounded-full shadow" />
            </div>
            <span className="text-sm text-slate-700">
              Gửi Telegram alert khi sử dụng đạt{' '}
              <span className="font-semibold text-slate-800">80% quota</span>
            </span>
          </label>
        </div>

        {/* Upgrade card */}
        <div className="border-2 border-dashed border-brand-200 rounded-xl p-5 flex items-center justify-between bg-brand-50">
          <div>
            <p className="text-sm font-semibold text-slate-800">Cần thêm monitors?</p>
            <p className="text-xs text-slate-500 mt-0.5">
              Gói Pro: 5 monitors + unlimited tokens
            </p>
          </div>
          <button className="flex items-center gap-1.5 bg-brand-500 hover:bg-brand-600 text-white text-sm font-semibold px-4 py-2 rounded-lg transition-colors">
            Upgrade Pro
            <ArrowUpRight size={14} />
          </button>
        </div>
      </div>
    </Layout>
  )
}
