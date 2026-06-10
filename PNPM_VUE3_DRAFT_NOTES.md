# pnpm + Vue 3 obvious-upgrades draft

This is intentionally a **draft overlay**, not a finished migration.

## What this overlay does

- Adds `pnpm-workspace.yaml`
- Adds a small `.npmrc` for pnpm workspace migration
- Replaces root `package.json` with a package-focused pnpm version
- Narrows root workspaces to `packages/*`
- Removes the old examples/website/docs/storybook/Nuxt toolchain from the first install surface
- Replaces obvious Vue 2 package targets:
  - `vue` -> Vue 3
  - adds `@vue/compiler-sfc`
  - `vue-router` -> v4 at root
  - `@vue/test-utils` -> v2 at root
  - `@testing-library/vue` -> v8 at root
- Replaces obvious deprecated build tool packages where possible:
  - `rollup` -> v4
  - `@rollup/plugin-*` packages added
  - modern Babel transform plugin names added
  - modern ESLint/Prettier versions added
- Updates `packages/chakra-ui-core/package.json` for Vue 3 peer/dev deps
- Updates `packages/chakra-ui-core/src/Chakra/index.js` from Vue 2 plugin APIs to Vue 3 plugin APIs

## What this overlay purposely postpones

- Nuxt docs/website
- Storybook
- examples
- release tooling
- old all-contributors tooling
- old Nuxt test tooling
- full render-function migration
- portal/teleport migration
- directive lifecycle migration
- Rollup config rewrite

## Suggested commands

```powershell
cd D:\new_Docker\chakra-vue
git checkout develop
git pull
git checkout -b pnpm-vue3-obvious-upgrades

# Extract overlay here.

Remove-Item -Recurse -Force node_modules -ErrorAction SilentlyContinue
Remove-Item yarn.lock -ErrorAction SilentlyContinue
Remove-Item pnpm-lock.yaml -ErrorAction SilentlyContinue

pnpm install
pnpm --filter @chakra-ui/vue build
```

Expect build errors. The goal is to shrink the install/build surface and expose the next real Vue 3 errors.

## Commit as draft

```powershell
git add package.json pnpm-workspace.yaml .npmrc packages/chakra-ui-core/package.json packages/chakra-ui-core/src/Chakra/index.js PNPM_VUE3_DRAFT_NOTES.md
git status
git commit -m "Draft pnpm and Vue 3 package upgrades"
git push -u origin pnpm-vue3-obvious-upgrades
```
