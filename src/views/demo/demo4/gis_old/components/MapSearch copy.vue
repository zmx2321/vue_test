<template>
  <section>
    <div id="map">
      <el-tabs type="border-card" class="demo-tabs">
        <el-tab-pane>
          <template #label>
            <span class="custom-tabs-label">
              <el-icon>
                <Files />
              </el-icon>
              <span>图层管理</span>
            </span>
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
            <span class="custom-tabs-label">
              <el-icon>
                <Grid />
              </el-icon>
              <span>网格管理</span>
            </span>
          </template>
          User
        </el-tab-pane>
        <el-tab-pane>
          <template #label>
            <span class="custom-tabs-label">
              <el-icon>
                <MapLocation />
              </el-icon>
              <span>地图功能</span>
            </span>
          </template>
          User
        </el-tab-pane>
        <el-tab-pane>
          <template #label>
            <span class="custom-tabs-label">
              <el-icon>
                <StarFilled />
              </el-icon>
              <span>POI</span>
            </span>
          </template>
          User
        </el-tab-pane>
      </el-tabs>
      <!-- 搜索框 -->
      <div class="searchTool">
        <el-autocomplete v-model="searchInput" :fetch-suggestions="querySearch" @select="handleSelect"
          style="width: 400px" placeholder="搜基站、查网格" clearable :trigger-on-focus="false">
          <template #prepend>
            <el-select v-model="typeSelect" placeholder="请选择" style="width: 115px" @change="selectChange">
              <el-option v-if="nowIsphysicalSiteLayer" v-for="item in searchFormInfo1" :key="item.value"
                :label="item.desc" :value="item.value" />
              <el-option v-else v-for="item in searchFormInfo2" :key="item.value" :label="item.desc"
                :value="item.value" />
            </el-select>
          </template>
          <!-- <template #append>
                    <el-button :icon="Search" @click="fnSearch"/>
                </template> -->
        </el-autocomplete>
      </div>
      <div class="buttom">
        <p style="margin-left: 50px;font-size: 12px;">Copyright © CMDI.vip All Rights Reserved.</p>
        <p style="margin-right: -600px;font-size:  12px;">当前层级：{{ currentZoomLevel }}</p>
        <p style="margin-right: 120px;font-size:  12px;" id="info"></p>
      </div>
      <div id="popup" class="ol-popup">
        <a href="#" rel="external nofollow" id="popup-closer" class="ol-popup-closer"></a>
        <div id="popup-content" class="popup-content"></div>
      </div>
    </div>
  </section>
</template>

<script setup>
</script>

<style lang="scss" scoped></style>