import { describe, it, expect, vi, beforeEach } from 'vitest'

const mockGetServerSession = vi.fn()
const mockGetAllQuestions = vi.fn()

vi.mock('#auth', () => ({ getServerSession: mockGetServerSession }))
vi.mock('../../../../../server/utils/questions', () => ({
  getAllQuestions: mockGetAllQuestions,
}))

const handler = (await import('../../../../../server/api/questions/index.get')).default
const mockEvent = {} as Parameters<typeof handler>[0]

describe('GET /api/questions', () => {
  beforeEach(() => {
    mockGetServerSession.mockReset()
    mockGetAllQuestions.mockReset()
  })

  it('throws 401 when unauthenticated', async () => {
    mockGetServerSession.mockResolvedValue(null)
    await expect(handler(mockEvent)).rejects.toMatchObject({ statusCode: 401 })
  })

  it('throws 401 when session has no email', async () => {
    mockGetServerSession.mockResolvedValue({ user: {} })
    await expect(handler(mockEvent)).rejects.toMatchObject({ statusCode: 401 })
  })

  it('returns all non-invalidated questions for authenticated user', async () => {
    const questions = [
      {
        id: 'q1',
        prompt: 'What is 2+2?',
        isInvalidated: false,
        answers: [
          { id: 'a1', text: '4', isCorrect: true },
          { id: 'a2', text: '5', isCorrect: false },
        ],
      },
    ]
    mockGetServerSession.mockResolvedValue({ user: { email: 'a@b.com' } })
    mockGetAllQuestions.mockResolvedValue(questions)

    const result = await handler(mockEvent)
    expect(result).toEqual(questions)
    expect(mockGetAllQuestions).toHaveBeenCalledOnce()
  })

  it('returns empty array when no questions exist', async () => {
    mockGetServerSession.mockResolvedValue({ user: { email: 'a@b.com' } })
    mockGetAllQuestions.mockResolvedValue([])

    const result = await handler(mockEvent)
    expect(result).toEqual([])
  })
})
