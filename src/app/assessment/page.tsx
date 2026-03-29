"use client"

import { useState, useRef, useEffect, useCallback } from "react"
import { useRouter } from "next/navigation"
import {
  Send,
  Brain,
  Loader2,
  Mail,
  Lock,
  User,
  CheckCircle,
  ArrowRight,
  Sparkles,
} from "lucide-react"
import { signIn } from "next-auth/react"

interface Message {
  role: "assistant" | "user"
  content: string
  typing?: boolean
}

type Phase = "chat" | "loading" | "signup" | "done"

export default function AssessmentPage() {
  const router = useRouter()
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState("")
  const [sending, setSending] = useState(false)
  const [sessionId, setSessionId] = useState<string | null>(null)
  const [phase, setPhase] = useState<Phase>("chat")
  const [scores, setScores] = useState<Record<string, Record<string, number>> | null>(null)
  const [signupForm, setSignupForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  })
  const [signupError, setSignupError] = useState("")
  const [signupLoading, setSignupLoading] = useState(false)

  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [])

  useEffect(() => {
    scrollToBottom()
  }, [messages, scrollToBottom])

  // Auto-focus input when chat phase
  useEffect(() => {
    if (phase === "chat" && !sending) {
      inputRef.current?.focus()
    }
  }, [phase, sending])

  // Start assessment on mount
  useEffect(() => {
    startAssessment()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const startAssessment = async () => {
    setSending(true)
    setMessages([
      {
        role: "assistant",
        content: "正在准备中...",
        typing: true,
      },
    ])

    try {
      const res = await fetch("/api/assessment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({}),
      })

      const data = await res.json()
      if (!res.ok) {
        setMessages([
          {
            role: "assistant",
            content: data.error || "服务暂时不可用，请稍后再试。",
          },
        ])
        return
      }

      setSessionId(data.sessionId)
      setMessages([{ role: "assistant", content: data.message }])

      if (data.completed) {
        handleComplete(data.scores)
      }
    } catch {
      setMessages([
        {
          role: "assistant",
          content: "网络连接失败，请检查网络后刷新页面重试。",
        },
      ])
    }
    setSending(false)
  }

  const sendMessage = async () => {
    if (!input.trim() || sending || !sessionId) return

    const userMessage = input.trim()
    setInput("")
    setMessages((prev) => [...prev, { role: "user", content: userMessage }])
    setSending(true)

    // Add typing indicator
    setMessages((prev) => [
      ...prev,
      { role: "assistant", content: "", typing: true },
    ])

    try {
      const res = await fetch("/api/assessment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sessionId, message: userMessage }),
      })

      const data = await res.json()

      // Remove typing indicator and add real message
      setMessages((prev) => {
        const withoutTyping = prev.slice(0, -1)
        return [...withoutTyping, { role: "assistant", content: data.message }]
      })

      if (data.completed) {
        handleComplete(data.scores)
      }
    } catch {
      setMessages((prev) => {
        const withoutTyping = prev.slice(0, -1)
        return [
          ...withoutTyping,
          {
            role: "assistant",
            content: "抱歉，出了点问题。请再试一次吧！",
          },
        ]
      })
    }
    setSending(false)
  }

  const handleComplete = (
    assessmentScores: Record<string, Record<string, number>>
  ) => {
    setScores(assessmentScores)
    // Keep the final message visible, then show signup after a brief delay
    setPhase("loading")
    setTimeout(() => {
      setPhase("signup")
    }, 2000)
  }

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault()
    const { name, email, password, confirmPassword } = signupForm

    if (!name || !email || !password) {
      setSignupError("请填写所有字段")
      return
    }
    if (password !== confirmPassword) {
      setSignupError("两次密码不一致")
      return
    }
    if (password.length < 6) {
      setSignupError("密码至少 6 位")
      return
    }

    setSignupLoading(true)
    setSignupError("")

    try {
      // Register
      const registerRes = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      })

      if (!registerRes.ok) {
        const data = await registerRes.json()
        setSignupError(data.error || "注册失败")
        setSignupLoading(false)
        return
      }

      const userData = await registerRes.json()

      // Save assessment scores
      if (scores) {
        await fetch("/api/assessment/save", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ userId: userData.id, scores }),
        })
      }

      // Auto sign in
      await signIn("credentials", {
        email,
        password,
        redirect: false,
      })

      setPhase("done")
    } catch {
      setSignupError("注册失败，请稍后再试")
    }
    setSignupLoading(false)
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      sendMessage()
    }
  }

  // Done screen
  if (phase === "done") {
    return (
      <div className="min-h-[80vh] flex items-center justify-center px-4">
        <div className="max-w-md w-full text-center">
          <div
            className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6"
            style={{ backgroundColor: "#FFE8ED" }}
          >
            <CheckCircle className="w-10 h-10" style={{ color: "#FF6B8A" }} />
          </div>
          <h2 className="text-2xl font-bold mb-3">🎉 欢迎加入 MeetTheOne！</h2>
          <p className="text-gray-500 mb-8">
            你的心理档案已经建立完成
            <br />
            我们已经为你准备好个性化推荐
          </p>

          {/* Score summary */}
          {scores && (
            <div className="bg-gray-50 rounded-2xl p-6 mb-8 text-left">
              <h3 className="font-bold mb-4 flex items-center gap-2">
                <Sparkles className="w-5 h-5" style={{ color: "#FF6B8A" }} />
                你的性格画像
              </h3>
              <div className="space-y-3 text-sm">
                {Object.entries(scores).map(([quiz, vals]) => (
                  <div key={quiz}>
                    <div className="font-medium mb-1 capitalize">
                      {getQuizLabel(quiz)}
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {Object.entries(vals as Record<string, number>).map(
                        ([key, val]) => (
                          <span
                            key={key}
                            className="px-2 py-1 rounded-full bg-white text-xs border"
                          >
                            {getDimensionLabel(key)}:{" "}
                            {getBar(val)}
                          </span>
                        )
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="flex flex-col gap-3">
            <button
              onClick={() => router.push("/matches")}
              className="w-full py-3 rounded-xl text-white font-medium transition hover:opacity-90 flex items-center justify-center gap-2"
              style={{ backgroundColor: "#FF6B8A" }}
            >
              查看匹配推荐 <ArrowRight className="w-4 h-4" />
            </button>
            <button
              onClick={() => router.push("/profile")}
              className="w-full py-3 rounded-xl border font-medium transition hover:bg-gray-50"
              style={{ borderColor: "#FF6B8A", color: "#FF6B8A" }}
            >
              完善个人资料
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-[80vh] flex flex-col max-w-2xl mx-auto">
      {/* Header */}
      <div className="sticky top-16 z-40 bg-white/90 backdrop-blur-md border-b border-gray-100 px-4 py-3">
        <div className="flex items-center gap-3">
          <div
            className="w-10 h-10 rounded-full flex items-center justify-center"
            style={{ backgroundColor: "#FFE8ED" }}
          >
            <Brain className="w-5 h-5" style={{ color: "#FF6B8A" }} />
          </div>
          <div>
            <h1 className="font-bold text-sm">AI 心理咨询师</h1>
            <p className="text-xs text-gray-400">
              {phase === "chat"
                ? "正在对话中..."
                : phase === "loading"
                  ? "正在分析你的性格..."
                  : "创建你的档案"}
            </p>
          </div>
          {phase === "chat" && !sending && (
            <div className="ml-auto flex items-center gap-1">
              <div className="w-2 h-2 rounded-full bg-green-400" />
              <span className="text-xs text-gray-400">在线</span>
            </div>
          )}
        </div>
      </div>

      {/* Chat Messages */}
      {phase === "chat" || phase === "loading" ? (
        <div className="flex-1 overflow-y-auto px-4 py-6 space-y-4">
          {messages.map((msg, i) => (
            <div
              key={i}
              className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
            >
              {msg.role === "assistant" && (
                <div
                  className="w-8 h-8 rounded-full flex items-center justify-center mr-2 flex-shrink-0 mt-1"
                  style={{ backgroundColor: "#FFE8ED" }}
                >
                  <Brain className="w-4 h-4" style={{ color: "#FF6B8A" }} />
                </div>
              )}
              <div
                className={`max-w-[80%] px-4 py-3 rounded-2xl ${
                  msg.role === "user"
                    ? "text-white rounded-br-md"
                    : "bg-gray-100 rounded-bl-md"
                } ${msg.typing ? "animate-pulse" : ""}`}
                style={
                  msg.role === "user"
                    ? { backgroundColor: "#FF6B8A" }
                    : undefined
                }
              >
                {msg.typing ? (
                  <div className="flex gap-1 py-1">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" />
                    <div
                      className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                      style={{ animationDelay: "0.1s" }}
                    />
                    <div
                      className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                      style={{ animationDelay: "0.2s" }}
                    />
                  </div>
                ) : (
                  <p className="text-sm whitespace-pre-wrap leading-relaxed">
                    {msg.content}
                  </p>
                )}
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>
      ) : null}

      {/* Signup Form */}
      {phase === "signup" && (
        <div className="flex-1 overflow-y-auto px-4 py-6">
          <div className="space-y-4 mb-6">
            {/* Show the last few messages for context */}
            {messages.slice(-3).map((msg, i) => (
              <div
                key={i}
                className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
              >
                {msg.role === "assistant" && (
                  <div
                    className="w-8 h-8 rounded-full flex items-center justify-center mr-2 flex-shrink-0 mt-1"
                    style={{ backgroundColor: "#FFE8ED" }}
                  >
                    <Brain className="w-4 h-4" style={{ color: "#FF6B8A" }} />
                  </div>
                )}
                <div
                  className={`max-w-[80%] px-4 py-3 rounded-2xl ${
                    msg.role === "user"
                      ? "text-white rounded-br-md"
                      : "bg-gray-100 rounded-bl-md"
                  }`}
                  style={
                    msg.role === "user"
                      ? { backgroundColor: "#FF6B8A" }
                      : undefined
                  }
                >
                  <p className="text-sm whitespace-pre-wrap">{msg.content}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Signup card */}
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
            <div className="text-center mb-6">
              <div
                className="w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-3"
                style={{ backgroundColor: "#FFE8ED" }}
              >
                <Sparkles className="w-7 h-7" style={{ color: "#FF6B8A" }} />
              </div>
              <h2 className="text-xl font-bold mb-1">评估完成！✨</h2>
              <p className="text-gray-500 text-sm">
                创建账号，保存你的性格档案
                <br />
                并获取专属匹配推荐
              </p>
            </div>

            <form onSubmit={handleSignup} className="space-y-3">
              {signupError && (
                <div className="text-red-500 text-sm text-center bg-red-50 p-3 rounded-lg">
                  {signupError}
                </div>
              )}

              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="你的昵称"
                  value={signupForm.name}
                  onChange={(e) =>
                    setSignupForm({ ...signupForm, name: e.target.value })
                  }
                  className="w-full pl-11 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-200 transition text-sm"
                  required
                />
              </div>

              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="email"
                  placeholder="Email"
                  value={signupForm.email}
                  onChange={(e) =>
                    setSignupForm({ ...signupForm, email: e.target.value })
                  }
                  className="w-full pl-11 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-200 transition text-sm"
                  required
                />
              </div>

              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="password"
                  placeholder="设置密码（至少 6 位）"
                  value={signupForm.password}
                  onChange={(e) =>
                    setSignupForm({ ...signupForm, password: e.target.value })
                  }
                  className="w-full pl-11 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-200 transition text-sm"
                  required
                />
              </div>

              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="password"
                  placeholder="确认密码"
                  value={signupForm.confirmPassword}
                  onChange={(e) =>
                    setSignupForm({
                      ...signupForm,
                      confirmPassword: e.target.value,
                    })
                  }
                  className="w-full pl-11 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-200 transition text-sm"
                  required
                />
              </div>

              <button
                type="submit"
                disabled={signupLoading}
                className="w-full py-3 rounded-xl text-white font-medium transition hover:opacity-90 disabled:opacity-50 flex items-center justify-center gap-2 text-sm"
                style={{ backgroundColor: "#FF6B8A" }}
              >
                {signupLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    创建中...
                  </>
                ) : (
                  "创建账号并保存档案"
                )}
              </button>
            </form>

            <p className="text-center text-xs text-gray-400 mt-4">
              已有账号？
              <button
                onClick={() => router.push("/login")}
                className="font-medium ml-1"
                style={{ color: "#FF6B8A" }}
              >
                登录
              </button>
            </p>
          </div>
        </div>
      )}

      {/* Input bar (chat phase only) */}
      {phase === "chat" && (
        <div className="sticky bottom-0 bg-white border-t border-gray-100 px-4 py-3">
          <div className="flex items-center gap-2">
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="输入你的回答..."
              disabled={sending}
              className="flex-1 px-4 py-3 bg-gray-100 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-pink-200 transition disabled:opacity-50"
            />
            <button
              onClick={sendMessage}
              disabled={sending || !input.trim()}
              className="w-10 h-10 rounded-full flex items-center justify-center text-white transition hover:opacity-90 disabled:opacity-30 flex-shrink-0"
              style={{ backgroundColor: "#FF6B8A" }}
            >
              {sending ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <Send className="w-5 h-5" />
              )}
            </button>
          </div>
          <p className="text-center text-xs text-gray-400 mt-2">
            💬 和 AI 轻松聊天，完成性格评估后即可获得匹配推荐
          </p>
        </div>
      )}
    </div>
  )
}

// Helper functions for labels
function getQuizLabel(key: string): string {
  const labels: Record<string, string> = {
    bigfive: "🧠 大五人格",
    lovelanguage: "❤️ 爱的语言",
    travel: "✈️ 旅行风格",
    marriage: "🏠 婚姻价值观",
  }
  return labels[key] || key
}

function getDimensionLabel(key: string): string {
  const labels: Record<string, string> = {
    openness: "开放性",
    conscientiousness: "尽责性",
    extraversion: "外向性",
    agreeableness: "亲和性",
    neuroticism: "神经质",
    words: "言语",
    acts: "行动",
    gifts: "礼物",
    time: "时光",
    touch: "接触",
    planned: "计划型",
    spontaneous: "随性型",
    budget: "省钱",
    luxury: "奢侈",
    adventure: "冒险",
    relax: "休闲",
    calm: "冷静",
    culture: "文化",
    equality: "平等分担",
    family: "家庭优先",
    children: "子女观",
    parents: "长辈关系",
    finance: "财务",
    tradition: "传统",
    space: "个人空间",
    discipline: "教育理念",
  }
  return labels[key] || key
}

function getBar(score: number): string {
  const filled = "●".repeat(score)
  const empty = "○".repeat(5 - score)
  return `${filled}${empty}`
}
