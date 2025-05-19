import { PrismaClient } from '@/prisma/generated/analytics'

// Prevent multiple instances of Prisma Client in development
declare global {
  const db2: PrismaClient | undefined
}

const prismaClientSingleton = () => {
  return new PrismaClient()
}

type PrismaClientSingleton = ReturnType<typeof prismaClientSingleton>

const globalForPrisma = globalThis as unknown as {
  db2: PrismaClientSingleton | undefined
}

export const db2 = globalForPrisma.db2 ?? prismaClientSingleton()

if (process.env.NODE_ENV !== "production") globalForPrisma.db2 = db2
