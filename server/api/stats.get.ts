import { defineEventHandler, createError } from 'h3'
import { getServerSession } from '#auth'
import { findOrCreateUser } from '../utils/users'
import { getUserStats } from '../utils/stats'

export default defineEventHandler(async (event) => {
  const session = await getServerSession(event)
  if (!session?.user?.email) throw createError({ statusCode: 401, message: 'Unauthorized' })
  const user = await findOrCreateUser(session.user.email, session.user.name)
  return getUserStats(user.id)
})
