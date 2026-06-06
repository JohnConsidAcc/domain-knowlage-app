import { describe, it, expect, beforeEach } from 'vitest'
import { mountSuspended, mockNuxtImport } from '@nuxt/test-utils/runtime'
import { ref } from 'vue'
import DefaultLayout from '~/layouts/default.vue'

const mockSessionData = ref<{ user: { name: string | null; email: string } } | null>({
  user: { name: 'Jane Smith', email: 'jane@example.com' },
})

mockNuxtImport('useAuth', () => () => ({ data: mockSessionData }))

describe('App header (default layout)', () => {
  beforeEach(() => {
    mockSessionData.value = { user: { name: 'Jane Smith', email: 'jane@example.com' } }
  })

  it('renders the app header', async () => {
    const wrapper = await mountSuspended(DefaultLayout)
    expect(wrapper.find('.app-header').exists()).toBe(true)
  })

  it('displays the signed-in user name', async () => {
    const wrapper = await mountSuspended(DefaultLayout)
    expect(wrapper.find('.user-name').text()).toBe('Jane Smith')
  })

  it('falls back to email when name is absent', async () => {
    mockSessionData.value = { user: { name: null, email: 'jane@example.com' } }
    const wrapper = await mountSuspended(DefaultLayout)
    expect(wrapper.find('.user-name').text()).toBe('jane@example.com')
  })

  it('shows an empty string when session is missing', async () => {
    mockSessionData.value = null
    const wrapper = await mountSuspended(DefaultLayout)
    expect(wrapper.find('.user-name').text()).toBe('')
  })
})
