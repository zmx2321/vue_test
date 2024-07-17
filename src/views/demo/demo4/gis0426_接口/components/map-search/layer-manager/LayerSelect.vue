<template>
  <section class="layer_select_wrap">
    <div class="Default_layer_wrap layer_select_cont">
      <h3>默认</h3>
      <el-checkbox-group v-model="defaultLayerSelect">
        <el-checkbox v-for="(item, index) in defaultLayerList" :key="index" :label="item.layerName" :value="item.id"
          @change="selectDefaultLayer" />
      </el-checkbox-group>
    </div>
    <div class="custom_layer_wrap layer_select_cont">
      <h3>自定义</h3>
      <el-radio-group v-model="customLayerSelect">
        <el-radio v-for="(item, index) in customLayerList" :key="index" :label="item.layerName" :value="item.id"
          @change="selectCustomLayer(item)" />
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

const defaultLayerList = ref([])
const customLayerList = ref([])

let defaultLayerSelect = ref(['4g', '5g'])  // 默认[多选]
let customLayerSelect = ref("")  // 自定义[单选]

// poxy对象
const { proxy } = getCurrentInstance();

/**
 * 接收其他组件派发的方法
 */
// 测试
mittBus.on('addTestKmlFile', file => {
  console.log('测试添加kml', file.name)

  customLayerList.value.push({
    layerName: file.name,
    value: file.raw
  })
})

// 通知图层列表刷新
mittBus.on('reloadLayerSelect', () => {
  // console.log('通知图层列表刷新')

  initLayerData()
})

const selectDefaultLayer = (val) => {
  // console.log(val, defaultLayerSelect.value)

  mittBus.emit('selectDefaultLayer', defaultLayerSelect.value)
}

const selectCustomLayer = async (val) => {
  // console.log(val, customLayerSelect.value, val)

  let params = {
    id: val.id
  }

  proxy.$modal.loading("正在请求，请稍候...");
  let customLayerFile = await apiCommon(lgApi.getGisLayercontent, params)
  proxy.$modal.closeLoading();
  // console.log(customLayerFile)


  // loadKML(customLayerFile)
  mittBus.emit('loadKML', customLayerFile)
}

// 加载kml
// const loadKML = (file) => {
//   if (!file) {
//     return;
//   }

//   const reader = new FileReader();
//   reader.onload = (e) => {
//     const text = e.target.result;

//     mittBus.emit('loadKML', text)
//   };
//   reader.readAsText(file);
//   /* if (typeof !== 'string') {

//   } */
//   /* if (isFile) {

//   } */
//   // console.log("获取文件流加载kml", event.target.files[0])
//   /* const file = event.target.files[0];
//   if (!file) {
//     return;
//   }

//   const reader = new FileReader();
//   reader.onload = (e) => {
//     const text = e.target.result;

//     mittBus.emit('loadKML', text)
//   };
//   reader.readAsText(file); */
// }

const initLayerData = async () => {
  let layerData = await apiCommon(lgApi.gueryGisLayerList)
  layerData = layerData.data

  const defaultLayerListData = layerData.defaultLayerList
  const customLayerListData = layerData.customLayerList

  defaultLayerList.value = defaultLayerListData
  customLayerList.value = customLayerListData
}
initLayerData()
</script>

<style lang="scss" scoped>
.layer_select_wrap {
  position: fixed;
  margin-top: 12px;
  padding: 10px;
  width: 255px;
  height: 72vh;
  background: rgb(255 255 255 / 80%);
  border-radius: 10px;

  .layer_select_cont {
    margin-left: 12px;
    margin-top: 25px;

    &:not(:last-child) {
      // margin-bottom: 30px;
    }

    h3 {
      margin-bottom: 5px;
      font-size: 15px;
    }

    &.Default_layer_wrap {
      .el-checkbox-group {
        margin-top: 15px;

        .el-checkbox {
          display: block;
        }
      }
    }

    &.custom_layer_wrap {
      .el-radio-group {
        margin-top: 15px;

        .el-radio {
          display: block;
          width: 100%;
        }
      }
    }
  }
}
</style>