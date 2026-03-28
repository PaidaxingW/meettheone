"use client"
import { useState } from "react"
import { Heart, MessageCircle, Share2, PenLine } from "lucide-react"

const initialPosts = [
  { id: "1", title: "如何判斷一個人是否適合你？", content: "分享三個我在心理學中學到的重要判斷標準：1. 價值觀是否一致 2. 溝通方式是否互補 3. 是否能接受對方的缺點...", author: "小美", likes: 42, time: "3小時前" },
  { id: "2", title: "第一次見面的約會地點推薦", content: "我建議選一個安靜的咖啡廳，不要太吵雜，方便聊天。避開電影院，因為沒辦法交流。如果有共通興趣，可以考慮逛展覽...", author: "小芳", likes: 28, time: "5小時前" },
  { id: "3", title: "大五人格測驗真的準嗎？", content: "做完大五人格測驗後，發現跟自己的認知蠻一致的！尤其是開放性和盡責性的分數，跟我平時的性格完全吻合。推薦大家也來做做看...", author: "阿傑", likes: 35, time: "1天前" },
  { id: "4", title: "遠距離戀愛的維持秘訣", content: "和男朋友交往兩年，其中有半年是遠距離。分享一下我們維持感情的方法：每天固定的視訊時間、一起看電影、寄小禮物驚喜...", author: "小琳", likes: 56, time: "2天前" },
]

export default function CommunityPage() {
  const [posts, setPosts] = useState(initialPosts)
  const [showForm, setShowForm] = useState(false)
  const [newPost, setNewPost] = useState({ title: "", content: "" })

  const handleSubmit = () => {
    if (!newPost.title || !newPost.content) return
    setPosts([{ id: Date.now().toString(), ...newPost, author: "我", likes: 0, time: "剛剛" }, ...posts])
    setNewPost({ title: "", content: "" })
    setShowForm(false)
  }

  const toggleLike = (id: string) => {
    setPosts(posts.map(p => p.id === id ? { ...p, likes: p.likes + 1 } : p))
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold">戀愛社區</h1>
          <p className="text-gray-500">分享你的戀愛經驗，互相學習成長</p>
        </div>
        <button onClick={() => setShowForm(!showForm)}
          className="px-4 py-2 rounded-xl text-white text-sm font-medium flex items-center gap-2" style={{ backgroundColor: "#FF6B8A" }}>
          <PenLine className="w-4 h-4" /> 發文
        </button>
      </div>

      {showForm && (
        <div className="mb-6 p-6 rounded-2xl border border-gray-200 bg-white">
          <input type="text" placeholder="標題" value={newPost.title} onChange={e => setNewPost({ ...newPost, title: e.target.value })}
            className="w-full px-4 py-3 border border-gray-200 rounded-xl mb-3 text-sm focus:outline-none focus:ring-2 focus:ring-pink-200" />
          <textarea placeholder="分享你的經驗..." rows={4} value={newPost.content} onChange={e => setNewPost({ ...newPost, content: e.target.value })}
            className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-pink-200 resize-none" />
          <div className="flex justify-end gap-2 mt-3">
            <button onClick={() => setShowForm(false)} className="px-4 py-2 text-sm text-gray-500">取消</button>
            <button onClick={handleSubmit} className="px-4 py-2 rounded-xl text-white text-sm font-medium" style={{ backgroundColor: "#FF6B8A" }}>發布</button>
          </div>
        </div>
      )}

      <div className="space-y-4">
        {posts.map(post => (
          <article key={post.id} className="p-6 rounded-2xl border border-gray-100 bg-white hover:shadow-sm transition">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 rounded-full bg-pink-100 flex items-center justify-center text-sm font-bold" style={{ color: "#FF6B8A" }}>{post.author[0]}</div>
              <span className="font-medium text-sm">{post.author}</span>
              <span className="text-xs text-gray-400">{post.time}</span>
            </div>
            <h3 className="font-bold text-lg mb-2">{post.title}</h3>
            <p className="text-gray-600 text-sm mb-4">{post.content}</p>
            <div className="flex items-center gap-6 text-sm text-gray-400">
              <button onClick={() => toggleLike(post.id)} className="flex items-center gap-1 hover:text-pink-400 transition">
                <Heart className={`w-4 h-4 ${post.likes > 0 ? "fill-pink-400 text-pink-400" : ""}`} /> {post.likes}
              </button>
              <button className="flex items-center gap-1 hover:text-gray-600 transition"><MessageCircle className="w-4 h-4" /> 回覆</button>
              <button className="flex items-center gap-1 hover:text-gray-600 transition"><Share2 className="w-4 h-4" /> 分享</button>
            </div>
          </article>
        ))}
      </div>
    </div>
  )
}
