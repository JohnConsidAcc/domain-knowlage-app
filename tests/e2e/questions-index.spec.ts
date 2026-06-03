import { test, expect } from '@playwright/test'
import { waitForHydration } from './helpers'

test.describe('All questions page', () => {
  // Helper: create a question via the API and return its id
  async function createQuestion(request: any, prompt: string) {
    const res = await request.post('/api/questions', {
      data: {
        prompt,
        answers: [
          { text: 'Correct answer', isCorrect: true },
          { text: 'Wrong answer', isCorrect: false },
        ],
      },
    })
    const { id } = await res.json()
    return id
  }

  test('shows page heading', async ({ page }) => {
    await page.goto('/questions')
    await expect(page.locator('h1')).toContainText('All questions')
  })

  test('shows questions in the list', async ({ page, request }) => {
    const prompt = `E2E all-questions list test ${Date.now()}`
    await createQuestion(request, prompt)

    await page.goto('/questions')
    await waitForHydration(page)
    await expect(page.locator('.question-item').filter({ hasText: prompt })).toBeVisible()
  })

  test('highlights the correct answer', async ({ page, request }) => {
    const prompt = `E2E correct-highlight test ${Date.now()}`
    await createQuestion(request, prompt)

    await page.goto('/questions')
    await waitForHydration(page)
    const item = page.locator('.question-item').filter({ hasText: prompt })
    await expect(item.locator('.answer-list li.correct')).toContainText('Correct answer')
  })

  test('shows Edit and Flag buttons for each question', async ({ page, request }) => {
    const prompt = `E2E buttons test ${Date.now()}`
    await createQuestion(request, prompt)

    await page.goto('/questions')
    await waitForHydration(page)
    const item = page.locator('.question-item').filter({ hasText: prompt })
    await expect(item.locator('.item-actions button', { hasText: 'Edit' })).toBeVisible()
    await expect(item.locator('.item-actions button', { hasText: 'Flag' })).toBeVisible()
  })

  test('can enter edit mode for a question', async ({ page, request }) => {
    const prompt = `E2E edit-mode test ${Date.now()}`
    await createQuestion(request, prompt)

    await page.goto('/questions')
    await waitForHydration(page)
    await page.locator('.question-item', { hasText: prompt }).locator('.item-actions button', { hasText: 'Edit' }).click()
    await expect(page.locator('.edit-form')).toBeVisible()
    await expect(page.locator('.edit-form textarea')).toHaveValue(prompt)
  })

  test('can cancel editing without saving', async ({ page, request }) => {
    const prompt = `E2E cancel-edit test ${Date.now()}`
    await createQuestion(request, prompt)

    await page.goto('/questions')
    await waitForHydration(page)
    await page.locator('.question-item', { hasText: prompt }).locator('.item-actions button', { hasText: 'Edit' }).click()
    await expect(page.locator('.edit-form')).toBeVisible()

    await page.locator('.edit-actions button', { hasText: 'Cancel' }).click()
    await expect(page.locator('.edit-form')).not.toBeVisible()
    await expect(page.locator('.question-item', { hasText: prompt })).toBeVisible()
  })

  test('can save an edited question', async ({ page, request }) => {
    const prompt = `E2E save-edit test ${Date.now()}`
    await createQuestion(request, prompt)

    await page.goto('/questions')
    await waitForHydration(page)
    await page.locator('.question-item', { hasText: prompt }).locator('.item-actions button', { hasText: 'Edit' }).click()

    const textarea = page.locator('.edit-form textarea')
    const updatedPrompt = `${prompt} (updated)`
    await textarea.fill(updatedPrompt)
    await page.locator('.edit-actions button', { hasText: 'Save' }).click()

    // Edit form should close and the updated question should appear
    await expect(page.locator('.edit-form')).not.toBeVisible()
    await expect(page.locator('.question-item').filter({ hasText: updatedPrompt })).toBeVisible()
  })

  test('can flag a question and it is removed from the list', async ({ page, request }) => {
    const prompt = `E2E flag test ${Date.now()}`
    await createQuestion(request, prompt)

    await page.goto('/questions')
    await waitForHydration(page)
    await page.locator('.question-item', { hasText: prompt }).locator('.flag-btn').click()

    await expect(page.locator('.question-item').filter({ hasText: prompt })).not.toBeVisible()
  })

  test('shows error banner when API fails', async ({ page }) => {
    await page.route('**/api/questions', route => route.fulfill({
      status: 500,
      contentType: 'application/json',
      body: JSON.stringify({ message: 'Internal Server Error' }),
    }))
    await page.goto('/questions')
    await expect(page.getByText('Failed to load questions')).toBeVisible()
    await expect(page.locator('.question-list')).toHaveCount(0)
  })

  test('shows flag error when flagging fails', async ({ page, request }) => {
    const prompt = `E2E flag-error test ${Date.now()}`
    await createQuestion(request, prompt)

    await page.goto('/questions')
    await waitForHydration(page)

    await page.route('**/api/questions/**', route => route.fulfill({
      status: 500,
      contentType: 'application/json',
      body: JSON.stringify({ message: 'Flag failed' }),
    }))

    await page.locator('.question-item', { hasText: prompt }).locator('.flag-btn').click()
    await expect(page.getByText('Failed to flag question')).toBeVisible()
  })

  test('sidebar contains All questions link', async ({ page }) => {
    await page.goto('/questions')
    await expect(page.locator('.sidebar-link', { hasText: 'All questions' })).toBeVisible()
  })
})
