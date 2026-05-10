import { describe, it, expect, vi, beforeEach } from 'vitest'

const mockGetServerSession = vi.fn()
const mockFindOrCreateUser = vi.fn()
const mockGetNextQuestion = vi.fn()

vi.mock('#auth', () => ({ getServerSession: mockGetServerSession }))
vi.mock('../../../../../server/utils/users', () => ({ findOrCreateUser: mockFindOrCreateUser }))
vi.mock('../../../../../server/utils/questions', () => ({ getNextQuestion: mockGetNextQuestion }))

const handler = (await import('../../../../../server/api/questions/next.get')).default
const mockEvent = {} as Parameters<typeof handler>[0]

describe('GET /api/questions/next', () => {
  beforeEach(() => {
    mockGetServerSession.mockReset()
    mockFindOrCreateUser.mockReset()
    mockGetNextQuestion.mockReset()
  })

  it('throws 401 when unauthenticated', async () => {
    mockGetServerSession.mockResolvedValue(null)
    await expect(handler(mockEvent)).rejects.toMatchObject({ statusCode: 401 })
  })

  it('throws 401 when session has no email', async () => {
    mockGetServerSession.mockResolvedValue({ user: {} })
    await expect(handler(mockEvent)).rejects.toMatchObject({ statusCode: 401 })
  })

  it('returns next question for authenticated user', async () => {
    const question = { id: 'q1', prompt: 'Q', answers: [] }
    mockGetServerSession.mockResolvedValue({ user: { email: 'a@b.com', name: 'Alice' } })
    mockFindOrCreateUser.mockResolvedValue({ id: 'u1' })
    mockGetNextQuestion.mockResolvedValue(question)
    expect(await handler(mockEvent)).toEqual(question)
    expect(mockFindOrCreateUser).toHaveBeenCalledWith('a@b.com', 'Alice')
  })

  it('returns null when no questions available', async () => {
    mockGetServerSession.mockResolvedValue({ user: { email: 'a@b.com', name: null } })
    mockFindOrCreateUser.mockResolvedValue({ id: 'u1' })
    mockGetNextQuestion.mockResolvedValue(null)
    expect(await handler(mockEvent)).toBeNull()
  })
})
