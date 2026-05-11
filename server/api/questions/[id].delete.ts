import { defineEventHandler, createError, getRouterParam } from 'h3'
import { getServerSession } from '#auth'
import { deleteQuestion } from '../../utils/questions'

export default defineEventHandler(async (event) => {
  const session = await getServerSession(event)
  if (!session?.user?.email) throw createError({ statusCode: 401, message: 'Unauthorized' })
  const id = getRouterParam(event, 'id')!
  return deleteQuestion(id)
})
