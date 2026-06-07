import { describe, it, expect } from 'vitest'
import { resolveRedirect } from '../../../../server/utils/auth'

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
