import { defineNuxtPlugin } from '#app'
import Buefy from 'buefy'
import 'buefy/dist/buefy.css'

export default defineNuxtPlugin((nuxtApp) => {
    nuxtApp.vueApp.use(Buefy, {
        defaultIconPack: 'fas',
        defaultTheme: 'default',
        defaultDialog: {
            confirm: {
                title: 'Are you sure?',
                message: 'This will permanently delete the data.',
                confirmText: 'Delete',
                cancelText: 'Cancel'
            }
        }
    })
})
