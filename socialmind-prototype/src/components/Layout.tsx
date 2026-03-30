import { type ReactNode } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import {
  Brain,
  BarChart2,
  Upload,
  History,
  Eye,
  Settings,
  Gauge,
  LogOut,
  Star,
} from 'lucide-react'

interface LayoutProps {
  children: ReactNode
}

interface NavItem {
  label: string
  path: string
  icon: ReactNode
}

const insightNavItems: NavItem[] = [
  { label: 'Phân tích Xã hội', path: '/insight/chat', icon: <BarChart2 size={16} /> },
  { label: 'Upload File', path: '/insight/upload', icon: <Upload size={16} /> },
  { label: 'Lịch sử', path: '/history', icon: <History size={16} /> },
]

const watchNavItems: NavItem[] = [
  { label: 'Dashboard', path: '/watch/dashboard', icon: <Eye size={16} /> },
  { label: 'Thiết lập Monitor', path: '/watch/setup', icon: <Settings size={16} /> },
  { label: 'Sử dụng', path: '/usage', icon: <Gauge size={16} /> },
]

export default function Layout({ children }: LayoutProps) {
  const navigate = useNavigate()

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden">
      {/* Sidebar */}
      <aside className="w-60 bg-slate-900 text-white flex flex-col flex-shrink-0">
        {/* Logo */}
        <div className="flex items-center gap-2.5 px-5 py-5 border-b border-slate-700">
          <div className="w-8 h-8 bg-brand-500 rounded-lg flex items-center justify-center flex-shrink-0">
            <Brain size={18} className="text-white" />
          </div>
          <span className="text-lg font-bold tracking-tight">SocialMind</span>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-5">
          {/* INSIGHT section */}
          <div>
            <p className="px-2 mb-2 text-xs font-semibold uppercase tracking-widest text-slate-400">
              Insight
            </p>
            <ul className="space-y-0.5">
              {insightNavItems.map((item) => (
                <li key={item.path}>
                  <NavLink
                    to={item.path}
                    className={({ isActive }) =>
                      `flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm transition-colors ${
                        isActive
                          ? 'bg-brand-500 text-white font-medium'
                          : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                      }`
                    }
                  >
                    {item.icon}
                    {item.label}
                  </NavLink>
                </li>
              ))}
            </ul>
          </div>

          {/* WATCH section */}
          <div>
            <p className="px-2 mb-2 text-xs font-semibold uppercase tracking-widest text-slate-400">
              Watch
            </p>
            <ul className="space-y-0.5">
              {watchNavItems.map((item) => (
                <li key={item.path}>
                  <NavLink
                    to={item.path}
                    className={({ isActive }) =>
                      `flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm transition-colors ${
                        isActive
                          ? 'bg-brand-500 text-white font-medium'
                          : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                      }`
                    }
                  >
                    {item.icon}
                    {item.label}
                  </NavLink>
                </li>
              ))}
            </ul>
          </div>
        </nav>

        {/* User area */}
        <div className="border-t border-slate-700 p-4">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-8 h-8 rounded-full bg-brand-500 flex items-center justify-center text-sm font-semibold flex-shrink-0">
              M
            </div>
            <div className="min-w-0">
              <p className="text-sm font-medium text-white truncate">Trung Nguyên Vinh</p>
              <span className="inline-flex items-center gap-1 text-xs bg-yellow-500/20 text-yellow-300 px-1.5 py-0.5 rounded-full">
                <Star size={10} className="fill-yellow-300" />
                Growth
              </span>
            </div>
          </div>
          <button
            onClick={() => navigate('/')}
            className="flex items-center gap-2 text-slate-400 hover:text-white text-xs transition-colors"
          >
            <LogOut size={13} />
            Đăng xuất
          </button>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 overflow-y-auto">
        {children}
      </main>
    </div>
  )
}
