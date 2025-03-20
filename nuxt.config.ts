import vuetify, { transformAssetUrls } from 'vite-plugin-vuetify'

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2024-11-01',
  devtools: { enabled: true },
  build: {
    transpile: ['vuetify'],
  },
  runtimeConfig: {
    authSecret: process.env.AUTH_SECRET || 'supersecretrandomkey123',
  },
  modules: [
    "@prisma/nuxt",
    "@sidebase/nuxt-auth",
    (_options, nuxt) => {
      nuxt.hooks.hook('vite:extendConfig', (config) => {
        // @ts-expect-error
        config.plugins.push(vuetify({ autoImport: true }))
      })
    },
    //...
  ],
  auth: {
    originEnvKey: process.env.NUXT_AUTH_BASE_URL || 'http://localhost:3000',
    globalAppMiddleware: true,
  },
  vite: {
    vue: {
      template: {
        transformAssetUrls,
      },
    },
  },
})
