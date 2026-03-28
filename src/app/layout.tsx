import type { Metadata } from "next"
import "./globals.css"
import Providers from "@/components/Providers"
import Navbar from "@/components/Navbar"

const siteUrl = "https://meettheone.app"

export const metadata: Metadata = {
  title: "觅得 MeetTheOne | 心理学相亲交友平台 | 科学配对找到对的人",
  description: "觅得(MeetTheOne)是基于心理学的专业相亲交友平台。通过大五人格、爱之语等心理测试和AI智能配对算法，帮助单身男女精准匹配，找到真正契合的另一半。免费注册，每天推荐优质对象。",
  keywords: "相亲,交友,心理学交友,相亲平台,婚恋交友,在线交友,智能配对,心理测试,大五人格,爱之语,找对象,相亲网站,觅得,MeetTheOne,婚恋,结婚交友,严肃交友,同城交友,约会",
  metadataBase: new URL(siteUrl),
  alternates: {
    canonical: siteUrl,
    languages: {
      "zh-CN": siteUrl,
    },
  },
  openGraph: {
    title: "觅得 MeetTheOne | 心理学相亲交友平台 | 科学配对找到对的人",
    description: "觅得(MeetTheOne)是基于心理学的专业相亲交友平台。通过大五人格、爱之语等心理测试和AI智能配对算法，帮助单身男女精准匹配，找到真正契合的另一半。",
    url: siteUrl,
    siteName: "觅得 MeetTheOne",
    type: "website",
    locale: "zh_CN",
  },
  twitter: {
    card: "summary_large_image",
    title: "觅得 MeetTheOne | 心理学相亲交友平台",
    description: "基于心理学的专业相亲交友平台。通过心理测试和AI智能配对，帮你找到真正契合的另一半。",
  },
  manifest: "/manifest.json",
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="zh-CN">
      <head>
        <link href="https://fonts.googleapis.com/css2?family=Noto+Sans+SC:wght@300;400;500;700&display=swap" rel="stylesheet" />
        <meta name="theme-color" content="#FF6B8A" />
        <link rel="alternate" hrefLang="zh-CN" href={siteUrl} />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebSite",
              name: "觅得 MeetTheOne",
              url: siteUrl,
              description: "基于心理学的专业相亲交友平台",
              potentialAction: {
                "@type": "SearchAction",
                target: { "@type": "EntryPoint", urlTemplate: `${siteUrl}/search?q={search_term_string}` },
                "query-input": "required name=search_term_string",
              },
            }),
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Organization",
              name: "觅得 MeetTheOne",
              url: siteUrl,
              logo: `${siteUrl}/logo.png`,
              description: "觅得(MeetTheOne)是基于心理学的专业相亲交友平台，通过心理测试和AI智能配对算法帮助单身男女精准匹配。",
              contactPoint: {
                "@type": "ContactPoint",
                contactType: "customer service",
                availableLanguage: "Chinese",
              },
            }),
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "FAQPage",
              mainEntity: [
                {
                  "@type": "Question",
                  name: "心理学交友靠谱吗？",
                  acceptedAnswer: {
                    "@type": "Answer",
                    text: "心理学交友是经过科学验证的方式。觅得平台采用大五人格、爱之语等国际认可的心理学量表，结合AI算法进行多维度匹配，比传统仅看条件的相亲方式更精准、更科学。已有众多真实用户通过觅得找到了契合的另一半。",
                  },
                },
                {
                  "@type": "Question",
                  name: "觅得如何配对？",
                  acceptedAnswer: {
                    "@type": "Answer",
                    text: "觅得通过以下方式进行智能配对：1) 用户完成大五人格、爱之语、旅伴测验、婚姻价值观等专业心理测验；2) AI算法分析测验结果，从性格特质、价值观、生活方式等多维度评估匹配度；3) 兼顾相似性吸引和互补性需求，每日推荐最契合的对象。双方确认后即可开启聊天。",
                  },
                },
                {
                  "@type": "Question",
                  name: "觅得是免费的吗？",
                  acceptedAnswer: {
                    "@type": "Answer",
                    text: "觅得提供免费注册和基础心理测验功能。用户可以免费完成所有心理测验、查看AI匹配推荐、与确认匹配的对象聊天。我们致力于让每个人都能通过科学方式找到对的人。",
                  },
                },
                {
                  "@type": "Question",
                  name: "觅得和传统相亲平台有什么不同？",
                  acceptedAnswer: {
                    "@type": "Answer",
                    text: "传统相亲平台主要依赖年龄、收入、学历等外在条件匹配，而觅得更关注内在契合度。我们通过专业心理学量表深入了解用户的性格特质、沟通方式、价值观和生活方式，用AI算法进行科学匹配，帮助用户找到真正心灵相通的另一半。",
                  },
                },
                {
                  "@type": "Question",
                  name: "在觅得上交友安全吗？",
                  acceptedAnswer: {
                    "@type": "Answer",
                    text: "觅得非常重视用户安全。平台实行实名认证和照片审核机制，确保用户信息真实可靠。只有在双方互相确认匹配后才能开启聊天，有效减少骚扰。同时我们严格保护用户隐私，不会向第三方泄露个人信息。",
                  },
                },
              ],
            }),
          }}
        />
      </head>
      <body className="min-h-screen bg-white">
        <Providers>
          <Navbar />
          <main>{children}</main>
          <footer className="bg-gray-50 py-8 text-center text-sm text-gray-500 border-t mt-16">
            <p>© 2026 MeetTheOne 觅得. 用心理学，找到对的人。</p>
          </footer>
        </Providers>
      </body>
    </html>
  )
}
