import { defineEventHandler, createError, readBody } from 'h3'
import { getServerSession } from '#auth'
import { findOrCreateUser } from '../utils/users'
import { recordAttempt } from '../utils/attempts'

export default defineEventHandler(async (event) => {
  const session = await getServerSession(event)
  if (!session?.user?.email) throw createError({ statusCode: 401, message: 'Unauthorized' })
  const body = await readBody<{ questionId: string; answerId: string }>(event)
  if (!body?.questionId || !body?.answerId) {
    throw createError({ statusCode: 400, message: 'questionId and answerId are required' })
  }
  const user = await findOrCreateUser(session.user.email, session.user.name)
  return recordAttempt(user.id, body.questionId, body.answerId)
})
