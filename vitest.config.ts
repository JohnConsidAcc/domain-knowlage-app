import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    coverage: {
      provider: 'v8',
      reporter: ['text', 'html'],
      include: [
        'server/utils/**',
        'server/api/**',
        'app/components/**',
        'app/pages/**',
      ],
      exclude: [
        'server/api/auth/**',
        'server/utils/prisma.ts',  // PrismaClient singleton — not unit-testable
        'app/pages/**',            // Pages covered by Playwright (Phase 8); v8 cannot track them through Nuxt's virtual module system
      ],
      thresholds: {
        lines: 100,
        functions: 100,
        branches: 100,
        statements: 100,
      },
    },
  },
})
