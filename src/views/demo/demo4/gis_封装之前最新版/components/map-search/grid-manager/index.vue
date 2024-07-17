<template>
    <el-radio-group>
        <el-radio-button v-for="(item, index) in gridTabList" :key="index" :label="item" @click="setLayerEvent(item)">
            {{ item }}
        </el-radio-button>
    </el-radio-group>

    <!-- 图层管理 -->
    <grid-select v-show="isShowGridSelect" />

    <!-- 导入网格数据 -->
    <load-grid-data-dialog ref="refLoadGridDataDialog" />
</template>

<script setup>
import { onMounted, ref } from 'vue'
// 组件
import GridSelect from './GridSelect.vue'
import LoadGridDataDialog from './LoadGridDataDialog.vue'

const gridTabList = ref(['网格列表', '导入网格数据'])

let isShowGridSelect = ref(true)
const refLoadGridDataDialog = ref(null)

const setLayerEvent = (tag) => {
    // console.log('tag', tag, gridTabList.value)

    switch (tag) {
        case '网格列表':
            isShowGridSelect.value = !isShowGridSelect.value
            break
        case '导入网格数据':
            refLoadGridDataDialog.value.show()
            break
    }
}
</script>