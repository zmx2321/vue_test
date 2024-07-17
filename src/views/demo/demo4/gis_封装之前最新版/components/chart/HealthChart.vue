<template>
  <section ref="refChart" class="chart_wrap" :class="className" :style="{ height: height, width: width }"></section>
</template>

<script setup>
import { onMounted, onBeforeUnmount, ref, watch, nextTick } from 'vue'
import * as echarts from 'echarts'

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
    default: '100%'
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
  myChart.setOption(
    // ----------------------------  图表配置开始
    {
      title: {
        text: 'Basic Radar Chart'
      },
      legend: {
        data: ['Allocated Budget', 'Actual Spending']
      },
      radar: {
        // shape: 'circle',
        indicator: fieldData
        /* indicator: [
          { name: 'Sales', max: 6500 },
          { name: 'Administration', max: 16000 },
          { name: 'Information Technology', max: 30000 },
          { name: 'Customer Support', max: 38000 },
          { name: 'Development', max: 52000 },
          { name: 'Marketing', max: 25000 }
        ] */
      },
      series: [
        {
          name: 'Budget vs spending',
          type: 'radar',
          // 动画配置
          animation: true,
          data: yData
          /* data: [
            {
              value: [4200, 3000, 20000, 35000, 50000, 18000],
              name: 'Allocated Budget'
            },
            {
              value: [5000, 14000, 28000, 26000, 42000, 21000],
              name: 'Actual Spending'
            }
          ] */
        },
      ]
    }
    // ----------------------------  图表配置结束
  )
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

<style lang="scss" scoped>
.chart_wrap {
  min-height: 100px;
}
</style>
