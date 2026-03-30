import { useState, useRef } from 'react'
import Layout from '../components/Layout'
import {
  Upload,
  AlertTriangle,
  CheckCircle,
  Loader2,
  Printer,
  Mail,
  Copy,
} from 'lucide-react'

type Stage = 'idle' | 'processing' | 'done'

export default function InsightUpload() {
  const [stage, setStage] = useState<Stage>('idle')
  const [dragOver, setDragOver] = useState(false)
  const [fileName, setFileName] = useState('')
  const [copied, setCopied] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFile = (file: File) => {
    setFileName(file.name)
    setStage('processing')
    setTimeout(() => setStage('done'), 2500)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setDragOver(false)
    const file = e.dataTransfer.files[0]
    if (file) handleFile(file)
  }

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) handleFile(file)
  }

  const handleCopyEmail = () => {
    navigator.clipboard.writeText('feedback@socialmind.app').catch(() => {})
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <Layout>
      <div className="p-6 max-w-2xl mx-auto">
        <div className="mb-6">
          <h1 className="text-xl font-bold text-slate-800">Upload File Feedback</h1>
          <p className="text-sm text-slate-500 mt-1">
            Phân tích file Excel/CSV chứa feedback khách hàng
          </p>
        </div>

        {/* Privacy warning */}
        <div className="flex items-start gap-3 bg-yellow-50 border border-yellow-200 rounded-xl p-4 mb-6">
          <AlertTriangle size={16} className="text-yellow-600 flex-shrink-0 mt-0.5" />
          <p className="text-sm text-yellow-700 leading-relaxed">
            <span className="font-semibold">Lưu ý bảo mật: </span>
            Không upload file chứa dữ liệu cá nhân (tên, email, số điện thoại khách hàng). Chỉ upload
            nội dung feedback thuần túy.
          </p>
        </div>

        {stage === 'idle' && (
          <>
            {/* Email option */}
            <div className="bg-white border border-slate-200 rounded-xl p-5 mb-4">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-7 h-7 bg-brand-50 rounded-lg flex items-center justify-center">
                  <Mail size={14} className="text-brand-500" />
                </div>
                <p className="text-sm font-semibold text-slate-800">Gửi qua Email</p>
              </div>
              <p className="text-sm text-slate-600 mb-3 leading-relaxed">
                Đính kèm file Excel/CSV và gửi đến địa chỉ email bên dưới. Chúng tôi sẽ xử lý và
                gửi kết quả qua Telegram trong vòng 10 phút.
              </p>
              <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-lg px-3 py-2">
                <code className="text-sm text-slate-700 flex-1">feedback@socialmind.app</code>
                <button
                  onClick={handleCopyEmail}
                  className="flex items-center gap-1.5 text-xs text-brand-500 hover:text-brand-600 font-medium"
                >
                  <Copy size={12} />
                  {copied ? 'Đã copy!' : 'Copy'}
                </button>
              </div>
            </div>

            {/* Divider */}
            <div className="flex items-center gap-3 mb-4">
              <div className="flex-1 h-px bg-slate-200" />
              <span className="text-xs text-slate-400">hoặc upload trực tiếp</span>
              <div className="flex-1 h-px bg-slate-200" />
            </div>

            {/* Drop zone */}
            <div
              onDragOver={(e) => { e.preventDefault(); setDragOver(true) }}
              onDragLeave={() => setDragOver(false)}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              className={`border-2 border-dashed rounded-xl p-10 text-center cursor-pointer transition-colors ${
                dragOver
                  ? 'border-brand-500 bg-brand-50'
                  : 'border-slate-300 bg-white hover:border-brand-400 hover:bg-slate-50'
              }`}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept=".xlsx,.csv,.xls"
                className="hidden"
                onChange={handleFileInput}
              />
              <Upload
                size={32}
                className={`mx-auto mb-3 ${dragOver ? 'text-brand-500' : 'text-slate-400'}`}
              />
              <p className="text-sm font-medium text-slate-700 mb-1">
                Kéo thả file vào đây
              </p>
              <p className="text-xs text-slate-500">Hỗ trợ .xlsx, .csv · Tối đa 10MB</p>
            </div>
          </>
        )}

        {/* Processing */}
        {stage === 'processing' && (
          <div className="bg-white border border-slate-200 rounded-xl p-8 text-center">
            <Loader2 size={36} className="text-brand-500 animate-spin mx-auto mb-4" />
            <p className="text-base font-semibold text-slate-800 mb-1">Đang xử lý file...</p>
            <p className="text-sm text-slate-500">{fileName || 'feedback.xlsx'}</p>
            <div className="mt-5 h-1.5 bg-slate-100 rounded-full overflow-hidden">
              <div className="h-full bg-brand-500 rounded-full animate-pulse w-3/4" />
            </div>
          </div>
        )}

        {/* Done / Results */}
        {stage === 'done' && (
          <div className="space-y-4">
            {/* Success header */}
            <div className="flex items-center gap-3 bg-green-50 border border-green-200 rounded-xl p-4">
              <CheckCircle size={20} className="text-green-500 flex-shrink-0" />
              <div>
                <p className="text-sm font-semibold text-green-800">Xử lý hoàn tất!</p>
                <p className="text-xs text-green-600 mt-0.5">
                  {fileName || 'feedback.xlsx'} · 312 rows đã xử lý
                </p>
              </div>
            </div>

            {/* Negative alert badge */}
            <div className="flex items-center gap-3 bg-red-50 border border-red-200 rounded-xl p-4">
              <AlertTriangle size={18} className="text-red-500 flex-shrink-0" />
              <p className="text-sm text-red-700">
                <span className="font-semibold">⚠️ 23 negative items</span> được phát hiện —
                Telegram alert đã được gửi tự động
              </p>
            </div>

            {/* Mini report */}
            <div className="bg-white border border-slate-200 rounded-xl p-5">
              <h3 className="text-sm font-semibold text-slate-800 mb-4">Kết quả Phân tích</h3>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-3 mb-5">
                {[
                  { label: 'Positive', value: '45%', color: 'text-green-600', bg: 'bg-green-50' },
                  { label: 'Neutral', value: '30%', color: 'text-slate-600', bg: 'bg-slate-50' },
                  { label: 'Negative', value: '25%', color: 'text-rose-600', bg: 'bg-rose-50' },
                ].map((s) => (
                  <div key={s.label} className={`rounded-lg p-3 text-center ${s.bg}`}>
                    <p className={`text-xl font-bold ${s.color}`}>{s.value}</p>
                    <p className="text-xs text-slate-500 mt-0.5">{s.label}</p>
                  </div>
                ))}
              </div>

              {/* Total rows */}
              <div className="flex items-center justify-between py-2.5 border-t border-slate-100">
                <span className="text-sm text-slate-500">Tổng rows xử lý</span>
                <span className="text-sm font-semibold text-slate-800">312</span>
              </div>

              {/* Top pain */}
              <div className="flex items-start justify-between py-2.5 border-t border-slate-100">
                <span className="text-sm text-slate-500">Top Pain Point</span>
                <div className="text-right">
                  <p className="text-sm font-semibold text-slate-800">Giao diện khó dùng</p>
                  <span className="text-xs text-rose-500">67 mentions</span>
                </div>
              </div>

              <div className="flex items-center justify-between py-2.5 border-t border-slate-100">
                <span className="text-sm text-slate-500">Negative items</span>
                <span className="text-sm font-semibold text-rose-600">23</span>
              </div>
            </div>

            {/* Export */}
            <button
              onClick={() => window.print()}
              className="flex items-center gap-2 bg-brand-500 hover:bg-brand-600 text-white text-sm font-medium px-4 py-2.5 rounded-lg transition-colors"
            >
              <Printer size={14} />
              Export PDF
            </button>
          </div>
        )}
      </div>
    </Layout>
  )
}
