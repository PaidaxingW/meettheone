"use client"
import { useRouter } from "next/navigation"
import { useState } from "react"
import Link from "next/link"
import { signIn } from "next-auth/react"
import { Heart, Mail, Lock, User } from "lucide-react"

export default function RegisterPage() {
  const router = useRouter()
  const [form, setForm] = useState({ name: "", email: "", password: "", confirmPassword: "" })
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (form.password !== form.confirmPassword) { setError("密码不一致"); return }
    if (form.password.length < 6) { setError("密码至少 6 位"); return }
    setLoading(true)
    setError("")

    const res = await fetch("/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: form.name, email: form.email, password: form.password }),
    })

    if (res.ok) {
      await signIn("credentials", { email: form.email, password: form.password, redirect: false })
      router.push("/profile")
    } else {
      const data = await res.json()
      setError(data.error || "注册失败")
    }
    setLoading(false)
  }

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Heart className="w-12 h-12 mx-auto mb-4 fill-current" style={{ color: "#FF6B8A" }} />
          <h1 className="text-2xl font-bold">加入 MeetTheOne</h1>
          <p className="text-gray-500 mt-2">用心理学，找到对的人</p>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && <div className="text-red-500 text-sm text-center bg-red-50 p-3 rounded-lg">{error}</div>}
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input type="text" placeholder="你的昵称" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })}
                className="w-full pl-11 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-200 transition" required />
            </div>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input type="email" placeholder="Email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })}
                className="w-full pl-11 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-200 transition" required />
            </div>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input type="password" placeholder="密码（至少 6 位）" value={form.password} onChange={e => setForm({ ...form, password: e.target.value })}
                className="w-full pl-11 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-200 transition" required />
            </div>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input type="password" placeholder="确认密码" value={form.confirmPassword} onChange={e => setForm({ ...form, confirmPassword: e.target.value })}
                className="w-full pl-11 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-200 transition" required />
            </div>
            <button type="submit" disabled={loading}
              className="w-full py-3 rounded-xl text-white font-medium transition hover:opacity-90 disabled:opacity-50"
              style={{ backgroundColor: "#FF6B8A" }}>
              {loading ? "注册中..." : "创建账号"}
            </button>
          </form>

          <p className="text-center text-sm text-gray-500 mt-6">
            已有账号？<Link href="/login" className="font-medium" style={{ color: "#FF6B8A" }}>登录</Link>
          </p>
        </div>
      </div>
    </div>
  )
}
