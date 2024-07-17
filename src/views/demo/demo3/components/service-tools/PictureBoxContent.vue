<template>
  <!-- 盒子模板-获取主事件和数据 -->
  <picture-box-template :area-image="areaImage">
    <tool-tip
      :class="['bok-' + item.bunkNo, { soon: item.status === '临期' }, { empty: item.status === '空铺' }]"
      :data-content="item.bunkNo"
      v-for="(item, index) in currentBunkList"
      :key="index">
      <!-- 弹窗信息 -->
      <template #info>
        <info-content />
      </template>
      <!-- 按钮 -->
      <template #btn>
        <div class="btn_wrap">
          <!-- 编号 -->
          <b>{{ item.bunkNo }}</b>
          <!-- 空 -->
          <span class="blank" :class="[{ soon: item.status === '临期' }, { empty: item.status === '空铺' }]"></span>
        </div>
      </template>
    </tool-tip>
  </picture-box-template>
</template>

<script setup>
// 引入库
import { ref } from 'vue'
// store
import { demoStoreData } from '@/store/modules/demo-store-data.js'
// 引入组件
import PictureBoxTemplate from './PictureBoxTemplate.vue'
import ToolTip from './ToolTip.vue'
import InfoContent from './InfoContent.vue'

/**
 * 父组件参数
 */
defineProps({
  areaImage: {
    type: String,
    default: () => {}
  }
})

/**
 * 定义常量、变量
 */
const demoDataStore = demoStoreData()
const currentBunkList = ref(demoDataStore.currentBunkList)
</script>

<style lang="scss" scoped>
.btn_wrap {
  display: block;
  width: 100%;
  height: 100%;
}
</style>
