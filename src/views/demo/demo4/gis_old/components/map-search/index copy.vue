<template>
  <el-tabs type="border-card" class="map_search_tab">
    <el-tab-pane>
      <template #label>
        <el-icon>
          <Grid />
        </el-icon>
        <span>基本信息</span>
      </template>
      <el-form :inline="true" :model="formInline" class="demo-form-inline">
        <!-- <el-form-item label="矢量底图：">
                        <el-radio-group v-model="radio1" size="small" @change="changeVectorMap">
                            <el-radio-button label="amap">高德地图</el-radio-button>
                            <el-radio-button label="tianditu">天地图</el-radio-button>
                        </el-radio-group>
                    </el-form-item> -->
        <!-- <el-divider direction="vertical" /> -->
        <el-form-item label="默认图层：">
          <el-radio-group v-model="radio2" size="small" @change="changeDefalutMap">
            <el-radio-button label="physicalSite">物理站图层</el-radio-button>
            <el-radio-button label="tianditu">4/5G工参</el-radio-button>
            <el-radio-button label="grid">网格图层</el-radio-button>
          </el-radio-group>
        </el-form-item>
      </el-form>
    </el-tab-pane>

    <el-tab-pane>
      <template #label>
        <span>
          <el-icon>
            <Files />
          </el-icon>
          <span>图层管理</span>
        </span>
      </template>
    </el-tab-pane>
  </el-tabs>
</template>

<script setup>
</script>

<style lang="scss" scoped>
.map_search_tab {}
</style>