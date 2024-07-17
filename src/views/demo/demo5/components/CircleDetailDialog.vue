<template>
  <el-dialog width="740px" v-model="showDialog" :close-on-click-modal="false" :modal-append-to-body="false"
    :close-on-press-escape="false">
    <template #header>
      <span>xxxxx</span>
    </template>
    <div class="container">
      xxxxx
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
}

defineExpose({ show })
</script>
<style lang="scss" scoped></style>
