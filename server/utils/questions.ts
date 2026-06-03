import { prisma } from './prisma'

export async function getNextQuestion() {
  const questions = await prisma.question.findMany({
    where: { isInvalidated: false },
    include: { answers: { select: { id: true, text: true } } },
  })
  if (questions.length === 0) return null
  return questions[Math.floor(Math.random() * questions.length)]
}

export async function createQuestion(data: {
  prompt: string
  createdById: string
  answers: { text: string; isCorrect: boolean }[]
}) {
  return prisma.question.create({
    data: {
      prompt: data.prompt,
      createdById: data.createdById,
      answers: { create: data.answers },
    },
    include: { answers: true },
  })
}

export async function invalidateQuestion(id: string) {
  return prisma.question.update({
    where: { id },
    data: { isInvalidated: true },
  })
}

export async function getInvalidatedQuestions() {
  return prisma.question.findMany({
    where: { isInvalidated: true },
    include: { answers: true },
    orderBy: { updatedAt: 'desc' },
  })
}

export async function updateQuestion(
  id: string,
  data: {
    prompt?: string
    answers?: { text: string; isCorrect: boolean }[]
  },
) {
  return prisma.question.update({
    where: { id },
    data: {
      prompt: data.prompt,
      isInvalidated: false,
      ...(data.answers && {
        answers: {
          deleteMany: {},
          create: data.answers,
        },
      }),
    },
    include: { answers: true },
  })
}

export async function deleteQuestion(id: string) {
  await prisma.answer.deleteMany({ where: { questionId: id } })
  await prisma.userAttempt.deleteMany({ where: { questionId: id } })
  return prisma.question.delete({ where: { id } })
}

export async function getAllQuestions() {
  return prisma.question.findMany({
    where: { isInvalidated: false },
    include: { answers: { select: { id: true, text: true, isCorrect: true } } },
    orderBy: { createdAt: 'desc' },
  })
}
