import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "觅得 MeetTheOne | 交友社区",
  description: "在觅得交友社区分享恋爱心得、约会攻略，与志同道合的单身朋友交流互动。",
}
export const dynamic = "force-dynamic"
export default function Layout({ children }: { children: React.ReactNode }) { return children }
