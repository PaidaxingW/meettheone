export const dynamic = 'force-dynamic'

import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function POST(req: Request) {
  const { userId, quizType, scores } = await req.json()
  if (!userId || !quizType || !scores) return NextResponse.json({ error: "Missing fields" }, { status: 400 })

  // Upsert quiz result
  const existing = await prisma.quizResult.findFirst({ where: { userId, quizType } })
  if (existing) {
    await prisma.quizResult.update({ where: { id: existing.id }, data: { scores: JSON.stringify(scores) } })
  } else {
    await prisma.quizResult.create({ data: { userId, quizType, scores: JSON.stringify(scores) } })
  }

  return NextResponse.json({ success: true })
}

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const userId = searchParams.get("userId")
  if (!userId) return NextResponse.json({ error: "Missing userId" }, { status: 400 })

  const results = await prisma.quizResult.findMany({ where: { userId } })
  const parsed = results.map((r: { quizType: string; scores: string }) => ({ quizType: r.quizType, scores: JSON.parse(r.scores) }))
  return NextResponse.json(parsed)
}
