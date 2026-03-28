"use client"
import Link from "next/link"
import { useSession, signOut } from "next-auth/react"
import { Heart, Menu, X } from "lucide-react"
import { useState } from "react"

export default function Navbar() {
  const { data } = useSession()
  const [open, setOpen] = useState(false)

  return (
    <nav className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-gray-100">
      <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 text-xl font-bold" style={{ color: "#FF6B8A" }}>
          <Heart className="w-6 h-6 fill-current" /> MeetTheOne
        </Link>

        {/* Desktop */}
        <div className="hidden md:flex items-center gap-6">
          {data?.user ? (
            <>
              <Link href="/matches" className="text-gray-600 hover:text-[#FF6B8A] transition">匹配</Link>
              <Link href="/chat" className="text-gray-600 hover:text-[#FF6B8A] transition">聊天</Link>
              <Link href="/quizzes" className="text-gray-600 hover:text-[#FF6B8A] transition">测验</Link>
              <Link href="/dashboard" className="text-gray-600 hover:text-[#FF6B8A] transition">分析</Link>
              <Link href="/community" className="text-gray-600 hover:text-[#FF6B8A] transition">社区</Link>
              <Link href="/profile" className="text-gray-600 hover:text-[#FF6B8A] transition">个人</Link>
              <button onClick={() => signOut()} className="text-sm text-gray-400 hover:text-red-400">退出登录</button>
            </>
          ) : (
            <>
              <Link href="/login" className="text-gray-600 hover:text-[#FF6B8A] transition">登录</Link>
              <Link href="/register" className="px-4 py-2 rounded-full text-white text-sm font-medium transition hover:opacity-90" style={{ backgroundColor: "#FF6B8A" }}>
                免费注册
              </Link>
            </>
          )}
        </div>

        {/* Mobile */}
        <button className="md:hidden" onClick={() => setOpen(!open)}>
          {open ? <X /> : <Menu />}
        </button>
      </div>

      {open && (
        <div className="md:hidden bg-white border-t px-4 py-4 space-y-3">
          {data?.user ? (
            <>
              {[
                { href: "/matches", label: "匹配" },
                { href: "/chat", label: "聊天" },
                { href: "/quizzes", label: "测验" },
                { href: "/dashboard", label: "分析" },
                { href: "/community", label: "社区" },
                { href: "/profile", label: "个人" },
              ].map(l => (
                <Link key={l.href} href={l.href} className="block py-2 text-gray-600" onClick={() => setOpen(false)}>{l.label}</Link>
              ))}
              <button onClick={() => signOut()} className="block py-2 text-red-400">退出登录</button>
            </>
          ) : (
            <>
              <Link href="/login" className="block py-2 text-gray-600" onClick={() => setOpen(false)}>登录</Link>
              <Link href="/register" className="block py-2 font-medium" style={{ color: "#FF6B8A" }} onClick={() => setOpen(false)}>免费注册</Link>
            </>
          )}
        </div>
      )}
    </nav>
  )
}
