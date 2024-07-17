<template>
  <el-dialog width="740px" v-model="showDialog" :close-on-click-modal="false" :modal-append-to-body="false"
    :close-on-press-escape="false">
    <template #header>
      <span>{{ currentPopupData.newCellName }}</span>
    </template>
    <div class="container">
      <!-- {{ currentPopupData }} -->

      <el-descriptions class="margin-top" :title="`cgi: ${currentPopupData.cgi}`" :column="3" :size="size" border>
        <el-descriptions-item>
          <template #label>
            <span class="cell-item">
              省市区
            </span>
          </template>
          <span>{{ currentPopupData.province }}{{ currentPopupData.city }}市{{ currentPopupData.county }}</span>
        </el-descriptions-item>
        <el-descriptions-item>
          <template #label>
            <span class="cell-item">
              站点名称
            </span>
          </template>
          <span>{{ currentPopupData.stationName }}</span>
        </el-descriptions-item>
        <el-descriptions-item>
          <template #label>
            <span class="cell-item">
              基站类型
            </span>
          </template>
          <span>{{ currentPopupData.coverType }}</span>
        </el-descriptions-item>
        <el-descriptions-item>
          <template #label>
            <span class="cell-item">
              站号
            </span>
          </template>
          <span>{{ currentPopupData.stationNo }}</span>
        </el-descriptions-item>
        <el-descriptions-item>
          <template #label>
            <span class="cell-item">
              频段
            </span>
          </template>
          <span>{{ currentPopupData.workFrequency }}</span>
        </el-descriptions-item>
        <el-descriptions-item>
          <template #label>
            <span class="cell-item">
              经纬度
            </span>
          </template>
          <span>[{{ currentPopupData.longitude.toFixed(positionFix) }},
            {{ currentPopupData.latitude.toFixed(positionFix) }}]</span>
        </el-descriptions-item>
        <el-descriptions-item>
          <template #label>
            <span class="cell-item">
              小区生命周期状态
            </span>
          </template>
          <span>{{ currentPopupData.cellLifeStatus }}</span>
        </el-descriptions-item>
      </el-descriptions>
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
const positionFix = ref(3)

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
