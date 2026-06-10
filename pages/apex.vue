<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'
import ApexChart from 'vue3-apexcharts'
import {parse} from 'papaparse'

const files = ref<string[]>([])
const selected = ref('')
const series = ref([{ data: [] }])

const chartOptions = ref({
  chart: { type: 'candlestick' },
  xaxis: { type: 'datetime' },
})

function loadCSV(file: string) {
  fetch(`/dummy/${file}`)
      .then(res => res.text())
      .then(text => {
        parse(text, {
          header: true,
          dynamicTyping: true,
          complete: (results) => {
            const data = results.data.map((row: any) => ({
              x: new Date(row.timestamp * 1000),
              y: [row.open, row.high, row.low, row.close],
            }))
            series.value = [{ data }]
          },
        })
      })
}

onMounted(async () => {
  const res = await fetch('/api/csv-files')
  files.value = await res.json()
  selected.value = files.value[0]
  loadCSV(selected.value)
})

watch(selected, (newVal) => {
  loadCSV(newVal)
})

</script>

<template>
  <div class="p-4 space-y-4">
    <select v-model="selected" class="border rounded px-3 py-1 bg-white text-sm">
      <option v-for="f in files" :key="f" :value="f">{{ f }}</option>
    </select>

    <ApexChart
        width="100%"
        height="500"
        type="candlestick"
        :options="chartOptions"
        :series="series"
    />
  </div>
</template>
