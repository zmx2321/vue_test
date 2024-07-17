<template>
  <section class="demo_cont">
    <el-cascader v-model="cityValue" :options="cityOptions" clearable @change="getCity" placeholder="请选择" />

    <div class="servarea_wrap">
      <service-main ref="refServiceMain" />
    </div>
  </section>
</template>

<script setup>
// 引入库
import { ref, onMounted } from 'vue'
// 引入组件
import ServiceMain from './components/ServiceMain.vue'

/**
 * 定义数据
 * 常量 - 变量
 */
// ref
const refServiceMain = ref(null)

// 城市下拉框
const cityOptions = [
  {
    value: '1',
    label: '嘉兴',
    children: [
      {
        value: '1-1',
        label: '嘉兴二楼'
      },
      {
        value: '1-2',
        label: '嘉兴三楼'
      }
    ]
  }
]

// 选择的城市
let cityValue = ref([])

const getCity = () => {
  // console.log(cityOptions[0].children[0].value)
  refServiceMain.value.setImgUrlByCity(cityValue.value[1])
}

onMounted(() => {
  cityValue.value = [cityOptions[0].value, cityOptions[0].children[0].value] // 回显
  refServiceMain.value.setImgUrlByCity(cityOptions[0].children[0].value) // 设置数据
})
</script>

<style lang="scss" scoped>
@import url(../styles/demoCommonStyle.scss);

.demo_cont {
  .servarea_wrap {
    width: 100%;
    min-height: 100px;
    margin-top: 10px;
  }
}
</style>
