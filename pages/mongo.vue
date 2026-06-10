<script setup lang="ts">
import {useFetch} from '#app'
import {Message} from 'view-ui-plus'
import {vOnClickOutside} from '@vueuse/components'
import {ref, watch, onMounted, computed} from 'vue'

type DocType = { _id: string; [key: string]: any }

const selected = ref('network')
const collections = ref<string[]>([])
const docs = ref<DocType[]>([])
const originalDocs = ref<Record<string, DocType>>({})
const expanded = ref<Set<string>>(new Set())
const error = ref<string | null>(null)
const search = ref('')

const editingIndex = ref<number | null>(null)
const editingKey = ref<string | null>(null)
const editValue = ref<string>('')

const {copy, isSupported} = useClipboard({legacy: true})

const prefix = '/api/mong.1675d?name='
const list = '_list'

const safeClone = <T>(obj: T): T => JSON.parse(JSON.stringify(obj))

onMounted(async () => {
  try {
    const res = await $fetch<string[]>(`${prefix}${list}`)
    collections.value = res
  } catch (err: any) {
    error.value = err.message || 'Failed to load collections.'
  }
  await load()
})

const copyToClipboard = async (value: any) => {
  const stringValue = typeof value === 'object'
      ? JSON.stringify(value, null, 2)
      : String(value)

  const truncated = stringValue.length > 100
      ? stringValue.slice(0, 100) + '...'
      : stringValue

  if (!isSupported.value) {
    Message.warning('Clipboard API not supported in this browser or context')
    return
  }

  try {
    await copy(stringValue)
    Message.success(`Copied to clipboard:${truncated}`)
  } catch (err) {
    console.error('Copy failed:', err)
    Message.error('Clipboard write failed')
  }
}

const load = async () => {
  const {data, error: docError} = await useFetch<any[]>(`${prefix}${selected.value}`)
  if (!docError.value && data.value) {
    docs.value = data.value
    originalDocs.value = Object.fromEntries(
        docs.value.map(doc => [doc._id, safeClone(doc)])
    )
  } else {
    error.value = docError.value?.message || 'Failed to load documents.'
  }
}

watch(selected, load)

const enableEdit = (rowIndex: number, key: string, value: any) => {
  editingIndex.value = rowIndex
  editingKey.value = key
  editValue.value = typeof value === 'object' ? JSON.stringify(value, null, 2) : value
}

const saveEdit = (doc: any) => {
  if (editingIndex.value !== null && editingKey.value) {
    try {
      doc[editingKey.value] = JSON.parse(editValue.value)
    } catch {
      doc[editingKey.value] = editValue.value
    }
  }
  editingIndex.value = null
  editingKey.value = null
}

const saveToDb = async (doc: DocType) => {
  const {_id, ...rest} = doc
  try {
    const res = await $fetch<{ success: boolean }>('/api/mong.1675d.update', {
      method: 'POST',
      body: {
        collection: selected.value,
        _id,
        update: rest,
      },
    })
    if (res.success) {
      originalDocs.value[_id] = safeClone(doc)
    }
  } catch (err) {
    console.error('Save error:', err)
  }
}

const undoChanges = (doc: any) => {
  const original = originalDocs.value[doc._id]
  if (original) Object.assign(doc, safeClone(original))
}

const hasChanges = (doc: DocType) => {
  return JSON.stringify(doc) !== JSON.stringify(originalDocs.value[doc._id])
}

const toggleExpand = (id: string) => {
  if (expanded.value.has(id)) expanded.value.delete(id)
  else expanded.value.add(id)
}

const buildTitle = (doc: DocType) => {
  const label = doc.title || doc.nickname || doc.name
  const parts = [doc._id]
  const categoryParts = []
  if (label) categoryParts.push(label)
  if (doc.category) categoryParts.push(doc.category)
  if (doc.subcategory) categoryParts.push(doc.subcategory)
  if (categoryParts.length) parts.push(categoryParts.join(' -- '))
  return parts
}

const filteredDocs = computed(() => {
  const term = search.value.toLowerCase()
  return docs.value.filter(doc =>
      buildTitle(doc).join(' ').toLowerCase().includes(term)
  )
})
</script>

<template>
  <div class="p-4 space-y-4">
    <h1 class="text-xl font-bold">MongoDB GUI</h1>

    <label>Select collection:</label>
    <select v-model="selected" class="border px-2 py-1 rounded">
      <option v-for="name in collections" :key="name" :value="name">{{ name }}</option>
    </select>
    <div class="max-w-6xl mx-5">
      <label>Search:</label>
      <input v-model="search" placeholder="Filter by title..." class="border px-2 py-1 rounded w-full"/>
    </div>
    <div v-if="error" class="text-red-600">{{ error }}</div>

    <div v-else-if="filteredDocs.length === 0" class="text-gray-500">No matching documents found.</div>

    <div v-else class="space-y-2">
      <div v-for="(doc, index) in filteredDocs" :key="doc._id">
        <button
            class="text-left px-4 py-2 bg-slate-200 hover:bg-brown-200 flex items-center gap-2 min-w-[140px] w-full max-w-2xl"
            @click="toggleExpand(doc._id)"
        >
          <span :class="expanded.has(doc._id) ? 'rotate-90' : 'rotate-0'" class="transition-transform">▶</span>
          <div>
            <div v-for="line in buildTitle(doc)" :key="line" class="font-700 text-indigo">{{ line }}</div>
          </div>
        </button>

        <div v-if="expanded.has(doc._id)"
             class="border-t border-gray-200 p-4 mx-[12px] text-sm bg-white rounded border shadow max-w-6xl">
          <div class="max-h-96 overflow-auto space-y-2">
            <div
                v-for="(value, key) in doc"
                :key="key"
                v-if="!['__v', 'nickname', 'name', 'title', 'category', 'subcategory'].includes(key)"
                class="flex gap-2 items-start"
            >
              <strong
                  class="min-w-[100px] text-blue-700 cursor-pointer hover:underline select-none"
                  @click="copyToClipboard(value)"
                  title="Click to copy value"
              >
                {{ key }}:
              </strong>

              <div
                  v-if="editingIndex === index && editingKey === key"
                  v-on-click-outside="() => saveEdit(doc)"
                  class="flex-1"
              >
                <textarea
                    v-model="editValue"
                    @keydown.enter.prevent="saveEdit(doc)"
                    class="w-full border rounded p-1 text-xs font-mono"
                    rows="2"
                    autofocus
                ></textarea>
              </div>

              <div
                  v-else
                  @dblclick="enableEdit(index, key, value)"
                  class="flex-1 whitespace-pre-wrap cursor-pointer"
              >
                {{ typeof value === 'object' ? JSON.stringify(value, null, 2) : value }}
              </div>
            </div>
          </div>

          <div v-if="hasChanges(doc)" class="flex justify-end gap-2 mt-2">
            <i-button class="text-sm px-2 py-1 border rounded bg-green-100 hover:bg-green-200" @click="saveToDb(doc)">
              💾 Save
            </i-button>
            <i-button class="text-sm px-2 py-1 border rounded bg-yellow-100 hover:bg-yellow-200"
                      @click="undoChanges(doc)">
              ↩️ Undo
            </i-button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
