import type { Metadata } from "next"
import "./globals.css"
import Providers from "@/components/Providers"
import Navbar from "@/components/Navbar"

export const metadata: Metadata = {
  title: "MeetTheOne - 找到对的那个人",
  description: "心理学驱动的相亲交友平台，用科学找到最适合你的人",
  manifest: "/manifest.json",
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="zh-CN">
      <head>
        <link href="https://fonts.googleapis.com/css2?family=Noto+Sans+SC:wght@300;400;500;700&display=swap" rel="stylesheet" />
        <meta name="theme-color" content="#FF6B8A" />
      </head>
      <body className="min-h-screen bg-white">
        <Providers>
          <Navbar />
          <main>{children}</main>
          <footer className="bg-gray-50 py-8 text-center text-sm text-gray-500 border-t mt-16">
            <p>© 2026 MeetTheOne. 用心理学，找到对的人。</p>
          </footer>
        </Providers>
      </body>
    </html>
  )
}
