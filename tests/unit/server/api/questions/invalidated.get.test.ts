import { describe, it, expect, vi, beforeEach } from 'vitest'

const mockGetServerSession = vi.fn()
const mockGetInvalidatedQuestions = vi.fn()

vi.mock('#auth', () => ({ getServerSession: mockGetServerSession }))
vi.mock('../../../../../server/utils/questions', () => ({
  getInvalidatedQuestions: mockGetInvalidatedQuestions,
}))

const handler = (await import('../../../../../server/api/questions/invalidated.get')).default
const mockEvent = {} as Parameters<typeof handler>[0]

describe('GET /api/questions/invalidated', () => {
  beforeEach(() => {
    mockGetServerSession.mockReset()
    mockGetInvalidatedQuestions.mockReset()
  })

  it('throws 401 when unauthenticated', async () => {
    mockGetServerSession.mockResolvedValue(null)
    await expect(handler(mockEvent)).rejects.toMatchObject({ statusCode: 401 })
  })

  it('throws 401 when session has no email', async () => {
    mockGetServerSession.mockResolvedValue({ user: {} })
    await expect(handler(mockEvent)).rejects.toMatchObject({ statusCode: 401 })
  })

  it('returns invalidated questions for authenticated user', async () => {
    const questions = [{ id: 'q1', prompt: 'Q?', isInvalidated: true, answers: [] }]
    mockGetServerSession.mockResolvedValue({ user: { email: 'a@b.com' } })
    mockGetInvalidatedQuestions.mockResolvedValue(questions)

    const result = await handler(mockEvent)
    expect(result).toEqual(questions)
    expect(mockGetInvalidatedQuestions).toHaveBeenCalledOnce()
  })

  it('returns empty array when no invalidated questions exist', async () => {
    mockGetServerSession.mockResolvedValue({ user: { email: 'a@b.com' } })
    mockGetInvalidatedQuestions.mockResolvedValue([])

    const result = await handler(mockEvent)
    expect(result).toEqual([])
  })
})
