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
</template>

<script setup>
import { onMounted, ref } from 'vue'
// 组件
import LayerSelect from './LayerSelect.vue'
import LoadKfmlFileDialog from './LoadKfmlFileDialog.vue'

const layerTabList = ['图层管理', '导入kml']

const layerTabPosition = ref('图层管理')
let isShowLayerSelect = ref(true)

// let layerTabPosition = ref('')
// let isShowLayerSelect = ref(false)

const refLoadKfmlFileDialog = ref(null)

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
    }
}
</script>

<style lang="scss" scoped></style>