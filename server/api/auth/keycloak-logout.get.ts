/**
 * GET /api/auth/keycloak-logout
 *
 * Redirects to the Keycloak end-session endpoint to clear the Keycloak SSO
 * session. The client should call NextAuth signOut({ redirect: false }) first
 * to clear the local session cookie, then navigate here.
 */
export default defineEventHandler((event) => {
  const issuer = process.env.OIDC_ISSUER ?? ''
  const clientId = process.env.OIDC_CLIENT_ID ?? ''
  const redirectUri = process.env.NEXTAUTH_URL ?? 'http://localhost:3000'

  return sendRedirect(event, buildKeycloakLogoutUrl(issuer, clientId, redirectUri))
})
