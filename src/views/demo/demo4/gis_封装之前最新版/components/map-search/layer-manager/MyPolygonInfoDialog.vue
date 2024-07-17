<template>
  <el-dialog width="740px" v-model="showDialog" :close-on-click-modal="false" :modal-append-to-body="false"
    :close-on-press-escape="false">
    <template #header>
      <span>选区数据</span>
    </template>
    <div class="container">
      xxxx
    </div>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="showDialog = false">关闭</el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script setup>
import { ref } from 'vue'
import { fromLonLat, transform } from 'ol/proj';  // 经纬度坐标相关

// 组件传参
import mittBus from '@/utils/mittBus' // mitt

const showDialog = ref(false)
const currentPopupData = ref(null)

/**
 * 父组件调弹框显示方法
 */
const show = (val) => {
  showDialog.value = true

  console.log("设置多边形数据", val, JSON.stringify(val))

  mittBus.emit('setCancelPolygonBtn')
}

defineExpose({ show })
</script>
<style lang="scss" scoped></style>
