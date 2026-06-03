import { defineEventHandler, createError } from 'h3'
import { prisma } from '../../utils/prisma'

const E2E_QUESTIONS = [
  {
    prompt: 'What does HTML stand for?',
    answers: [
      { text: 'HyperText Markup Language', isCorrect: true },
      { text: 'HyperText Machine Language', isCorrect: false },
      { text: 'HighText Markup Language', isCorrect: false },
      { text: 'HyperTool Multi Language', isCorrect: false },
    ],
  },
  {
    prompt: 'Which planet is closest to the Sun?',
    answers: [
      { text: 'Mercury', isCorrect: true },
      { text: 'Venus', isCorrect: false },
      { text: 'Earth', isCorrect: false },
      { text: 'Mars', isCorrect: false },
    ],
  },
  {
    prompt: 'What is 2 + 2?',
    answers: [
      { text: '3', isCorrect: false },
      { text: '4', isCorrect: true },
      { text: '5', isCorrect: false },
      { text: '22', isCorrect: false },
    ],
  },
  {
    prompt: 'What color is the sky on a clear day?',
    answers: [
      { text: 'Green', isCorrect: false },
      { text: 'Red', isCorrect: false },
      { text: 'Blue', isCorrect: true },
      { text: 'Yellow', isCorrect: false },
    ],
  },
  {
    prompt: 'How many days are in a week?',
    answers: [
      { text: '5', isCorrect: false },
      { text: '6', isCorrect: false },
      { text: '7', isCorrect: true },
      { text: '8', isCorrect: false },
    ],
  },
]

export default defineEventHandler(async () => {
  if (process.env.NODE_ENV === 'production') {
    throw createError({ statusCode: 404, message: 'Not found' })
  }

  // Clear in FK-safe order
  await prisma.userAttempt.deleteMany()
  await prisma.answer.deleteMany()
  await prisma.question.deleteMany()

  // Upsert the E2E seed user
  const seedUser = await prisma.user.upsert({
    where: { email: 'e2e-seed@test.local' },
    update: {},
    create: {
      subject: 'e2e-seed',
      email: 'e2e-seed@test.local',
      name: 'E2E Seed',
    },
  })

  // Re-seed fixed questions
  for (const q of E2E_QUESTIONS) {
    await prisma.question.create({
      data: {
        prompt: q.prompt,
        createdById: seedUser.id,
        answers: { create: q.answers },
      },
    })
  }

  return { ok: true, seeded: E2E_QUESTIONS.length }
})
