"use client"
import { useSession } from "next-auth/react"
import { useState } from "react"
import { Brain, Heart, Plane, Home, CheckCircle } from "lucide-react"
import { useRouter } from "next/navigation"

const quizzes = [
  { id: "bigfive", title: "大五人格測驗", icon: Brain, desc: "了解你的五大性格特質：開放性、盡責性、外向性、親和性、神經質", color: "#6366f1", questions: [
    { q: "我喜歡嘗試新的體驗", key: "openness" },
    { q: "我是一個有條理、有計畫的人", key: "conscientiousness" },
    { q: "我喜歡參加社交活動", key: "extraversion" },
    { q: "我很容易信任別人", key: "agreeableness" },
    { q: "我容易感到焦慮或壓力", key: "neuroticism" },
    { q: "我喜歡思考抽象的概念", key: "openness" },
    { q: "我總是按時完成任務", key: "conscientiousness" },
    { q: "我在人群中感到精力充沛", key: "extraversion" },
    { q: "我樂意幫助別人", key: "agreeableness" },
    { q: "我的情緒變化比較大", key: "neuroticism" },
  ]},
  { id: "lovelanguage", title: "愛之語測驗", icon: Heart, desc: "發現你的愛之語：肯定的言語、服務的行動、接受禮物、精心時刻、身體接觸", color: "#ec4899", questions: [
    { q: "我喜歡聽伴侶說「我愛你」", key: "words" },
    { q: "我喜歡伴侶幫我做家事", key: "acts" },
    { q: "我喜歡收到伴侶的小驚喜", key: "gifts" },
    { q: "我喜歡和伴侶一起做事情", key: "time" },
    { q: "我喜歡和伴侶擁抱牽手", key: "touch" },
    { q: "讚美和鼓勵對我很重要", key: "words" },
    { q: "當伴侶為我服務時，我感到被愛", key: "acts" },
    { q: "精心準備的禮物讓我感動", key: "gifts" },
    { q: "不被打擾的二人時光很珍貴", key: "time" },
    { q: "身體上的親近讓我感到安心", key: "touch" },
  ]},
  { id: "travel", title: "旅伴測驗", icon: Plane, desc: "了解你的旅行風格：計畫型 vs 隨性型、奢侈 vs 省錢、冒險 vs 休閒", color: "#f59e0b", questions: [
    { q: "旅行前我會做詳細行程規劃", key: "planned" },
    { q: "我喜歡隨性的旅行方式", key: "spontaneous" },
    { q: "旅行預算我會精打細算", key: "budget" },
    { q: "我願意在旅行上花較多錢", key: "luxury" },
    { q: "我喜歡冒險刺激的活動", key: "adventure" },
    { q: "我偏好放鬆的度假方式", key: "relax" },
    { q: "旅行中遇到問題我會冷靜處理", key: "calm" },
    { q: "我喜歡體驗當地文化和美食", key: "culture" },
  ]},
  { id: "marriage", title: "婚姻價值觀問卷", icon: Home, desc: "探索你的家庭觀、婚姻觀、子女教育、家事分工等價值觀", color: "#10b981", questions: [
    { q: "婚姻中，雙方應該共同承擔家事", key: "equality" },
    { q: "我認為家庭比事業更重要", key: "family" },
    { q: "我希望未來有小孩", key: "children" },
    { q: "我願意和公婆/岳父母同住", key: "parents" },
    { q: "財務應該共同管理", key: "finance" },
    { q: "我重視傳統家庭價值觀", key: "tradition" },
    { q: "夫妻應該有各自的個人空間", key: "space" },
    { q: "教育子女應該嚴格管教", key: "discipline" },
  ]},
]

