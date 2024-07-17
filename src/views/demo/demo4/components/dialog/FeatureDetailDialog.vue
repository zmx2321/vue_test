<template>
  <el-dialog width="740px" v-model="showDialog" :close-on-click-modal="false" :modal-append-to-body="false"
    :close-on-press-escape="false">
    <template #header>
      <span>重叠feature</span>
    </template>
    1111
    <template #footer>
      <span class="dialog-footer">
        <el-button v-blur @click="showDialog = false">关闭</el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script setup>
import { ref } from 'vue'

const showDialog = ref(false)

/**
 * 父组件调弹框显示方法
 */
const show = (olMap, features) => {
  showDialog.value = true

  console.log("重叠features", olMap, features)
}

defineExpose({ show })
</script>
<style lang="scss" scoped></style>
