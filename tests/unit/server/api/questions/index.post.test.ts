import { describe, it, expect, vi, beforeEach } from 'vitest'

const mockGetServerSession = vi.fn()
const mockFindOrCreateUser = vi.fn()
const mockCreateQuestion = vi.fn()
const mockReadBody = vi.fn()

vi.mock('#auth', () => ({ getServerSession: mockGetServerSession }))
vi.mock('../../../../../server/utils/users', () => ({ findOrCreateUser: mockFindOrCreateUser }))
vi.mock('../../../../../server/utils/questions', () => ({ createQuestion: mockCreateQuestion }))
vi.mock('h3', async (importOriginal) => {
  const actual = await importOriginal<typeof import('h3')>()
  return { ...actual, readBody: mockReadBody }
})

const handler = (await import('../../../../../server/api/questions/index.post')).default
const mockEvent = {} as Parameters<typeof handler>[0]

describe('POST /api/questions', () => {
  beforeEach(() => {
    mockGetServerSession.mockReset()
    mockFindOrCreateUser.mockReset()
    mockCreateQuestion.mockReset()
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

  it('throws 400 when prompt is missing', async () => {
    mockGetServerSession.mockResolvedValue({ user: { email: 'a@b.com' } })
    mockReadBody.mockResolvedValue({ answers: [{ text: 'A', isCorrect: true }, { text: 'B', isCorrect: false }] })
    await expect(handler(mockEvent)).rejects.toMatchObject({ statusCode: 400, message: 'prompt is required' })
  })

  it('throws 400 when prompt is only whitespace', async () => {
    mockGetServerSession.mockResolvedValue({ user: { email: 'a@b.com' } })
    mockReadBody.mockResolvedValue({ prompt: '   ', answers: [{ text: 'A', isCorrect: true }, { text: 'B', isCorrect: false }] })
    await expect(handler(mockEvent)).rejects.toMatchObject({ statusCode: 400 })
  })

  it('throws 400 when fewer than 2 answers provided', async () => {
    mockGetServerSession.mockResolvedValue({ user: { email: 'a@b.com' } })
    mockReadBody.mockResolvedValue({ prompt: 'Q?', answers: [{ text: 'A', isCorrect: true }] })
    await expect(handler(mockEvent)).rejects.toMatchObject({ statusCode: 400, message: 'at least 2 answers are required' })
  })

  it('throws 400 when answers is not an array', async () => {
    mockGetServerSession.mockResolvedValue({ user: { email: 'a@b.com' } })
    mockReadBody.mockResolvedValue({ prompt: 'Q?', answers: null })
    await expect(handler(mockEvent)).rejects.toMatchObject({ statusCode: 400 })
  })

  it('throws 400 when no answer is marked correct', async () => {
    mockGetServerSession.mockResolvedValue({ user: { email: 'a@b.com' } })
    mockReadBody.mockResolvedValue({
      prompt: 'Q?',
      answers: [{ text: 'A', isCorrect: false }, { text: 'B', isCorrect: false }],
    })
    await expect(handler(mockEvent)).rejects.toMatchObject({ statusCode: 400, message: 'at least one answer must be correct' })
  })

  it('creates and returns question for authenticated user', async () => {
    const question = { id: 'q1', prompt: 'Q?', answers: [] }
    mockGetServerSession.mockResolvedValue({ user: { email: 'a@b.com', name: 'Alice' } })
    mockReadBody.mockResolvedValue({
      prompt: '  Q?  ',
      answers: [{ text: 'A', isCorrect: true }, { text: 'B', isCorrect: false }],
    })
    mockFindOrCreateUser.mockResolvedValue({ id: 'u1' })
    mockCreateQuestion.mockResolvedValue(question)

    const result = await handler(mockEvent)
    expect(result).toEqual(question)
    expect(mockFindOrCreateUser).toHaveBeenCalledWith('a@b.com', 'Alice')
    expect(mockCreateQuestion).toHaveBeenCalledWith({
      prompt: 'Q?',
      createdById: 'u1',
      answers: [{ text: 'A', isCorrect: true }, { text: 'B', isCorrect: false }],
    })
  })
})
