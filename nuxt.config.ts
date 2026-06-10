import { defineNuxtConfig } from 'nuxt/config'

export default defineNuxtConfig({
    ssr: true,
    compatibilityDate: '2025-04-22',
    modules: ['reka-ui/nuxt', '@unocss/nuxt', '@nuxt/icon', '@primevue/nuxt-module', '@vueuse/nuxt'],

    imports: {
        autoImport: true,
    },

    devServer: {
        port: 5431,
        host: '0.0.0.0',
    },
})