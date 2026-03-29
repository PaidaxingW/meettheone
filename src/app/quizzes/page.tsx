"use client"
import { useSession } from "next-auth/react"
import Link from "next/link"
import { Brain, Sparkles, ArrowRight } from "lucide-react"
import { useRouter } from "next/navigation"
import { useEffect } from "react"

export default function QuizzesPage() {
  const { data: session } = useSession()
  const router = useRouter()

  // Auto-redirect to the new AI assessment page
  useEffect(() => {
    router.replace("/assessment")
  }, [router])

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4">
      <div className="max-w-md text-center">
        <div
          className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4"
          style={{ backgroundColor: "#FFE8ED" }}
        >
          <Sparkles className="w-8 h-8" style={{ color: "#FF6B8A" }} />
        </div>
        <h1 className="text-2xl font-bold mb-3">全新体验上线！</h1>
        <p className="text-gray-500 mb-6">
          我们已将选择题测验升级为
          <br />
          <strong style={{ color: "#FF6B8A" }}>AI 对话式心理评估</strong>
          <br />
          更自然、更深入、更准确
        </p>
        <p className="text-sm text-gray-400 mb-6">
          正在跳转到新页面...
        </p>
        <Link
          href="/assessment"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-white font-medium transition hover:opacity-90"
          style={{ backgroundColor: "#FF6B8A" }}
        >
          <Brain className="w-5 h-5" />
          开始 AI 心理评估
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </div>
  )
}
