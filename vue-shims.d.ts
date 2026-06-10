declare module '@imengyu/vue-scroll-rect' {
    import type { Plugin } from 'vue'
    const ScrollRect: Plugin
    export default ScrollRect
}

declare module 'vue' {
    export interface GlobalComponents {
        ScrollRect: typeof import('@imengyu/vue-scroll-rect')['default']
        // or 'v-scroll-rect' depending on the component tag
    }
}
