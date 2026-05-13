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
})
