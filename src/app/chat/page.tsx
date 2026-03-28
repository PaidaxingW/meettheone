"use client"
import { useSession } from "next-auth/react"
import { useState, useEffect, useRef } from "react"
import { Send, Clock, Heart } from "lucide-react"

interface ChatMatch {
  id: string
  name: string
  lastMessage?: string
  expiresAt?: string
}

interface Msg {
  id: string
  content: string
  senderId: string
  createdAt: string
}

export default function ChatPage() {
  const { data: session } = useSession()
  const [chatList, setChatList] = useState<ChatMatch[]>([])
  const [activeChat, setActiveChat] = useState<string | null>(null)
  const [messages, setMessages] = useState<Msg[]>([])
  const [newMsg, setNewMsg] = useState("")
  const messagesEnd = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (session?.user) {
      // Mock chat list
      setChatList([
        { id: "1", name: "小明", lastMessage: "嗨，很高興認識你！", expiresAt: new Date(Date.now() + 48 * 3600000).toISOString() },
        { id: "2", name: "小美", lastMessage: "週末有空見面嗎？", expiresAt: new Date(Date.now() + 24 * 3600000).toISOString() },
      ])
    }
  }, [session])

  useEffect(() => {
    if (activeChat) {
      setMessages([
        { id: "1", content: "嗨，很高興匹配成功！", senderId: "other", createdAt: new Date().toISOString() },
        { id: "2", content: "你好呀！很高興認識你 😊", senderId: (session?.user as any)?.id || "", createdAt: new Date().toISOString() },
      ])
    }
  }, [activeChat])

  useEffect(() => { messagesEnd.current?.scrollIntoView({ behavior: "smooth" }) }, [messages])

  const sendMessage = () => {
    if (!newMsg.trim()) return
    setMessages([...messages, { id: Date.now().toString(), content: newMsg, senderId: (session?.user as any)?.id || "", createdAt: new Date().toISOString() }])
    setNewMsg("")

    // Simulate reply
    setTimeout(() => {
      const replies = ["好的 👍", "我也是这麼想的！", "哈哈太有趣了", "那我們约周末見面？"]
      setMessages(prev => [...prev, { id: (Date.now() + 1).toString(), content: replies[Math.floor(Math.random() * replies.length)], senderId: activeChat!, createdAt: new Date().toISOString() }])
    }, 1500)
  }

  if (!session) return <div className="text-center py-20">请先登录</div>

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-8">聊天室</h1>

      <div className="flex gap-4 h-[calc(100vh-200px)]">
        {/* Chat list */}
        <div className="w-full md:w-80 border border-gray-100 rounded-2xl overflow-hidden flex flex-col">
          <div className="p-4 border-b border-gray-100 font-medium text-gray-500">对话列表</div>
          {chatList.length === 0 ? (
            <div className="flex-1 flex items-center justify-center text-gray-400 text-sm p-4 text-center">还没有对话，先去匹配页面发送邀请吧！</div>
          ) : (
            chatList.map(chat => (
              <button key={chat.id} onClick={() => setActiveChat(chat.id)}
                className={`p-4 text-left border-b border-gray-50 hover:bg-gray-50 transition flex items-center gap-3 ${activeChat === chat.id ? "bg-pink-50" : ""}`}>
                <div className="w-12 h-12 rounded-full bg-pink-100 flex items-center justify-center font-bold flex-shrink-0" style={{ color: "#FF6B8A" }}>{chat.name[0]}</div>
                <div className="flex-1 min-w-0">
                  <div className="font-medium flex items-center gap-2">{chat.name}</div>
                  <p className="text-sm text-gray-400 truncate">{chat.lastMessage}</p>
                </div>
                {chat.expiresAt && (
                  <div className="text-xs text-orange-400 flex items-center gap-1 flex-shrink-0">
                    <Clock className="w-3 h-3" /> {Math.ceil((new Date(chat.expiresAt).getTime() - Date.now()) / 3600000)}h
                  </div>
                )}
              </button>
            ))
          )}
        </div>

        {/* Chat area */}
        {activeChat ? (
          <div className="hidden md:flex flex-1 border border-gray-100 rounded-2xl overflow-hidden flex-col">
            <div className="p-4 border-b border-gray-100 font-medium flex items-center gap-2">
              <Heart className="w-4 h-4" style={{ color: "#FF6B8A" }} />
              {chatList.find(c => c.id === activeChat)?.name}
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-gray-50">
              {messages.map(msg => (
                <div key={msg.id} className={`flex ${msg.senderId === (session.user as any)?.id ? "justify-end" : "justify-start"}`}>
                  <div className={`max-w-xs px-4 py-2 rounded-2xl text-sm ${msg.senderId === (session.user as any)?.id ? "text-white rounded-br-md" : "bg-white border border-gray-200 rounded-bl-md"}`}
                    style={msg.senderId === (session.user as any)?.id ? { backgroundColor: "#FF6B8A" } : {}}>
                    {msg.content}
                  </div>
                </div>
              ))}
              <div ref={messagesEnd} />
            </div>

            <div className="p-4 border-t border-gray-100 flex gap-2">
              <input type="text" value={newMsg} onChange={e => setNewMsg(e.target.value)}
                onKeyDown={e => e.key === "Enter" && sendMessage()}
                placeholder="输入消息..."
                className="flex-1 px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-200 text-sm" />
              <button onClick={sendMessage} className="px-4 py-3 rounded-xl text-white transition hover:opacity-90" style={{ backgroundColor: "#FF6B8A" }}>
                <Send className="w-5 h-5" />
              </button>
            </div>
          </div>
        ) : (
          <div className="hidden md:flex flex-1 items-center justify-center text-gray-400">选择一个对话开始聊天</div>
        )}
      </div>
    </div>
  )
}
