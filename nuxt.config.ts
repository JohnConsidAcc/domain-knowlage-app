export default defineNuxtConfig({
  compatibilityDate: '2024-11-01',
  future: { compatibilityVersion: 4 },
  devServer: { host: '0.0.0.0' },
  css: ['~/assets/css/main.css'],
  modules: ['@sidebase/nuxt-auth'],
  auth: {
    provider: {
      type: 'authjs',
    },
    baseURL: '/api/auth',
    globalAppMiddleware: true,
  },
})
