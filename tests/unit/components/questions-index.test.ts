import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mountSuspended, mockNuxtImport } from '@nuxt/test-utils/runtime'
import { ref } from 'vue'
import QuestionsIndexPage from '~/pages/questions/index.vue'

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
    isInvalidated: false,
  },
]

describe('All questions page', () => {
  beforeEach(() => {
    mockFetch.mockReset()
    mockRefresh.mockReset()
    mockUseFetch.mockReturnValue({ data: ref(sampleQuestions), refresh: mockRefresh, pending: ref(false), error: ref(null) })
  })

  it('renders the page heading', async () => {
    const wrapper = await mountSuspended(QuestionsIndexPage)
    expect(wrapper.text()).toContain('All questions')
  })

  it('shows empty message when no questions exist', async () => {
    mockUseFetch.mockReturnValue({ data: ref([]), refresh: mockRefresh, pending: ref(false), error: ref(null) })
    const wrapper = await mountSuspended(QuestionsIndexPage)
    expect(wrapper.text()).toContain('No questions found')
  })

  it('shows loading skeleton while pending', async () => {
    mockUseFetch.mockReturnValue({ data: ref(null), refresh: mockRefresh, pending: ref(true), error: ref(null) })
    const wrapper = await mountSuspended(QuestionsIndexPage)
    expect(wrapper.find('.skel-list').exists()).toBe(true)
    expect(wrapper.find('.question-list').exists()).toBe(false)
  })

  it('shows fetch error banner when initial load fails', async () => {
    mockUseFetch.mockReturnValue({ data: ref(null), refresh: mockRefresh, pending: ref(false), error: ref({ message: 'Network error' }) })
    const wrapper = await mountSuspended(QuestionsIndexPage)
    expect(wrapper.text()).toContain('Failed to load questions')
    expect(wrapper.find('.question-list').exists()).toBe(false)
  })

  it('renders questions with prompt and answers', async () => {
    const wrapper = await mountSuspended(QuestionsIndexPage)
    expect(wrapper.text()).toContain('What is the capital of France?')
    expect(wrapper.text()).toContain('Paris')
    expect(wrapper.text()).toContain('Berlin')
  })

  it('highlights the correct answer', async () => {
    const wrapper = await mountSuspended(QuestionsIndexPage)
    const correctItem = wrapper.find('.answer-list li.correct')
    expect(correctItem.exists()).toBe(true)
    expect(correctItem.text()).toContain('Paris')
  })

  it('renders Edit and Flag buttons for each question', async () => {
    const wrapper = await mountSuspended(QuestionsIndexPage)
    expect(wrapper.text()).toContain('Edit')
    expect(wrapper.text()).toContain('Flag')
  })

  it('enters edit mode when Edit button is clicked', async () => {
    const wrapper = await mountSuspended(QuestionsIndexPage)
    const editBtn = wrapper.find('.item-actions button')
    await editBtn.trigger('click')
    expect(wrapper.find('.edit-form').exists()).toBe(true)
    expect(wrapper.find('textarea').element.value).toBe('What is the capital of France?')
  })

  it('exits edit mode when Cancel is clicked', async () => {
    const wrapper = await mountSuspended(QuestionsIndexPage)
    await wrapper.find('.item-actions button').trigger('click')
    expect(wrapper.find('.edit-form').exists()).toBe(true)

    const cancelBtn = wrapper.findAll('.edit-actions button')[1]
    await cancelBtn.trigger('click')
    expect(wrapper.find('.edit-form').exists()).toBe(false)
  })

  it('shows error when saving with empty prompt', async () => {
    const wrapper = await mountSuspended(QuestionsIndexPage)
    await wrapper.find('.item-actions button').trigger('click')
    await wrapper.find('textarea').setValue('')
    const saveBtn = wrapper.findAll('.edit-actions button')[0]
    await saveBtn.trigger('click')
    expect(wrapper.text()).toContain('Prompt is required')
  })

  it('shows error when saving with fewer than 2 answers', async () => {
    mockUseFetch.mockReturnValue({
      data: ref([{
        id: 'q2',
        prompt: 'Single answer question?',
        answers: [
          { id: 'a1', text: 'Only answer', isCorrect: true },
        ],
        isInvalidated: false,
      }]),
      refresh: mockRefresh,
      pending: ref(false),
      error: ref(null),
    })
    const wrapper = await mountSuspended(QuestionsIndexPage)
    // Open edit — question starts with only 1 answer
    await wrapper.find('.item-actions button').trigger('click')
    // Save immediately — editAnswers has 1 item, below the required 2
    const saveBtn = wrapper.findAll('.edit-actions button')[0]
    await saveBtn.trigger('click')
    expect(wrapper.text()).toContain('At least 2 answers required')
  })

  it('shows error when no answer is marked correct', async () => {
    mockUseFetch.mockReturnValue({
      data: ref([{
        id: 'q3',
        prompt: 'No correct answer?',
        answers: [
          { id: 'a1', text: 'Option A', isCorrect: false },
          { id: 'a2', text: 'Option B', isCorrect: false },
        ],
        isInvalidated: false,
      }]),
      refresh: mockRefresh,
      pending: ref(false),
      error: ref(null),
    })
    const wrapper = await mountSuspended(QuestionsIndexPage)
    await wrapper.find('.item-actions button').trigger('click')
    const saveBtn = wrapper.findAll('.edit-actions button')[0]
    await saveBtn.trigger('click')
    expect(wrapper.text()).toContain('Mark one answer as correct')
  })

  it('shows error when an answer has empty text', async () => {
    const wrapper = await mountSuspended(QuestionsIndexPage)
    await wrapper.find('.item-actions button').trigger('click')
    // Add a 3rd answer — it starts with empty text
    await wrapper.find('.edit-answers-fieldset > button').trigger('click')
    const saveBtn = wrapper.findAll('.edit-actions button')[0]
    await saveBtn.trigger('click')
    expect(wrapper.text()).toContain('All answers must have text')
  })

  it('saves edit and refreshes list on success', async () => {
    mockFetch.mockResolvedValue({})
    const wrapper = await mountSuspended(QuestionsIndexPage)
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

  it('shows error when save fails with a message', async () => {
    mockFetch.mockRejectedValue({ data: { message: 'Update failed' } })
    const wrapper = await mountSuspended(QuestionsIndexPage)
    await wrapper.find('.item-actions button').trigger('click')
    const saveBtn = wrapper.findAll('.edit-actions button')[0]
    await saveBtn.trigger('click')
    await wrapper.vm.$nextTick()
    expect(wrapper.text()).toContain('Update failed')
  })

  it('shows generic error when save fails without a message', async () => {
    mockFetch.mockRejectedValue({})
    const wrapper = await mountSuspended(QuestionsIndexPage)
    await wrapper.find('.item-actions button').trigger('click')
    const saveBtn = wrapper.findAll('.edit-actions button')[0]
    await saveBtn.trigger('click')
    await wrapper.vm.$nextTick()
    expect(wrapper.text()).toContain('Something went wrong')
  })

  it('flags question and refreshes list on success', async () => {
    mockFetch.mockResolvedValue({})
    const wrapper = await mountSuspended(QuestionsIndexPage)
    const flagBtn = wrapper.find('.flag-btn')
    await flagBtn.trigger('click')
    await wrapper.vm.$nextTick()
    expect(mockFetch).toHaveBeenCalledWith(
      '/api/questions/q1',
      expect.objectContaining({ method: 'PATCH', body: expect.objectContaining({ action: 'invalidate' }) }),
    )
    expect(mockRefresh).toHaveBeenCalled()
  })

  it('shows flag error banner when flag fails', async () => {
    mockFetch.mockRejectedValue(new Error('Network error'))
    const wrapper = await mountSuspended(QuestionsIndexPage)
    const flagBtn = wrapper.find('.flag-btn')
    await flagBtn.trigger('click')
    await wrapper.vm.$nextTick()
    expect(wrapper.text()).toContain('Failed to flag question')
  })

  it('can add and remove answers in edit mode', async () => {
    const wrapper = await mountSuspended(QuestionsIndexPage)
    await wrapper.find('.item-actions button').trigger('click')
    const initialRows = wrapper.findAll('.answer-row').length

    // Add answer
    await wrapper.find('.edit-answers-fieldset > button').trigger('click')
    expect(wrapper.findAll('.answer-row')).toHaveLength(initialRows + 1)

    // Remove the newly added answer
    const removeButtons = wrapper.findAll('.answer-row button')
    await removeButtons[removeButtons.length - 1].trigger('click')
    expect(wrapper.findAll('.answer-row')).toHaveLength(initialRows)
  })

  it('renders a link back to the quiz', async () => {
    const wrapper = await mountSuspended(QuestionsIndexPage)
    expect(wrapper.text()).toContain('Back to quiz')
  })
})
