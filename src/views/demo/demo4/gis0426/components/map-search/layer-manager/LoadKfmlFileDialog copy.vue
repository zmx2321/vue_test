<template>
  <el-dialog width="740px" v-model="showDialog" :close-on-click-modal="false" :modal-append-to-body="false"
    :close-on-press-escape="false">
    <template #header>
      <span>导入kml</span>
    </template>
    <div class="container">
      <!-- 图层管理 -->
      <input type="file" @change="loadKML" />
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
// 组件传参
import mittBus from '@/utils/mittBus' // mitt

const showDialog = ref(false)

// 接收其他组件派发的方法
mittBus.on('closeLoadKfmlFileDialog', () => {
  showDialog.value = false
})

/**
 * 父组件调弹框显示方法
 */
const show = () => {
  showDialog.value = true
}

const loadKML = (event) => {
  const file = event.target.files[0];
  if (!file) {
    return;
  }

  const reader = new FileReader();
  reader.onload = (e) => {
    const text = e.target.result;

    mittBus.emit('loadKML', text)
  };
  reader.readAsText(file);
}

defineExpose({ show })
</script>
<style lang="scss" scoped></style>
