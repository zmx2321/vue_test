<template>
  <section class="chart_dom">
    <chart1 class="my_chart" :width="'800px'" :height="'500px'" :chart-data="chartData1" />
    <chart1 class="my_chart" :width="'500px'" :height="'500px'" :chart-data="chartData2" />
  </section>
</template>

<script setup>
import { ref } from 'vue'

import chart1 from './chartComponents/chart1.vue'

const chartData1 = ref({
  fieldData: ['丽水', '诸暨', '桥头', '南浔', '湖州', '青田', '萧山', '金华', '奉化', '方言', '永康'],
  yData: [120, 125, 150, 80, 70, 110, 130, 120, 320, 150, 80]
})
const chartData2 = ref({
  fieldData: ['12-3', '12-4', '12-5', '12-6', '12-7', '12-8'],
  yData: [5, 20, 36, 10, 10, 20]
})
</script>

<style lang="scss" scoped></style>
