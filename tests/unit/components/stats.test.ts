import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mountSuspended, mockNuxtImport } from '@nuxt/test-utils/runtime'
import { ref } from 'vue'
import StatsPage from '~/pages/stats.vue'

const { mockUseFetch } = vi.hoisted(() => ({
  mockUseFetch: vi.fn(),
}))
mockNuxtImport('useFetch', () => mockUseFetch)

const mockFetch = vi.fn()
vi.stubGlobal('$fetch', mockFetch)

const sampleStats = {
  today: { total: 10, correct: 8, accuracy: 80 },
  week: { total: 50, correct: 40, accuracy: 80 },
  month: { total: 100, correct: 70, accuracy: 70 },
  allTime: { total: 200, correct: 150, accuracy: 75 },
}

describe('Statistics page', () => {
  beforeEach(() => {
    mockFetch.mockReset()
    vi.stubGlobal('confirm', vi.fn(() => true))
    const mockRefresh = vi.fn().mockResolvedValue(undefined)
    mockUseFetch.mockReturnValue({ data: ref(sampleStats), pending: ref(false), error: ref(null), refresh: mockRefresh })
  })

  it('renders the page heading', async () => {
    const wrapper = await mountSuspended(StatsPage)
    expect(wrapper.text()).toContain('My statistics')
  })

  it('shows loading skeleton while pending', async () => {
    mockUseFetch.mockReturnValue({ data: ref(null), pending: ref(true), error: ref(null) })
    const wrapper = await mountSuspended(StatsPage)
    expect(wrapper.findAll('.skel-card')).toHaveLength(4)
    expect(wrapper.find('.stat-card').exists()).toBe(false)
  })

  it('shows error banner when fetch fails', async () => {
    mockUseFetch.mockReturnValue({ data: ref(null), pending: ref(false), error: ref({ message: 'Server error' }) })
    const wrapper = await mountSuspended(StatsPage)
    expect(wrapper.text()).toContain('Failed to load statistics')
    expect(wrapper.find('.stat-card').exists()).toBe(false)
  })

  it('shows error banner when stats data is null', async () => {
    mockUseFetch.mockReturnValue({ data: ref(null), pending: ref(false), error: ref(null) })
    const wrapper = await mountSuspended(StatsPage)
    expect(wrapper.text()).toContain('No statistics available')
  })

  it('renders four stat cards when data loads', async () => {
    const wrapper = await mountSuspended(StatsPage)
    expect(wrapper.findAll('.stat-card')).toHaveLength(4)
  })

  it('shows Today, This week, This month and All time labels', async () => {
    const wrapper = await mountSuspended(StatsPage)
    expect(wrapper.text()).toContain('Today')
    expect(wrapper.text()).toContain('This week')
    expect(wrapper.text()).toContain('This month')
    expect(wrapper.text()).toContain('All time')
  })

  it('shows accuracy and detail for each period', async () => {
    const wrapper = await mountSuspended(StatsPage)
    expect(wrapper.findAll('.accuracy')).toHaveLength(4)
    expect(wrapper.findAll('.detail')).toHaveLength(4)
  })

  it('renders accuracy values from the data', async () => {
    const wrapper = await mountSuspended(StatsPage)
    expect(wrapper.text()).toContain('80')
    expect(wrapper.text()).toContain('75')
  })

  it('renders a reset progress button', async () => {
    const wrapper = await mountSuspended(StatsPage)
    expect(wrapper.find('.reset-btn').exists()).toBe(true)
    expect(wrapper.find('.reset-btn').text()).toContain('Reset my progress')
  })

  it('does nothing when the confirm dialog is cancelled', async () => {
    vi.stubGlobal('confirm', vi.fn(() => false))
    const wrapper = await mountSuspended(StatsPage)
    await wrapper.find('.reset-btn').trigger('click')
    expect(mockFetch).not.toHaveBeenCalled()
  })

  it('calls DELETE /api/attempts and refreshes when confirmed', async () => {
    mockFetch.mockResolvedValue({ ok: true, deleted: 5 })
    const wrapper = await mountSuspended(StatsPage)
    await wrapper.find('.reset-btn').trigger('click')
    await wrapper.vm.$nextTick()
    expect(mockFetch).toHaveBeenCalledWith('/api/attempts', { method: 'DELETE' })
  })

  it('shows success message after a successful reset', async () => {
    mockFetch.mockResolvedValue({ ok: true, deleted: 5 })
    const wrapper = await mountSuspended(StatsPage)
    await wrapper.find('.reset-btn').trigger('click')
    await wrapper.vm.$nextTick()
    expect(wrapper.text()).toContain('Progress reset successfully')
  })

  it('shows error message when reset fails', async () => {
    mockFetch.mockRejectedValue({ data: { message: 'Server error' } })
    const wrapper = await mountSuspended(StatsPage)
    await wrapper.find('.reset-btn').trigger('click')
    await wrapper.vm.$nextTick()
    expect(wrapper.text()).toContain('Server error')
  })

  it('shows generic error when reset fails without a message', async () => {
    mockFetch.mockRejectedValue({})
    const wrapper = await mountSuspended(StatsPage)
    await wrapper.find('.reset-btn').trigger('click')
    await wrapper.vm.$nextTick()
    expect(wrapper.text()).toContain('Something went wrong')
  })

  it('disables the reset button while resetting', async () => {
    let resolve!: () => void
    mockFetch.mockReturnValue(new Promise<void>(r => { resolve = r }))
    const wrapper = await mountSuspended(StatsPage)
    wrapper.find('.reset-btn').trigger('click')
    await wrapper.vm.$nextTick()
    expect(wrapper.find('.reset-btn').attributes('disabled')).toBeDefined()
    resolve()
  })
})
