import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mountSuspended } from '@nuxt/test-utils/runtime'
import AddPage from '~/pages/questions/add.vue'

const mockFetch = vi.fn()
vi.stubGlobal('$fetch', mockFetch)

describe('Add question page', () => {
  beforeEach(() => {
    mockFetch.mockReset()
  })

  it('renders the page heading', async () => {
    const wrapper = await mountSuspended(AddPage)
    expect(wrapper.text()).toContain('Add a question')
  })

  it('renders a textarea for the question prompt', async () => {
    const wrapper = await mountSuspended(AddPage)
    expect(wrapper.find('textarea').exists()).toBe(true)
  })

  it('renders two answer inputs by default', async () => {
    const wrapper = await mountSuspended(AddPage)
    expect(wrapper.findAll('.answer-row')).toHaveLength(2)
  })

  it('adds an answer row when "+ Add answer" is clicked', async () => {
    const wrapper = await mountSuspended(AddPage)
    await wrapper.find('fieldset > button[type="button"]').trigger('click')
    expect(wrapper.findAll('.answer-row')).toHaveLength(3)
  })

  it('removes an answer row when Remove is clicked and more than 2 answers exist', async () => {
    const wrapper = await mountSuspended(AddPage)
    // Add a third answer first
    await wrapper.find('fieldset > button[type="button"]').trigger('click')
    expect(wrapper.findAll('.answer-row')).toHaveLength(3)
    // Remove the last one
    const removeButtons = wrapper.findAll('.answer-row button')
    await removeButtons[removeButtons.length - 1].trigger('click')
    expect(wrapper.findAll('.answer-row')).toHaveLength(2)
  })

  it('shows error when submitting without a prompt', async () => {
    const wrapper = await mountSuspended(AddPage)
    // Set a correct answer to avoid that validation error
    const radios = wrapper.findAll('input[type="radio"]')
    await radios[0].trigger('change')
    await wrapper.find('form').trigger('submit')
    expect(wrapper.text()).toContain('A question prompt is required')
  })

  it('shows error when submitting without a correct answer', async () => {
    const wrapper = await mountSuspended(AddPage)
    const textarea = wrapper.find('textarea')
    await textarea.setValue('My question?')
    // Don't select a correct answer
    await wrapper.find('form').trigger('submit')
    expect(wrapper.text()).toContain('Mark one answer as correct')
  })

  it('shows success message after successful submission', async () => {
    mockFetch.mockResolvedValue({ id: 'q1' })
    const wrapper = await mountSuspended(AddPage)

    await wrapper.find('textarea').setValue('My question?')
    const radios = wrapper.findAll('input[type="radio"]')
    await radios[0].trigger('change')
    const textInputs = wrapper.findAll('input[type="text"]')
    await textInputs[0].setValue('Answer A')
    await textInputs[1].setValue('Answer B')

    await wrapper.find('form').trigger('submit')
    await wrapper.vm.$nextTick()

    expect(wrapper.text()).toContain('Question added successfully')
  })

  it('shows error message when submission fails', async () => {
    mockFetch.mockRejectedValue({ data: { message: 'Server error' } })
    const wrapper = await mountSuspended(AddPage)

    await wrapper.find('textarea').setValue('My question?')
    const radios = wrapper.findAll('input[type="radio"]')
    await radios[0].trigger('change')
    const textInputs = wrapper.findAll('input[type="text"]')
    await textInputs[0].setValue('Answer A')
    await textInputs[1].setValue('Answer B')

    await wrapper.find('form').trigger('submit')
    await wrapper.vm.$nextTick()

    expect(wrapper.text()).toContain('Server error')
  })

  it('shows generic error when submission fails without message', async () => {
    mockFetch.mockRejectedValue({})
    const wrapper = await mountSuspended(AddPage)

    await wrapper.find('textarea').setValue('My question?')
    const radios = wrapper.findAll('input[type="radio"]')
    await radios[0].trigger('change')
    const textInputs = wrapper.findAll('input[type="text"]')
    await textInputs[0].setValue('Answer A')
    await textInputs[1].setValue('Answer B')

    await wrapper.find('form').trigger('submit')
    await wrapper.vm.$nextTick()

    expect(wrapper.text()).toContain('Something went wrong')
  })

  it('renders a link back to the quiz', async () => {
    const wrapper = await mountSuspended(AddPage)
    expect(wrapper.text()).toContain('Back to quiz')
  })
})
