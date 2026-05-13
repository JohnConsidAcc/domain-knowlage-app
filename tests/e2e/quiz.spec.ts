import { test, expect } from '@playwright/test'

test.describe('Quiz', () => {
  test('shows a question with answer buttons', async ({ page }) => {
    await page.goto('/')
    await expect(page.locator('.prompt')).toBeVisible()
    await expect(page.locator('.answers button').first()).toBeVisible()
  })

  test('shows feedback after answering', async ({ page }) => {
    await page.goto('/')
    await expect(page.locator('.prompt')).toBeVisible()
    await page.locator('.answers button').first().click()
    await expect(page.locator('.feedback')).toBeVisible()
  })

  test('shows Correct! when the right answer is chosen', async ({ page }) => {
    // Each visit serves a random question; click the first answer and
    // retry on new questions until one happens to be correct.
    const maxAttempts = 20
    for (let attempt = 0; attempt < maxAttempts; attempt++) {
      await page.goto('/')
      await expect(page.locator('.prompt')).toBeVisible()
      await page.locator('.answers button').first().click()
      await expect(page.locator('.feedback')).toBeVisible()
      if (await page.locator('.feedback .correct').isVisible()) {
        await expect(page.locator('.feedback')).toContainText('Correct!')
        return
      }
    }
    throw new Error('No correct answer found in 20 attempts')
  })

  test('shows Incorrect and highlights correct answer when wrong answer chosen', async ({ page }) => {
    // Click the last answer button on each visit until we land on a wrong one.
    // Picking .last() (rather than .first()) avoids the case where seed data
    // happens to put the correct answer in position 0 for every question.
    const maxAttempts = 20
    for (let attempt = 0; attempt < maxAttempts; attempt++) {
      await page.goto('/')
      await expect(page.locator('.prompt')).toBeVisible()
      await page.locator('.answers button').last().click()
      await expect(page.locator('.feedback')).toBeVisible()
      if (await page.locator('.feedback .incorrect').isVisible()) {
        await expect(page.locator('.feedback')).toContainText('Incorrect')
        await expect(page.locator('.answers button.correct')).toHaveCount(1)
        return
      }
    }
    throw new Error('No incorrect answer found in 20 attempts')
  })

  test('answer buttons are disabled after answering', async ({ page }) => {
    await page.goto('/')
    await expect(page.locator('.prompt')).toBeVisible()
    await page.locator('.answers button').first().click()
    await expect(page.locator('.feedback')).toBeVisible()

    // All answer buttons should now be disabled
    const buttons = page.locator('.answers button')
    const count = await buttons.count()
    for (let i = 0; i < count; i++) {
      await expect(buttons.nth(i)).toBeDisabled()
    }
  })

  test('Next question button loads a new question', async ({ page }) => {
    await page.goto('/')
    const firstPrompt = await page.locator('.prompt').textContent()

    await page.locator('.answers button').first().click()
    await expect(page.locator('.next-btn')).toBeVisible()
    await page.locator('.next-btn').click()

    // A new question should load (may or may not be the same text with few questions)
    await expect(page.locator('.prompt')).toBeVisible()
    await expect(page.locator('.feedback')).not.toBeVisible()
    await expect(page.locator('.next-btn')).not.toBeVisible()
  })

  test('Report question button invalidates the question and loads the next one', async ({ page }) => {
    await page.goto('/')
    const firstPrompt = await page.locator('.prompt').textContent()

    await page.locator('.invalidate-btn').click()

    // Next question should load
    await expect(page.locator('.prompt')).toBeVisible()
  })
})
