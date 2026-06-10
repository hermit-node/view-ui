// plugins/scroll-rect.client.ts
import { defineNuxtPlugin } from '#app'
import ScrollRect from '@imengyu/vue-scroll-rect'
import '@imengyu/vue-scroll-rect/lib/vue-scroll-rect.css'

export default defineNuxtPlugin((nuxtApp) => {
    nuxtApp.vueApp.use(ScrollRect)
})
