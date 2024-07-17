<template>
  <el-dialog width="740px" v-model="showDialog" :close-on-click-modal="false" :modal-append-to-body="false"
    :close-on-press-escape="false">
    <template #header>
      <span>{{ currentPopupData.newCellName }}</span>
    </template>
    <div class="container">
      {{ currentPopupData }}
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

const showDialog = ref(false)
const currentPopupData = ref(null)

/**
 * 父组件调弹框显示方法
 */
const show = (val) => {
  showDialog.value = true

  // const { popupData } = val
  currentPopupData.value = val
}

defineExpose({ show })
</script>
<style lang="scss" scoped></style>
