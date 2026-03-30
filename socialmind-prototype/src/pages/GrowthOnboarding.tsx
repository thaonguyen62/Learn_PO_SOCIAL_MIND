import { useNavigate } from 'react-router-dom'
import { Brain, Search, Eye, Star } from 'lucide-react'

export default function GrowthOnboarding() {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen bg-slate-100 flex items-center justify-center p-4">
      <div className="w-full max-w-xl">
        {/* Logo */}
        <div className="flex flex-col items-center mb-8">
          <div className="w-12 h-12 bg-brand-500 rounded-xl flex items-center justify-center mb-3 shadow-lg">
            <Brain size={26} className="text-white" />
          </div>
          <div className="flex items-center gap-1.5">
            <span className="text-xl font-bold text-slate-900">SocialMind</span>
            <span className="inline-flex items-center gap-1 text-xs bg-yellow-100 text-yellow-700 px-2 py-0.5 rounded-full font-medium">
              <Star size={10} className="fill-yellow-500 text-yellow-500" />
              Growth
            </span>
          </div>
        </div>

        {/* Card */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8">
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold text-slate-900 mb-2">
              Bạn muốn làm gì hôm nay?
            </h1>
            <p className="text-slate-500 text-sm">
              Chọn một use-case để bắt đầu nhanh hơn
            </p>
          </div>

          {/* Choice cards */}
          <div className="grid grid-cols-2 gap-4 mb-6">
            {/* Option 1 */}
            <button
              onClick={() => navigate('/insight/chat')}
              className="group flex flex-col items-center text-center p-6 rounded-xl border-2 border-slate-200 hover:border-brand-500 hover:bg-brand-50 transition-all"
            >
              <div className="w-14 h-14 bg-brand-50 group-hover:bg-brand-100 rounded-2xl flex items-center justify-center mb-4 transition-colors">
                <Search size={28} className="text-brand-500" />
              </div>
              <h3 className="text-sm font-semibold text-slate-800 mb-1">
                Phân tích thị trường
              </h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Khám phá Wants, Needs, Pains từ social media ngay bây giờ
              </p>
            </button>

            {/* Option 2 */}
            <button
              onClick={() => navigate('/watch/setup')}
              className="group flex flex-col items-center text-center p-6 rounded-xl border-2 border-slate-200 hover:border-brand-500 hover:bg-brand-50 transition-all"
            >
              <div className="w-14 h-14 bg-brand-50 group-hover:bg-brand-100 rounded-2xl flex items-center justify-center mb-4 transition-colors">
                <Eye size={28} className="text-brand-500" />
              </div>
              <h3 className="text-sm font-semibold text-slate-800 mb-1">
                Theo dõi brand liên tục
              </h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Nhận alert tức thì khi có spike về brand/competitor
              </p>
            </button>
          </div>

          <p className="text-center text-xs text-slate-400">
            Bạn có thể đổi bất kỳ lúc nào từ sidebar
          </p>
        </div>
      </div>
    </div>
  )
}
