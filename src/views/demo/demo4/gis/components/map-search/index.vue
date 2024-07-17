<template>
  <el-button type="primary" :icon="Search" @click="toggleSearch" class="search_btn">
    {{ isShowSearch === 'none' ? '显示' : '关闭' }}信息窗
  </el-button>

  <el-button type="primary" @click="reflashMap" class="reflash_map">刷新地图</el-button>

  <el-tabs type="border-card" class="map_search_wrap">
    <!-- 基本信息 -->
    <el-tab-pane>
      <template #label>
        <el-icon>
          <Grid />
        </el-icon>
        <span @click="showSearch">基本信息</span>
      </template>
      <!-- 基本信息组件 -->
      <base-info />
    </el-tab-pane>

    <!-- 图层管理 -->
    <el-tab-pane>
      <template #label>
        <el-icon>
          <Files />
        </el-icon>
        <span @click="showSearch">图层管理</span>
      </template>
      <!-- 图层管理组件 -->
      <layer-manager />
    </el-tab-pane>
  </el-tabs>
</template>

<script setup>
import { ref } from 'vue'
import BaseInfo from './BaseInfo.vue';
import LayerManager from './LayerManager.vue';
import mittBus from '@/utils/mittBus' // mitt

let isShowSearch = ref('block')  // 搜索框默认隐藏 - 控制scss样式
// let isShowSearch = ref('none')  // 搜索框默认隐藏 - 控制scss样式

/**
 * 父组件参数
 */
/* const props = defineProps({
  // 搜索框默认隐藏
  isShowSearch: {
    type: Boolean,
    default: false
  }
}) */

// 控制样式,显示隐藏
const toggleSearch = () => {
  switch (isShowSearch.value) {
    case 'none':
      isShowSearch.value = 'block'
      break
    case 'block':
      isShowSearch.value = 'none'
      break
  }
}

const showSearch = () => {
  isShowSearch.value = 'block'
}

// 刷新地图
const reflashMap = () => {
  mittBus.emit('reflashMap')
}
</script>

<style lang="scss" scoped>
.search_btn {
  position: absolute;
  top: 3px;
  left: 5px;
  z-index: 999;
}

.reflash_map {
  position: absolute;
  top: 3px;
  right: 5px;
  z-index: 999;
}

.map_search_wrap {
  :deep .el-tabs__header {
    .el-tabs__nav-wrap {
      .el-tabs__nav-scroll {
        padding-left: 112px;
      }
    }
  }

  :deep .el-tabs__content {
    display: v-bind("isShowSearch");
    position: absolute;
    top: 50px;
    left: 10px;
    padding: 10px 0 0 10px;
    width: 98%;
    min-height: 80px;
    background: rgb(255 255 255 / 80%);
    border-radius: 10px;
    overflow: hidden;
    z-index: 999;
  }
}
</style>