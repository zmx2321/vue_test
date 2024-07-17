<template>
  <section ref="refChart" :class="className" :style="{ height: height, width: width }"></section>
</template>

<script setup>
import { onMounted, onBeforeUnmount, ref, watch, nextTick } from 'vue'
import * as echarts from 'echarts'
// import resize from '@/utils/resize.js'

/**
 * 父组件参数
 */
const props = defineProps({
  className: {
    type: String,
    default: 'chart'
  },
  width: {
    type: String,
    default: '100%'
  },
  height: {
    type: String,
    default: '100px'
  },
  chartFontColor: {
    type: String,
    default: '#000'
  },
  autoResize: {
    type: Boolean,
    default: true
  },
  chartData: {
    type: Object,
    required: true
  },
  txtFontSize: {
    type: Number,
    default: 15
  }
})

/**
 * 定义变量
 */
let myChart = null // 图表
const refChart = ref(null) // 图表ref

/**
 * 监听数据
 */
watch(
  props.chartData,
  (val) => {
    setOption(val)
  },
  { deep: true }
)

/**
 * 方法
 */
/**
 * 工具方法
 */
const setProxyData = (proxyData) => JSON.parse(JSON.stringify(proxyData))

/**
 * 图表相关
 */
// 销毁图表
const destroyChart = (next) => {
  if (myChart) {
    myChart.dispose()
    myChart = null

    if (next) {
      next()
    }
  }
}
// 重置图表
const resetChart = () => {
  // console.log("初始化图表", myChart)

  destroyChart(() => {
    // 重新启动图表
    initChart()
  })
}
// 初始化图表
const initChart = () => {
  myChart = echarts.init(refChart.value, 'macarons')
  setOption(props.chartData)
}

// 设置图表
const setOption = ({ fieldData, yData } = {}) => {
  // 绘制图表
  myChart.setOption({
    title: { text: '总用户量' },
    tooltip: {},
    xAxis: {
      // data: ['12-3', '12-4', '12-5', '12-6', '12-7', '12-8']
      data: setProxyData(fieldData)
    },
    yAxis: {},
    series: [
      {
        name: '用户量',
        type: 'line',
        // data: [5, 20, 36, 10, 10, 20]
        data: setProxyData(yData)
      }
    ]
  })
  window.onresize = function () {
    // 自适应大小
    myChart.resize()
  }
}

/**
 * 生命周期
 */
onMounted(() => {
  nextTick(() => {
    initChart() // 初始化图表
  })
})
onBeforeUnmount(() => {
  destroyChart() // 销毁图表
})

/**
 * 暴露方法
 */
defineExpose({
  resetChart
})
</script>

<style lang="scss" scoped></style>
