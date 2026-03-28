import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "觅得 MeetTheOne | 登录",
  description: "登录觅得 MeetTheOne 账号，查看智能匹配推荐和聊天消息。",
}
export const dynamic = "force-dynamic"
export default function Layout({ children }: { children: React.ReactNode }) { return children }
