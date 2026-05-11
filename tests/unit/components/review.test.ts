import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mountSuspended, mockNuxtImport } from '@nuxt/test-utils/runtime'
import { ref } from 'vue'
import ReviewPage from '~/pages/questions/review.vue'

const mockFetch = vi.fn()
vi.stubGlobal('$fetch', mockFetch)

const { mockRefresh, mockUseFetch } = vi.hoisted(() => ({
  mockRefresh: vi.fn(),
  mockUseFetch: vi.fn(),
}))
mockNuxtImport('useFetch', () => mockUseFetch)

const sampleQuestions = [
  {
    id: 'q1',
    prompt: 'What is the capital of France?',
    answers: [
      { id: 'a1', text: 'Paris', isCorrect: true },
      { id: 'a2', text: 'Berlin', isCorrect: false },
    ],
    isInvalidated: true,
  },
]

describe('Review flagged questions page', () => {
  beforeEach(() => {
    mockFetch.mockReset()
    mockRefresh.mockReset()
    mockUseFetch.mockReturnValue({ data: ref(sampleQuestions), refresh: mockRefresh })
  })

  it('renders the page heading', async () => {
    const wrapper = await mountSuspended(ReviewPage)
    expect(wrapper.text()).toContain('Review flagged questions')
  })

  it('shows empty message when no flagged questions', async () => {
    mockUseFetch.mockReturnValue({ data: ref([]), refresh: mockRefresh })
    const wrapper = await mountSuspended(ReviewPage)
    expect(wrapper.text()).toContain('No flagged questions')
  })

  it('renders flagged questions', async () => {
    const wrapper = await mountSuspended(ReviewPage)
    expect(wrapper.text()).toContain('What is the capital of France?')
    expect(wrapper.text()).toContain('Paris')
    expect(wrapper.text()).toContain('Berlin')
  })

  it('renders Correct and Delete buttons for each question', async () => {
    const wrapper = await mountSuspended(ReviewPage)
    expect(wrapper.text()).toContain('Correct')
    expect(wrapper.text()).toContain('Delete')
  })

  it('enters edit mode when Correct button is clicked', async () => {
    const wrapper = await mountSuspended(ReviewPage)
    const correctBtn = wrapper.find('.item-actions button')
    await correctBtn.trigger('click')
    expect(wrapper.find('.edit-form').exists()).toBe(true)
    expect(wrapper.find('textarea').element.value).toBe('What is the capital of France?')
  })

  it('exits edit mode when Cancel is clicked', async () => {
    const wrapper = await mountSuspended(ReviewPage)
    await wrapper.find('.item-actions button').trigger('click')
    expect(wrapper.find('.edit-form').exists()).toBe(true)

    const cancelBtn = wrapper.findAll('.edit-actions button')[1]
    await cancelBtn.trigger('click')
    expect(wrapper.find('.edit-form').exists()).toBe(false)
  })

  it('shows error when saving correction with empty prompt', async () => {
    const wrapper = await mountSuspended(ReviewPage)
    await wrapper.find('.item-actions button').trigger('click')
    await wrapper.find('textarea').setValue('')
    const saveBtn = wrapper.findAll('.edit-actions button')[0]
    await saveBtn.trigger('click')
    expect(wrapper.text()).toContain('Prompt is required')
  })

  it('shows error when saving correction with an empty answer text', async () => {
    const wrapper = await mountSuspended(ReviewPage)
    await wrapper.find('.item-actions button').trigger('click')
    // Add a 3rd answer — it starts with empty text
    await wrapper.find('.edit-form > button').trigger('click')
    const saveBtn = wrapper.findAll('.edit-actions button')[0]
    await saveBtn.trigger('click')
    expect(wrapper.text()).toContain('All answers must have text')
  })

  it('saves correction and refreshes list on success', async () => {
    mockFetch.mockResolvedValue({})
    const wrapper = await mountSuspended(ReviewPage)
    await wrapper.find('.item-actions button').trigger('click')
    const saveBtn = wrapper.findAll('.edit-actions button')[0]
    await saveBtn.trigger('click')
    await wrapper.vm.$nextTick()
    expect(mockFetch).toHaveBeenCalledWith(
      '/api/questions/q1',
      expect.objectContaining({ method: 'PATCH', body: expect.objectContaining({ action: 'correct' }) }),
    )
    expect(mockRefresh).toHaveBeenCalled()
  })

  it('shows error when save correction fails', async () => {
    mockFetch.mockRejectedValue({ data: { message: 'Update failed' } })
    const wrapper = await mountSuspended(ReviewPage)
    await wrapper.find('.item-actions button').trigger('click')
    const saveBtn = wrapper.findAll('.edit-actions button')[0]
    await saveBtn.trigger('click')
    await wrapper.vm.$nextTick()
    expect(wrapper.text()).toContain('Update failed')
  })

  it('shows generic error when save correction fails without message', async () => {
    mockFetch.mockRejectedValue({})
    const wrapper = await mountSuspended(ReviewPage)
    await wrapper.find('.item-actions button').trigger('click')
    const saveBtn = wrapper.findAll('.edit-actions button')[0]
    await saveBtn.trigger('click')
    await wrapper.vm.$nextTick()
    expect(wrapper.text()).toContain('Something went wrong')
  })

  it('deletes question and refreshes after confirm', async () => {
    vi.stubGlobal('confirm', vi.fn(() => true))
    mockFetch.mockResolvedValue({})
    const wrapper = await mountSuspended(ReviewPage)
    const deleteBtn = wrapper.find('.delete-btn')
    await deleteBtn.trigger('click')
    await wrapper.vm.$nextTick()
    expect(mockFetch).toHaveBeenCalledWith('/api/questions/q1', { method: 'DELETE' })
    expect(mockRefresh).toHaveBeenCalled()
    vi.unstubAllGlobals()
    vi.stubGlobal('$fetch', mockFetch)
  })

  it('does not delete when user cancels the confirm dialog', async () => {
    vi.stubGlobal('confirm', vi.fn(() => false))
    const wrapper = await mountSuspended(ReviewPage)
    const deleteBtn = wrapper.find('.delete-btn')
    await deleteBtn.trigger('click')
    expect(mockFetch).not.toHaveBeenCalled()
    vi.unstubAllGlobals()
    vi.stubGlobal('$fetch', mockFetch)
  })

  it('can add and remove answers in edit mode', async () => {
    const wrapper = await mountSuspended(ReviewPage)
    await wrapper.find('.item-actions button').trigger('click')
    const initialRows = wrapper.findAll('.answer-row').length

    // Add answer
    await wrapper.find('.edit-form > button').trigger('click')
    expect(wrapper.findAll('.answer-row')).toHaveLength(initialRows + 1)

    // Remove the newly added answer
    const removeButtons = wrapper.findAll('.answer-row button')
    await removeButtons[removeButtons.length - 1].trigger('click')
    expect(wrapper.findAll('.answer-row')).toHaveLength(initialRows)
  })

  it('renders a link back to the quiz', async () => {
    const wrapper = await mountSuspended(ReviewPage)
    expect(wrapper.text()).toContain('Back to quiz')
  })
})
