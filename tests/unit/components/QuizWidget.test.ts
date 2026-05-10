import { describe, it, expect } from 'vitest'
import { mountSuspended } from '@nuxt/test-utils/runtime'
import QuizWidget from '~/components/QuizWidget.vue'

const question = {
  id: 'q1',
  prompt: 'What is 2 + 2?',
  answers: [
    { id: 'a1', text: '3' },
    { id: 'a2', text: '4' },
  ],
}

describe('QuizWidget', () => {
  it('renders the question prompt', async () => {
    const wrapper = await mountSuspended(QuizWidget, { props: { question, result: null } })
    expect(wrapper.text()).toContain('What is 2 + 2?')
  })

  it('renders all answers as buttons', async () => {
    const wrapper = await mountSuspended(QuizWidget, { props: { question, result: null } })
    const buttons = wrapper.findAll('button')
    expect(buttons).toHaveLength(2)
    expect(buttons[0].text()).toBe('3')
    expect(buttons[1].text()).toBe('4')
  })

  it('emits answered with questionId and answerId on click', async () => {
    const wrapper = await mountSuspended(QuizWidget, { props: { question, result: null } })
    await wrapper.findAll('button')[1].trigger('click')
    expect(wrapper.emitted('answered')).toEqual([['q1', 'a2']])
  })

  it('does not emit answered when result is already set (correct)', async () => {
    const wrapper = await mountSuspended(QuizWidget, { props: { question, result: true } })
    for (const b of wrapper.findAll('li button')) await b.trigger('click')
    expect(wrapper.emitted('answered')).toBeFalsy()
  })

  it('does not emit answered when result is already set (incorrect)', async () => {
    const wrapper = await mountSuspended(QuizWidget, { props: { question, result: false } })
    for (const b of wrapper.findAll('li button')) await b.trigger('click')
    expect(wrapper.emitted('answered')).toBeFalsy()
  })

  it('shows correct feedback when result is true', async () => {
    const wrapper = await mountSuspended(QuizWidget, { props: { question, result: true } })
    expect(wrapper.text()).toContain('Correct!')
    expect(wrapper.text()).not.toContain('Incorrect')
  })

  it('shows incorrect feedback when result is false', async () => {
    const wrapper = await mountSuspended(QuizWidget, { props: { question, result: false } })
    expect(wrapper.text()).toContain('Incorrect')
    expect(wrapper.text()).not.toContain('Correct!')
  })

  it('shows next button only when result is set', async () => {
    const noResult = await mountSuspended(QuizWidget, { props: { question, result: null } })
    expect(noResult.find('.next-btn').exists()).toBe(false)

    const withResult = await mountSuspended(QuizWidget, { props: { question, result: true } })
    expect(withResult.find('.next-btn').exists()).toBe(true)
  })

  it('emits next when next button is clicked', async () => {
    const wrapper = await mountSuspended(QuizWidget, { props: { question, result: true } })
    await wrapper.find('.next-btn').trigger('click')
    expect(wrapper.emitted('next')).toHaveLength(1)
  })
})
