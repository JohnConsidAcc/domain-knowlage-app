import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'

const mockDeleteManyAttempt = vi.fn()
const mockDeleteManyAnswer = vi.fn()
const mockDeleteManyQuestion = vi.fn()
const mockUpsertUser = vi.fn()
const mockCreateQuestion = vi.fn()

vi.mock('../../../../../server/utils/prisma', () => ({
  prisma: {
    userAttempt: { deleteMany: mockDeleteManyAttempt },
    answer: { deleteMany: mockDeleteManyAnswer },
    question: { deleteMany: mockDeleteManyQuestion, create: mockCreateQuestion },
    user: { upsert: mockUpsertUser },
  },
}))

const handler = (await import('../../../../../server/api/test/reset.post')).default
const mockEvent = {} as any

describe('POST /api/test/reset', () => {
  beforeEach(() => {
    vi.resetAllMocks()
    mockUpsertUser.mockResolvedValue({ id: 'seed-user-id' })
    mockCreateQuestion.mockResolvedValue({})
    mockDeleteManyAttempt.mockResolvedValue({ count: 0 })
    mockDeleteManyAnswer.mockResolvedValue({ count: 0 })
    mockDeleteManyQuestion.mockResolvedValue({ count: 0 })
  })

  afterEach(() => {
    vi.unstubAllEnvs()
  })

  it('returns 404 in production', async () => {
    vi.stubEnv('NODE_ENV', 'production')
    await expect(handler(mockEvent)).rejects.toMatchObject({ statusCode: 404 })
  })

  it('deletes attempts, answers and questions in order', async () => {
    const callOrder: string[] = []
    mockDeleteManyAttempt.mockImplementation(async () => { callOrder.push('attempts'); return { count: 0 } })
    mockDeleteManyAnswer.mockImplementation(async () => { callOrder.push('answers'); return { count: 0 } })
    mockDeleteManyQuestion.mockImplementation(async () => { callOrder.push('questions'); return { count: 0 } })

    await handler(mockEvent)
    expect(callOrder).toEqual(['attempts', 'answers', 'questions'])
  })

  it('upserts the E2E seed user', async () => {
    await handler(mockEvent)
    expect(mockUpsertUser).toHaveBeenCalledWith(
      expect.objectContaining({
        where: { email: 'e2e-seed@test.local' },
      }),
    )
  })

  it('creates exactly 5 questions', async () => {
    await handler(mockEvent)
    expect(mockCreateQuestion).toHaveBeenCalledTimes(5)
  })

  it('returns ok: true and seeded: 5', async () => {
    const result = await handler(mockEvent)
    expect(result).toEqual({ ok: true, seeded: 5 })
  })
})
