# Vue 3 migration first layer

This overlay does **not** complete the Chakra Vue migration. It starts the safe first layer.

## What this changes

- Updates `packages/chakra-ui-core/package.json` to target Vue 3:
  - `peerDependencies.vue` becomes `^3.5.0`
  - dev `vue` becomes `^3.5.0`
  - adds `@vue/compiler-sfc`
  - bumps package version to `0.14.0-vue3-alpha.0`

- Updates `packages/chakra-ui-core/src/Chakra/index.js` from Vue 2 plugin APIs to Vue 3 plugin APIs:
  - `Vue.directive(...)` -> `app.directive(...)`
  - `Vue.prototype.$chakra` -> `app.config.globalProperties.$chakra`
  - `Vue.prototype.$toast` -> `app.config.globalProperties.$toast`
  - `Vue.use(...)` -> `app.use(...)`
  - `Vue.mixin(...)` -> `app.mixin(...)`

## What this does NOT fix yet

The repo is still a Vue 2-era monorepo overall. Expect more failures after this.

Likely next blockers:

- render function API differences
- scoped slot/listener API differences
- `portal-vue` -> Vue 3 `Teleport` or a Vue 3 compatible portal package
- `focus-trap-vue` compatibility
- directive lifecycle hook names
- tests: `@vue/test-utils` v1 -> v2
- docs: Nuxt 2 -> Nuxt 3/4
- storybook: Storybook 5 -> modern Storybook

## Suggested branch flow

```powershell
cd D:\new_Docker\chakra-vue
git checkout develop
git pull
git checkout -b vue3-migration-start
```

Extract this overlay over the repo root.

Then run:

```powershell
yarn install
yarn workspace @chakra-ui/vue build
```

If build fails, commit this as the baseline anyway:

```powershell
git add packages/chakra-ui-core/package.json packages/chakra-ui-core/src/Chakra/index.js VUE3_MIGRATION_FIRST_LAYER.md
git commit -m "Start Vue 3 core package migration"
git push -u origin vue3-migration-start
```

Then work through the next errors one batch at a time.
