import { test as setup, expect } from '@playwright/test'

setup('reset E2E test data', async ({ request }) => {
  const response = await request.post('/api/test/reset')
  expect(response.status()).toBe(200)
  const body = await response.json()
  expect(body.ok).toBe(true)
  expect(body.seeded).toBe(5)
})
