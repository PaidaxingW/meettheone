"use client"
import { useSession } from "next-auth/react"
import { useState, useEffect } from "react"
import { Heart, Star, MessageCircle, X, ChevronRight } from "lucide-react"

interface MatchUser {
  id: string
  name: string
  image: string | null
  age: number
  location: string | null
  occupation: string | null
  bio: string | null
  score: number
  dimensions: Record<string, number>
}

export default function MatchesPage() {
  const { data: session } = useSession()
  const [matches, setMatches] = useState<MatchUser[]>([])
  const [selected, setSelected] = useState<MatchUser | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (session?.user) {
      fetch(`/api/matches?userId=${(session.user as any).id}`)
        .then(r => r.json())
        .then(data => { setMatches(data); setLoading(false) })
        .catch(() => setLoading(false))
    }
  }, [session])

  if (!session) return <div className="text-center py-20">請先登入</div>

  if (loading) return <div className="text-center py-20">分析配對中...</div>

  if (matches.length === 0) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-20 text-center">
        <Heart className="w-16 h-16 mx-auto mb-4" style={{ color: "#FFE8ED" }} />
        <h2 className="text-xl font-bold mb-2">還沒有配對推薦</h2>
        <p className="text-gray-500 mb-6">完成心理測驗後，我們會為你推薦最契合的對象</p>
        <a href="/quizzes" className="inline-block px-6 py-3 rounded-xl text-white font-medium" style={{ backgroundColor: "#FF6B8A" }}>去做測驗</a>
      </div>
    )
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-2">每日推薦</h1>
      <p className="text-gray-500 mb-8">根據心理測驗結果，為你推薦最契合的對象</p>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {matches.map(m => (
          <div key={m.id} className="bg-white rounded-2xl border border-gray-100 overflow-hidden hover:shadow-lg transition">
            <div className="h-48 bg-gradient-to-br from-pink-100 to-pink-50 flex items-center justify-center relative">
              <div className="w-20 h-20 rounded-full bg-white flex items-center justify-center text-3xl font-bold" style={{ color: "#FF6B8A" }}>
                {m.name ? m.name[0] : "?"}
              </div>
              <div className="absolute top-3 right-3 px-3 py-1 rounded-full text-sm font-bold text-white" style={{ backgroundColor: m.score >= 80 ? "#10b981" : m.score >= 60 ? "#f59e0b" : "#6b7280" }}>
                {m.score}%
              </div>
            </div>
            <div className="p-5">
              <h3 className="font-bold text-lg">{m.name}</h3>
              <p className="text-gray-500 text-sm">{m.age ? `${m.age}歲` : ""} {m.location && `· ${m.location}`}</p>
              {m.occupation && <p className="text-gray-400 text-sm">{m.occupation}</p>}
              {m.bio && <p className="text-gray-500 text-sm mt-2 line-clamp-2">{m.bio}</p>}

              {/* Dimension scores */}
              {m.dimensions && Object.keys(m.dimensions).length > 0 && (
                <div className="mt-4 space-y-2">
                  {Object.entries(m.dimensions).map(([key, val]) => (
                    <div key={key} className="flex items-center gap-2 text-xs">
                      <span className="w-16 text-gray-400">{key === "bigfive" ? "人格" : key === "lovelanguage" ? "愛之語" : key === "travel" ? "旅伴" : "婚姻"}</span>
                      <div className="flex-1 bg-gray-100 rounded-full h-1.5">
                        <div className="h-1.5 rounded-full" style={{ width: `${val}%`, backgroundColor: "#FF6B8A" }} />
                      </div>
                      <span className="w-8 text-right">{val}%</span>
                    </div>
                  ))}
                </div>
              )}

              <div className="mt-4 flex gap-2">
                <button onClick={() => setSelected(m)} className="flex-1 py-2 rounded-xl text-sm font-medium border border-gray-200 hover:border-pink-200 transition">查看詳情</button>
                <button className="px-4 py-2 rounded-xl text-sm font-medium text-white" style={{ backgroundColor: "#FF6B8A" }}>♥</button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Detail Modal */}
      {selected && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={() => setSelected(null)}>
          <div className="bg-white rounded-2xl max-w-md w-full max-h-[80vh] overflow-y-auto p-6" onClick={e => e.stopPropagation()}>
            <div className="flex justify-between items-start mb-4">
              <div className="flex items-center gap-3">
                <div className="w-16 h-16 rounded-full bg-pink-100 flex items-center justify-center text-2xl font-bold" style={{ color: "#FF6B8A" }}>{selected.name[0]}</div>
                <div>
                  <h2 className="font-bold text-xl">{selected.name}</h2>
                  <p className="text-gray-500">{selected.age}歲 {selected.location && `· ${selected.location}`}</p>
                </div>
              </div>
              <button onClick={() => setSelected(null)} className="text-gray-400"><X className="w-5 h-5" /></button>
            </div>
            {selected.bio && <p className="text-gray-600 mb-4">{selected.bio}</p>}
            {selected.occupation && <p className="text-sm text-gray-500 mb-4">職業：{selected.occupation}</p>}

            <div className="mb-4 p-4 bg-pink-50 rounded-xl">
              <h3 className="font-bold mb-2" style={{ color: "#FF6B8A" }}>配對分析</h3>
              <div className="text-3xl font-bold" style={{ color: "#FF6B8A" }}>{selected.score}%</div>
              <p className="text-sm text-gray-500 mt-1">整體匹配度</p>
            </div>

            <button className="w-full py-3 rounded-xl text-white font-medium flex items-center justify-center gap-2" style={{ backgroundColor: "#FF6B8A" }}>
              <MessageCircle className="w-5 h-5" /> 發送見面邀請
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
