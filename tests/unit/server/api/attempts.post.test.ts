import { describe, it, expect, vi, beforeEach } from 'vitest'

const mockGetServerSession = vi.fn()
const mockFindOrCreateUser = vi.fn()
const mockRecordAttempt = vi.fn()
const mockReadBody = vi.fn()

vi.mock('#auth', () => ({ getServerSession: mockGetServerSession }))
vi.mock('../../../../server/utils/users', () => ({ findOrCreateUser: mockFindOrCreateUser }))
vi.mock('../../../../server/utils/attempts', () => ({ recordAttempt: mockRecordAttempt }))
vi.mock('h3', async (importOriginal) => {
  const actual = await importOriginal<typeof import('h3')>()
  return { ...actual, readBody: mockReadBody }
})

const handler = (await import('../../../../server/api/attempts.post')).default
const mockEvent = {} as Parameters<typeof handler>[0]

describe('POST /api/attempts', () => {
  beforeEach(() => {
    mockGetServerSession.mockReset()
    mockFindOrCreateUser.mockReset()
    mockRecordAttempt.mockReset()
    mockReadBody.mockReset()
  })

  it('throws 401 when unauthenticated', async () => {
    mockGetServerSession.mockResolvedValue(null)
    await expect(handler(mockEvent)).rejects.toMatchObject({ statusCode: 401 })
  })

  it('throws 401 when session has no email', async () => {
    mockGetServerSession.mockResolvedValue({ user: {} })
    await expect(handler(mockEvent)).rejects.toMatchObject({ statusCode: 401 })
  })

  it('throws 400 when body is missing questionId', async () => {
    mockGetServerSession.mockResolvedValue({ user: { email: 'a@b.com' } })
    mockReadBody.mockResolvedValue({ answerId: 'a1' })
    await expect(handler(mockEvent)).rejects.toMatchObject({ statusCode: 400 })
  })

  it('throws 400 when body is missing answerId', async () => {
    mockGetServerSession.mockResolvedValue({ user: { email: 'a@b.com' } })
    mockReadBody.mockResolvedValue({ questionId: 'q1' })
    await expect(handler(mockEvent)).rejects.toMatchObject({ statusCode: 400 })
  })

  it('records attempt and returns result', async () => {
    mockGetServerSession.mockResolvedValue({ user: { email: 'a@b.com', name: 'Alice' } })
    mockReadBody.mockResolvedValue({ questionId: 'q1', answerId: 'a1' })
    mockFindOrCreateUser.mockResolvedValue({ id: 'u1' })
    mockRecordAttempt.mockResolvedValue({ wasCorrect: true })
    const result = await handler(mockEvent)
    expect(result).toEqual({ wasCorrect: true })
    expect(mockRecordAttempt).toHaveBeenCalledWith('u1', 'q1', 'a1')
  })
})
