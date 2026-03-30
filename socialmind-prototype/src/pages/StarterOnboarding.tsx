import { useNavigate } from 'react-router-dom'
import { Brain, CheckCircle, ArrowRight, Database, Sparkles } from 'lucide-react'

const steps = [
  {
    number: 1,
    icon: <Brain size={20} className="text-brand-500" />,
    title: 'Khai báo brand',
    description: 'Cho chúng tôi biết brand/category bạn muốn nghiên cứu',
  },
  {
    number: 2,
    icon: <Database size={20} className="text-brand-500" />,
    title: 'Thu thập data',
    description: 'AI tự động scrape từ Facebook, TikTok, Threads, Reddit và báo điện tử',
  },
  {
    number: 3,
    icon: <Sparkles size={20} className="text-brand-500" />,
    title: 'Nhận report',
    description: 'Báo cáo W-N-P (Wants, Needs, Pains) với insights từ khách hàng thực',
  },
]

export default function StarterOnboarding() {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen bg-slate-100 flex items-center justify-center p-4">
      <div className="w-full max-w-lg">
        {/* Logo */}
        <div className="flex flex-col items-center mb-8">
          <div className="w-12 h-12 bg-brand-500 rounded-xl flex items-center justify-center mb-3 shadow-lg">
            <Brain size={26} className="text-white" />
          </div>
          <span className="text-xl font-bold text-slate-900">SocialMind</span>
        </div>

        {/* Card */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8">
          {/* Plan badge */}
          <div className="flex justify-center mb-5">
            <span className="inline-flex items-center gap-1.5 bg-slate-100 text-slate-600 text-xs font-medium px-3 py-1 rounded-full">
              <CheckCircle size={12} className="text-green-500" />
              Gói Starter — miễn phí
            </span>
          </div>

          {/* Heading */}
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold text-slate-900 mb-2">
              Chào mừng đến SocialMind!
            </h1>
            <p className="text-slate-500 text-sm leading-relaxed">
              Chỉ 3 bước đơn giản để có ngay báo cáo social listening đầu tiên của bạn.
            </p>
          </div>

          {/* Steps */}
          <div className="space-y-4 mb-8">
            {steps.map((step, index) => (
              <div key={step.number} className="flex items-start gap-4">
                {/* Step connector */}
                <div className="flex flex-col items-center">
                  <div className="w-9 h-9 rounded-full bg-brand-50 border-2 border-brand-500 flex items-center justify-center flex-shrink-0">
                    {step.icon}
                  </div>
                  {index < steps.length - 1 && (
                    <div className="w-0.5 h-6 bg-slate-200 mt-1" />
                  )}
                </div>
                {/* Content */}
                <div className="pt-1.5">
                  <p className="text-sm font-semibold text-slate-800">{step.title}</p>
                  <p className="text-xs text-slate-500 mt-0.5 leading-relaxed">{step.description}</p>
                </div>
              </div>
            ))}
          </div>

          {/* CTA */}
          <button
            onClick={() => navigate('/insight/chat')}
            className="w-full flex items-center justify-center gap-2 bg-brand-500 hover:bg-brand-600 text-white font-semibold py-3 rounded-xl text-sm transition-colors"
          >
            Bắt đầu phân tích đầu tiên
            <ArrowRight size={16} />
          </button>

          <p className="text-center text-xs text-slate-400 mt-4">
            Gói Starter: 3 scans/tháng · Không cần thẻ tín dụng
          </p>
        </div>
      </div>
    </div>
  )
}
