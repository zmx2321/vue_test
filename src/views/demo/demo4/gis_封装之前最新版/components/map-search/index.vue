<template>
  <!-- <el-button type="primary" :icon="Search" @click="toggleSearch" class="search_btn">
    {{ isShowSearch === 'none' ? '显示' : '关闭' }}信息窗
  </el-button> -->
  <!-- <el-button :icon="Search" @click="toggleSearch" circle class="search_btn" /> -->
  <el-button
    type="primary"
    @click="toggleSearch"
    circle
    class="search_btn"
    :title="`${isShowSearch === 'none' ? '显示' : '关闭'}信息窗`"
  >
    <el-icon>
      <Expand />
    </el-icon>
  </el-button>

  <el-button type="primary" @click="reflashMap" class="reflash_map"
    >刷新地图</el-button
  >

  <el-tabs v-model="currentTab" type="border-card" class="map_search_wrap">
    <!-- 基本信息 -->
    <el-tab-pane :name="tabList[0]">
      <template #label>
        <el-icon>
          <Grid />
        </el-icon>
        <span @click="showSearch">基本信息</span>
      </template>
      <!-- 基本信息组件 -->
      <base-info class="base_info_wrap" />
    </el-tab-pane>

    <!-- 图层管理 -->
    <el-tab-pane :name="tabList[1]">
      <template #label>
        <el-icon>
          <Files />
        </el-icon>
        <span @click="showSearch">图层管理</span>
      </template>
      <!-- 图层管理组件 -->
      <layer-manager />
    </el-tab-pane>

    <!-- 网格管理 -->
    <el-tab-pane :name="tabList[2]">
      <template #label>
        <el-icon>
          <Files />
        </el-icon>
        <span @click="showSearch">网格管理</span>
      </template>
      <!-- 图层管理组件 -->
      <grid-manager />
    </el-tab-pane>
  </el-tabs>
</template>

<script setup>
import { ref } from "vue";
import BaseInfo from "./BaseInfo.vue";
import LayerManager from "./layer-manager/index.vue";
import GridManager from "./grid-manager/index.vue";
import mittBus from "@/utils/mittBus"; // mitt

const tabList = ["baseInfo", "layerManage", "gridManage"];

let isShowSearch = ref("block"); // 搜索框默认隐藏 - 控制scss样式
// let isShowSearch = ref('none')  // 搜索框默认隐藏 - 控制scss样式

let currentTab = ref(tabList[0]); // 默认选项

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
    case "none":
      isShowSearch.value = "block";
      break;
    case "block":
      isShowSearch.value = "none";
      break;
  }
};

const showSearch = () => {
  isShowSearch.value = "block";
};

// 刷新地图
const reflashMap = () => {
  mittBus.emit("reflashMap");
  // mittBus.emit("resetBtn");
};
</script>

<style lang="scss" scoped>
.search_btn {
  position: absolute;
  top: 4px;
  left: 7px;
  z-index: 1;
}

.reflash_map {
  position: absolute;
  top: 3px;
  right: 5px;
  z-index: 1;
}

.map_search_wrap {
  :deep .el-tabs__header {
    z-index: 0;

    .el-tabs__nav-wrap {
      .el-tabs__nav-scroll {
        padding-left: 45px;
      }
    }
  }

  :deep .el-tabs__content {
    display: v-bind("isShowSearch");
    position: absolute;
    top: 50px;
    left: 10px;
    padding: 0;
    z-index: 1;

    .base_info_wrap {
      padding: 10px 0 0 10px;
      width: 666px;
      min-height: 80px;
      overflow: hidden;
      background: rgb(255 255 255 / 80%);
      border-radius: 10px;
    }
  }
}
</style>
