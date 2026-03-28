import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const id = searchParams.get("id")
  if (!id) return NextResponse.json({ error: "Missing id" }, { status: 400 })
  const user = await prisma.user.findUnique({ where: { id }, select: { name: true, gender: true, birthDate: true, height: true, occupation: true, education: true, income: true, location: true, bio: true, image: true } })
  return NextResponse.json(user)
}

export async function PUT(req: Request) {
  const data = await req.json()
  const { id, ...update } = data
  if (!id) return NextResponse.json({ error: "Missing id" }, { status: 400 })

  const lookingFor = JSON.stringify({ minAge: update.minAge, maxAge: update.maxAge, minHeight: update.minHeight, maxHeight: update.maxHeight, prefLocation: update.prefLocation, prefEducation: update.prefEducation })

  await prisma.user.update({
    where: { id },
    data: { name: update.name, gender: update.gender, birthDate: update.birthDate ? new Date(update.birthDate) : undefined, height: update.height ? parseInt(update.height) : null, occupation: update.occupation, education: update.education, income: update.income, location: update.location, bio: update.bio, lookingFor },
  })
  return NextResponse.json({ success: true })
}