export default function QuizzesPage() {
  const { data: session } = useSession()
  const router = useRouter()
  const [activeQuiz, setActiveQuiz] = useState<string | null>(null)
  const [answers, setAnswers] = useState<Record<string, string>>({})
  const [completed, setCompleted] = useState<string[]>([])
  const [saving, setSaving] = useState(false)

  if (!session) return <div className="text-center py-20">請先登入以進行測驗</div>

  const quiz = quizzes.find(q => q.id === activeQuiz)

  const handleSave = async () => {
    if (!quiz) return
    setSaving(true)
    const scores: Record<string, number> = {}
    quiz.questions.forEach(q => {
      scores[q.key] = (scores[q.key] || 0) + 1
    })

    const res = await fetch("/api/quiz", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId: (session.user as any).id, quizType: quiz.id, scores }),
    })
    if (res.ok) {
      setCompleted([...completed, quiz.id])
      setActiveQuiz(null)
      setAnswers({})
    }
    setSaving(false)
  }

  if (quiz && !completed.includes(quiz.id)) {
    const currentQ = quiz.questions.find((_, i) => !answers[i.toString()])
    const currentIndex = currentQ ? quiz.questions.indexOf(currentQ) : -1

    return (
      <div className="max-w-2xl mx-auto px-4 py-8">
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-2">
            <quiz.icon className="w-6 h-6" style={{ color: quiz.color }} />
            <span className="font-bold text-lg">{quiz.title}</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div className="h-2 rounded-full transition-all" style={{ width: `${((currentIndex) / quiz.questions.length) * 100}%`, backgroundColor: quiz.color }} />
          </div>
          <p className="text-sm text-gray-400 mt-1">{Math.min(currentIndex + 1, quiz.questions.length)} / {quiz.questions.length}</p>
        </div>

        {currentQ ? (
          <div className="bg-white rounded-2xl border border-gray-100 p-8">
            <p className="text-xl font-medium mb-6">{currentQ.q}</p>
            <div className="grid grid-cols-1 gap-3">
              {["非常不同意", "不同意", "普通", "同意", "非常同意"].map((opt, i) => (
                <button key={i} onClick={() => setAnswers({ ...answers, [currentIndex.toString()]: opt })}
                  className={`p-4 rounded-xl border text-left transition ${answers[currentIndex.toString()] === opt ? "border-pink-300 bg-pink-50" : "border-gray-200 hover:border-pink-200"}`}>
                  {opt}
                </button>
              ))}
            </div>
          </div>
        ) : (
          <div className="text-center py-12">
            <CheckCircle className="w-16 h-16 mx-auto mb-4 text-green-500" />
            <h2 className="text-2xl font-bold mb-4">測驗完成！</h2>
            <p className="text-gray-500 mb-8">你的結果已計算完成，將用於智能配對</p>
            <button onClick={handleSave} disabled={saving}
              className="px-8 py-3 rounded-xl text-white font-medium transition hover:opacity-90" style={{ backgroundColor: quiz.color }}>
              {saving ? "儲存中..." : "儲存結果"}
            </button>
          </div>
        )}
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-2">心理測驗</h1>
      <p className="text-gray-500 mb-8">完成測驗，讓我們更了解你，為你找到更契合的對象</p>

      <div className="grid md:grid-cols-2 gap-6">
        {quizzes.map(q => (
          <div key={q.id} onClick={() => setActiveQuiz(q.id)}
            className="p-6 rounded-2xl border border-gray-100 hover:shadow-lg transition cursor-pointer bg-white">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ backgroundColor: q.color + "20" }}>
                <q.icon className="w-6 h-6" style={{ color: q.color }} />
              </div>
              <div>
                <h3 className="font-bold">{q.title}</h3>
                {completed.includes(q.id) && <span className="text-xs text-green-500">✓ 已完成</span>}
              </div>
            </div>
            <p className="text-gray-500 text-sm">{q.desc}</p>
            <p className="text-xs text-gray-400 mt-2">{q.questions.length} 題 · 約 3 分鐘</p>
          </div>
        ))}
      </div>

      {completed.length > 0 && (
        <div className="mt-8 text-center">
          <button onClick={() => router.push("/matches")}
            className="px-8 py-3 rounded-xl text-white font-medium transition hover:opacity-90" style={{ backgroundColor: "#FF6B8A" }}>
            查看我的配對 →
          </button>
        </div>
      )}
    </div>
  )
}
