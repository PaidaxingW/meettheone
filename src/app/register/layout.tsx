import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "觅得 MeetTheOne | 免费注册",
  description: "免费注册觅得 MeetTheOne，完成心理测验，获取AI智能匹配推荐，找到真正契合的另一半。",
}
export const dynamic = "force-dynamic"
export default function Layout({ children }: { children: React.ReactNode }) { return children }
