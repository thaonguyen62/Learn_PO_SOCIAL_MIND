import { useNavigate } from 'react-router-dom'
import Layout from '../components/Layout'
import { jobHistory } from '../data/mock'
import { Plus, FileText, Globe, CheckCircle, Eye, Printer } from 'lucide-react'

export default function JobHistory() {
  const navigate = useNavigate()

  return (
    <Layout>
      <div className="p-6 max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-xl font-bold text-slate-800">Lịch sử Phân tích</h1>
            <p className="text-sm text-slate-500 mt-1">{jobHistory.length} jobs đã hoàn thành</p>
          </div>
          <button
            onClick={() => navigate('/insight/chat')}
            className="flex items-center gap-2 bg-brand-500 hover:bg-brand-600 text-white text-sm font-semibold px-4 py-2.5 rounded-lg transition-colors"
          >
            <Plus size={15} />
            New Analysis
          </button>
        </div>

        {/* Table */}
        <div className="bg-white border border-slate-200 rounded-xl overflow-hidden">
          {/* Table header */}
          <div className="grid grid-cols-12 gap-4 px-5 py-3 bg-slate-50 border-b border-slate-200 text-xs font-semibold text-slate-500 uppercase tracking-wider">
            <div className="col-span-4">Brand / File</div>
            <div className="col-span-2">Loại</div>
            <div className="col-span-2">Ngày</div>
            <div className="col-span-1">Posts</div>
            <div className="col-span-1">Trạng thái</div>
            <div className="col-span-2 text-right">Thao tác</div>
          </div>

          {/* Rows */}
          {jobHistory.map((job, idx) => (
            <div
              key={job.id}
              className={`grid grid-cols-12 gap-4 px-5 py-4 items-center ${
                idx < jobHistory.length - 1 ? 'border-b border-slate-100' : ''
              } hover:bg-slate-50 transition-colors`}
            >
              {/* Brand */}
              <div className="col-span-4">
                <div className="flex items-center gap-2.5">
                  <div
                    className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${
                      job.type === 'file'
                        ? 'bg-purple-50 text-purple-500'
                        : 'bg-brand-50 text-brand-500'
                    }`}
                  >
                    {job.type === 'file' ? <FileText size={15} /> : <Globe size={15} />}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-slate-800">{job.brand}</p>
                    {job.platforms.length > 0 && (
                      <p className="text-xs text-slate-400 mt-0.5">{job.platforms.join(' · ')}</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Type */}
              <div className="col-span-2">
                <span
                  className={`text-xs font-medium px-2.5 py-1 rounded-full ${
                    job.type === 'file'
                      ? 'bg-purple-50 text-purple-600'
                      : 'bg-brand-50 text-brand-500'
                  }`}
                >
                  {job.type === 'file' ? 'File Upload' : 'Social'}
                </span>
              </div>

              {/* Date */}
              <div className="col-span-2">
                <span className="text-sm text-slate-600">{job.date}</span>
              </div>

              {/* Posts */}
              <div className="col-span-1">
                <span className="text-sm font-medium text-slate-700">{job.posts}</span>
              </div>

              {/* Status */}
              <div className="col-span-1">
                {job.status === 'completed' && (
                  <span className="inline-flex items-center gap-1 text-xs text-green-600">
                    <CheckCircle size={12} />
                    Xong
                  </span>
                )}
              </div>

              {/* Actions */}
              <div className="col-span-2 flex items-center justify-end gap-2">
                <button
                  onClick={() => job.id === '1' ? navigate('/insight/report') : undefined}
                  className="flex items-center gap-1.5 text-xs text-brand-500 font-medium hover:text-brand-600 px-2.5 py-1.5 rounded-lg hover:bg-brand-50 transition-colors"
                >
                  <Eye size={12} />
                  Xem
                </button>
                <button
                  onClick={() => window.print()}
                  className="flex items-center gap-1.5 text-xs text-slate-500 font-medium hover:text-slate-700 px-2.5 py-1.5 rounded-lg hover:bg-slate-100 transition-colors"
                >
                  <Printer size={12} />
                  PDF
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Empty state hint */}
        <div className="mt-4 flex items-center justify-center">
          <p className="text-xs text-slate-400">
            Hiển thị {jobHistory.length} jobs gần nhất · Lưu trữ trong 90 ngày
          </p>
        </div>
      </div>
    </Layout>
  )
}
