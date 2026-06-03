import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mountSuspended, mockNuxtImport } from '@nuxt/test-utils/runtime'
import { ref } from 'vue'
import StudyPage from '~/pages/study.vue'

const mockFetch = vi.fn()
vi.stubGlobal('$fetch', mockFetch)

const { mockUseFetch } = vi.hoisted(() => ({
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
      { id: 'a3', text: 'Madrid', isCorrect: false },
    ],
  },
  {
    id: 'q2',
    prompt: 'What is 2 + 2?',
    answers: [
      { id: 'b1', text: '3', isCorrect: false },
      { id: 'b2', text: '4', isCorrect: true },
    ],
  },
]

describe('Study mode page', () => {
  beforeEach(() => {
    mockFetch.mockReset()
    mockUseFetch.mockReturnValue({ data: ref(sampleQuestions), pending: ref(false), error: ref(null) })
  })

  it('renders the page heading', async () => {
    const wrapper = await mountSuspended(StudyPage)
    expect(wrapper.text()).toContain('Study mode')
  })

  it('shows loading skeleton while pending', async () => {
    mockUseFetch.mockReturnValue({ data: ref(null), pending: ref(true), error: ref(null) })
    const wrapper = await mountSuspended(StudyPage)
    expect(wrapper.find('.skel-container').exists()).toBe(true)
    expect(wrapper.find('.prompt').exists()).toBe(false)
  })

  it('shows error banner when fetch fails', async () => {
    mockUseFetch.mockReturnValue({ data: ref(null), pending: ref(false), error: ref({ message: 'Network error' }) })
    const wrapper = await mountSuspended(StudyPage)
    expect(wrapper.text()).toContain('Failed to load questions')
    expect(wrapper.find('.prompt').exists()).toBe(false)
  })

  it('shows the first question prompt', async () => {
    const wrapper = await mountSuspended(StudyPage)
    expect(wrapper.text()).toContain('What is the capital of France?')
  })

  it('shows the progress header with Question 1 of 2', async () => {
    const wrapper = await mountSuspended(StudyPage)
    expect(wrapper.find('.progress-header').text()).toContain('Question 1 of 2')
  })

  it('shows running tally of 0 correct and 0 incorrect initially', async () => {
    const wrapper = await mountSuspended(StudyPage)
    expect(wrapper.text()).toContain('✓ 0 correct')
    expect(wrapper.text()).toContain('✗ 0 incorrect')
  })

  it('renders answer buttons for the current question', async () => {
    const wrapper = await mountSuspended(StudyPage)
    const buttons = wrapper.findAll('.answers button')
    expect(buttons).toHaveLength(3)
    expect(wrapper.text()).toContain('Paris')
    expect(wrapper.text()).toContain('Berlin')
    expect(wrapper.text()).toContain('Madrid')
  })

  it('answer buttons are disabled after selecting an answer', async () => {
    mockFetch.mockResolvedValue({ wasCorrect: true, correctAnswerId: 'a1' })
    const wrapper = await mountSuspended(StudyPage)
    await wrapper.findAll('.answers button')[0].trigger('click')
    await wrapper.vm.$nextTick()
    const buttons = wrapper.findAll('.answers button')
    for (const btn of buttons) {
      expect(btn.attributes('disabled')).toBeDefined()
    }
  })

  it('shows feedback after answering correctly', async () => {
    mockFetch.mockResolvedValue({ wasCorrect: true, correctAnswerId: 'a1' })
    const wrapper = await mountSuspended(StudyPage)
    await wrapper.findAll('.answers button')[0].trigger('click')
    await wrapper.vm.$nextTick()
    expect(wrapper.find('.feedback').exists()).toBe(true)
    expect(wrapper.text()).toContain('Correct!')
  })

  it('shows feedback after answering incorrectly', async () => {
    mockFetch.mockResolvedValue({ wasCorrect: false, correctAnswerId: 'a1' })
    const wrapper = await mountSuspended(StudyPage)
    await wrapper.findAll('.answers button')[1].trigger('click')
    await wrapper.vm.$nextTick()
    expect(wrapper.find('.feedback').exists()).toBe(true)
    expect(wrapper.text()).toContain('Incorrect')
  })

  it('increments correct count when answer is correct', async () => {
    mockFetch.mockResolvedValue({ wasCorrect: true, correctAnswerId: 'a1' })
    const wrapper = await mountSuspended(StudyPage)
    await wrapper.findAll('.answers button')[0].trigger('click')
    await wrapper.vm.$nextTick()
    expect(wrapper.text()).toContain('✓ 1 correct')
    expect(wrapper.text()).toContain('✗ 0 incorrect')
  })

  it('increments incorrect count when answer is wrong', async () => {
    mockFetch.mockResolvedValue({ wasCorrect: false, correctAnswerId: 'a1' })
    const wrapper = await mountSuspended(StudyPage)
    await wrapper.findAll('.answers button')[1].trigger('click')
    await wrapper.vm.$nextTick()
    expect(wrapper.text()).toContain('✓ 0 correct')
    expect(wrapper.text()).toContain('✗ 1 incorrect')
  })

  it('Next button is shown in feedback and advances to the next question', async () => {
    mockFetch.mockResolvedValue({ wasCorrect: true, correctAnswerId: 'a1' })
    const wrapper = await mountSuspended(StudyPage)
    await wrapper.findAll('.answers button')[0].trigger('click')
    await wrapper.vm.$nextTick()
    const nextBtn = wrapper.find('.next-btn')
    expect(nextBtn.exists()).toBe(true)
    await nextBtn.trigger('click')
    await wrapper.vm.$nextTick()
    expect(wrapper.text()).toContain('What is 2 + 2?')
    expect(wrapper.find('.feedback').exists()).toBe(false)
    expect(wrapper.text()).toContain('Question 2 of 2')
  })

  it('shows completion screen after answering all questions', async () => {
    mockFetch.mockResolvedValue({ wasCorrect: true, correctAnswerId: 'a1' })
    const wrapper = await mountSuspended(StudyPage)

    // Answer question 1
    await wrapper.findAll('.answers button')[0].trigger('click')
    await wrapper.vm.$nextTick()
    await wrapper.find('.next-btn').trigger('click')
    await wrapper.vm.$nextTick()

    // Answer question 2
    mockFetch.mockResolvedValue({ wasCorrect: true, correctAnswerId: 'b2' })
    await wrapper.findAll('.answers button')[1].trigger('click')
    await wrapper.vm.$nextTick()
    await wrapper.find('.next-btn').trigger('click')
    await wrapper.vm.$nextTick()

    expect(wrapper.text()).toContain('All done!')
    expect(wrapper.find('.score').text()).toContain('2 / 2')
    expect(wrapper.text()).toContain('100% accuracy')
    expect(wrapper.find('.prompt').exists()).toBe(false)
  })

  it('shows "Back to quiz" link on the completion screen', async () => {
    mockFetch.mockResolvedValue({ wasCorrect: true, correctAnswerId: 'a1' })
    const wrapper = await mountSuspended(StudyPage)

    await wrapper.findAll('.answers button')[0].trigger('click')
    await wrapper.vm.$nextTick()
    await wrapper.find('.next-btn').trigger('click')
    await wrapper.vm.$nextTick()

    mockFetch.mockResolvedValue({ wasCorrect: false, correctAnswerId: 'b2' })
    await wrapper.findAll('.answers button')[0].trigger('click')
    await wrapper.vm.$nextTick()
    await wrapper.find('.next-btn').trigger('click')
    await wrapper.vm.$nextTick()

    expect(wrapper.text()).toContain('Back to quiz')
    const link = wrapper.find('.back-link')
    expect(link.exists()).toBe(true)
    expect(link.attributes('href')).toBe('/')
  })

  it('shows mixed correct/incorrect counts on completion screen', async () => {
    mockFetch.mockResolvedValue({ wasCorrect: true, correctAnswerId: 'a1' })
    const wrapper = await mountSuspended(StudyPage)

    // Answer Q1 correctly
    await wrapper.findAll('.answers button')[0].trigger('click')
    await wrapper.vm.$nextTick()
    await wrapper.find('.next-btn').trigger('click')
    await wrapper.vm.$nextTick()

    // Answer Q2 incorrectly
    mockFetch.mockResolvedValue({ wasCorrect: false, correctAnswerId: 'b2' })
    await wrapper.findAll('.answers button')[0].trigger('click')
    await wrapper.vm.$nextTick()
    await wrapper.find('.next-btn').trigger('click')
    await wrapper.vm.$nextTick()

    expect(wrapper.text()).toContain('1 / 2')
    expect(wrapper.text()).toContain('50% accuracy')
    expect(wrapper.text()).toContain('✓ 1 correct')
    expect(wrapper.text()).toContain('✗ 1 incorrect')
  })

  it('shows error banner when attempt API fails', async () => {
    mockFetch.mockRejectedValue(new Error('Network error'))
    const wrapper = await mountSuspended(StudyPage)
    await wrapper.findAll('.answers button')[0].trigger('click')
    await wrapper.vm.$nextTick()
    expect(wrapper.text()).toContain('Failed to record answer')
    expect(wrapper.find('.feedback').exists()).toBe(false)
  })

  it('shows "No questions available." when questions list is empty', async () => {
    mockUseFetch.mockReturnValue({ data: ref([]), pending: ref(false), error: ref(null) })
    const wrapper = await mountSuspended(StudyPage)
    expect(wrapper.text()).toContain('No questions available.')
  })

  it('posts the attempt to /api/attempts with correct body', async () => {
    mockFetch.mockResolvedValue({ wasCorrect: true, correctAnswerId: 'a1' })
    const wrapper = await mountSuspended(StudyPage)
    await wrapper.findAll('.answers button')[0].trigger('click')
    await wrapper.vm.$nextTick()
    expect(mockFetch).toHaveBeenCalledWith('/api/attempts', {
      method: 'POST',
      body: { questionId: 'q1', answerId: 'a1' },
    })
  })
})
