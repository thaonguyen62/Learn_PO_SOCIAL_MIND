export interface InsightJob {
  id: string
  brand: string
  type: 'social' | 'file'
  date: string
  posts: number | string
  status: 'completed' | 'running' | 'failed'
  platforms: string[]
}

export interface WNPInsight {
  title: string
  mentions: number
  quotes: { text: string; source: string }[]
}

export interface WNPData {
  wants: WNPInsight[]
  needs: WNPInsight[]
  pains: WNPInsight[]
  distribution: { name: string; value: number; color: string }[]
  platformVolume: { platform: string; posts: number }[]
}

export interface WatchAlert {
  id: string
  date: string
  time: string
  severity: 'critical' | 'warning'
  spikeRatio: number
  topIssue: string
}

export interface UsageStats {
  plan: string
  price: string
  billingPeriod: string
  scans: { used: number; limit: number | 'unlimited' }
  claudeTokens: { used: number; limit: number }
  apifyCredits: { used: number; limit: number }
  watchMonitors: { active: number; limit: number }
}

// W-N-P Data for Highlands Coffee
export const wnpData: WNPData = {
  distribution: [
    { name: 'Wants', value: 42, color: '#4f6ef7' },
    { name: 'Needs', value: 35, color: '#10b981' },
    { name: 'Pains', value: 23, color: '#f43f5e' },
  ],
  platformVolume: [
    { platform: 'Facebook', posts: 98 },
    { platform: 'TikTok', posts: 67 },
    { platform: 'Threads', posts: 34 },
    { platform: 'Reddit', posts: 28 },
    { platform: 'Báo điện tử', posts: 20 },
  ],
  wants: [
    {
      title: 'Muốn có không gian yên tĩnh hơn để làm việc',
      mentions: 34,
      quotes: [
        { text: 'Highlands ở Nguyễn Huệ ồn quá, không tập trung được', source: 'Facebook Groups' },
        { text: 'Cần chỗ ngồi làm việc mà không bị disturb', source: 'Reddit' },
      ],
    },
    {
      title: 'Muốn thêm tùy chọn milk alternative',
      mentions: 28,
      quotes: [
        { text: 'Sao không có oat milk như các quán khác nhỉ?', source: 'TikTok' },
        { text: 'Mình dị ứng lactose, mong có plant-based milk', source: 'Facebook Groups' },
      ],
    },
    {
      title: 'Muốn có app loyalty tốt hơn',
      mentions: 22,
      quotes: [
        { text: 'App Highlands đơn giản quá, thiếu tính năng so với Phúc Long', source: 'Reddit' },
        { text: 'Muốn có gamification như Starbucks', source: 'Threads' },
      ],
    },
    {
      title: 'Muốn extend giờ mở cửa',
      mentions: 19,
      quotes: [
        { text: '11pm đóng cửa hơi sớm, cần chỗ làm việc khuya', source: 'Facebook Groups' },
        { text: 'Mở thêm sáng sớm 6am nữa thì tốt', source: 'TikTok' },
      ],
    },
    {
      title: 'Muốn WiFi ổn định hơn',
      mentions: 17,
      quotes: [
        { text: 'WiFi Highlands chập chờn ghê, zoom call bị ngắt giữa chừng', source: 'Reddit' },
        { text: 'Tốc độ mạng kém vào giờ cao điểm', source: 'Facebook Groups' },
      ],
    },
  ],
  needs: [
    {
      title: 'Cần kết nối WiFi ổn định để làm việc',
      mentions: 41,
      quotes: [
        { text: 'Đến Highlands để làm việc nhưng mạng lag không chịu được', source: 'Facebook Groups' },
        { text: 'WiFi thường xuyên bị mất kết nối, rất bất tiện', source: 'TikTok' },
      ],
    },
    {
      title: 'Cần thêm ổ cắm điện',
      mentions: 37,
      quotes: [
        { text: 'Hết ổ điện phải đứng dậy tìm chỗ khác, rất khó chịu', source: 'Reddit' },
        { text: 'Ngồi 2 tiếng mà không có chỗ cắm sạc laptop', source: 'Facebook Groups' },
      ],
    },
    {
      title: 'Cần giá cả competitive hơn với The Coffee House',
      mentions: 29,
      quotes: [
        { text: 'Cùng size mà Highlands đắt hơn TCH cả 15k', source: 'TikTok' },
        { text: 'Chất lượng ngang nhau nhưng giá nhỉnh hơn, cân nhắc lại', source: 'Threads' },
      ],
    },
    {
      title: 'Cần staff phục vụ nhanh hơn giờ cao điểm',
      mentions: 24,
      quotes: [
        { text: 'Chờ 15 phút mới có đồ uống, quá lâu cho giờ trưa', source: 'Facebook Groups' },
        { text: 'Nhân viên đông nhưng order vẫn chậm lạ', source: 'TikTok' },
      ],
    },
    {
      title: 'Cần thêm menu healthy',
      mentions: 18,
      quotes: [
        { text: 'Muốn có salad hoặc wrap healthy để ăn trưa luôn', source: 'Reddit' },
        { text: 'Menu đồ ăn ít quá và không healthy', source: 'Threads' },
      ],
    },
  ],
  pains: [
    {
      title: 'Nhạc quá to, không làm việc được',
      mentions: 31,
      quotes: [
        { text: 'Mỗi lần vào Highlands là bị tra tấn bởi nhạc', source: 'TikTok' },
        { text: 'Nhạc loud quá mức cần thiết, khó tập trung', source: 'Facebook Groups' },
      ],
    },
    {
      title: 'Hết chỗ ngồi vào giờ trưa',
      mentions: 26,
      quotes: [
        { text: 'Đến 12h là full hết, phải đứng chờ hoặc về', source: 'Facebook Groups' },
        { text: 'Cuối tuần không bao giờ có bàn trống', source: 'TikTok' },
      ],
    },
    {
      title: 'App loyalty hay lỗi',
      mentions: 21,
      quotes: [
        { text: 'App bị crash khi thanh toán, mất điểm tích lũy', source: 'Reddit' },
        { text: 'Không sync được điểm sau khi mua, liên hệ support không ai trả lời', source: 'Threads' },
      ],
    },
    {
      title: 'Ly take-away bị leak',
      mentions: 16,
      quotes: [
        { text: 'Ly cold brew bị chảy ra túi, hỏng cả đồ đạc', source: 'Facebook Groups' },
        { text: 'Nắp không kín, bị đổ ra tay áo', source: 'TikTok' },
      ],
    },
    {
      title: 'Giá tăng nhưng size không đổi',
      mentions: 14,
      quotes: [
        { text: 'Tăng giá 10k mà portion y chang, không hài lòng', source: 'Reddit' },
        { text: 'Giá tăng liên tục nhưng chất lượng không cải thiện', source: 'Threads' },
      ],
    },
  ],
}

