import { defineEventHandler, createError, readBody } from 'h3'
import { getServerSession } from '#auth'
import { findOrCreateUser } from '../../utils/users'
import { createQuestion } from '../../utils/questions'

export default defineEventHandler(async (event) => {
  const session = await getServerSession(event)
  if (!session?.user?.email) throw createError({ statusCode: 401, message: 'Unauthorized' })

  const body = await readBody<{
    prompt: string
    answers: { text: string; isCorrect: boolean }[]
  }>(event)

  if (!body?.prompt?.trim()) {
    throw createError({ statusCode: 400, message: 'prompt is required' })
  }
  if (!Array.isArray(body.answers) || body.answers.length < 2) {
    throw createError({ statusCode: 400, message: 'at least 2 answers are required' })
  }
  if (!body.answers.some(a => a.isCorrect)) {
    throw createError({ statusCode: 400, message: 'at least one answer must be correct' })
  }

  const user = await findOrCreateUser(session.user.email, session.user.name)
  return createQuestion({ prompt: body.prompt.trim(), createdById: user.id, answers: body.answers })
})
