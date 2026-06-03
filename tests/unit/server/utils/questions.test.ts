import { describe, it, expect, vi, beforeEach } from 'vitest'

const mockFindMany = vi.fn()
const mockCreate = vi.fn()
const mockUpdate = vi.fn()
const mockDelete = vi.fn()
const mockAnswerDeleteMany = vi.fn()
const mockUserAttemptDeleteMany = vi.fn()

vi.mock('../../../../server/utils/prisma', () => ({
  prisma: {
    question: {
      findMany: mockFindMany,
      create: mockCreate,
      update: mockUpdate,
      delete: mockDelete,
    },
    answer: { deleteMany: mockAnswerDeleteMany },
    userAttempt: { deleteMany: mockUserAttemptDeleteMany },
  },
}))

const {
  getAllStudyQuestions,
  getNextQuestion,
  createQuestion,
  invalidateQuestion,
  getInvalidatedQuestions,
  updateQuestion,
  deleteQuestion,
  getAllQuestions,
} = await import('../../../../server/utils/questions')

describe('getAllStudyQuestions', () => {
  beforeEach(() => mockFindMany.mockReset())

  it('returns all non-invalidated questions ordered by createdAt asc', async () => {
    const questions = [
      { id: 'q1', prompt: 'Q1', answers: [{ id: 'a1', text: 'A', isCorrect: true }] },
      { id: 'q2', prompt: 'Q2', answers: [{ id: 'a2', text: 'B', isCorrect: false }] },
    ]
    mockFindMany.mockResolvedValue(questions)
    const result = await getAllStudyQuestions()
    expect(result).toEqual(questions)
    expect(mockFindMany).toHaveBeenCalledWith({
      where: { isInvalidated: false },
      include: { answers: { select: { id: true, text: true, isCorrect: true } } },
      orderBy: { createdAt: 'asc' },
    })
  })

  it('returns empty array when no non-invalidated questions exist', async () => {
    mockFindMany.mockResolvedValue([])
    expect(await getAllStudyQuestions()).toEqual([])
  })
})

describe('getNextQuestion', () => {
  beforeEach(() => mockFindMany.mockReset())

  it('returns null when no questions exist', async () => {
    mockFindMany.mockResolvedValue([])
    expect(await getNextQuestion()).toBeNull()
  })

  it('returns the question when only one exists', async () => {
    const q = { id: '1', prompt: 'Q1', answers: [] }
    mockFindMany.mockResolvedValue([q])
    expect(await getNextQuestion()).toEqual(q)
  })

  it('returns one of the available questions', async () => {
    const questions = [
      { id: '1', prompt: 'Q1', answers: [] },
      { id: '2', prompt: 'Q2', answers: [] },
    ]
    mockFindMany.mockResolvedValue(questions)
    const result = await getNextQuestion()
    expect(questions).toContainEqual(result)
  })

  it('queries only non-invalidated questions with answer id and text', async () => {
    mockFindMany.mockResolvedValue([{ id: '1', prompt: 'Q', answers: [] }])
    await getNextQuestion()
    expect(mockFindMany).toHaveBeenCalledWith({
      where: { isInvalidated: false },
      include: { answers: { select: { id: true, text: true } } },
    })
  })
})

describe('createQuestion', () => {
  beforeEach(() => mockCreate.mockReset())

  it('calls prisma.question.create with correct data', async () => {
    const created = { id: 'q1', prompt: 'New Q', answers: [] }
    mockCreate.mockResolvedValue(created)
    const result = await createQuestion({
      prompt: 'New Q',
      createdById: 'u1',
      answers: [{ text: 'A', isCorrect: true }, { text: 'B', isCorrect: false }],
    })
    expect(result).toEqual(created)
    expect(mockCreate).toHaveBeenCalledWith({
      data: {
        prompt: 'New Q',
        createdById: 'u1',
        answers: { create: [{ text: 'A', isCorrect: true }, { text: 'B', isCorrect: false }] },
      },
      include: { answers: true },
    })
  })
})

describe('invalidateQuestion', () => {
  beforeEach(() => mockUpdate.mockReset())

  it('sets isInvalidated to true', async () => {
    const updated = { id: 'q1', isInvalidated: true }
    mockUpdate.mockResolvedValue(updated)
    const result = await invalidateQuestion('q1')
    expect(result).toEqual(updated)
    expect(mockUpdate).toHaveBeenCalledWith({
      where: { id: 'q1' },
      data: { isInvalidated: true },
    })
  })
})

