import { useNavigate } from 'react-router-dom'
import Layout from '../components/Layout'
import { ArrowLeft } from 'lucide-react'

// This route is handled within WatchSetup step 2, but kept for direct routing
export default function WatchTelegram() {
  const navigate = useNavigate()

  return (
    <Layout>
      <div className="p-6 max-w-xl mx-auto">
        <button
          onClick={() => navigate('/watch/setup')}
          className="flex items-center gap-2 text-sm text-slate-500 hover:text-slate-700 mb-6 transition-colors"
        >
          <ArrowLeft size={14} />
          Quay lại thiết lập
        </button>
        <div className="bg-white border border-slate-200 rounded-xl p-8 text-center">
          <p className="text-slate-600 text-sm">
            Kết nối Telegram được tích hợp trong luồng thiết lập Watch Monitor.
          </p>
          <button
            onClick={() => navigate('/watch/setup')}
            className="mt-4 bg-brand-500 hover:bg-brand-600 text-white font-semibold px-6 py-2.5 rounded-lg text-sm transition-colors"
          >
            Đến thiết lập Watch Monitor
          </button>
        </div>
      </div>
    </Layout>
  )
}
