"use client"
import { useSession } from "next-auth/react"
import { useState, useEffect } from "react"
import { Camera, Save, Check } from "lucide-react"
import { chinaRegions, getCities } from "@/lib/china-regions"

export default function ProfilePage() {
  const { data: session, update } = useSession()
  const [saved, setSaved] = useState(false)
  const [form, setForm] = useState({
    name: "", gender: "", birthDate: "", height: "", occupation: "", education: "", income: "", location: "", bio: "",
    minAge: "", maxAge: "", minHeight: "", maxHeight: "", prefLocation: "", prefEducation: "",
  })
  const [locationProvince, setLocationProvince] = useState("")
  const [prefLocationProvince, setPrefLocationProvince] = useState("")

  useEffect(() => {
    if (session?.user) {
      setForm(f => ({ ...f, name: (session.user as any).name || "" }))
      fetch(`/api/auth/profile?id=${(session.user as any).id}`)
        .then(r => r.json())
        .then(data => {
          if (data.birthDate) data.birthDate = data.birthDate.split("T")[0]
          if (data.location && data.location.includes(",")) {
            setLocationProvince(data.location.split(",")[0])
          }
          if (data.prefLocation && data.prefLocation.includes(",")) {
            setPrefLocationProvince(data.prefLocation.split(",")[0])
          }
          setForm(f => ({ ...f, ...data }))
        })
        .catch(() => {})
    }
  }, [session])

  const handleProvinceChange = (field: "location" | "prefLocation", province: string, setter: (v: string) => void) => {
    setter(province)
    setForm(f => ({ ...f, [field]: `${province},` }))
  }

  const handleCityChange = (field: "location" | "prefLocation", province: string, city: string) => {
    setForm(f => ({ ...f, [field]: `${province},${city}` }))
  }

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

  if (!session) return <div className="text-center py-20">请先登录</div>

  const inputClass = "w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-200 transition text-sm"
  const labelClass = "block text-sm font-medium text-gray-700 mb-1"
  const selectClass = inputClass + " appearance-none bg-white"

  const locationCities = getCities(locationProvince)
  const prefCities = getCities(prefLocationProvince)
  const currentLocationCity = form.location.includes(",") ? form.location.split(",")[1] : ""
  const currentPrefCity = form.prefLocation.includes(",") ? form.prefLocation.split(",")[1] : ""

  const regionSelector = (
    field: "location" | "prefLocation",
    province: string,
    cities: string[],
    currentCity: string,
    onProvinceChange: (v: string) => void,
    onCityChange: (city: string) => void,
    label: string
  ) => (
    <div>
      <label className={labelClass}>{label}</label>
      <div className="flex gap-2">
        <select className={selectClass + " flex-1"} value={province} onChange={e => onProvinceChange(e.target.value)}>
          <option value="">选择省份</option>
          {chinaRegions.map(r => <option key={r.province} value={r.province}>{r.province}</option>)}
        </select>
        <select className={selectClass + " flex-1"} value={currentCity} onChange={e => onCityChange(e.target.value)} disabled={!province}>
          <option value="">选择城市</option>
          {cities.map(c => <option key={c} value={c}>{c}</option>)}
        </select>
      </div>
    </div>
  )

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-8">个人资料</h1>

      <div className="flex items-center gap-6 mb-8 p-6 bg-gray-50 rounded-2xl">
        <div className="w-24 h-24 rounded-full bg-pink-100 flex items-center justify-center text-3xl overflow-hidden" style={{ color: "#FF6B8A" }}>
          {form.name ? form.name[0] : "?"}
        </div>
        <div>
          <h2 className="font-bold text-lg">{form.name || "未设置"}</h2>
          <p className="text-gray-500 text-sm">{(session.user as any)?.email}</p>
          <button className="mt-2 text-sm flex items-center gap-1" style={{ color: "#FF6B8A" }}>
            <Camera className="w-4 h-4" /> 更换头像
          </button>
        </div>
      </div>

      <form onSubmit={handleSave} className="space-y-8">
        <section>
          <h3 className="font-bold text-lg mb-4" style={{ color: "#FF6B8A" }}>基本资料</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div><label className={labelClass}>昵称</label><input className={inputClass} value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} /></div>
            <div><label className={labelClass}>性别</label>
              <select className={selectClass} value={form.gender} onChange={e => setForm({ ...form, gender: e.target.value })}>
                <option value="">请选择</option><option value="male">男</option><option value="female">女</option>
              </select>
            </div>
            <div><label className={labelClass}>出生日期</label><input type="date" className={inputClass} value={form.birthDate} onChange={e => setForm({ ...form, birthDate: e.target.value })} /></div>
            <div><label className={labelClass}>身高 (cm)</label><input type="number" className={inputClass} value={form.height} onChange={e => setForm({ ...form, height: e.target.value })} /></div>
            <div><label className={labelClass}>职业</label><input className={inputClass} value={form.occupation} onChange={e => setForm({ ...form, occupation: e.target.value })} /></div>
            <div><label className={labelClass}>学历</label>
              <select className={selectClass} value={form.education} onChange={e => setForm({ ...form, education: e.target.value })}>
                <option value="">请选择</option><option value="highschool">高中</option><option value="bachelor">大学</option><option value="master">硕士</option><option value="phd">博士</option>
              </select>
            </div>
            <div><label className={labelClass}>收入</label>
              <select className={selectClass} value={form.income} onChange={e => setForm({ ...form, income: e.target.value })}>
                <option value="">请选择</option><option value="3w">3万以下</option><option value="3-5w">3-5万</option><option value="5-8w">5-8万</option><option value="8w+">8万以上</option>
              </select>
            </div>
            <div className="md:col-span-2">
              {regionSelector("location", locationProvince, locationCities, currentLocationCity,
                v => handleProvinceChange("location", v, setLocationProvince),
                v => handleCityChange("location", locationProvince, v), "地区")}
            </div>
          </div>
          <div className="mt-4"><label className={labelClass}>自我介绍</label><textarea className={inputClass} rows={3} value={form.bio} onChange={e => setForm({ ...form, bio: e.target.value })} placeholder="简单介绍自己..." /></div>
        </section>

        <section>
          <h3 className="font-bold text-lg mb-4" style={{ color: "#FF6B8A" }}>择偶条件</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div><label className={labelClass}>年龄范围</label>
              <div className="flex gap-2"><input type="number" className={inputClass} placeholder="最低" value={form.minAge} onChange={e => setForm({ ...form, minAge: e.target.value })} /><span className="self-center">~</span><input type="number" className={inputClass} placeholder="最高" value={form.maxAge} onChange={e => setForm({ ...form, maxAge: e.target.value })} /></div>
            </div>
            <div><label className={labelClass}>身高范围 (cm)</label>
              <div className="flex gap-2"><input type="number" className={inputClass} placeholder="最低" value={form.minHeight} onChange={e => setForm({ ...form, minHeight: e.target.value })} /><span className="self-center">~</span><input type="number" className={inputClass} placeholder="最高" value={form.maxHeight} onChange={e => setForm({ ...form, maxHeight: e.target.value })} /></div>
            </div>
            <div className="md:col-span-2">
              {regionSelector("prefLocation", prefLocationProvince, prefCities, currentPrefCity,
                v => handleProvinceChange("prefLocation", v, setPrefLocationProvince),
                v => handleCityChange("prefLocation", prefLocationProvince, v), "偏好地区")}
            </div>
            <div><label className={labelClass}>最低学历</label>
              <select className={selectClass} value={form.prefEducation} onChange={e => setForm({ ...form, prefEducation: e.target.value })}>
                <option value="">不限</option><option value="highschool">高中</option><option value="bachelor">大学</option><option value="master">硕士</option><option value="phd">博士</option>
              </select>
            </div>
          </div>
        </section>

        <button type="submit" className="w-full py-3 rounded-xl text-white font-medium transition hover:opacity-90 flex items-center justify-center gap-2" style={{ backgroundColor: "#FF6B8A" }}>
          {saved ? <><Check className="w-5 h-5" /> 已保存</> : <><Save className="w-5 h-5" /> 保存资料</>}
        </button>
      </form>
    </div>
  )
}
