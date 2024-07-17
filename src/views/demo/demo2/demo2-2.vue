<template>
  <section class="demo_cont">
    <div class="map_wrap">
      <div id="glMap" class="gl_map_cont"></div>
    </div>
  </section>
</template>

<script setup>
import { ref, onMounted } from 'vue'
// map-core
import * as mapUtils from './mapUtils'

const glMap = ref(null)

/**
 * map init
 */
// 重置地图
const resetMap = (next) => {
  // this.removeAllMarker()

  if (glMap.value) {
    glMap.value.remove()
  }

  if (next) {
    next()
  }
}
// 初始化地图
const initMapConfig = (next) => {
  resetMap(() => {
    next()

    // console.log('开始打点')
    mapUtils.setMapConfig(glMap.value) // 地图配置
    // this.glmapEvent() // 绑定事件
  })
}

const initZheJiangIndex = () => {
  glMap.value = mapUtils.zhejiangMapIndex()

  console.log(glMap.value)

  // 定制geojson并渲染
  mapUtils.renderGeoToZheJiangIndex(glMap.value, (textContent) => {
    console.log(textContent)
    // 为字符串时为区域
    // this.$emit('getMapAreaData', textContent)
  })
}

onMounted(() => {
  initMapConfig(() => {
    initZheJiangIndex() // 初始化首页浙江
  })
})
</script>

<style lang="scss" scoped>
@import url(../styles/demoCommonStyle.scss);
@import url(./scss/mapCommon.scss);
</style>
