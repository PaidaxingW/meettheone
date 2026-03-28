export const dynamic = 'force-dynamic'

import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import bcrypt from "bcryptjs"

export async function POST(req: Request) {
  try {
    const { name, email, password } = await req.json()
    if (!email || !password) return NextResponse.json({ error: "请填写所有欄位" }, { status: 400 })

    const exists = await prisma.user.findUnique({ where: { email } })
    if (exists) return NextResponse.json({ error: "此 Email 已被注册" }, { status: 400 })

    const hashed = await bcrypt.hash(password, 12)
    const user = await prisma.user.create({ data: { name, email, password: hashed } })
    return NextResponse.json({ id: user.id, email: user.email })
  } catch (error) {
    return NextResponse.json({ error: "注册失败" }, { status: 500 })
  }
}
