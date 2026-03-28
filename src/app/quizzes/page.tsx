"use client"
import { useSession } from "next-auth/react"
import { useState } from "react"
import { Brain, Heart, Plane, Home, CheckCircle } from "lucide-react"
import { useRouter } from "next/navigation"

const quizzes = [
  { id: "bigfive", title: "大五人格测验", icon: Brain, desc: "了解你的五大性格特质：开放性、尽责性、外向性、亲和性、神经质", color: "#6366f1", questions: [
    { q: "我喜欢尝试新的体验", key: "openness" },
    { q: "我是一个有条理、有计划的人", key: "conscientiousness" },
    { q: "我喜欢参加社交活动", key: "extraversion" },
    { q: "我很容易信任别人", key: "agreeableness" },
    { q: "我容易感到焦虑或压力", key: "neuroticism" },
    { q: "我喜欢思考抽象的概念", key: "openness" },
    { q: "我总是按时完成任务", key: "conscientiousness" },
    { q: "我在人群中感到精力充沛", key: "extraversion" },
    { q: "我乐意帮助别人", key: "agreeableness" },
    { q: "我的情绪变化比较大", key: "neuroticism" },
  ]},
  { id: "lovelanguage", title: "爱的语言测验", icon: Heart, desc: "发现你的爱的语言：肯定的言语、服务的行动、接受礼物、精心时刻、身体接触", color: "#ec4899", questions: [
    { q: "我喜欢听伴侣说「我爱你」", key: "words" },
    { q: "我喜欢伴侣帮我做家务", key: "acts" },
    { q: "我喜欢收到伴侣的小惊喜", key: "gifts" },
    { q: "我喜欢和伴侣一起做事情", key: "time" },
    { q: "我喜欢和伴侣拥抱牵手", key: "touch" },
    { q: "赞美和鼓励对我很重要", key: "words" },
    { q: "当伴侣为我服务时，我感到被爱", key: "acts" },
    { q: "精心准备的礼物让我感动", key: "gifts" },
    { q: "不被打扰的二人时光很珍贵", key: "time" },
    { q: "身体上的亲近让我感到安心", key: "touch" },
  ]},
  { id: "travel", title: "旅伴测验", icon: Plane, desc: "了解你的旅行风格：计划型 vs 随性型、奢侈 vs 省钱、冒险 vs 休闲", color: "#f59e0b", questions: [
    { q: "旅行前我会做详细行程规划", key: "planned" },
    { q: "我喜欢随性的旅行方式", key: "spontaneous" },
    { q: "旅行预算我会精打细算", key: "budget" },
    { q: "我愿意在旅行上花较多钱", key: "luxury" },
    { q: "我喜欢冒险刺激的活动", key: "adventure" },
    { q: "我偏好放松的度假方式", key: "relax" },
    { q: "旅行中遇到问题我会冷静处理", key: "calm" },
    { q: "我喜欢体验当地文化和美食", key: "culture" },
  ]},
  { id: "marriage", title: "婚姻價值觀問卷", icon: Home, desc: "探索你的家庭观、婚姻观、子女教育、家务分工等价值观", color: "#10b981", questions: [
    { q: "婚姻中，双方应该共同承担家务", key: "equality" },
    { q: "我认为家庭比事业更重要", key: "family" },
    { q: "我希望未来有小孩", key: "children" },
    { q: "我愿意和公婆/岳父母同住", key: "parents" },
    { q: "财务应该共同管理", key: "finance" },
    { q: "我重视传统家庭价值观", key: "tradition" },
    { q: "夫妻应该有各自的个人空间", key: "space" },
    { q: "教育子女应该严格管教", key: "discipline" },
  ]},
]

export default function QuizzesPage() {
  const { data: session } = useSession()
  const router = useRouter()
  const [activeQuiz, setActiveQuiz] = useState<string | null>(null)
  const [answers, setAnswers] = useState<Record<string, string>>({})
  const [completed, setCompleted] = useState<string[]>([])
  const [saving, setSaving] = useState(false)

  if (!session) return <div className="text-center py-20">请先登录以进行测验</div>

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
            <h2 className="text-2xl font-bold mb-4">测验完成！</h2>
            <p className="text-gray-500 mb-8">你的结果已计算完成，将用于智能匹配</p>
            <button onClick={handleSave} disabled={saving}
              className="px-8 py-3 rounded-xl text-white font-medium transition hover:opacity-90" style={{ backgroundColor: quiz.color }}>
              {saving ? "保存中..." : "保存结果"}
            </button>
          </div>
        )}
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-2">心理学测验</h1>
      <p className="text-gray-500 mb-8">完成测验，让我们更了解你，为你找到更契合的对象</p>

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
            <p className="text-xs text-gray-400 mt-2">{q.questions.length} 题 · 约 3 分钟</p>
          </div>
        ))}
      </div>

      {completed.length > 0 && (
        <div className="mt-8 text-center">
          <button onClick={() => router.push("/matches")}
            className="px-8 py-3 rounded-xl text-white font-medium transition hover:opacity-90" style={{ backgroundColor: "#FF6B8A" }}>
            查看我的匹配 →
          </button>
        </div>
      )}
    </div>
  )
}
