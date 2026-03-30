import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Layout from '../components/Layout'
import { Send, Bot, User, CheckCircle, ArrowRight } from 'lucide-react'

interface Question {
  id: number
  text: string
  placeholder: string
  chips: string[]
}

const questions: Question[] = [
  {
    id: 1,
    text: 'Tên brand hoặc category bạn muốn nghiên cứu là gì?',
    placeholder: 'VD: Highlands Coffee, cà phê take-away...',
    chips: ['Highlands Coffee', 'The Coffee House', 'Phúc Long', 'Gongcha'],
  },
  {
    id: 2,
    text: 'Industry của bạn?',
    placeholder: 'VD: F&B, SaaS, FMCG...',
    chips: ['F&B', 'SaaS', 'FMCG', 'Retail', 'Fintech'],
  },
  {
    id: 3,
    text: 'Đối tượng khách hàng mục tiêu (ICP) của bạn?',
    placeholder: 'VD: 22-35 tuổi, dân văn phòng, TP.HCM...',
    chips: ['22-35 tuổi urban', 'Gen Z 18-24', 'Dân văn phòng', 'Bà nội trợ 28-45'],
  },
  {
    id: 4,
    text: 'Đối thủ cạnh tranh chính?',
    placeholder: 'VD: The Coffee House, Phúc Long...',
    chips: ['The Coffee House / Phúc Long', 'Starbucks', 'Gongcha / TocoToco', 'Trung Nguyên'],
  },
  {
    id: 5,
    text: 'Câu hỏi nghiên cứu cụ thể của bạn?',
    placeholder: 'VD: Khách hàng đang nói gì về chất lượng dịch vụ?',
    chips: [
      'Khách hàng đang nói gì về chất lượng dịch vụ?',
      'Pain points chính với sản phẩm hiện tại?',
      'Lý do chuyển sang đối thủ?',
    ],
  },
]

const defaultAnswers = [
  'Highlands Coffee',
  'F&B',
  '22-35 tuổi urban',
  'The Coffee House / Phúc Long',
  'Khách hàng đang nói gì về chất lượng dịch vụ?',
]

interface Message {
  role: 'agent' | 'user'
  text: string
}

