import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "觅得 MeetTheOne | 聊天",
  description: "与匹配成功的对象开启聊天，了解彼此，安排见面约会。",
}
export const dynamic = "force-dynamic"
export default function Layout({ children }: { children: React.ReactNode }) { return children }
