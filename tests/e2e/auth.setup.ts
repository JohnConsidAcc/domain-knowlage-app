import { test as setup, expect } from '@playwright/test'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const authFile = path.join(__dirname, '.auth/user.json')

setup('authenticate as test user', async ({ page }) => {
  await page.goto('/')

  // The auth middleware redirects to the nuxt-auth sign-in page
  // Click the OIDC sign-in button to proceed to Keycloak
  await page.click('text=Sign in with OIDC')

  // Wait for redirect to Keycloak login page
  await page.waitForURL(/localhost:8080/, { timeout: 30_000 })

  await page.fill('#username', 'test@example.com')
  await page.fill('#password', 'Test1234!')
  await page.click('[name="login"]')

  // Wait until we land back in the app
  await page.waitForURL('http://localhost:3000/**', { timeout: 30_000 })
  await expect(page.locator('.sidebar')).toBeVisible()

  await page.context().storageState({ path: authFile })
})
