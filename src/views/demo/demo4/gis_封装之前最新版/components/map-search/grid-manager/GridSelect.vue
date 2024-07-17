<template>
  <section class="grid_select_wrap">
    <div class="Default_grid_wrap grid_select_cont">
      <h3>默认</h3>
      <el-checkbox-group v-model="defaultGridSelect">
        <el-checkbox v-for="(item, index) in defaultGridList" :key="index" :label="item.GridName"
          @change="selectDefaultGrid">{{ item.GridName }}</el-checkbox>
      </el-checkbox-group>
    </div>
    <div class="custom_grid_wrap grid_select_cont">
      <h3>自定义</h3>
      <el-radio-group v-model="customGridSelect">
        <el-radio v-for="(item, index) in customGridList" :key="index" :label="item.id" @change="selectCustomGrid">
          {{ item.GridName }}
        </el-radio>
      </el-radio-group>
    </div>
  </section>
</template>

<script setup>
import { ref } from 'vue'
// 组件传参
import mittBus from '@/utils/mittBus' // mitt
// api相关
import { apiCommon } from '@/utils/index.js'
import * as lgApi from "@/api/gis/gis";

const defaultGridList = ref([])
const customGridList = ref([])

let defaultGridSelect = ref([])  // 默认[多选]
let customGridSelect = ref("")  // 自定义[单选]

// poxy对象
const { proxy } = getCurrentInstance();

/**
 * 接收其他组件派发的方法
 */
// 测试
/* mittBus.on('addTestKmlFile', file => {
  console.log('测试添加kml', file.name)

  customGridList.value.push({
    GridName: file.name,
    value: file.raw
  })
}) */

// 通知图层列表刷新
mittBus.on('reloadGridSelect', () => {
  // console.log('通知图层列表刷新')

  initGridData()
})

const selectDefaultGrid = (val) => {
  // console.log(val, defaultGridSelect.value)

  mittBus.emit('selectDefaultGrid', defaultGridSelect.value)
}

const selectCustomGrid = async (id) => {
  // console.log(val, customGridSelect.value, val)

  let params = {
    id
  }
  // console.log(id)

  proxy.$modal.loading("正在请求，请稍候...");
  let customGridFile = await apiCommon(lgApi.getGisGridcontent, params)
  proxy.$modal.closeLoading();
  // console.log(customGridFile)


  // loadKML(customGridFile)
  mittBus.emit('loadKML', customGridFile)
}

// 初始化图层管理
const initGridData = async () => {
  try {
    let GridData = await apiCommon(lgApi.gueryGisGridList)
    GridData = GridData.data

    const defaultGridListData = GridData.defaultGridList
    const customGridListData = GridData.customGridList

    defaultGridList.value = defaultGridListData
    customGridList.value = customGridListData

    defaultGridSelect.value = [defaultGridList.value[0].GridName, defaultGridList.value[1].GridName]  // 默认[多选]
  } catch (e) {
    console.warn(e)
  }
}
// initGridData()
</script>

<style lang="scss" scoped>
.grid_select_wrap {
  position: fixed;
  margin-top: 12px;
  padding: 10px;
  width: 255px;
  height: 72vh;
  background: rgb(255 255 255 / 80%);
  border-radius: 10px;

  .grid_select_cont {
    margin-left: 12px;
    margin-top: 25px;

    &:not(:last-child) {
      // margin-bottom: 30px;
    }

    h3 {
      margin-bottom: 5px;
      font-size: 15px;
    }

    &.Default_grid_wrap {
      .el-checkbox-group {
        margin-top: 15px;

        .el-checkbox {
          display: block;
        }
      }
    }

    &.custom_grid_wrap {
      .el-radio-group {
        margin-top: 15px;

        :deep .el-radio {
          display: block;
          width: 100%;

          .el-radio__label {
            white-space: initial;
            line-height: 25px;
          }
        }
      }
    }
  }
}
</style>