describe('getInvalidatedQuestions', () => {
  beforeEach(() => mockFindMany.mockReset())

  it('returns invalidated questions ordered by updatedAt desc', async () => {
    const questions = [{ id: 'q1', isInvalidated: true, answers: [] }]
    mockFindMany.mockResolvedValue(questions)
    const result = await getInvalidatedQuestions()
    expect(result).toEqual(questions)
    expect(mockFindMany).toHaveBeenCalledWith({
      where: { isInvalidated: true },
      include: { answers: true },
      orderBy: { updatedAt: 'desc' },
    })
  })

  it('returns empty array when no invalidated questions', async () => {
    mockFindMany.mockResolvedValue([])
    expect(await getInvalidatedQuestions()).toEqual([])
  })
})

describe('updateQuestion', () => {
  beforeEach(() => mockUpdate.mockReset())

  it('updates prompt and answers, sets isInvalidated to false', async () => {
    const updated = { id: 'q1', prompt: 'Fixed Q', isInvalidated: false, answers: [] }
    mockUpdate.mockResolvedValue(updated)
    const result = await updateQuestion('q1', {
      prompt: 'Fixed Q',
      answers: [{ text: 'A', isCorrect: true }],
    })
    expect(result).toEqual(updated)
    expect(mockUpdate).toHaveBeenCalledWith({
      where: { id: 'q1' },
      data: {
        prompt: 'Fixed Q',
        isInvalidated: false,
        answers: { deleteMany: {}, create: [{ text: 'A', isCorrect: true }] },
      },
      include: { answers: true },
    })
  })

  it('updates prompt only without replacing answers when answers not provided', async () => {
    const updated = { id: 'q1', prompt: 'Updated', isInvalidated: false, answers: [] }
    mockUpdate.mockResolvedValue(updated)
    await updateQuestion('q1', { prompt: 'Updated' })
    expect(mockUpdate).toHaveBeenCalledWith({
      where: { id: 'q1' },
      data: { prompt: 'Updated', isInvalidated: false },
      include: { answers: true },
    })
  })
})

describe('getAllQuestions', () => {
  beforeEach(() => mockFindMany.mockReset())

  it('returns non-invalidated questions ordered by createdAt desc', async () => {
    const questions = [
      { id: 'q1', isInvalidated: false, answers: [{ id: 'a1', text: 'A', isCorrect: true }] },
    ]
    mockFindMany.mockResolvedValue(questions)
    const result = await getAllQuestions()
    expect(result).toEqual(questions)
    expect(mockFindMany).toHaveBeenCalledWith({
      where: { isInvalidated: false },
      include: { answers: { select: { id: true, text: true, isCorrect: true } } },
      orderBy: { createdAt: 'desc' },
    })
  })

  it('returns empty array when no questions exist', async () => {
    mockFindMany.mockResolvedValue([])
    expect(await getAllQuestions()).toEqual([])
  })
})

describe('deleteQuestion', () => {
  beforeEach(() => {
    mockAnswerDeleteMany.mockReset()
    mockUserAttemptDeleteMany.mockReset()
    mockDelete.mockReset()
  })

  it('deletes answers, attempts, then question in order', async () => {
    const deleted = { id: 'q1' }
    const callOrder: string[] = []
    mockAnswerDeleteMany.mockImplementation(async () => { callOrder.push('answers'); return {} })
    mockUserAttemptDeleteMany.mockImplementation(async () => { callOrder.push('attempts'); return {} })
    mockDelete.mockImplementation(async () => { callOrder.push('question'); return deleted })

    const result = await deleteQuestion('q1')
    expect(result).toEqual(deleted)
    expect(callOrder).toEqual(['answers', 'attempts', 'question'])
  })

  it('passes correct ids to each deleteMany call', async () => {
    mockAnswerDeleteMany.mockResolvedValue({})
    mockUserAttemptDeleteMany.mockResolvedValue({})
    mockDelete.mockResolvedValue({ id: 'q1' })

    await deleteQuestion('q1')
    expect(mockAnswerDeleteMany).toHaveBeenCalledWith({ where: { questionId: 'q1' } })
    expect(mockUserAttemptDeleteMany).toHaveBeenCalledWith({ where: { questionId: 'q1' } })
    expect(mockDelete).toHaveBeenCalledWith({ where: { id: 'q1' } })
  })
})
