import type { Metadata } from "next"
import "./globals.css"
import { SessionProvider } from "next-auth/react"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import Navbar from "@/components/Navbar"

export const metadata: Metadata = {
  title: "MeetTheOne - 找到對的那個人",
  description: "心理學驅動的相親交友平台，用科學找到最適合你的人",
  manifest: "/manifest.json",
}

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const session = await getServerSession(authOptions)
  return (
    <html lang="zh-TW">
      <head>
        <link href="https://fonts.googleapis.com/css2?family=Noto+Sans+TC:wght@300;400;500;700&display=swap" rel="stylesheet" />
        <meta name="theme-color" content="#FF6B8A" />
      </head>
      <body className="min-h-screen bg-white">
        <SessionProvider session={session}>
          <Navbar session={session} />
          <main>{children}</main>
          <footer className="bg-gray-50 py-8 text-center text-sm text-gray-500 border-t mt-16">
            <p>© 2026 MeetTheOne. 用心理學，找到對的人。</p>
          </footer>
        </SessionProvider>
      </body>
    </html>
  )
}
