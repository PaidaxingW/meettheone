import { PrismaClient } from '@prisma/client'

const globalForPrisma = globalThis as unknown as { prisma: PrismaClient | null }

// Defaults for local dev when no env vars set
if (!process.env.DATABASE_URL) {
  process.env.DATABASE_URL = "file:./dev.db"
}
if (!process.env.DATABASE_PROVIDER) {
  process.env.DATABASE_PROVIDER = "sqlite"
}

export const prisma = globalForPrisma.prisma || new PrismaClient()

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma
