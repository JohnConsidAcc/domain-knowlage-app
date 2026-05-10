import { prisma } from './prisma'

export async function recordAttempt(userId: string, questionId: string, answerId: string) {
  const answer = await prisma.answer.findUnique({ where: { id: answerId } })
  if (!answer || answer.questionId !== questionId) {
    throw new Error('Invalid answer')
  }
  await prisma.userAttempt.create({
    data: { userId, questionId, wasCorrect: answer.isCorrect },
  })
  return { wasCorrect: answer.isCorrect }
}
