"use client"
import { useSession } from "next-auth/react"
import { useState, useEffect } from "react"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, Legend } from "recharts"
import { TrendingUp, Heart, Users, Star } from "lucide-react"

export default function DashboardPage() {
  const { data: session } = useSession()
  const [quizData, setQuizData] = useState<any>(null)
  const [matchStats, setMatchStats] = useState({ total: 0, avg: 0, top: 0 })

  useEffect(() => {
    if (session?.user) {
      fetch(`/api/quiz?userId=${(session.user as any).id}`)
        .then(r => r.json())
        .then(setQuizData)

      fetch(`/api/matches?userId=${(session.user as any).id}`)
        .then(r => r.json())
        .then(data => {
          setMatchStats({
            total: data.length,
            avg: data.length ? Math.round(data.reduce((s: number, d: any) => s + d.score, 0) / data.length) : 0,
            top: data.length ? data[0]?.score || 0 : 0,
          })
        })
    }
  }, [session])

  if (!session) return <div className="text-center py-20">請先登入</div>

  const radarData = quizData?.map((q: any) => {
    const labels: Record<string, string> = { bigfive: "人格", lovelanguage: "愛之語", travel: "旅伴", marriage: "婚姻觀" }
    const total = Object.values(q.scores).reduce((s: number, v: any) => s + v, 0) as number
    const max = Object.values(q.scores).length * 3
    return { subject: labels[q.quizType] || q.quizType, value: Math.round((total / max) * 100) }
  }) || []

  const matchBarData = [
    { range: "90%+", count: 0 },
    { range: "80-89%", count: 0 },
    { range: "70-79%", count: 0 },
    { range: "60-69%", count: 0 },
    { range: "<60%", count: 0 },
  ]

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-2">配對分析儀表板</h1>
      <p className="text-gray-500 mb-8">了解你的配對數據和心理測驗分析</p>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {[
          { icon: Users, label: "推薦人數", value: matchStats.total, color: "#FF6B8A" },
          { icon: TrendingUp, label: "平均匹配", value: `${matchStats.avg}%`, color: "#6366f1" },
          { icon: Star, label: "最高匹配", value: `${matchStats.top}%`, color: "#f59e0b" },
          { icon: Heart, label: "完成測驗", value: `${quizData?.length || 0}/4`, color: "#10b981" },
        ].map((s, i) => (
          <div key={i} className="p-5 rounded-2xl border border-gray-100 bg-white">
            <s.icon className="w-5 h-5 mb-2" style={{ color: s.color }} />
            <div className="text-2xl font-bold">{s.value}</div>
            <div className="text-sm text-gray-500">{s.label}</div>
          </div>
        ))}
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        {/* Radar Chart */}
        <div className="bg-white rounded-2xl border border-gray-100 p-6">
          <h3 className="font-bold mb-4">心理測驗概覽</h3>
          {radarData.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <RadarChart data={radarData}>
                <PolarGrid />
                <PolarAngleAxis dataKey="subject" />
                <PolarRadiusAxis domain={[0, 100]} />
                <Radar name="你的分數" dataKey="value" stroke="#FF6B8A" fill="#FF6B8A" fillOpacity={0.3} />
              </RadarChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-[300px] flex items-center justify-center text-gray-400">完成測驗後顯示數據</div>
          )}
        </div>

        {/* Match Distribution */}
        <div className="bg-white rounded-2xl border border-gray-100 p-6">
          <h3 className="font-bold mb-4">匹配度分佈</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={matchBarData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="range" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="count" fill="#FF6B8A" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Tips */}
      <div className="mt-8 p-6 rounded-2xl bg-pink-50">
        <h3 className="font-bold mb-3" style={{ color: "#FF6B8A" }}>💡 AI 相處建議</h3>
        <ul className="space-y-2 text-sm text-gray-600">
          <li>• 完成更多心理測驗可以提升配對精準度</li>
          <li>• 72 小時內見面是關係建立的最佳時機</li>
          <li>• 在聊天中展現真實的自己，建立信任感</li>
          <li>• 注意彼此的愛之語差異，用對方喜歡的方式表達關心</li>
        </ul>
      </div>
    </div>
  )
}