export default function InsightChat() {
  const navigate = useNavigate()
  const [currentStep, setCurrentStep] = useState(0) // 0 = intro, 1-5 = questions, 6 = summary
  const [answers, setAnswers] = useState<string[]>(Array(5).fill(''))
  const [inputValue, setInputValue] = useState('')
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'agent',
      text: 'Xin chào! Tôi là SocialMind AI. Tôi sẽ giúp bạn cấu hình nghiên cứu social listening. Hãy trả lời 5 câu hỏi ngắn để tôi thu thập đúng data cho bạn nhé!',
    },
  ])

  const currentQuestion = currentStep >= 1 && currentStep <= 5 ? questions[currentStep - 1] : null

  const handleStart = () => {
    setCurrentStep(1)
    setMessages((prev) => [
      ...prev,
      { role: 'agent', text: questions[0].text },
    ])
  }

  const handleAnswer = (answer: string) => {
    if (!answer.trim()) return
    const newAnswers = [...answers]
    newAnswers[currentStep - 1] = answer

    setAnswers(newAnswers)
    setMessages((prev) => [
      ...prev,
      { role: 'user', text: answer },
    ])
    setInputValue('')

    const nextStep = currentStep + 1
    if (nextStep <= 5) {
      setTimeout(() => {
        setMessages((prev) => [
          ...prev,
          { role: 'agent', text: questions[nextStep - 1].text },
        ])
        setCurrentStep(nextStep)
      }, 400)
    } else {
      setTimeout(() => {
        setMessages((prev) => [
          ...prev,
          {
            role: 'agent',
            text: 'Tuyệt! Tôi đã có đủ thông tin. Đây là tóm tắt context nghiên cứu của bạn:',
          },
        ])
        setCurrentStep(6)
      }, 400)
    }
  }

  const handleChipClick = (chip: string) => {
    handleAnswer(chip)
  }

  const handleSend = () => {
    handleAnswer(inputValue)
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleAnswer(inputValue)
    }
  }

  const summaryLabels = ['Brand / Category', 'Industry', 'Target ICP', 'Đối thủ', 'Câu hỏi nghiên cứu']

  return (
    <Layout>
      <div className="flex flex-col h-full">
        {/* Header */}
        <div className="border-b border-slate-200 bg-white px-6 py-4 flex-shrink-0">
          <h1 className="text-base font-semibold text-slate-800">Phân tích Xã hội</h1>
          <p className="text-xs text-slate-500 mt-0.5">Bước 1/3 — Khai báo business context</p>
        </div>

        <div className="flex flex-1 overflow-hidden">
          {/* Chat area */}
          <div className="flex-1 flex flex-col overflow-hidden">
            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4">
              {messages.map((msg, i) => (
                <div
                  key={i}
                  className={`flex items-start gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}
                >
                  {/* Avatar */}
                  <div
                    className={`w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 ${
                      msg.role === 'agent'
                        ? 'bg-brand-500 text-white'
                        : 'bg-slate-200 text-slate-600'
                    }`}
                  >
                    {msg.role === 'agent' ? <Bot size={14} /> : <User size={14} />}
                  </div>
                  {/* Bubble */}
                  <div
                    className={`max-w-sm px-4 py-2.5 rounded-2xl text-sm leading-relaxed ${
                      msg.role === 'agent'
                        ? 'bg-white border border-slate-200 text-slate-800 rounded-tl-sm'
                        : 'bg-brand-500 text-white rounded-tr-sm'
                    }`}
                  >
                    {msg.text}
                  </div>
                </div>
              ))}

              {/* Context Summary */}
              {currentStep === 6 && (
                <div className="ml-10">
                  <div className="bg-white border border-slate-200 rounded-xl p-5 max-w-md">
                    <div className="flex items-center gap-2 mb-4">
                      <CheckCircle size={16} className="text-green-500" />
                      <p className="text-sm font-semibold text-slate-800">Context Summary</p>
                    </div>
                    <div className="space-y-2.5">
                      {summaryLabels.map((label, idx) => (
                        <div key={idx} className="flex gap-3">
                          <span className="text-xs text-slate-400 w-32 flex-shrink-0">{label}</span>
                          <span className="text-xs font-medium text-slate-700">
                            {answers[idx] || defaultAnswers[idx]}
                          </span>
                        </div>
                      ))}
                    </div>
                    <button
                      onClick={() => navigate('/insight/progress')}
                      className="mt-5 w-full flex items-center justify-center gap-2 bg-brand-500 hover:bg-brand-600 text-white text-sm font-semibold py-2.5 rounded-lg transition-colors"
                    >
                      Bắt đầu thu thập data
                      <ArrowRight size={15} />
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Input area */}
            {currentStep === 0 && (
              <div className="border-t border-slate-200 bg-white p-4 flex-shrink-0">
                <button
                  onClick={handleStart}
                  className="w-full bg-brand-500 hover:bg-brand-600 text-white font-semibold py-2.5 rounded-lg text-sm transition-colors"
                >
                  Bắt đầu →
                </button>
              </div>
            )}

            {currentStep >= 1 && currentStep <= 5 && currentQuestion && (
              <div className="border-t border-slate-200 bg-white p-4 flex-shrink-0">
                {/* Chips */}
                <div className="flex flex-wrap gap-2 mb-3">
                  {currentQuestion.chips.map((chip) => (
                    <button
                      key={chip}
                      onClick={() => handleChipClick(chip)}
                      className="text-xs px-3 py-1.5 bg-brand-50 text-brand-500 border border-brand-100 rounded-full hover:bg-brand-100 transition-colors"
                    >
                      {chip}
                    </button>
                  ))}
                </div>
                {/* Text input */}
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder={currentQuestion.placeholder}
                    className="flex-1 border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent"
                    autoFocus
                  />
                  <button
                    onClick={handleSend}
                    disabled={!inputValue.trim()}
                    className="bg-brand-500 hover:bg-brand-600 disabled:opacity-40 text-white px-3 py-2 rounded-lg transition-colors"
                  >
                    <Send size={16} />
                  </button>
                </div>
                <p className="text-xs text-slate-400 mt-2">
                  Câu hỏi {currentStep}/5 — nhấn chip hoặc tự nhập
                </p>
              </div>
            )}
          </div>

          {/* Right panel — progress */}
          <div className="w-56 border-l border-slate-200 bg-slate-50 p-4 flex-shrink-0">
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-4">
              Tiến trình
            </p>
            <div className="space-y-3">
              {questions.map((q, idx) => {
                const stepNum = idx + 1
                const done = currentStep > stepNum
                const active = currentStep === stepNum
                return (
                  <div key={q.id} className="flex items-start gap-2.5">
                    <div
                      className={`w-5 h-5 rounded-full flex items-center justify-center text-xs font-semibold flex-shrink-0 mt-0.5 ${
                        done
                          ? 'bg-green-500 text-white'
                          : active
                          ? 'bg-brand-500 text-white'
                          : 'bg-slate-200 text-slate-400'
                      }`}
                    >
                      {done ? '✓' : stepNum}
                    </div>
                    <div>
                      <p
                        className={`text-xs leading-tight ${
                          active ? 'text-slate-800 font-medium' : done ? 'text-slate-500' : 'text-slate-400'
                        }`}
                      >
                        {q.text.length > 40 ? q.text.slice(0, 40) + '…' : q.text}
                      </p>
                      {done && answers[idx] && (
                        <p className="text-xs text-green-600 mt-0.5 truncate">{answers[idx]}</p>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  )
}
