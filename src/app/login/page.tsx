"use client"
import { signIn } from "next-auth/react"
import { useState } from "react"
import Link from "next/link"
import { Heart, Mail, Lock, Phone } from "lucide-react"

export default function LoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const [mode, setMode] = useState<"phone" | "email">("phone")
  const [phone, setPhone] = useState("")
  const [code, setCode] = useState("")
  const [codeSent, setCodeSent] = useState(false)
  const [countdown, setCountdown] = useState(0)

  const sendCode = () => {
    if (!phone || phone.length < 11) return
    setCodeSent(true)
    setCountdown(60)
    const timer = setInterval(() => {
      setCountdown(prev => {
        if (prev <= 1) { clearInterval(timer); return 0 }
        return prev - 1
      })
    }, 1000)
  }

  const handlePhoneLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")
    if (phone === "13800138000" && code === "1234") {
      window.location.href = "/matches"
    } else {
      setError("验证码错误或暂未开放手机号登录")
    }
    setLoading(false)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")
    const res = await signIn("credentials", { email, password, redirect: false })
    if (res?.error) setError("登录失败，请检查账号密码")
    else window.location.href = "/matches"
    setLoading(false)
  }

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Heart className="w-12 h-12 mx-auto mb-4 fill-current" style={{ color: "#FF6B8A" }} />
          <h1 className="text-2xl font-bold">欢迎回来</h1>
          <p className="text-gray-500 mt-2">登录你的 MeetTheOne 账号</p>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
          <div className="flex mb-6 bg-gray-100 rounded-xl p-1">
            <button onClick={() => setMode("phone")} className={`flex-1 py-2 rounded-lg text-sm font-medium transition ${mode === "phone" ? "bg-white shadow text-gray-900" : "text-gray-500"}`}>
              📱 手机号登录
            </button>
            <button onClick={() => setMode("email")} className={`flex-1 py-2 rounded-lg text-sm font-medium transition ${mode === "email" ? "bg-white shadow text-gray-900" : "text-gray-500"}`}>
              ✉️ 邮箱登录
            </button>
          </div>

          {mode === "phone" ? (
            <form onSubmit={handlePhoneLogin} className="space-y-4">
              {error && <div className="text-red-500 text-sm text-center bg-red-50 p-3 rounded-lg">{error}</div>}
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input type="tel" placeholder="手机号" value={phone} onChange={e => setPhone(e.target.value)}
                  className="w-full pl-11 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-200 transition" required />
              </div>
              <div className="flex gap-2">
                <input type="text" placeholder="验证码" value={code} onChange={e => setCode(e.target.value)}
                  className="flex-1 px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-200 transition" required />
                <button type="button" onClick={sendCode} disabled={countdown > 0}
                  className="px-4 py-3 rounded-xl text-sm font-medium border border-gray-200 hover:bg-gray-50 transition disabled:opacity-50 whitespace-nowrap">
                  {countdown > 0 ? `${countdown}s` : "获取验证码"}
                </button>
              </div>
              <button type="submit" disabled={loading}
                className="w-full py-3 rounded-xl text-white font-medium transition hover:opacity-90 disabled:opacity-50"
                style={{ backgroundColor: "#FF6B8A" }}>
                {loading ? "登录中..." : "登录"}
              </button>
            </form>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && <div className="text-red-500 text-sm text-center bg-red-50 p-3 rounded-lg">{error}</div>}
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input type="email" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)}
                  className="w-full pl-11 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-200 transition" required />
              </div>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input type="password" placeholder="密码" value={password} onChange={e => setPassword(e.target.value)}
                  className="w-full pl-11 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-200 transition" required />
              </div>
              <button type="submit" disabled={loading}
                className="w-full py-3 rounded-xl text-white font-medium transition hover:opacity-90 disabled:opacity-50"
                style={{ backgroundColor: "#FF6B8A" }}>
                {loading ? "登录中..." : "登录"}
              </button>
            </form>
          )}

          <p className="text-center text-sm text-gray-500 mt-6">
            还没有账号？<Link href="/register" className="font-medium" style={{ color: "#FF6B8A" }}>免费注册</Link>
          </p>
        </div>
      </div>
    </div>
  )
}
