import { NuxtAuthHandler } from '#auth'
import type { AuthOptions } from 'next-auth'

// Use the Docker-internal Keycloak URL for all server-side OIDC calls so
// Node.js never needs to verify the self-signed TLS cert (Node 18+ fetch /
// undici ignores NODE_EXTRA_CA_CERTS). The browser-facing authorization URL
// still uses KC_HOSTNAME_URL because it comes from Keycloak's discovery doc.
const internalIssuer =
  process.env.OIDC_INTERNAL_ISSUER ?? process.env.OIDC_ISSUER

const authOptions: AuthOptions = {
  providers: [
    {
      id: 'oidc',
      name: 'OIDC',
      type: 'oauth',
      wellKnown: `${internalIssuer}/.well-known/openid-configuration`,
      clientId: process.env.OIDC_CLIENT_ID,
      clientSecret: process.env.OIDC_CLIENT_SECRET,
      authorization: { params: { scope: 'openid email profile' } },
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
