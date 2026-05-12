import { describe, it, expect, vi, beforeEach } from 'vitest'

const mockGetServerSession = vi.fn()
const mockFindOrCreateUser = vi.fn()
const mockGetUserStats = vi.fn()

vi.mock('#auth', () => ({ getServerSession: mockGetServerSession }))
vi.mock('../../../../server/utils/users', () => ({ findOrCreateUser: mockFindOrCreateUser }))
vi.mock('../../../../server/utils/stats', () => ({ getUserStats: mockGetUserStats }))

const handler = (await import('../../../../server/api/stats.get')).default
const mockEvent = {} as Parameters<typeof handler>[0]

describe('GET /api/stats', () => {
  beforeEach(() => {
    mockGetServerSession.mockReset()
    mockFindOrCreateUser.mockReset()
    mockGetUserStats.mockReset()
  })

  it('throws 401 when unauthenticated', async () => {
    mockGetServerSession.mockResolvedValue(null)
    await expect(handler(mockEvent)).rejects.toMatchObject({ statusCode: 401 })
  })

  it('throws 401 when session has no email', async () => {
    mockGetServerSession.mockResolvedValue({ user: {} })
    await expect(handler(mockEvent)).rejects.toMatchObject({ statusCode: 401 })
  })

  it('returns stats for the authenticated user', async () => {
    const stats = {
      today: { total: 4, correct: 2, accuracy: 50 },
      week: { total: 10, correct: 7, accuracy: 70 },
      month: { total: 30, correct: 20, accuracy: 67 },
      allTime: { total: 100, correct: 60, accuracy: 60 },
    }
    mockGetServerSession.mockResolvedValue({ user: { email: 'a@b.com', name: 'Alice' } })
    mockFindOrCreateUser.mockResolvedValue({ id: 'u1' })
    mockGetUserStats.mockResolvedValue(stats)

    const result = await handler(mockEvent)
    expect(result).toEqual(stats)
    expect(mockFindOrCreateUser).toHaveBeenCalledWith('a@b.com', 'Alice')
    expect(mockGetUserStats).toHaveBeenCalledWith('u1')
  })
})
