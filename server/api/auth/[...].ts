import { NuxtAuthHandler } from '#auth'
import type { AuthOptions } from 'next-auth'

// Server-side OIDC calls (discovery, token exchange, userinfo) use the
// Docker-internal URL so Node.js never needs to verify the self-signed TLS
// cert (Node 18+ fetch / undici ignores NODE_EXTRA_CA_CERTS).
//
// The authorization URL (browser redirect to Keycloak login) is set
// explicitly from OIDC_ISSUER so the browser always receives the correct
// external HTTPS URL — the discovery document returns keycloak:8080 when
// fetched internally because Keycloak v2 hostname config only applies to
// frontend (Nginx-proxied) requests.
const internalIssuer =
  process.env.OIDC_INTERNAL_ISSUER ?? process.env.OIDC_ISSUER
const externalIssuer = process.env.OIDC_ISSUER

const authOptions: AuthOptions = {
  providers: [
    {
      id: 'oidc',
      name: 'OIDC',
      type: 'oauth',
      wellKnown: `${internalIssuer}/.well-known/openid-configuration`,
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
