import { describe, it, expect } from 'vitest'
import { resolveRedirect, buildKeycloakLogoutUrl } from '../../../../server/utils/auth'

const BASE = 'http://localhost:3000'

describe('resolveRedirect', () => {
  it('returns baseUrl when url is the sign-in page (redirect loop prevention)', () => {
    expect(resolveRedirect(`${BASE}/api/auth/signin`, BASE)).toBe(BASE)
  })

  it('returns baseUrl when url contains /api/auth/signin as a substring', () => {
    expect(resolveRedirect(`${BASE}/api/auth/signin?callbackUrl=%2F`, BASE)).toBe(BASE)
  })

  it('resolves a relative url against baseUrl', () => {
    expect(resolveRedirect('/stats', BASE)).toBe(`${BASE}/stats`)
  })

  it('allows a same-origin absolute url through', () => {
    expect(resolveRedirect(`${BASE}/questions`, BASE)).toBe(`${BASE}/questions`)
  })

  it('returns baseUrl for a cross-origin url', () => {
    expect(resolveRedirect('https://evil.example.com', BASE)).toBe(BASE)
  })

  it('returns baseUrl when url is exactly baseUrl', () => {
    expect(resolveRedirect(BASE, BASE)).toBe(BASE)
  })
})

describe('buildKeycloakLogoutUrl', () => {
  const ISSUER = 'http://localhost:8080/realms/domain-app'
  const CLIENT_ID = 'domain-knowledge-app'
  const REDIRECT = 'http://localhost:3000'

  it('includes the logout path', () => {
    const url = buildKeycloakLogoutUrl(ISSUER, CLIENT_ID, REDIRECT)
    expect(url).toContain('/protocol/openid-connect/logout')
  })

  it('sets post_logout_redirect_uri', () => {
    const url = buildKeycloakLogoutUrl(ISSUER, CLIENT_ID, REDIRECT)
    expect(url).toContain(`post_logout_redirect_uri=${encodeURIComponent(REDIRECT)}`)
  })

  it('sets client_id', () => {
    const url = buildKeycloakLogoutUrl(ISSUER, CLIENT_ID, REDIRECT)
    expect(url).toContain(`client_id=${CLIENT_ID}`)
  })
})
