import { describe, it, expect, vi, beforeEach } from 'vitest'

const mockGetServerSession = vi.fn()
const mockFindOrCreateUser = vi.fn()
const mockDeleteMany = vi.fn()

vi.mock('#auth', () => ({ getServerSession: mockGetServerSession }))
vi.mock('../../../../server/utils/users', () => ({ findOrCreateUser: mockFindOrCreateUser }))
vi.mock('../../../../server/utils/prisma', () => ({
  prisma: { userAttempt: { deleteMany: mockDeleteMany } },
}))

const handler = (await import('../../../../server/api/attempts.delete')).default
const mockEvent = {} as Parameters<typeof handler>[0]

describe('DELETE /api/attempts', () => {
  beforeEach(() => {
    mockGetServerSession.mockReset()
    mockFindOrCreateUser.mockReset()
    mockDeleteMany.mockReset()
  })

  it('throws 401 when unauthenticated', async () => {
    mockGetServerSession.mockResolvedValue(null)
    await expect(handler(mockEvent)).rejects.toMatchObject({ statusCode: 401 })
  })

  it('throws 401 when session has no email', async () => {
    mockGetServerSession.mockResolvedValue({ user: {} })
    await expect(handler(mockEvent)).rejects.toMatchObject({ statusCode: 401 })
  })

  it('deletes all attempts for the user and returns count', async () => {
    mockGetServerSession.mockResolvedValue({ user: { email: 'a@b.com', name: 'Alice' } })
    mockFindOrCreateUser.mockResolvedValue({ id: 'u1' })
    mockDeleteMany.mockResolvedValue({ count: 7 })

    const result = await handler(mockEvent)

    expect(mockFindOrCreateUser).toHaveBeenCalledWith('a@b.com', 'Alice')
    expect(mockDeleteMany).toHaveBeenCalledWith({ where: { userId: 'u1' } })
    expect(result).toEqual({ ok: true, deleted: 7 })
  })
})
