import { prisma } from './prisma'

export async function findOrCreateUser(email: string, name?: string | null) {
  return prisma.user.upsert({
    where: { email },
    update: { name: name ?? undefined },
    create: { subject: email, email, name: name ?? null },
  })
}
