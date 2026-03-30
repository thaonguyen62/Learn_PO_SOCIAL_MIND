import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Login from './pages/Login'
import StarterOnboarding from './pages/StarterOnboarding'
import GrowthOnboarding from './pages/GrowthOnboarding'
import InsightChat from './pages/InsightChat'
import InsightProgress from './pages/InsightProgress'
import InsightReport from './pages/InsightReport'
import InsightUpload from './pages/InsightUpload'
import WatchSetup from './pages/WatchSetup'
import WatchTelegram from './pages/WatchTelegram'
import WatchDashboard from './pages/WatchDashboard'
import JobHistory from './pages/JobHistory'
import UsageDashboard from './pages/UsageDashboard'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/onboarding/starter" element={<StarterOnboarding />} />
        <Route path="/onboarding/growth" element={<GrowthOnboarding />} />
        <Route path="/insight/chat" element={<InsightChat />} />
        <Route path="/insight/progress" element={<InsightProgress />} />
        <Route path="/insight/report" element={<InsightReport />} />
        <Route path="/insight/upload" element={<InsightUpload />} />
        <Route path="/watch/setup" element={<WatchSetup />} />
        <Route path="/watch/telegram" element={<WatchTelegram />} />
        <Route path="/watch/dashboard" element={<WatchDashboard />} />
        <Route path="/history" element={<JobHistory />} />
        <Route path="/usage" element={<UsageDashboard />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App