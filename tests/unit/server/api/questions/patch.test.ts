import { describe, it, expect, vi, beforeEach } from 'vitest'

const mockGetServerSession = vi.fn()
const mockInvalidateQuestion = vi.fn()
const mockUpdateQuestion = vi.fn()
const mockReadBody = vi.fn()
const mockGetRouterParam = vi.fn()

vi.mock('#auth', () => ({ getServerSession: mockGetServerSession }))
vi.mock('../../../../../server/utils/questions', () => ({
  invalidateQuestion: mockInvalidateQuestion,
  updateQuestion: mockUpdateQuestion,
}))
vi.mock('h3', async (importOriginal) => {
  const actual = await importOriginal<typeof import('h3')>()
  return { ...actual, readBody: mockReadBody, getRouterParam: mockGetRouterParam }
})

const handler = (await import('../../../../../server/api/questions/[id].patch')).default
const mockEvent = {} as Parameters<typeof handler>[0]

describe('PATCH /api/questions/:id', () => {
  beforeEach(() => {
    mockGetServerSession.mockReset()
    mockInvalidateQuestion.mockReset()
    mockUpdateQuestion.mockReset()
    mockReadBody.mockReset()
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

  it('throws 400 when action is unknown', async () => {
    mockGetServerSession.mockResolvedValue({ user: { email: 'a@b.com' } })
    mockReadBody.mockResolvedValue({ action: 'unknown' })
    await expect(handler(mockEvent)).rejects.toMatchObject({ statusCode: 400, message: 'action must be invalidate or correct' })
  })

  it('invalidates question when action is invalidate', async () => {
    const updated = { id: 'q1', isInvalidated: true }
    mockGetServerSession.mockResolvedValue({ user: { email: 'a@b.com' } })
    mockReadBody.mockResolvedValue({ action: 'invalidate' })
    mockInvalidateQuestion.mockResolvedValue(updated)

    const result = await handler(mockEvent)
    expect(result).toEqual(updated)
    expect(mockInvalidateQuestion).toHaveBeenCalledWith('q1')
  })

  it('throws 400 when action is correct but prompt is missing', async () => {
    mockGetServerSession.mockResolvedValue({ user: { email: 'a@b.com' } })
    mockReadBody.mockResolvedValue({
      action: 'correct',
      answers: [{ text: 'A', isCorrect: true }, { text: 'B', isCorrect: false }],
    })
    await expect(handler(mockEvent)).rejects.toMatchObject({ statusCode: 400, message: 'prompt is required' })
  })

  it('throws 400 when action is correct but prompt is whitespace', async () => {
    mockGetServerSession.mockResolvedValue({ user: { email: 'a@b.com' } })
    mockReadBody.mockResolvedValue({
      action: 'correct',
      prompt: '   ',
      answers: [{ text: 'A', isCorrect: true }, { text: 'B', isCorrect: false }],
    })
    await expect(handler(mockEvent)).rejects.toMatchObject({ statusCode: 400 })
  })

  it('throws 400 when action is correct but fewer than 2 answers', async () => {
    mockGetServerSession.mockResolvedValue({ user: { email: 'a@b.com' } })
    mockReadBody.mockResolvedValue({
      action: 'correct',
      prompt: 'Fixed Q?',
      answers: [{ text: 'A', isCorrect: true }],
    })
    await expect(handler(mockEvent)).rejects.toMatchObject({ statusCode: 400, message: 'at least 2 answers are required' })
  })

  it('throws 400 when action is correct but answers is not an array', async () => {
    mockGetServerSession.mockResolvedValue({ user: { email: 'a@b.com' } })
    mockReadBody.mockResolvedValue({ action: 'correct', prompt: 'Fixed Q?', answers: null })
    await expect(handler(mockEvent)).rejects.toMatchObject({ statusCode: 400 })
  })

  it('throws 400 when action is correct but no answer is correct', async () => {
    mockGetServerSession.mockResolvedValue({ user: { email: 'a@b.com' } })
    mockReadBody.mockResolvedValue({
      action: 'correct',
      prompt: 'Fixed Q?',
      answers: [{ text: 'A', isCorrect: false }, { text: 'B', isCorrect: false }],
    })
    await expect(handler(mockEvent)).rejects.toMatchObject({ statusCode: 400, message: 'at least one answer must be correct' })
  })

  it('updates question when action is correct with valid data', async () => {
    const updated = { id: 'q1', prompt: 'Fixed Q?', isInvalidated: false, answers: [] }
    mockGetServerSession.mockResolvedValue({ user: { email: 'a@b.com' } })
    mockReadBody.mockResolvedValue({
      action: 'correct',
      prompt: '  Fixed Q?  ',
      answers: [{ text: 'A', isCorrect: true }, { text: 'B', isCorrect: false }],
    })
    mockUpdateQuestion.mockResolvedValue(updated)

    const result = await handler(mockEvent)
    expect(result).toEqual(updated)
    expect(mockUpdateQuestion).toHaveBeenCalledWith('q1', {
      prompt: 'Fixed Q?',
      answers: [{ text: 'A', isCorrect: true }, { text: 'B', isCorrect: false }],
    })
  })
})
