<template>
    <!-- <el-radio-group v-model="layerTabPosition"> -->
    <el-radio-group>
        <el-radio-button v-for="(item, index) in layerTabList" :key="index" :label="item" @click="setLayerEvent(item)">
            {{ item }}
        </el-radio-button>
    </el-radio-group>

    <!-- 图层管理 -->
    <layer-select v-show="isShowLayerSelect" />

    <!-- 导入kml -->
    <load-kfml-file-dialog ref="refLoadKfmlFileDialog" />

    <!-- 自定义多边形数据 -->
    <my-polygon-info-dialog ref="refMyPolygonInfoDialog" />
</template>

<script setup>
import { onMounted, ref } from 'vue'
// 组件
import LayerSelect from './LayerSelect.vue'
import LoadKfmlFileDialog from './LoadKfmlFileDialog.vue'
import MyPolygonInfoDialog from './MyPolygonInfoDialog.vue'
// 组件传参
import mittBus from '@/utils/mittBus' // mitt

const layerTabList = ref(['图层管理', '导入kml', '选区'/* , '测试地图功能' */])

const layerTabPosition = ref('图层管理')
let isShowLayerSelect = ref(true)

// let layerTabPosition = ref('')
// let isShowLayerSelect = ref(false)

const refLoadKfmlFileDialog = ref(null)
const refMyPolygonInfoDialog = ref(null)

/**
 * 接收其他组件派发的方法
 */
// 设置多边形数据
mittBus.on('setMyPolygonInfoDialog', (coordinates) => {
    refMyPolygonInfoDialog.value.show(coordinates)
})
// 设置取消选区按钮
mittBus.on('setCancelPolygonBtn', () => {
    layerTabList.value[2] = '选区'
})

const setLayerEvent = (tag) => {
    // console.log('tag', tag, layerTabPosition.value)

    switch (tag) {
        case '图层管理':
            // console.log('图层管理')
            isShowLayerSelect.value = !isShowLayerSelect.value
            break
        case '导入kml':
            // console.log('导入kml')
            refLoadKfmlFileDialog.value.show()
            break
        case '选区':
            layerTabList.value[2] = '取消选区'
            drawPolygon()
            break
        case '取消选区':
            layerTabList.value[2] = '选区'
            cancelPolygon()
            break
        case '测试地图功能':
            mittBus.emit('olMapTestCommon')
            break
    }
}

// 选区
const drawPolygon = () => {
    // console.log('drawPolygon')

    mittBus.emit('drawPolygon')
}

// 取消选区选区
const cancelPolygon = () => {
    // console.log('cancelPolygon')

    mittBus.emit('cancelPolygon')
}
</script>

<style lang="scss" scoped></style>