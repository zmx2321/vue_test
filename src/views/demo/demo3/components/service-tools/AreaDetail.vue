<template>
  <el-dialog v-model="dialogVisible" title="Tips" width="30%" class="dialog_wrap">
    <ul>
      <li>
        <dl>
          <dt>归属：</dt>
          <dd>{{ currentBoxData.type === 1 ? '嘉兴二楼' : '嘉兴三楼' }}</dd>
        </dl>
      </li>
      <li>
        <dl>
          <dt>编号：</dt>
          <dd>{{ currentBoxData.bunkNo }}</dd>
        </dl>
      </li>
      <li>
        <dl>
          <dt>名称：</dt>
          <dd>{{ currentBoxData.name }}</dd>
        </dl>
      </li>
      <li>
        <dl>
          <dt>详情：</dt>
          <dd>{{ currentBoxData.detail }}</dd>
        </dl>
      </li>
      <li>
        <dl>
          <dt>状态：</dt>
          <dd>{{ currentBoxData.status }}</dd>
        </dl>
      </li>
    </ul>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="dialogVisible = false">Cancel</el-button>
        <el-button type="primary" @click="dialogVisible = false">Confirm</el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script setup>
// 引入库
import { ref } from 'vue'

/**
 * 定义常量、变量
 */
const currentBoxData = ref(null)

/**
 * 定义常量、变量
 */
const dialogVisible = ref(false) // 弹窗

/**
 * 定义方法
 */
// 显示弹窗
const showDetailDialog = (tipNum, currentBunkList) => {
  // console.log(tipNum, currentBunkList)
  currentBoxData.value = currentBunkList.filter((item) => item.bunkNo === tipNum)[0]
  dialogVisible.value = true
}

/**
 * 暴露方法
 */
defineExpose({
  showDetailDialog
})
</script>

<style lang="scss" scoped>
.dialog_wrap {
  ul {
    li {
      dl {
        dt,
        dd {
          display: inline-block;
        }
      }
    }
  }
}
</style>
