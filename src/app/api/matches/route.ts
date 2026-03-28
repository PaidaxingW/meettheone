import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { calculateMatch } from "@/lib/matching"

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const userId = searchParams.get("userId")
  if (!userId) return NextResponse.json({ error: "Missing userId" }, { status: 400 })

  const myResults = await prisma.quizResult.findMany({ where: { userId } })
  const myScores: Record<string, Record<string, number>> = {}
  myResults.forEach((r: { quizType: string; scores: string }) => { myScores[r.quizType] = JSON.parse(r.scores) })

  if (Object.keys(myScores).length === 0) return NextResponse.json([])

  const otherUsers = await prisma.user.findMany({
    where: { id: { not: userId } },
    include: { quizResults: true },
    take: 50,
  })

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const matches = otherUsers.map((user: any) => {
      const theirScores: Record<string, Record<string, number>> = {}
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      user.quizResults.forEach((r: any) => { theirScores[r.quizType] = JSON.parse(r.scores) })

      const result = calculateMatch(myScores, theirScores)
      const age = user.birthDate ? Math.floor((Date.now() - user.birthDate.getTime()) / (365.25 * 86400000)) : null

      return {
        id: user.id,
        name: user.name || "匿名",
        image: user.image,
        age,
        location: user.location,
        occupation: user.occupation,
        bio: user.bio,
        score: result.total,
        dimensions: result.dimensions,
      }
    })
    .filter((m: { score: number }) => m.score > 0)
    .sort((a: { score: number }, b: { score: number }) => b.score - a.score)
    .slice(0, 10)

  return NextResponse.json(matches)
}
