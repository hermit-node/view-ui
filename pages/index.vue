<template>
  <div class="min-h-screen flex flex-col bg-gray-50">
    <!-- ✅ NAVIGATION BAR -->
    <Menubar :model="items" class="px-4 py-2 shadow bg-white rounded-none border-b">

      <!-- 🔹 Start: Logo -->
      <template #start>
        <div class="flex items-center gap-3 pr-4">
          <svg width="35" height="40" viewBox="0 0 35 40" fill="none" xmlns="http://www.w3.org/2000/svg" class="h-8">
            <path d="M5 5h25v30H5z" fill="#10B981" />
            <path d="M10 10h15v20H10z" fill="#fff" />
          </svg>
          <span class="font-bold text-lg">MyApp</span>
        </div>
      </template>

      <!-- 🔹 Menu Item Template -->
      <template #item="{ item, props, hasSubmenu, root }">
        <a
            v-bind="props.action"
            v-ripple
            class="flex items-center gap-2 px-3 py-2 hover:bg-gray-100 rounded transition-all"
        >
          <span>{{ item.label }}</span>
          <span v-if="item.shortcut" class="ml-auto text-xs text-gray-400">{{ item.shortcut }}</span>
          <i
              v-if="hasSubmenu"
              :class="[
              'pi text-sm ml-2',
              root ? 'pi-angle-down' : 'pi-angle-right'
            ]"
          />
        </a>
      </template>

      <!-- 🔹 End: Search & Avatar -->
      <template #end>
        <div class="flex items-center gap-3 pl-4">
          <InputText placeholder="Search..." class="border rounded px-2 py-1 w-32 sm:w-auto" />
          <Avatar image="https://i.pravatar.cc/40" shape="circle" />
        </div>
      </template>
    </Menubar>

    <!-- ✅ Page Content -->
    <main class="flex-1 p-8">
      <h1 class="text-3xl font-bold mb-4">Landing Page</h1>
      <p class="text-gray-700">Your custom Nuxt 3 + PrimeVue + UnoCSS navbar with responsive layout.</p>
    </main>
  </div>
</template>

<script setup lang="ts">
const items = ref([
  {
    label: 'Home',
    icon: 'pi pi-home',
    shortcut: '⌘H',
    command: () => navigateTo('/'),
  },
  {
    label: 'Products',
    icon: 'pi pi-box',
    items: [
      { label: 'New', icon: 'pi pi-plus' },
      { label: 'Popular', icon: 'pi pi-star' },
    ],
  },
  {
    label: 'About',
    icon: 'pi pi-info-circle',
    command: () => navigateTo('/about'),
  },
  {
    label: 'Contact',
    icon: 'pi pi-envelope',
    command: () => navigateTo('/contact'),
  },
])
</script>
