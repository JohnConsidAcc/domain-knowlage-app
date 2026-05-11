import { prisma } from './prisma'

export async function recordAttempt(userId: string, questionId: string, answerId: string) {
  const answer = await prisma.answer.findUnique({ where: { id: answerId } })
  if (!answer || answer.questionId !== questionId) {
    throw new Error('Invalid answer')
  }
  await prisma.userAttempt.create({
    data: { userId, questionId, wasCorrect: answer.isCorrect },
  })
  const correctAnswer = await prisma.answer.findFirst({
    where: { questionId, isCorrect: true },
  })
  return { wasCorrect: answer.isCorrect, correctAnswerId: correctAnswer?.id ?? null }
}
