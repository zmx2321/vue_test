<template>
  <el-dialog
    width="740px"
    v-model="showDialog"
    :close-on-click-modal="false"
    :modal-append-to-body="false"
    :close-on-press-escape="false"
  >
    <template #header>
      <span>{{ currentPopupData.newCellName }}</span>
    </template>
    <div class="container">
      <el-tabs v-model="activeName" @tab-click="handleClick">
        <!-- 基本信息 -->
        <el-tab-pane label="基本信息" name="base">
          <el-descriptions
            class="margin-top"
            :title="`cgi: ${currentPopupData.cgi}`"
            :column="3"
            border
          >
            <el-descriptions-item>
              <template #label>
                <span class="cell-item"> 省市区 </span>
              </template>
              <span
                >{{ currentPopupData.province }}{{ currentPopupData.city }}市{{
                  currentPopupData.county
                }}</span
              >
            </el-descriptions-item>
            <el-descriptions-item>
              <template #label>
                <span class="cell-item"> 站点名称 </span>
              </template>
              <span>{{ currentPopupData.stationName }}</span>
            </el-descriptions-item>
            <el-descriptions-item>
              <template #label>
                <span class="cell-item"> 基站类型 </span>
              </template>
              <span>{{ currentPopupData.coverType }}</span>
            </el-descriptions-item>
            <el-descriptions-item>
              <template #label>
                <span class="cell-item"> 站号 </span>
              </template>
              <span>{{ currentPopupData.stationNo }}</span>
            </el-descriptions-item>
            <el-descriptions-item>
              <template #label>
                <span class="cell-item"> 频段 </span>
              </template>
              <span>{{ currentPopupData.workFrequency }}</span>
            </el-descriptions-item>
            <el-descriptions-item>
              <template #label>
                <span class="cell-item"> 经纬度 </span>
              </template>
              <span
                >[{{ currentPopupData.longitude.toFixed(positionFix) }},
                {{ currentPopupData.latitude.toFixed(positionFix) }}]</span
              >
            </el-descriptions-item>
            <el-descriptions-item>
              <template #label>
                <span class="cell-item"> 小区生命周期状态 </span>
              </template>
              <span>{{ currentPopupData.cellLifeStatus }}</span>
            </el-descriptions-item>
          </el-descriptions>
        </el-tab-pane>

        <!-- 健康度信息 -->
        <el-tab-pane label="健康度信息" name="health" class="health_wrap">
          <div class="health_txt">
            <b>95</b>
            <el-descriptions class="margin-top" :column="1" border>
              <el-descriptions-item>
                <template #label>
                  <span class="cell-item"> 机房环境 </span>
                </template>
                <span>90</span>
              </el-descriptions-item>
              <el-descriptions-item>
                <template #label>
                  <span class="cell-item"> 价值收益 </span>
                </template>
                <span>100</span>
              </el-descriptions-item>
              <el-descriptions-item>
                <template #label>
                  <span class="cell-item"> 用户感知 </span>
                </template>
                <span>100</span>
              </el-descriptions-item>
              <el-descriptions-item>
                <template #label>
                  <span class="cell-item"> 网络质量 </span>
                </template>
                <span>100</span>
              </el-descriptions-item>
              <el-descriptions-item>
                <template #label>
                  <span class="cell-item"> 告警故障 </span>
                </template>
                <span>100</span>
              </el-descriptions-item>
            </el-descriptions>
          </div>
          <div class="health_chart">
            <health-chart
              class="chart_cot"
              ref="refHealthChart"
              :width="'80%'"
              :height="'80%'"
              :chart-data="healthChartData"
              v-if="isShowChart"
            />
          </div>
        </el-tab-pane>
      </el-tabs>
    </div>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="showDialog = false">关闭</el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script setup>
// core
import { nextTick, ref } from "vue";
// 组件
import HealthChart from "../chart/HealthChart.vue";
// api相关
import { apiCommon } from "@/utils/index.js";
import * as lgApi from "@/api/gis/gis";

const showDialog = ref(false);
const currentPopupData = ref(null);
const positionFix = ref(3);

const refHealthChart = ref(null);
const healthChartData = ref(null);
// const healthDataInfo = ref(null)
let isShowChart = ref(false);

let activeName = ref("base");
// let activeName = ref('health')

/**
 * 父组件调弹框显示方法
 */
const show = (val) => {
  showDialog.value = true;

  activeName.value = "base";

  // const { popupData } = val
  currentPopupData.value = val; // 基本信息数据
  // getHealthData()  // 健康度数据
};

const handleClick = (tab) => {
  const { name } = tab.props;

  isShowChart.value = false;

  if (name === "health") {
    getHealthData(); // 健康度数据
  }
};

// 获取健康度图表数据
const getHealthData = async () => {
  // 获取接口数据接口
  // ......
  /* let params = {
    cellName: queryString
  }
  gisData = await apiCommon(lgApi.queryCellListByCellName, params) */
  // currentPopupData

  getHealthChartData(); // 获取健康度图表数据
};

// 获取健康度图表数据
const getHealthChartData = () => {
  // 图表赋值
  healthChartData.value = {
    fieldData: [
      { name: "Sales", max: 6500 },
      { name: "Administration", max: 16000 },
      { name: "Information Technology", max: 30000 },
      { name: "Customer Support", max: 38000 },
      { name: "Development", max: 52000 },
      { name: "Marketing", max: 25000 },
    ],
    yData: [
      {
        value: [4200, 3000, 20000, 35000, 50000, 18000],
        name: "Allocated Budget",
      },
      {
        value: [5000, 14000, 28000, 26000, 42000, 21000],
        name: "Actual Spending",
      },
    ],
  };

  setTimeout(() => {
    isShowChart.value = true;

    nextTick(() => {
      refHealthChart.value.resetChart();
    });
  }, 0);
};

defineExpose({ show });
</script>
<style lang="scss" scoped>
.health_wrap {
  display: flex;
  justify-content: space-around;

  .health_txt {
    width: 35%;

    b {
      position: relative;
      display: block;
      text-align: center;
      margin-bottom: 10px;
      font-size: 28px;
      color: #000;

      &::before {
        content: "";
        position: absolute;
        margin-left: -29px;
        top: 50%;
        transform: translateY(-50%);
        width: 23px;
        height: 23px;
        background: url("../../icon/tongji.svg") top no-repeat;
        background-size: 100% 100%;
      }
    }
  }

  .health_chart {
    flex: 1;
    position: relative;

    .chart_cot {
      position: absolute;
      left: 50%;
      top: 50%;
      transform: translate(-50%, -50%);
    }
  }
}
</style>
