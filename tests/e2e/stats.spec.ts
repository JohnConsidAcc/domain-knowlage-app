import { test, expect } from '@playwright/test'

test.describe('Statistics page', () => {
  test('shows the stats page heading', async ({ page }) => {
    await page.goto('/stats')
    await expect(page.locator('h1')).toContainText('My statistics')
  })

  test('shows four time period cards', async ({ page }) => {
    await page.goto('/stats')
    await expect(page.locator('.stat-card')).toHaveCount(4)
  })

  test('shows Today, This week, This month and All time labels', async ({ page }) => {
    await page.goto('/stats')
    await expect(page.locator('.period-label', { hasText: 'Today' })).toBeVisible()
    await expect(page.locator('.period-label', { hasText: 'This week' })).toBeVisible()
    await expect(page.locator('.period-label', { hasText: 'This month' })).toBeVisible()
    await expect(page.locator('.period-label', { hasText: 'All time' })).toBeVisible()
  })

  test('each card shows an accuracy percentage and attempt counts', async ({ page }) => {
    await page.goto('/stats')
    const cards = page.locator('.stat-card')
    const count = await cards.count()
    for (let i = 0; i < count; i++) {
      await expect(cards.nth(i).locator('.accuracy')).toBeVisible()
      await expect(cards.nth(i).locator('.detail')).toContainText('correct')
    }
  })

  test('shows error banner when stats API fails', async ({ page }) => {
    await page.route('**/api/stats', route => route.fulfill({
      status: 500,
      contentType: 'application/json',
      body: JSON.stringify({ message: 'Internal Server Error' }),
    }))
    await page.goto('/stats')
    await expect(page.getByText('Failed to load statistics')).toBeVisible()
    await expect(page.locator('.stat-card')).toHaveCount(0)
  })

  test('shows a reset progress button', async ({ page }) => {
    await page.goto('/stats')
    await expect(page.locator('.reset-btn')).toBeVisible()
    await expect(page.locator('.reset-btn')).toContainText('Reset my progress')
  })

  test('cancelling the confirm dialog does not reset stats', async ({ page }) => {
    await page.goto('/stats')
    page.on('dialog', dialog => dialog.dismiss())
    await page.locator('.reset-btn').click()
    // Stats grid should still be visible — nothing was cleared
    await expect(page.locator('.stat-card')).toHaveCount(4)
  })

  test('confirming reset clears all attempts and shows success message', async ({ page }) => {
    // First answer a question so there is something to reset
    await page.goto('/')
    await page.locator('.answers button').first().click()
    await expect(page.locator('.feedback')).toBeVisible()

    await page.goto('/stats')
    page.on('dialog', dialog => dialog.accept())
    await page.locator('.reset-btn').click()
    await expect(page.getByText('Progress reset successfully')).toBeVisible()

    // All time total should now be 0
    const allTimeDetail = await page.locator('.stat-card').last().locator('.detail').textContent()
    expect(allTimeDetail).toContain('0 / 0 correct')
  })

  test('stats update after answering a question', async ({ page }) => {
    await page.goto('/stats')
    const allTimeDetail = await page.locator('.stat-card').last().locator('.detail').textContent()
    const before = parseInt(allTimeDetail?.match(/(\d+) \//)?.[1] ?? '0')

    // Answer a quiz question
    await page.goto('/')
    await expect(page.locator('.answers button').first()).toBeVisible()
    await page.locator('.answers button').first().click()
    await expect(page.locator('.feedback')).toBeVisible()

    // Check stats updated
    await page.goto('/stats')
    const updatedDetail = await page.locator('.stat-card').last().locator('.detail').textContent()
    const after = parseInt(updatedDetail?.match(/(\d+) \//)?.[1] ?? '0')
    expect(after).toBeGreaterThan(before)
  })
})
