import VScrollLock from 'v-scroll-lock'
import { merge } from 'lodash-es'
import { toCSSVar } from '@chakra-ui/styled-system'
import defaultTheme from '@chakra-ui/theme-vue'

import { parsePackIcons } from '../utils/icons'
import internalIcons from '../lib/internal-icons'
import { createClientDirective } from '../directives'
import useToast from '../CToast'
import { colorModeObserver, mode } from '../utils'

/**
 * Chakra-ui Component library plugin
 * Vue 3 first-layer migration:
 * - Vue.prototype -> app.config.globalProperties
 * - Vue.directive -> app.directive
 * - Vue.use -> app.use
 * - Vue.mixin -> app.mixin
 *
 * @type {import("../../types").ChakraPlugin}
 */
const Chakra = {
  /**
   *
   * @param {import('vue').App} app
   * @param {import("../../types").Options} options
   */
  install (app, options = {}) {
    let packIcons = {}
    const extendedIcons = options.icons ? options.icons.extend || {} : {}

    if (options.icons) {
      packIcons = parsePackIcons(options.icons.iconSet)
    }

    const icons = {
      ...internalIcons,
      ...packIcons,
      ...extendedIcons
    }

    // Recursively merge extended theme variables
    const mergedTheme = toCSSVar(merge(defaultTheme, options.extendTheme))

    app.directive('chakra', createClientDirective(mergedTheme))

    // Bind theme and icons to global properties
    app.config.globalProperties.$chakra = {
      theme: mergedTheme,
      icons
    }

    const toast = useToast()
    app.config.globalProperties.$toast = toast

    /** Install dependent plugins */
    app.use(VScrollLock)

    app.mixin({
      computed: {
        chakraColorMode () {
          return colorModeObserver.colorMode
        },
        chakraTheme () {
          return colorModeObserver.theme
        },
        chakraToggleColorMode () {
          return colorModeObserver.toggleColorMode
        },
        $mode: () => (lightValue, darkValue) => mode(lightValue, darkValue, colorModeObserver)
      }
    })
  }
}

export default Chakra
export { mode } from '../utils/color-mode-observer'
