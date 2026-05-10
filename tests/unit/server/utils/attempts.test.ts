import { describe, it, expect, vi, beforeEach } from 'vitest'

const mockFindUnique = vi.fn()
const mockCreate = vi.fn()

vi.mock('../../../../server/utils/prisma', () => ({
  prisma: {
    answer: { findUnique: mockFindUnique },
    userAttempt: { create: mockCreate },
  },
}))

const { recordAttempt } = await import('../../../../server/utils/attempts')

describe('recordAttempt', () => {
  beforeEach(() => {
    mockFindUnique.mockReset()
    mockCreate.mockReset()
  })

  it('records a correct attempt', async () => {
    mockFindUnique.mockResolvedValue({ id: 'a1', questionId: 'q1', isCorrect: true })
    mockCreate.mockResolvedValue({})
    const result = await recordAttempt('u1', 'q1', 'a1')
    expect(result).toEqual({ wasCorrect: true })
    expect(mockCreate).toHaveBeenCalledWith({
      data: { userId: 'u1', questionId: 'q1', wasCorrect: true },
    })
  })

  it('records an incorrect attempt', async () => {
    mockFindUnique.mockResolvedValue({ id: 'a2', questionId: 'q1', isCorrect: false })
    mockCreate.mockResolvedValue({})
    const result = await recordAttempt('u1', 'q1', 'a2')
    expect(result).toEqual({ wasCorrect: false })
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
