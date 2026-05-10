import { describe, it, expect, vi, beforeEach } from 'vitest'

const mockFindMany = vi.fn()

vi.mock('../../../../server/utils/prisma', () => ({
  prisma: { question: { findMany: mockFindMany } },
}))

const { getNextQuestion } = await import('../../../../server/utils/questions')

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
