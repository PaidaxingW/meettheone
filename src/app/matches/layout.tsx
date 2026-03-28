import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "觅得 MeetTheOne | 智能匹配",
  description: "查看觅得 AI 智能匹配推荐，找到与你性格和价值观最契合的对象。",
}
export const dynamic = "force-dynamic"
export default function Layout({ children }: { children: React.ReactNode }) { return children }
