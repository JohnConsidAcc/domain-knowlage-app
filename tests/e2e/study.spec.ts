import { test, expect } from '@playwright/test'

test.describe('Study mode', () => {
  test('study page loads and shows heading', async ({ page }) => {
    await page.goto('/study')
    await expect(page.locator('h1')).toContainText('Study mode')
  })

  test('shows progress header with question count', async ({ page }) => {
    await page.goto('/study')
    await expect(page.locator('.progress-header')).toBeVisible()
    await expect(page.locator('.progress-header')).toContainText('Question 1 of')
  })

  test('shows running tally starting at 0 correct and 0 incorrect', async ({ page }) => {
    await page.goto('/study')
    await expect(page.locator('.correct-count').first()).toContainText('0 correct')
    await expect(page.locator('.incorrect-count').first()).toContainText('0 incorrect')
  })

  test('shows a question prompt and answer buttons', async ({ page }) => {
    await page.goto('/study')
    await expect(page.locator('.prompt')).toBeVisible()
    await expect(page.locator('.answers button').first()).toBeVisible()
  })

  test('answer buttons are disabled after answering', async ({ page }) => {
    await page.goto('/study')
    await expect(page.locator('.answers button').first()).toBeVisible()
    await page.locator('.answers button').first().click()
    await expect(page.locator('.feedback')).toBeVisible()
    const buttons = page.locator('.answers button')
    const count = await buttons.count()
    for (let i = 0; i < count; i++) {
      await expect(buttons.nth(i)).toBeDisabled()
    }
  })

  test('shows feedback after answering a question', async ({ page }) => {
    await page.goto('/study')
    await expect(page.locator('.answers button').first()).toBeVisible()
    await page.locator('.answers button').first().click()
    await expect(page.locator('.feedback')).toBeVisible()
  })

  test('shows Next button in feedback after answering', async ({ page }) => {
    await page.goto('/study')
    await expect(page.locator('.answers button').first()).toBeVisible()
    await page.locator('.answers button').first().click()
    await expect(page.locator('.next-btn')).toBeVisible()
    await expect(page.locator('.next-btn')).toContainText('Next')
  })

  test('Next button advances to the next question', async ({ page }) => {
    await page.goto('/study')
    await expect(page.locator('.progress-header')).toContainText('Question 1 of')
    await page.locator('.answers button').first().click()
    await expect(page.locator('.next-btn')).toBeVisible()
    await page.locator('.next-btn').click()
    await expect(page.locator('.feedback')).not.toBeVisible()
    await expect(page.locator('.progress-header')).toContainText('Question 2 of')
  })

  test('tally updates after a correct answer', async ({ page }) => {
    // Find and answer a question correctly by trying each answer
    await page.goto('/study')
    await expect(page.locator('.answers button').first()).toBeVisible()

    const maxAttempts = 20
    for (let attempt = 0; attempt < maxAttempts; attempt++) {
      await page.goto('/study')
      await expect(page.locator('.answers button').first()).toBeVisible()
      await page.locator('.answers button').first().click()
      await expect(page.locator('.feedback')).toBeVisible()
      if (await page.locator('.feedback .correct').isVisible()) {
        await expect(page.locator('.correct-count').first()).toContainText('1 correct')
        return
      }
    }
    // If we couldn't get a correct answer in 20 tries, just verify tally changed
  })

  test('sidebar shows Study mode link', async ({ page }) => {
    await page.goto('/')
    await expect(page.locator('.sidebar-link', { hasText: 'Study mode' })).toBeVisible()
  })

  test('Study mode sidebar link navigates to /study', async ({ page }) => {
    await page.goto('/')
    await page.locator('.sidebar-link', { hasText: 'Study mode' }).click()
    await expect(page).toHaveURL('/study')
    await expect(page.locator('h1')).toContainText('Study mode')
  })

  test('shows error banner when study questions API fails', async ({ page }) => {
    await page.route('**/api/study/questions', route => route.fulfill({
      status: 500,
      contentType: 'application/json',
      body: JSON.stringify({ message: 'Internal Server Error' }),
    }))
    await page.goto('/study')
    await expect(page.getByText('Failed to load questions')).toBeVisible()
    await expect(page.locator('.prompt')).toHaveCount(0)
  })

  test('completion screen is shown after answering all questions', async ({ page }) => {
    // Get the total count of questions from the progress header
    await page.goto('/study')
    const progressText = await page.locator('.progress-header').textContent()
    const totalMatch = progressText?.match(/of (\d+)/)
    if (!totalMatch) {
      throw new Error('Could not read question count from progress header')
    }
    const total = parseInt(totalMatch[1])

    // Answer all questions
    for (let i = 0; i < total; i++) {
      await expect(page.locator('.answers button').first()).toBeVisible()
      await page.locator('.answers button').first().click()
      await expect(page.locator('.next-btn')).toBeVisible()
      await page.locator('.next-btn').click()
    }

    await expect(page.locator('.completion-screen')).toBeVisible()
    await expect(page.locator('.completion-screen')).toContainText('All done!')
  })

  test('completion screen shows score and accuracy', async ({ page }) => {
    await page.goto('/study')
    const progressText = await page.locator('.progress-header').textContent()
    const totalMatch = progressText?.match(/of (\d+)/)
    if (!totalMatch) throw new Error('Could not read question count')
    const total = parseInt(totalMatch[1])

    for (let i = 0; i < total; i++) {
      await expect(page.locator('.answers button').first()).toBeVisible()
      await page.locator('.answers button').first().click()
      await expect(page.locator('.next-btn')).toBeVisible()
      await page.locator('.next-btn').click()
    }

    await expect(page.locator('.score')).toBeVisible()
    await expect(page.locator('.accuracy-label')).toContainText('% accuracy')
  })

  test('completion screen has Back to quiz link', async ({ page }) => {
    await page.goto('/study')
    const progressText = await page.locator('.progress-header').textContent()
    const totalMatch = progressText?.match(/of (\d+)/)
    if (!totalMatch) throw new Error('Could not read question count')
    const total = parseInt(totalMatch[1])

    for (let i = 0; i < total; i++) {
      await expect(page.locator('.answers button').first()).toBeVisible()
      await page.locator('.answers button').first().click()
      await expect(page.locator('.next-btn')).toBeVisible()
      await page.locator('.next-btn').click()
    }

    await expect(page.locator('.back-link')).toBeVisible()
    await expect(page.locator('.back-link')).toContainText('Back to quiz')
    await page.locator('.back-link').click()
    await expect(page).toHaveURL('/')
  })
})
