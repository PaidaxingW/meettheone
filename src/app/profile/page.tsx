"use client"
import { useSession } from "next-auth/react"
import { useState, useEffect } from "react"
import { Camera, Save, Check } from "lucide-react"

export default function ProfilePage() {
  const { data: session, update } = useSession()
  const [saved, setSaved] = useState(false)
  const [form, setForm] = useState({
    name: "", gender: "", birthDate: "", height: "", occupation: "", education: "", income: "", location: "", bio: "",
    minAge: "", maxAge: "", minHeight: "", maxHeight: "", prefLocation: "", prefEducation: "",
  })

  useEffect(() => {
    if (session?.user) {
      setForm(f => ({ ...f, name: (session.user as any).name || "" }))
      fetch(`/api/auth/profile?id=${(session.user as any).id}`)
        .then(r => r.json())
        .then(data => {
          if (data.birthDate) data.birthDate = data.birthDate.split("T")[0]
          setForm(f => ({ ...f, ...data }))
        })
        .catch(() => {})
    }
  }, [session])

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!session?.user) return
    const res = await fetch("/api/auth/profile", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: (session.user as any).id, ...form }),
    })
    if (res.ok) {
      setSaved(true)
      await update({ name: form.name })
      setTimeout(() => setSaved(false), 2000)
    }
  }

  if (!session) return <div className="text-center py-20">請先登入</div>

  const inputClass = "w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-200 transition text-sm"
  const labelClass = "block text-sm font-medium text-gray-700 mb-1"
  const selectClass = inputClass + " appearance-none bg-white"

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-8">個人資料</h1>

      {/* Avatar */}
      <div className="flex items-center gap-6 mb-8 p-6 bg-gray-50 rounded-2xl">
        <div className="w-24 h-24 rounded-full bg-pink-100 flex items-center justify-center text-3xl overflow-hidden" style={{ color: "#FF6B8A" }}>
          {form.name ? form.name[0] : "?"}
        </div>
        <div>
          <h2 className="font-bold text-lg">{form.name || "未設定"}</h2>
          <p className="text-gray-500 text-sm">{(session.user as any)?.email}</p>
          <button className="mt-2 text-sm flex items-center gap-1" style={{ color: "#FF6B8A" }}>
            <Camera className="w-4 h-4" /> 更換頭像
          </button>
        </div>
      </div>

      <form onSubmit={handleSave} className="space-y-8">
        {/* Basic Info */}
        <section>
          <h3 className="font-bold text-lg mb-4" style={{ color: "#FF6B8A" }}>基本資料</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div><label className={labelClass}>暱稱</label><input className={inputClass} value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} /></div>
            <div><label className={labelClass}>性別</label>
              <select className={selectClass} value={form.gender} onChange={e => setForm({ ...form, gender: e.target.value })}>
                <option value="">請選擇</option><option value="male">男</option><option value="female">女</option>
              </select>
            </div>
            <div><label className={labelClass}>出生日期</label><input type="date" className={inputClass} value={form.birthDate} onChange={e => setForm({ ...form, birthDate: e.target.value })} /></div>
            <div><label className={labelClass}>身高 (cm)</label><input type="number" className={inputClass} value={form.height} onChange={e => setForm({ ...form, height: e.target.value })} /></div>
            <div><label className={labelClass}>職業</label><input className={inputClass} value={form.occupation} onChange={e => setForm({ ...form, occupation: e.target.value })} /></div>
            <div><label className={labelClass}>學歷</label>
              <select className={selectClass} value={form.education} onChange={e => setForm({ ...form, education: e.target.value })}>
                <option value="">請選擇</option><option value="highschool">高中</option><option value="bachelor">大學</option><option value="master">碩士</option><option value="phd">博士</option>
              </select>
            </div>
            <div><label className={labelClass}>收入</label>
              <select className={selectClass} value={form.income} onChange={e => setForm({ ...form, income: e.target.value })}>
                <option value="">請選擇</option><option value="3w">3萬以下</option><option value="3-5w">3-5萬</option><option value="5-8w">5-8萬</option><option value="8w+">8萬以上</option>
              </select>
            </div>
            <div><label className={labelClass}>地區</label><input className={inputClass} value={form.location} onChange={e => setForm({ ...form, location: e.target.value })} placeholder="例如：台北市" /></div>
          </div>
          <div className="mt-4"><label className={labelClass}>自我介紹</label><textarea className={inputClass} rows={3} value={form.bio} onChange={e => setForm({ ...form, bio: e.target.value })} placeholder="簡單介紹自己..." /></div>
        </section>

        {/* Preferences */}
        <section>
          <h3 className="font-bold text-lg mb-4" style={{ color: "#FF6B8A" }}>擇偶條件</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div><label className={labelClass}>年齡範圍</label>
              <div className="flex gap-2"><input type="number" className={inputClass} placeholder="最低" value={form.minAge} onChange={e => setForm({ ...form, minAge: e.target.value })} /><span className="self-center">~</span><input type="number" className={inputClass} placeholder="最高" value={form.maxAge} onChange={e => setForm({ ...form, maxAge: e.target.value })} /></div>
            </div>
            <div><label className={labelClass}>身高範圍 (cm)</label>
              <div className="flex gap-2"><input type="number" className={inputClass} placeholder="最低" value={form.minHeight} onChange={e => setForm({ ...form, minHeight: e.target.value })} /><span className="self-center">~</span><input type="number" className={inputClass} placeholder="最高" value={form.maxHeight} onChange={e => setForm({ ...form, maxHeight: e.target.value })} /></div>
            </div>
            <div><label className={labelClass}>偏好地區</label><input className={inputClass} value={form.prefLocation} onChange={e => setForm({ ...form, prefLocation: e.target.value })} /></div>
            <div><label className={labelClass}>最低學歷</label>
              <select className={selectClass} value={form.prefEducation} onChange={e => setForm({ ...form, prefEducation: e.target.value })}>
                <option value="">不限</option><option value="highschool">高中</option><option value="bachelor">大學</option><option value="master">碩士</option><option value="phd">博士</option>
              </select>
            </div>
          </div>
        </section>

        <button type="submit" className="w-full py-3 rounded-xl text-white font-medium transition hover:opacity-90 flex items-center justify-center gap-2" style={{ backgroundColor: "#FF6B8A" }}>
          {saved ? <><Check className="w-5 h-5" /> 已儲存</> : <><Save className="w-5 h-5" /> 儲存資料</>}
        </button>
      </form>
    </div>
  )
}