// Watch Mode Alerts
export const watchAlerts: WatchAlert[] = [
  {
    id: '1',
    date: '27/03',
    time: '14:32',
    severity: 'critical',
    spikeRatio: 3.2,
    topIssue: 'App loyalty bị lỗi hàng loạt',
  },
  {
    id: '2',
    date: '25/03',
    time: '09:15',
    severity: 'warning',
    spikeRatio: 1.8,
    topIssue: 'Giá tăng',
  },
]

// Job History
export const jobHistory: InsightJob[] = [
  {
    id: '1',
    brand: 'Highlands Coffee',
    type: 'social',
    date: '28/03/2026',
    posts: 247,
    status: 'completed',
    platforms: ['Facebook', 'TikTok', 'Threads', 'Reddit', 'Báo điện tử'],
  },
  {
    id: '2',
    brand: 'Phúc Long',
    type: 'social',
    date: '22/03/2026',
    posts: 183,
    status: 'completed',
    platforms: ['Facebook', 'TikTok', 'Threads'],
  },
  {
    id: '3',
    brand: 'Sprint 12 Feedback',
    type: 'file',
    date: '20/03/2026',
    posts: '312 rows',
    status: 'completed',
    platforms: [],
  },
]

// Usage Stats
export const usageStats: UsageStats = {
  plan: 'Growth',
  price: '$59/tháng',
  billingPeriod: '01/03 – 31/03/2026',
  scans: { used: 7, limit: 'unlimited' },
  claudeTokens: { used: 45230, limit: 200000 },
  apifyCredits: { used: 2.3, limit: 10 },
  watchMonitors: { active: 1, limit: 1 },
}
