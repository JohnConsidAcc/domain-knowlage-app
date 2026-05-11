import { defineEventHandler, createError, getRouterParam, readBody } from 'h3'
import { getServerSession } from '#auth'
import { invalidateQuestion, updateQuestion } from '../../utils/questions'

export default defineEventHandler(async (event) => {
  const session = await getServerSession(event)
  if (!session?.user?.email) throw createError({ statusCode: 401, message: 'Unauthorized' })

  const id = getRouterParam(event, 'id')!
  const body = await readBody<{
    action: 'invalidate' | 'correct'
    prompt?: string
    answers?: { text: string; isCorrect: boolean }[]
  }>(event)

  if (body?.action === 'invalidate') {
    return invalidateQuestion(id)
  }

  if (body?.action === 'correct') {
    if (!body.prompt?.trim()) {
      throw createError({ statusCode: 400, message: 'prompt is required' })
    }
    if (!Array.isArray(body.answers) || body.answers.length < 2) {
      throw createError({ statusCode: 400, message: 'at least 2 answers are required' })
    }
    if (!body.answers.some(a => a.isCorrect)) {
      throw createError({ statusCode: 400, message: 'at least one answer must be correct' })
    }
    return updateQuestion(id, { prompt: body.prompt.trim(), answers: body.answers })
  }

  throw createError({ statusCode: 400, message: 'action must be invalidate or correct' })
})
