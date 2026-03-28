import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "觅得 MeetTheOne | 个人分析",
  description: "查看你的心理测验分析报告和匹配度数据，深入了解自己的性格特质。",
}
export const dynamic = "force-dynamic"
export default function Layout({ children }: { children: React.ReactNode }) { return children }
