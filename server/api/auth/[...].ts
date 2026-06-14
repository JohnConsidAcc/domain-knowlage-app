import { NuxtAuthHandler } from '#auth'
import type { AuthOptions } from 'next-auth'

// All endpoints are set explicitly — no wellKnown/discovery.
//
// When wellKnown is used, next-auth feeds the discovery document through
// openid-client, which overrides the explicit authorization.url with the
// authorization_endpoint from the document. Keycloak's discovery document
// returns the Docker-internal hostname (keycloak:8080) for all requests
// that bypass Nginx, so the browser would be redirected to an unreachable
// internal URL regardless of what OIDC_ISSUER is set to.
//
// Without wellKnown, next-auth uses our explicit URLs directly:
//   - authorization → external HTTPS URL (browser redirect)
//   - token / userinfo → internal Docker URL (server-side, no TLS needed)
const internalIssuer =
  process.env.OIDC_INTERNAL_ISSUER ?? process.env.OIDC_ISSUER
const externalIssuer = process.env.OIDC_ISSUER

const authOptions: AuthOptions = {
  providers: [
    {
      id: 'oidc',
      name: 'OIDC',
      type: 'oauth',
      clientId: process.env.OIDC_CLIENT_ID,
      clientSecret: process.env.OIDC_CLIENT_SECRET,
      authorization: {
        url: `${externalIssuer}/protocol/openid-connect/auth`,
        params: { scope: 'openid email profile' },
      },
      token: `${internalIssuer}/protocol/openid-connect/token`,
      userinfo: `${internalIssuer}/protocol/openid-connect/userinfo`,
      profile(profile) {
        return {
          id: profile.sub,
          name: profile.name,
          email: profile.email,
          image: profile.picture,
        }
      },
    },
  ],
  secret: process.env.NEXTAUTH_SECRET,
  callbacks: {
    async redirect({ url, baseUrl }) {
      return resolveRedirect(url, baseUrl)
    },
  },
}

export default NuxtAuthHandler(authOptions, useRuntimeConfig())
