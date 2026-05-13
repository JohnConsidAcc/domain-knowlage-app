import { test, expect } from '@playwright/test'
import { waitForHydration } from './helpers'

test.describe('Add question', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/questions/add')
    await waitForHydration(page)
  })

  test('renders the add question form', async ({ page }) => {
    await expect(page.locator('h1')).toContainText('Add a question')
    await expect(page.locator('textarea')).toBeVisible()
    await expect(page.locator('.answer-row')).toHaveCount(2)
  })

  test('shows validation error when submitting without a prompt', async ({ page }) => {
    await page.locator('input[type="radio"]').first().click()
    await page.locator('input[type="text"]').first().fill('Answer A')
    await page.locator('input[type="text"]').nth(1).fill('Answer B')
    await page.locator('button[type="submit"]').click()
    await expect(page.locator('.error')).toContainText('question prompt is required')
  })

  test('shows validation error when no correct answer is marked', async ({ page }) => {
    await page.locator('textarea').fill('What is the capital of France?')
    await page.locator('input[type="text"]').first().fill('Paris')
    await page.locator('input[type="text"]').nth(1).fill('Berlin')
    await page.locator('button[type="submit"]').click()
    await expect(page.locator('.error')).toContainText('Mark one answer as correct')
  })

  test('can add and remove answer rows', async ({ page }) => {
    await expect(page.locator('.answer-row')).toHaveCount(2)
    await page.locator('fieldset > button').click()
    await expect(page.locator('.answer-row')).toHaveCount(3)

    // Remove buttons are disabled at 2 answers; remove the extra one
    const removeButtons = page.locator('.answer-row button')
    await removeButtons.last().click()
    await expect(page.locator('.answer-row')).toHaveCount(2)
  })

  test('successfully adds a question and shows success message', async ({ page }) => {
    await page.locator('textarea').fill('E2E test question — what does LTE stand for?')
    await page.locator('input[type="radio"]').first().click()
    await page.locator('input[type="text"]').first().fill('Long-Term Evolution')
    await page.locator('input[type="text"]').nth(1).fill('Local Telephone Exchange')
    await page.locator('button[type="submit"]').click()
    await expect(page.locator('.success')).toContainText('Question added successfully')
  })
})
