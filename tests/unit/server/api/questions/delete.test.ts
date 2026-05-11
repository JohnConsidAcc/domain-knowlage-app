import { describe, it, expect, vi, beforeEach } from 'vitest'

const mockGetServerSession = vi.fn()
const mockDeleteQuestion = vi.fn()
const mockGetRouterParam = vi.fn()

vi.mock('#auth', () => ({ getServerSession: mockGetServerSession }))
vi.mock('../../../../../server/utils/questions', () => ({ deleteQuestion: mockDeleteQuestion }))
vi.mock('h3', async (importOriginal) => {
  const actual = await importOriginal<typeof import('h3')>()
  return { ...actual, getRouterParam: mockGetRouterParam }
})

const handler = (await import('../../../../../server/api/questions/[id].delete')).default
const mockEvent = {} as Parameters<typeof handler>[0]

describe('DELETE /api/questions/:id', () => {
  beforeEach(() => {
    mockGetServerSession.mockReset()
    mockDeleteQuestion.mockReset()
    mockGetRouterParam.mockReset()
    mockGetRouterParam.mockReturnValue('q1')
  })

  it('throws 401 when unauthenticated', async () => {
    mockGetServerSession.mockResolvedValue(null)
    await expect(handler(mockEvent)).rejects.toMatchObject({ statusCode: 401 })
  })

  it('throws 401 when session has no email', async () => {
    mockGetServerSession.mockResolvedValue({ user: {} })
    await expect(handler(mockEvent)).rejects.toMatchObject({ statusCode: 401 })
  })

  it('deletes the question and returns result', async () => {
    const deleted = { id: 'q1' }
    mockGetServerSession.mockResolvedValue({ user: { email: 'a@b.com' } })
    mockDeleteQuestion.mockResolvedValue(deleted)

    const result = await handler(mockEvent)
    expect(result).toEqual(deleted)
    expect(mockDeleteQuestion).toHaveBeenCalledWith('q1')
  })
})
