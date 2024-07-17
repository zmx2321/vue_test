<template>
  <section class="layer_select_wrap">
    <div class="Default_layer_wrap layer_select_cont">
      <h3>默认[多选]</h3>
      <el-checkbox-group v-model="defaultLayerSelect">
        <el-checkbox v-for="(item, index) in DefaultLayerList" :key="index" :label="item.label" :value="item.value"
          @change="selectDefaultLayer" />
      </el-checkbox-group>
    </div>
    <div class="custom_layer_wrap layer_select_cont">
      <h3>自定义[单选]</h3>
      <el-radio-group v-model="customLayerSelect">
        <el-radio v-for="(item, index) in customLayerList" :key="index" :label="item.label" :value="item.value"
          @change="selectCustomLayer(item.value)" />
      </el-radio-group>
    </div>
  </section>
</template>

<script setup>
import { ref } from 'vue'
// 组件传参
import mittBus from '@/utils/mittBus' // mitt

const DefaultLayerList = ref([
  {
    label: '4g',
    value: '4g'
  },
  {
    label: '5g',
    value: '5g'
  },
  {
    label: '奉化_5G_工参_扇区谷歌图',
    value: 'custom3'
  },
  {
    label: '奉化_4G_工参_扇区谷歌图',
    value: 'custom4'
  },
])
const customLayerList = ref([
  {
    label: 'LTE资源',
    value: 'custom1'
  },
  {
    label: '5g资源',
    value: 'custom2'
  },

])

let defaultLayerSelect = ref(['4g', '5g'])  // 默认[多选]
let customLayerSelect = ref("")  // 自定义[单选]

const selectDefaultLayer = (val) => {
  console.log(val, defaultLayerSelect.value)

  mittBus.emit('selectDefaultLayer', defaultLayerSelect.value)
}

const selectCustomLayer = (val) => {
  console.log(val, customLayerSelect.value)
}
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