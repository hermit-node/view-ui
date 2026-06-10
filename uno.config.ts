import {defineConfig, presetWind3} from 'unocss'
import {presetRadix} from 'unocss-preset-radix'
import {presetAnimations} from 'unocss-preset-animations'
import type {Preset} from 'unocss'

export default defineConfig({
    presets: [
        presetWind3(),
        presetAnimations({}) as Preset,
    ],
    safelist: [
        'data-[state=open]:animate-slideDown',
        'data-[state=closed]:animate-slideUp',
    ],
    theme: {
        extend: {
            keyframes: {
                slideDown: '{ from { height: 0 } to { height: var(--radix-accordion-content-height) } }',
                slideUp: '{ from { height: var(--radix-accordion-content-height) } to { height: 0 } }',
            },
            animation: {
                slideDown: 'slideDown 100ms ease-out',
                slideUp: 'slideUp 100ms ease-in',
                custom: 'custom 1s cubic-bezier(0.4,0,.6,1) infinite',
            },
        },
        colors: {
            brown: {
                100: '#efebe9',
                200: '#d7ccc8',
                300: '#bcaaa4',
                400: '#a1887f',
                500: '#8d6e63',
                600: '#795548',
                700: '#6d4c41',
                800: '#5d4037',
                900: '#4e342e',
            },
            gold: {
                100: '#fff9e6',
                200: '#fff2cc',
                300: '#ffe699',
                400: '#ffdb66',
                500: '#ffcc00',
                600: '#e6b800',
                700: '#cc9f00',
                800: '#b38a00',
                900: '#997300',
            },
            mauve: {
                1: '#fdfcfd',
                2: '#faf9fb',
                3: '#f2eff3',
                4: '#eae7ec',
                5: '#e3dfe6',
                6: '#dbd8e0',
                7: '#d0cdd7',
                8: '#bcbac7',
                9: '#908e9b',
                10: '#86848f',
                11: '#6f6e77',
                12: '#1a1523',
            },
            grass: {
                1: '#fbfefb',
                2: '#f5fbf5',
                3: '#e9f6e9',
                4: '#daf1db',
                5: '#c9e8ca',
                6: '#b2ddb5',
                7: '#94ce9a',
                8: '#65ba74',
                9: '#46a758',
                10: '#3e9b4f',
                11: '#2a7e3b',
                12: '#203c25',
            },
        },
    },
})
