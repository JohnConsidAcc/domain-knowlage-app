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

/**
 * Builds the Keycloak RP-initiated logout URL.
 *
 * Redirecting the user here ends the Keycloak session so they are not
 * silently re-authenticated on the next sign-in attempt.
 */
export function buildKeycloakLogoutUrl(
  issuer: string,
  clientId: string,
  postLogoutRedirectUri: string,
): string {
  const url = new URL(`${issuer}/protocol/openid-connect/logout`)
  url.searchParams.set('post_logout_redirect_uri', postLogoutRedirectUri)
  url.searchParams.set('client_id', clientId)
  return url.toString()
}
