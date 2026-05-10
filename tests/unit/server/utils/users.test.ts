import { describe, it, expect, vi, beforeEach } from 'vitest'

const mockUpsert = vi.fn()

vi.mock('../../../../server/utils/prisma', () => ({
  prisma: { user: { upsert: mockUpsert } },
}))

const { findOrCreateUser } = await import('../../../../server/utils/users')

describe('findOrCreateUser', () => {
  beforeEach(() => mockUpsert.mockReset())

  it('upserts by email with name', async () => {
    mockUpsert.mockResolvedValue({ id: '1', email: 'a@b.com', name: 'Alice', subject: 'a@b.com' })
    const user = await findOrCreateUser('a@b.com', 'Alice')
    expect(mockUpsert).toHaveBeenCalledWith({
      where: { email: 'a@b.com' },
      update: { name: 'Alice' },
      create: { subject: 'a@b.com', email: 'a@b.com', name: 'Alice' },
    })
    expect(user.email).toBe('a@b.com')
  })

  it('upserts without name', async () => {
    mockUpsert.mockResolvedValue({ id: '2', email: 'b@b.com', name: null, subject: 'b@b.com' })
    await findOrCreateUser('b@b.com')
    expect(mockUpsert).toHaveBeenCalledWith({
      where: { email: 'b@b.com' },
      update: { name: undefined },
      create: { subject: 'b@b.com', email: 'b@b.com', name: null },
    })
  })

  it('upserts with null name', async () => {
    mockUpsert.mockResolvedValue({ id: '3', email: 'c@b.com', name: null, subject: 'c@b.com' })
    await findOrCreateUser('c@b.com', null)
    expect(mockUpsert).toHaveBeenCalledWith({
      where: { email: 'c@b.com' },
      update: { name: undefined },
      create: { subject: 'c@b.com', email: 'c@b.com', name: null },
    })
  })
})
