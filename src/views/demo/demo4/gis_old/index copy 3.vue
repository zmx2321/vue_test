<template>
    <section>
        <div id="olMap" class="ol_map"></div>
    </section>
</template>

<script setup>
// vue - core
import { ref, onMounted } from 'vue';
// map - core
import * as mapUtils from './mapUtils.js'
import { transform } from 'ol/proj';
// 工具
import { apiCommon } from '@/utils/index.js'
// 业务
import * as lgApi from "@/api/gis/gis";

// 地图加载完初始化做的一些操作
const mapInit = (olMap) => {
    // console.log('地图加载完初始化做的一些操作', olMap)

    // 移除控件
    mapUtils.clearControls(olMap)
}

// 地图加载完初始化后获取地图的一些信息
const getMapInitInfo = (olMap) => {
    // console.log("地图加载完初始化后获取地图的一些信息", olMap)

    // 获取可视区域的左上角和右下角坐标
    // getCurrentViewPosition(olMap)  // 地图加载时会自动触发一次
}

// 设置地图
const setOlmap = (olMap) => {
    // setPoint(olMap)  // 设置标注点
    addCurve(olMap)  // 设置扇形区
    mapEvent(olMap)  // 地图事件
}

/**
 * 地图工具方法
 */
// 获取可视区域的左上角和右下角坐标
const getCurrentViewPosition = async (olMap) => {
    let viewPosition = mapUtils.getCurrentViewPosition(olMap)
    // console.log("获取可视区域的左上角和右下角坐标", viewPosition)

    // console.log(viewPosition)

    let params4G = {
        "minLatitude": viewPosition.bottomRight[1],
        "maxLatitude": viewPosition.topLeft[1],
        "minLongitude": viewPosition.topLeft[0],
        "maxLongitude": viewPosition.bottomRight[0]
    }
    let params5G = {
        "minLatitude": viewPosition.bottomRight[1],
        "maxLatitude": viewPosition.topLeft[1],
        "minLongitude": viewPosition.topLeft[0],
        "maxLongitude": viewPosition.bottomRight[0]
    }

    let params4GData = await apiCommon(lgApi.queryCell4gList, params4G)
    params4GData = params4GData.data
    // console.log('params4GData:', params4GData)

    // 获取所有4g点
    let point4GList = []
    params4GData.forEach(item => {
        point4GList.push([item.longitude, item.latitude])
    })
    // console.log(point4GList)

    // 添加多个点
    mapUtils.setPoint(olMap, point4GList)

    let params5GData = await apiCommon(lgApi.queryCell5gList, params5G)
    console.log('params5GData:', params5GData)
}

// 设置标注点
const setPoint = (olMap) => {
    // mapUtils.setPointTest(olMap)

    // 添加多个点
    const points = [
        [121.63, 29.88],
        [121.6355502376645,
            29.884027098077965],
        // ... 更多点
    ];

    mapUtils.setPoint(olMap, points)
}

// 设置扇形区
const addCurve = (olMap) => {
    mapUtils.addCurveTest(olMap)
}

// 地图事件
const mapEvent = (olMap) => {
    olMap.on('click', e => {
        // console.log("点击获取坐标", transform(e.coordinate, 'EPSG:3857', 'EPSG:4326'))

        // mapUtils.removePointTest(olMap)
        // mapUtils.clickSetPointTest(olMap, e)

    })

    olMap.on('moveend', e => {
        console.log('拖拽移动触发事件', e)

        getCurrentViewPosition(olMap)
    })
}


/**
 * vue生命周期函数
 * 挂载后触发
 */
onMounted(() => {
    const olMap = mapUtils.initOlMap('olMap')  // 初始化地图

    mapInit(olMap)  // 地图加载完初始化做的一些操作
    getMapInitInfo(olMap)  // 地图加载完初始化后获取地图的一些信息
    setOlmap(olMap)  // 设置地图
})
</script>

<style lang="scss" scoped>
.ol_map {
    width: 100%;
    height: 580px;
}
</style>