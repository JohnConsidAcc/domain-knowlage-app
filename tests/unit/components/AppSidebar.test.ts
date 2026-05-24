import { describe, it, expect } from 'vitest'
import { mountSuspended } from '@nuxt/test-utils/runtime'
import AppSidebar from '~/components/AppSidebar.vue'

describe('AppSidebar', () => {
  it('renders navigation links', async () => {
    const wrapper = await mountSuspended(AppSidebar)
    expect(wrapper.text()).toContain('Quiz')
    expect(wrapper.text()).toContain('Add question')
    expect(wrapper.text()).toContain('Review flagged')
    expect(wrapper.text()).toContain('My statistics')
  })

  it('renders links with correct hrefs', async () => {
    const wrapper = await mountSuspended(AppSidebar)
    const links = wrapper.findAll('a')
    const hrefs = links.map(l => l.attributes('href'))
    expect(hrefs).toContain('/')
    expect(hrefs).toContain('/questions/add')
    expect(hrefs).toContain('/questions/review')
    expect(hrefs).toContain('/stats')
  })

  it('starts expanded and shows labels', async () => {
    const wrapper = await mountSuspended(AppSidebar)
    expect(wrapper.find('nav').classes()).not.toContain('collapsed')
    expect(wrapper.findAll('.link-label')).toHaveLength(4)
  })

  it('collapses when toggle button is clicked', async () => {
    const wrapper = await mountSuspended(AppSidebar)
    await wrapper.find('.sidebar-toggle').trigger('click')
    expect(wrapper.find('nav').classes()).toContain('collapsed')
    expect(wrapper.findAll('.link-label')).toHaveLength(0)
  })

  it('expands again when toggle is clicked a second time', async () => {
    const wrapper = await mountSuspended(AppSidebar)
    await wrapper.find('.sidebar-toggle').trigger('click')
    await wrapper.find('.sidebar-toggle').trigger('click')
    expect(wrapper.find('nav').classes()).not.toContain('collapsed')
    expect(wrapper.findAll('.link-label')).toHaveLength(4)
  })

  it('toggle button has correct aria-expanded attribute', async () => {
    const wrapper = await mountSuspended(AppSidebar)
    const toggle = wrapper.find('.sidebar-toggle')
    expect(toggle.attributes('aria-expanded')).toBe('true')
    await toggle.trigger('click')
    expect(toggle.attributes('aria-expanded')).toBe('false')
  })

  it('renders icons for each link', async () => {
    const wrapper = await mountSuspended(AppSidebar)
    expect(wrapper.findAll('.link-icon')).toHaveLength(4)
  })

  it('icons remain visible when collapsed', async () => {
    const wrapper = await mountSuspended(AppSidebar)
    await wrapper.find('.sidebar-toggle').trigger('click')
    expect(wrapper.findAll('.link-icon')).toHaveLength(4)
  })

  it('nav has accessible aria-label', async () => {
    const wrapper = await mountSuspended(AppSidebar)
    expect(wrapper.find('nav').attributes('aria-label')).toBe('Main navigation')
  })

  it('applies mobile-open class when mobileOpen prop is true', async () => {
    const wrapper = await mountSuspended(AppSidebar, { props: { mobileOpen: true } })
    expect(wrapper.find('nav').classes()).toContain('mobile-open')
  })

  it('shows close button when mobileOpen prop is true', async () => {
    const wrapper = await mountSuspended(AppSidebar, { props: { mobileOpen: true } })
    expect(wrapper.find('.sidebar-close').exists()).toBe(true)
  })

  it('emits close when close button is clicked', async () => {
    const wrapper = await mountSuspended(AppSidebar, { props: { mobileOpen: true } })
    await wrapper.find('.sidebar-close').trigger('click')
    expect(wrapper.emitted('close')).toHaveLength(1)
  })

  it('does not show close button when mobileOpen is false', async () => {
    const wrapper = await mountSuspended(AppSidebar, { props: { mobileOpen: false } })
    expect(wrapper.find('.sidebar-close').exists()).toBe(false)
  })
})
