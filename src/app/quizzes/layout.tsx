import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "觅得 MeetTheOne | 心理测验",
  description: "完成大五人格、爱之语、旅伴测验、婚姻价值观等专业心理测验，深入了解自己的性格与沟通方式。",
}
export const dynamic = "force-dynamic"
export default function Layout({ children }: { children: React.ReactNode }) { return children }
