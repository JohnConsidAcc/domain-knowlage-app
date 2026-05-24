import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mountSuspended, mockNuxtImport } from '@nuxt/test-utils/runtime'
import { ref } from 'vue'
import StatsPage from '~/pages/stats.vue'

const { mockUseFetch } = vi.hoisted(() => ({
  mockUseFetch: vi.fn(),
}))
mockNuxtImport('useFetch', () => mockUseFetch)

const sampleStats = {
  today: { total: 10, correct: 8, accuracy: 80 },
  week: { total: 50, correct: 40, accuracy: 80 },
  month: { total: 100, correct: 70, accuracy: 70 },
  allTime: { total: 200, correct: 150, accuracy: 75 },
}

describe('Statistics page', () => {
  beforeEach(() => {
    mockUseFetch.mockReturnValue({ data: ref(sampleStats), pending: ref(false), error: ref(null) })
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
})
