import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'

const mockCount = vi.fn()

vi.mock('../../../../server/utils/prisma', () => ({
  prisma: {
    userAttempt: { count: mockCount },
  },
}))

const { getUserStats } = await import('../../../../server/utils/stats')

describe('getUserStats', () => {
  beforeEach(() => mockCount.mockReset())

  it('returns stats with correct accuracy when user has attempts', async () => {
    // 4 calls per period (total + correct) × 4 periods = 8 count calls
    // We stub: today=2/4, week=3/5, month=4/8, allTime=10/20
    mockCount
      // today: total=4, correct=2
      .mockResolvedValueOnce(4)
      .mockResolvedValueOnce(2)
      // week: total=5, correct=3
      .mockResolvedValueOnce(5)
      .mockResolvedValueOnce(3)
      // month: total=8, correct=4
      .mockResolvedValueOnce(8)
      .mockResolvedValueOnce(4)
      // allTime: total=20, correct=10
      .mockResolvedValueOnce(20)
      .mockResolvedValueOnce(10)

    const result = await getUserStats('u1')

    expect(result.today).toEqual({ total: 4, correct: 2, accuracy: 50 })
    expect(result.week).toEqual({ total: 5, correct: 3, accuracy: 60 })
    expect(result.month).toEqual({ total: 8, correct: 4, accuracy: 50 })
    expect(result.allTime).toEqual({ total: 20, correct: 10, accuracy: 50 })
  })

  it('returns 0% accuracy when there are no attempts', async () => {
    mockCount.mockResolvedValue(0)
    const result = await getUserStats('u1')
    expect(result.today).toEqual({ total: 0, correct: 0, accuracy: 0 })
    expect(result.allTime).toEqual({ total: 0, correct: 0, accuracy: 0 })
  })

  it('rounds accuracy to nearest integer', async () => {
    // 1 correct out of 3 = 33.33...% → rounds to 33
    mockCount
      .mockResolvedValueOnce(3).mockResolvedValueOnce(1) // today
      .mockResolvedValueOnce(3).mockResolvedValueOnce(1) // week
      .mockResolvedValueOnce(3).mockResolvedValueOnce(1) // month
      .mockResolvedValueOnce(3).mockResolvedValueOnce(1) // allTime
    const result = await getUserStats('u1')
    expect(result.today.accuracy).toBe(33)
  })

  it('passes userId to all count queries', async () => {
    mockCount.mockResolvedValue(0)
    await getUserStats('user-abc')
    const calls = mockCount.mock.calls
    expect(calls.length).toBe(8)
    for (const [arg] of calls) {
      expect(arg.where.userId).toBe('user-abc')
    }
  })

  it('allTime query has no date filter', async () => {
    mockCount.mockResolvedValue(0)
    await getUserStats('u1')
    // The last two calls are for allTime (total and correct) — no answeredAt filter
    const calls = mockCount.mock.calls
    const allTimeTotalCall = calls[6][0]
    const allTimeCorrectCall = calls[7][0]
    expect(allTimeTotalCall.where.answeredAt).toBeUndefined()
    expect(allTimeCorrectCall.where.answeredAt).toBeUndefined()
  })

  it('today/week/month queries include a gte date filter', async () => {
    mockCount.mockResolvedValue(0)
    await getUserStats('u1')
    const calls = mockCount.mock.calls
    // First 6 calls (today, week, month — 2 each) should have answeredAt.gte
    for (let i = 0; i < 6; i++) {
      expect(calls[i][0].where.answeredAt?.gte).toBeInstanceOf(Date)
    }
  })

  it('correct queries include wasCorrect: true filter', async () => {
    mockCount.mockResolvedValue(0)
    await getUserStats('u1')
    const calls = mockCount.mock.calls
    // Odd-indexed calls (1, 3, 5, 7) are the "correct" count calls
    for (const i of [1, 3, 5, 7]) {
      expect(calls[i][0].where.wasCorrect).toBe(true)
    }
  })

  it('startOfWeek resolves to the previous Monday when today is not Sunday', async () => {
    vi.useFakeTimers()
    vi.setSystemTime(new Date('2024-01-10T12:00:00')) // Wednesday
    mockCount.mockResolvedValue(0)
    await getUserStats('u1')
    const weekCall = mockCount.mock.calls[2][0] // week-total call
    expect(weekCall.where.answeredAt.gte).toEqual(new Date(2024, 0, 8)) // Monday (local time)
    vi.useRealTimers()
  })

  it('startOfWeek resolves to the previous Monday when today is Sunday', async () => {
    vi.useFakeTimers()
    vi.setSystemTime(new Date('2024-01-14T12:00:00')) // Sunday
    mockCount.mockResolvedValue(0)
    await getUserStats('u1')
    const weekCall = mockCount.mock.calls[2][0] // week-total call
    expect(weekCall.where.answeredAt.gte).toEqual(new Date(2024, 0, 8)) // Previous Monday (local time)
    vi.useRealTimers()
  })
})
