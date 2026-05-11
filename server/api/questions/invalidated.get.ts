import { defineEventHandler, createError } from 'h3'
import { getServerSession } from '#auth'
import { getInvalidatedQuestions } from '../../utils/questions'

export default defineEventHandler(async (event) => {
  const session = await getServerSession(event)
  if (!session?.user?.email) throw createError({ statusCode: 401, message: 'Unauthorized' })
  return getInvalidatedQuestions()
})
