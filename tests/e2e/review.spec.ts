import { test, expect } from '@playwright/test'
import { waitForHydration } from './helpers'

test.describe('Review flagged questions', () => {
  // Helper: create and invalidate a question via the API
  async function createFlaggedQuestion(request: any, prompt: string) {
    const createRes = await request.post('/api/questions', {
      data: {
        prompt,
        answers: [
          { text: 'Correct answer', isCorrect: true },
          { text: 'Wrong answer', isCorrect: false },
        ],
      },
    })
    const { id } = await createRes.json()
    await request.patch(`/api/questions/${id}`, {
      data: { action: 'invalidate' },
    })
    return id
  }

  test('shows empty message when no questions are flagged', async ({ page }) => {
    await page.goto('/questions/review')
    await expect(page.locator('h1')).toContainText('Review flagged questions')
  })

  test('shows flagged questions in the list', async ({ page, request }) => {
    const prompt = `E2E flagged question ${Date.now()}`
    await createFlaggedQuestion(request, prompt)

    await page.goto('/questions/review')
    await expect(page.locator('.question-item').filter({ hasText: prompt })).toBeVisible()
  })

  test('can enter edit mode for a flagged question', async ({ page, request }) => {
    const prompt = `E2E edit test ${Date.now()}`
    await createFlaggedQuestion(request, prompt)

    await page.goto('/questions/review')
    await waitForHydration(page)
    await page.locator('.question-item', { hasText: prompt }).locator('.item-actions button').first().click()
    await expect(page.locator('.edit-form')).toBeVisible()
    await expect(page.locator('.edit-form textarea')).toHaveValue(prompt)
  })

  test('can cancel editing without saving', async ({ page, request }) => {
    const prompt = `E2E cancel test ${Date.now()}`
    await createFlaggedQuestion(request, prompt)

    await page.goto('/questions/review')
    await waitForHydration(page)
    await page.locator('.question-item', { hasText: prompt }).locator('.item-actions button').first().click()
    await expect(page.locator('.edit-form')).toBeVisible()

    await page.locator('.edit-actions button', { hasText: 'Cancel' }).click()
    await expect(page.locator('.edit-form')).not.toBeVisible()
    await expect(page.locator('.question-item', { hasText: prompt })).toBeVisible()
  })

  test('can correct a flagged question and it is removed from the list', async ({ page, request }) => {
    const prompt = `E2E correct test ${Date.now()}`
    await createFlaggedQuestion(request, prompt)

    await page.goto('/questions/review')
    await waitForHydration(page)
    await page.locator('.question-item', { hasText: prompt }).locator('.item-actions button').first().click()

    // Update the prompt and save
    const textarea = page.locator('.edit-form textarea')
    await textarea.fill(`${prompt} (corrected)`)
    await page.locator('.edit-actions button', { hasText: 'Save' }).click()

    // Question should be removed from the flagged list
    await expect(page.locator('.question-item', { hasText: prompt })).not.toBeVisible()
  })

  test('can delete a flagged question', async ({ page, request }) => {
    const prompt = `E2E delete test ${Date.now()}`
    await createFlaggedQuestion(request, prompt)

    await page.goto('/questions/review')
    await waitForHydration(page)

    // Accept the confirm dialog
    page.on('dialog', dialog => dialog.accept())

    await page.locator('.question-item', { hasText: prompt }).locator('.delete-btn').click()
    await expect(page.locator('.question-item', { hasText: prompt })).not.toBeVisible()
  })
})
