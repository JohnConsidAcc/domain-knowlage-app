import { test, expect } from '@playwright/test'
import { waitForHydration } from './helpers'

test.describe('Sidebar navigation', () => {
  test('sidebar is visible on the quiz page', async ({ page }) => {
    await page.goto('/')
    await expect(page.locator('.sidebar')).toBeVisible()
  })

  test('sidebar is visible on the add question page', async ({ page }) => {
    await page.goto('/questions/add')
    await expect(page.locator('.sidebar')).toBeVisible()
  })

  test('sidebar is visible on the review page', async ({ page }) => {
    await page.goto('/questions/review')
    await expect(page.locator('.sidebar')).toBeVisible()
  })

  test('sidebar is visible on the stats page', async ({ page }) => {
    await page.goto('/stats')
    await expect(page.locator('.sidebar')).toBeVisible()
  })

  test('sidebar is visible on the study page', async ({ page }) => {
    await page.goto('/study')
    await expect(page.locator('.sidebar')).toBeVisible()
  })

  test('Quiz link navigates to the quiz page', async ({ page }) => {
    await page.goto('/stats')
    await page.locator('.sidebar-link', { hasText: 'Quiz' }).click()
    await expect(page).toHaveURL('/')
  })

  test('Add question link navigates to the add page', async ({ page }) => {
    await page.goto('/')
    await page.locator('.sidebar-link', { hasText: 'Add question' }).click()
    await expect(page).toHaveURL('/questions/add')
    await expect(page.locator('h1')).toContainText('Add a question')
  })

  test('Review flagged link navigates to the review page', async ({ page }) => {
    await page.goto('/')
    await page.locator('.sidebar-link', { hasText: 'Review flagged' }).click()
    await expect(page).toHaveURL('/questions/review')
    await expect(page.locator('h1')).toContainText('Review flagged questions')
  })

  test('Study mode link navigates to the study page', async ({ page }) => {
    await page.goto('/')
    await page.locator('.sidebar-link', { hasText: 'Study mode' }).click()
    await expect(page).toHaveURL('/study')
    await expect(page.locator('h1')).toContainText('Study mode')
  })

  test('My statistics link navigates to the stats page', async ({ page }) => {
    await page.goto('/')
    await page.locator('.sidebar-link', { hasText: 'My statistics' }).click()
    await expect(page).toHaveURL('/stats')
    await expect(page.locator('h1')).toContainText('My statistics')
  })

  test('sidebar collapses and hides labels when toggle is clicked', async ({ page }) => {
    await page.goto('/')
    await waitForHydration(page)
    await expect(page.locator('.link-label').first()).toBeVisible()
    await page.locator('.sidebar-toggle').click()
    await expect(page.locator('.link-label').first()).not.toBeVisible()
    await expect(page.locator('.sidebar')).toHaveClass(/collapsed/)
  })

  test('sidebar expands again when toggle is clicked a second time', async ({ page }) => {
    await page.goto('/')
    await waitForHydration(page)
    await page.locator('.sidebar-toggle').click()
    await page.locator('.sidebar-toggle').click()
    await expect(page.locator('.link-label').first()).toBeVisible()
    await expect(page.locator('.sidebar')).not.toHaveClass(/collapsed/)
  })

  test('header bar is visible on every page', async ({ page }) => {
    for (const url of ['/', '/stats', '/questions/add', '/questions', '/questions/review', '/study']) {
      await page.goto(url)
      await expect(page.locator('.app-header')).toBeVisible()
    }
  })

  test('header displays the signed-in user name or email', async ({ page }) => {
    await page.goto('/')
    const text = await page.locator('.user-name').textContent()
    expect(text?.trim().length).toBeGreaterThan(0)
  })

  test('sidebar shows a sign-out button', async ({ page }) => {
    await page.goto('/')
    await expect(page.locator('.sidebar-signout')).toBeVisible()
  })

  test('clicking sign-out redirects to the sign-in page', async ({ page }) => {
    await page.goto('/')
    await page.locator('.sidebar-signout').click()
    // After sign-out, nuxt-auth redirects to its sign-in page or Keycloak
    await page.waitForURL(/auth\/signin|api\/auth\/signin|login|keycloak|localhost:8080/, { timeout: 15_000 })
  })
})
