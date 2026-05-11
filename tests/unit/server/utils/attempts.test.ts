import { describe, it, expect, vi, beforeEach } from 'vitest'

const mockFindUnique = vi.fn()
const mockFindFirst = vi.fn()
const mockCreate = vi.fn()

vi.mock('../../../../server/utils/prisma', () => ({
  prisma: {
    answer: { findUnique: mockFindUnique, findFirst: mockFindFirst },
    userAttempt: { create: mockCreate },
  },
}))

const { recordAttempt } = await import('../../../../server/utils/attempts')

describe('recordAttempt', () => {
  beforeEach(() => {
    mockFindUnique.mockReset()
    mockFindFirst.mockReset()
    mockCreate.mockReset()
  })

  it('records a correct attempt and returns wasCorrect with correctAnswerId', async () => {
    mockFindUnique.mockResolvedValue({ id: 'a1', questionId: 'q1', isCorrect: true })
    mockCreate.mockResolvedValue({})
    mockFindFirst.mockResolvedValue({ id: 'a1' })
    const result = await recordAttempt('u1', 'q1', 'a1')
    expect(result).toEqual({ wasCorrect: true, correctAnswerId: 'a1' })
    expect(mockCreate).toHaveBeenCalledWith({
      data: { userId: 'u1', questionId: 'q1', wasCorrect: true },
    })
    expect(mockFindFirst).toHaveBeenCalledWith({
      where: { questionId: 'q1', isCorrect: true },
    })
  })

  it('records an incorrect attempt and returns the correct answer id', async () => {
    mockFindUnique.mockResolvedValue({ id: 'a2', questionId: 'q1', isCorrect: false })
    mockCreate.mockResolvedValue({})
    mockFindFirst.mockResolvedValue({ id: 'a1' })
    const result = await recordAttempt('u1', 'q1', 'a2')
    expect(result).toEqual({ wasCorrect: false, correctAnswerId: 'a1' })
  })

  it('returns null correctAnswerId when no correct answer exists', async () => {
    mockFindUnique.mockResolvedValue({ id: 'a1', questionId: 'q1', isCorrect: true })
    mockCreate.mockResolvedValue({})
    mockFindFirst.mockResolvedValue(null)
    const result = await recordAttempt('u1', 'q1', 'a1')
    expect(result).toEqual({ wasCorrect: true, correctAnswerId: null })
  })

  it('throws when answer is not found', async () => {
    mockFindUnique.mockResolvedValue(null)
    await expect(recordAttempt('u1', 'q1', 'bad')).rejects.toThrow('Invalid answer')
  })

  it('throws when answer belongs to a different question', async () => {
    mockFindUnique.mockResolvedValue({ id: 'a1', questionId: 'other-q', isCorrect: true })
    await expect(recordAttempt('u1', 'q1', 'a1')).rejects.toThrow('Invalid answer')
  })
})
