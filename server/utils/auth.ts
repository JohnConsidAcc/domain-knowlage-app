/**
 * Sanitises the post-login redirect URL for the NextAuth redirect callback.
 *
 * Prevents an infinite loop when the `callbackUrl` cookie is stale and points
 * back at the sign-in page (e.g. left over from a previous sign-out).
 */
export function resolveRedirect(url: string, baseUrl: string): string {
  // Never redirect back to the sign-in page.
  if (url.includes('/api/auth/signin')) return baseUrl
  // Allow relative URLs.
  if (url.startsWith('/')) return `${baseUrl}${url}`
  // Allow same-origin absolute URLs.
  if (new URL(url).origin === baseUrl) return url
  return baseUrl
}
