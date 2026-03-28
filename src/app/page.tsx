import Link from "next/link"
import { Heart, Brain, Users, Shield, Star, ArrowRight, Sparkles } from "lucide-react"

const successStories = [
  { names: "小明 & 小美", days: 180, quote: "透過大五人格測驗，我們發現彼此在開放性上完美互補！" },
  { names: "阿傑 & 小蘭", days: 90, quote: "旅伴測驗讓我們知道對方也是喜歡隨性旅行的靈魂。" },
  { names: "志豪 & 小琳", days: 270, quote: "婚姻價值觀問卷讓我們提前確認了人生方向。" },
]

const features = [
  { icon: Brain, title: "心理學測驗", desc: "大五人格、愛之語、旅伴測驗、婚姻價值觀，全方位了解自己與對方" },
  { icon: Sparkles, title: "智能配對", desc: "AI 驅動的多維匹配引擎，兼顧相似性與互補性" },
  { icon: Users, title: "見面約會", desc: "雙方確認後開啟聊天，72小時內敲定見面，讓真實連結發生" },
  { icon: Shield, title: "安全認證", desc: "實名驗證、照片審核，打造安全的交友環境" },
]

export default function Home() {
  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-br from-pink-50 to-white py-20 md:py-32">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-pink-50 text-sm font-medium mb-6" style={{ color: "#FF6B8A" }}>
            <Star className="w-4 h-4 fill-current" /> 心理學驅動 · 科學交友
          </div>
          <h1 className="text-4xl md:text-6xl font-bold leading-tight mb-6">
            用<span style={{ color: "#FF6B8A" }}>心理學</span>，<br />
            找到<span style={{ color: "#FF6B8A" }}>對的人</span>
          </h1>
          <p className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto mb-10">
            MeetTheOne 運用心理學量表與 AI 演算法，幫你找到真正契合的另一半。<br />
            不只是條件匹配，更是心靈相通。
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/register" className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-full text-white text-lg font-medium transition hover:opacity-90 shadow-lg hover:shadow-xl" style={{ backgroundColor: "#FF6B8A" }}>
              開始尋找另一半 <ArrowRight className="w-5 h-5" />
            </Link>
            <Link href="/quizzes" className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-full border-2 text-lg font-medium transition hover:bg-gray-50" style={{ borderColor: "#FF6B8A", color: "#FF6B8A" }}>
              先做測驗
            </Link>
          </div>
        </div>
        {/* Decorative */}
        <div className="absolute top-10 left-10 w-20 h-20 rounded-full opacity-10" style={{ backgroundColor: "#FF6B8A" }} />
        <div className="absolute bottom-20 right-20 w-32 h-32 rounded-full opacity-10" style={{ backgroundColor: "#FF6B8A" }} />
      </section>

      {/* Features */}
      <section className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-4">為什麼選擇 MeetTheOne？</h2>
          <p className="text-gray-500 text-center mb-12 max-w-xl mx-auto">我們相信，好的關係建立在深入了解之上</p>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((f, i) => (
              <div key={i} className="text-center p-6 rounded-2xl hover:shadow-lg transition bg-white border border-gray-100">
                <div className="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-4" style={{ backgroundColor: "#FFE8ED" }}>
                  <f.icon className="w-7 h-7" style={{ color: "#FF6B8A" }} />
                </div>
                <h3 className="font-bold text-lg mb-2">{f.title}</h3>
                <p className="text-gray-500 text-sm">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">三步找到真愛</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { step: "01", title: "完成心理測驗", desc: "4 套專業心理學量表，深入了解你的性格與價值觀" },
              { step: "02", title: "智能配對推薦", desc: "AI 分析測驗結果，每日推薦最契合的對象" },
              { step: "03", title: "見面聊聊", desc: "雙方確認後開啟聊天，72 小時內見面，讓真實發生" },
            ].map((s) => (
              <div key={s.step} className="text-center">
                <div className="text-5xl font-bold mb-4" style={{ color: "#FF6B8A", opacity: 0.3 }}>{s.step}</div>
                <h3 className="font-bold text-lg mb-2">{s.title}</h3>
                <p className="text-gray-500 text-sm">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Success Stories */}
      <section className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-4">幸福見證</h2>
          <p className="text-gray-500 text-center mb-12">真實會員的愛情故事</p>
          <div className="grid md:grid-cols-3 gap-8">
            {successStories.map((s, i) => (
              <div key={i} className="p-6 rounded-2xl border border-gray-100 bg-white hover:shadow-lg transition">
                <div className="flex items-center gap-2 mb-3">
                  <Heart className="w-5 h-5 fill-current" style={{ color: "#FF6B8A" }} />
                  <span className="font-bold">{s.names}</span>
                </div>
                <p className="text-gray-600 text-sm mb-4">&ldquo;{s.quote}&rdquo;</p>
                <div className="text-xs text-gray-400">交往 {s.days} 天 💕</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-4 text-center rounded-3xl p-12" style={{ backgroundColor: "#FF6B8A" }}>
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">準備好找到對的人了嗎？</h2>
          <p className="text-pink-100 text-lg mb-8">加入 MeetTheOne，讓心理學為你的愛情之路點亮明燈</p>
          <Link href="/register" className="inline-flex items-center gap-2 px-8 py-4 bg-white rounded-full text-lg font-medium transition hover:bg-gray-50" style={{ color: "#FF6B8A" }}>
            免費開始 <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </section>
    </div>
  )
}
