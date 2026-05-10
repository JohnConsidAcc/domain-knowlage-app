import { defineWorkspace } from 'vitest/config'
import { defineVitestProject } from '@nuxt/test-utils/config'

export default defineWorkspace([
  {
    test: {
      name: 'server',
      include: ['tests/unit/server/**/*.test.ts'],
      environment: 'node',
    },
  },
  defineVitestProject({
    test: {
      name: 'components',
      include: ['tests/unit/components/**/*.test.ts'],
      environmentOptions: {
        nuxt: {
          overrides: {
            auth: { globalAppMiddleware: false },
          },
        },
      },
    },
  }),
])
