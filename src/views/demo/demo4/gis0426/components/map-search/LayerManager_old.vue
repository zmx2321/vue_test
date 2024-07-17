<template>
    <section>
        <el-radio-group v-model="layerTabPosition" @change="setLayerEvent">
            <el-radio-button v-for="(item, index) in layerTabList" :key="index" :label="item">{{ item
                }}</el-radio-button>
        </el-radio-group>

        <!-- 图层管理 -->
        <input type="file" @change="loadKML" />
    </section>
</template>

<script setup>
import { onMounted, ref } from 'vue'
// 组件传参
import mittBus from '@/utils/mittBus' // mitt

const layerTabList = ['图层管理', '导入kml']


const layerTabPosition = ref('图层管理')

const setLayerEvent = (tag) => {
    console.log('tag', tag)
}

const loadKML = (event) => {
    const file = event.target.files[0];
    if (!file) {
        return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
        const text = e.target.result;

        mittBus.emit('loadKML', text)
    };
    reader.readAsText(file);
}
</script>

<style lang="scss" scoped></style>