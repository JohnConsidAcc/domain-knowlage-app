import { NuxtAuthHandler } from '#auth'
import type { AuthOptions } from 'next-auth'

const authOptions: AuthOptions = {
  providers: [
    {
      id: 'oidc',
      name: 'OIDC',
      type: 'oauth',
      wellKnown: process.env.OIDC_ISSUER + '/.well-known/openid-configuration',
      clientId: process.env.OIDC_CLIENT_ID,
      clientSecret: process.env.OIDC_CLIENT_SECRET,
      authorization: { params: { scope: 'openid email profile' } },
      idToken: true,
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
}

export default NuxtAuthHandler(authOptions, useRuntimeConfig())
