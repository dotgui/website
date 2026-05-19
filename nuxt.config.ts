export default defineNuxtConfig({
  ssr: false,
  compatibilityDate: '2026-05-20',
  experimental: {
    viteEnvironmentApi: true
  },
  css: ['~/assets/css/main.css'],
  app: {
    head: {
      title: '.gui',
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1.0' }
      ]
    }
  }
})
