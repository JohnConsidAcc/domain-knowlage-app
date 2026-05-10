import { prisma } from './prisma'

export async function getNextQuestion() {
  const questions = await prisma.question.findMany({
    where: { isInvalidated: false },
    include: { answers: { select: { id: true, text: true } } },
  })
  if (questions.length === 0) return null
  return questions[Math.floor(Math.random() * questions.length)]
}
