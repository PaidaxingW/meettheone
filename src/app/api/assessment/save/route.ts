export const dynamic = 'force-dynamic'

import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

// POST /api/assessment/save — save assessment results for a user
// Works for both newly registered and existing users
export async function POST(req: Request) {
  try {
    const { userId, scores } = await req.json()
    if (!userId || !scores) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 })
    }

    const results = []

    // Save each quiz type
    for (const [quizType, quizScores] of Object.entries(scores)) {
      const existing = await prisma.quizResult.findFirst({
        where: { userId, quizType },
      })
      const scoresJson = JSON.stringify(quizScores)

      if (existing) {
        await prisma.quizResult.update({
          where: { id: existing.id },
          data: { scores: scoresJson },
        })
      } else {
        await prisma.quizResult.create({
          data: { userId, quizType, scores: scoresJson },
        })
      }
      results.push(quizType)
    }

    return NextResponse.json({ success: true, saved: results })
  } catch (error) {
    console.error("Save assessment error:", error)
    return NextResponse.json({ error: "保存失败" }, { status: 500 })
  }
}
