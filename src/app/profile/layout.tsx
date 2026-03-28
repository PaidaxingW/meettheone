import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "觅得 MeetTheOne | 个人资料",
  description: "编辑你的觅得个人资料，完善信息以获得更精准的AI匹配推荐。",
}
export const dynamic = "force-dynamic"
export default function Layout({ children }: { children: React.ReactNode }) { return children }
