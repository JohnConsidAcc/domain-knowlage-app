import type { Page } from '@playwright/test'

/**
 * Wait for the Nuxt/Vue app to finish hydrating the *current page's
 * component tree*.
 *
 * `__vue_app__` on `#__nuxt` is set when the Vue app is created (before
 * hydration of page content), so it's not a reliable signal on its own.
 * `__vueParentComponent` is attached to a DOM node once Vue has claimed
 * it during hydration — so probing `<main>` (the per-page wrapper) tells
 * us page content is live.
 *
 * Additionally wait for networkidle so any `useFetch` driving the page
 * has settled and the DOM has stabilised.
 */
export async function waitForHydration(page: Page) {
  await page.waitForFunction(
    () => {
      const main = document.querySelector('main') as (HTMLElement & { __vueParentComponent?: unknown }) | null
      return !!main && main.__vueParentComponent !== undefined
    },
    undefined,
    { timeout: 10_000 },
  )
  await page.waitForLoadState('networkidle')
}
