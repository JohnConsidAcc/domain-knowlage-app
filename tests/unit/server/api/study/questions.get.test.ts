import { describe, it, expect, vi, beforeEach } from 'vitest'

const mockGetServerSession = vi.fn()
const mockGetAllStudyQuestions = vi.fn()

vi.mock('#auth', () => ({ getServerSession: mockGetServerSession }))
vi.mock('../../../../../server/utils/questions', () => ({ getAllStudyQuestions: mockGetAllStudyQuestions }))

const handler = (await import('../../../../../server/api/study/questions.get')).default
const mockEvent = {} as Parameters<typeof handler>[0]

describe('GET /api/study/questions', () => {
  beforeEach(() => {
    mockGetServerSession.mockReset()
    mockGetAllStudyQuestions.mockReset()
  })

  it('throws 401 when unauthenticated', async () => {
    mockGetServerSession.mockResolvedValue(null)
    await expect(handler(mockEvent)).rejects.toMatchObject({ statusCode: 401 })
  })

  it('throws 401 when session has no email', async () => {
    mockGetServerSession.mockResolvedValue({ user: {} })
    await expect(handler(mockEvent)).rejects.toMatchObject({ statusCode: 401 })
  })

  it('returns all study questions for authenticated user', async () => {
    const questions = [
      { id: 'q1', prompt: 'Q1', answers: [{ id: 'a1', text: 'A', isCorrect: true }] },
      { id: 'q2', prompt: 'Q2', answers: [{ id: 'a2', text: 'B', isCorrect: false }] },
    ]
    mockGetServerSession.mockResolvedValue({ user: { email: 'a@b.com', name: 'Alice' } })
    mockGetAllStudyQuestions.mockResolvedValue(questions)
    const result = await handler(mockEvent)
    expect(result).toEqual(questions)
    expect(mockGetAllStudyQuestions).toHaveBeenCalledOnce()
  })

  it('returns empty array when no questions exist', async () => {
    mockGetServerSession.mockResolvedValue({ user: { email: 'a@b.com', name: null } })
    mockGetAllStudyQuestions.mockResolvedValue([])
    const result = await handler(mockEvent)
    expect(result).toEqual([])
  })
})
