import { prisma } from './prisma'

function startOfDay(): Date {
  const d = new Date()
  return new Date(d.getFullYear(), d.getMonth(), d.getDate())
}

function startOfWeek(): Date {
  const d = new Date()
  const day = new Date(d.getFullYear(), d.getMonth(), d.getDate())
  const weekday = day.getDay() // 0 = Sun
  const diff = weekday === 0 ? -6 : 1 - weekday // Monday as week start
  day.setDate(day.getDate() + diff)
  return day
}

function startOfMonth(): Date {
  const d = new Date()
  return new Date(d.getFullYear(), d.getMonth(), 1)
}

async function periodStats(userId: string, since?: Date) {
  const where = {
    userId,
    ...(since ? { answeredAt: { gte: since } } : {}),
  }
  const [total, correct] = await Promise.all([
    prisma.userAttempt.count({ where }),
    prisma.userAttempt.count({ where: { ...where, wasCorrect: true } }),
  ])
  return {
    total,
    correct,
    accuracy: total > 0 ? Math.round((correct / total) * 100) : 0,
  }
}

export async function getUserStats(userId: string) {
  const [today, week, month, allTime] = await Promise.all([
    periodStats(userId, startOfDay()),
    periodStats(userId, startOfWeek()),
    periodStats(userId, startOfMonth()),
    periodStats(userId),
  ])
  return { today, week, month, allTime }
}
