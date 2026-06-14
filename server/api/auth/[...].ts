import { NuxtAuthHandler } from '#auth'
import type { AuthOptions } from 'next-auth'

// No wellKnown — all endpoints are configured explicitly.
//
// next-auth's openid-client wrapper (lib/oauth/client.js) constructs the
// openid-client Issuer like this when wellKnown is absent:
//
//   new Issuer({
//     issuer:                provider.issuer,
//     authorization_endpoint: provider.authorization?.url,
//     token_endpoint:        provider.token?.url,      ← must be object, not string
//     userinfo_endpoint:     provider.userinfo?.url,   ← must be object, not string
//     jwks_uri:              provider.jwks_endpoint,
//   })
//
// If token/userinfo are plain strings, ?.url = undefined and openid-client
// throws "issuer must be configured on the issuer" (missing token_endpoint).
//
// Split strategy:
//   - authorization  → external HTTPS URL (browser redirect to Keycloak)
//   - token/userinfo → internal Docker HTTP (no TLS; Node 18+ undici ignores
//                      NODE_EXTRA_CA_CERTS so self-signed certs can't be trusted)
//   - jwks_endpoint  → internal Docker HTTP (id_token signature validation)
//   - issuer         → external HTTPS URL (must match 'iss' in Keycloak tokens,
//                      which Keycloak sets from KC_HOSTNAME_URL)
const internalIssuer =
  process.env.OIDC_INTERNAL_ISSUER ?? process.env.OIDC_ISSUER
const externalIssuer = process.env.OIDC_ISSUER

const authOptions: AuthOptions = {
  providers: [
    {
      id: 'oidc',
      name: 'OIDC',
      type: 'oauth',
      issuer: externalIssuer,
      clientId: process.env.OIDC_CLIENT_ID,
      clientSecret: process.env.OIDC_CLIENT_SECRET,
      authorization: {
        url: `${externalIssuer}/protocol/openid-connect/auth`,
        params: { scope: 'openid email profile' },
      },
      token: { url: `${internalIssuer}/protocol/openid-connect/token` },
      userinfo: { url: `${internalIssuer}/protocol/openid-connect/userinfo` },
      jwks_endpoint: `${internalIssuer}/protocol/openid-connect/certs`,
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
