<template>
    <div id="popup" class="ol-popup popup_toggle" v-show="isShowPopup">
        <div class="popup_wrap">
            <a href="#" id="popup-closer" class="ol-popup-closer"></a>
            <div id="popup-content" class="popup-content"></div>
        </div>
    </div>

    <!-- 气泡详情弹窗 -->
    <popup-detail-dialog ref="refPopupDetailDialog" />
</template>

<script setup>
// vue core
import { ref, computed } from 'vue'
// map data
import * as popupInner from './popupInner'
// map core
import * as mapUtils from '../../mapUtils'
import { fromLonLat, transform, toLonLat } from 'ol/proj';
import Overlay from 'ol/Overlay';
import { toStringHDMS } from 'ol/coordinate';
// 组件传参
import mittBus from '@/utils/mittBus' // mitt
// 组件
import PopupDetailDialog from './PopupDetailDialog.vue'
// api相关
import { apiCommon } from '@/utils/index.js'
import { queryCellByCgi } from "@/api/gis/gis";

// 如果popup不设置overflow的话,会在左下角显示,这里在一开始进行隐藏
let isShowPopup = ref(false)
let currentPopupObj = {}
let refPopupDetailDialog = ref(null)
let featuresPopupDom = {}

const showPopup = () => {
    isShowPopup.value = true
}

const hidePopup = () => {
    // console.log('隐藏Popup')
    isShowPopup.value = false
}

// 点击标注弹出气泡
const setPointPopup = (olMap, e, popupData) => {
    console.log('点击标注弹出气泡', olMap)

    // 使用变量存储弹窗所需的 DOM 对象
    let container = document.getElementById('popup');
    let closer = document.getElementById('popup-closer');
    let content = document.getElementById('popup-content');

    // 经纬度
    let coordinate = transform(e.coordinate, 'EPSG:3857', 'EPSG:4326');
    // 点击尺 （这里是尺(米)，并不是经纬度）;
    let hdms = toStringHDMS(toLonLat(e.coordinate)); // 转换为经纬度显示

    const popupObj = {
        name: '标注气泡窗',
        hdms,
        coordinate,
        popupData  // 气泡窗业务数据
    }
    // console.log(22222, popupObj)
    currentPopupObj = popupObj

    /* mapUtils.setPopup(olMap, e, container, closer, content, popupInner.pointPopupInner(popupObj), event => {
        popupClickEvent(event)
    }) */

    mapUtils.setPopup(olMap, e, container, closer, content, popupInner.commonPopupInner(popupObj), event => {
        popupClickEvent(event)
    })
}

// 点击扇形弹出气泡
const setCurvePopup = (olMap, e, popupData) => {
    console.log('点击扇形弹出气泡', olMap)

    // 使用变量存储弹窗所需的 DOM 对象
    let container = document.getElementById('popup');
    let closer = document.getElementById('popup-closer');
    let content = document.getElementById('popup-content');

    // test
    let coordinate = transform(e.coordinate, 'EPSG:3857', 'EPSG:4326');
    // 点击尺 （这里是尺(米)，并不是经纬度）;
    let hdms = toStringHDMS(toLonLat(e.coordinate)); // 转换为经纬度显示

    const popupObj = {
        name: '扇形气泡窗',
        hdms,
        coordinate,
        popupData
    }
    currentPopupObj = popupObj

    /* mapUtils.setPopup(olMap, e, container, closer, content, popupInner.curvePopupInner(popupObj), event => {
        popupClickEvent(event)
    }) */

    mapUtils.setPopup(olMap, e, container, closer, content, popupInner.commonPopupInner(popupObj), event => {
        popupClickEvent(event)
    })
}

// 通用信息展示弹窗
const setCommonPopup = (olMap, e, popupData) => {
    console.log('点击标注弹出气泡', olMap)

    // 使用变量存储弹窗所需的 DOM 对象
    let container = document.getElementById('popup');
    let closer = document.getElementById('popup-closer');
    let content = document.getElementById('popup-content');

    // 经纬度
    let coordinate = transform(e.coordinate, 'EPSG:3857', 'EPSG:4326');
    // 点击尺 （这里是尺(米)，并不是经纬度）;
    let hdms = toStringHDMS(toLonLat(e.coordinate)); // 转换为经纬度显示

    const popupObj = {
        name: '通用信息展示弹窗',
        hdms,
        coordinate,
        popupData  // 气泡窗业务数据
    }
    // console.log(22222, popupObj)
    currentPopupObj = popupObj

    switch (currentPopupObj.popupData.networkType) {
        case '4g':
            currentPopupObj.popupData.newCellName = currentPopupObj.popupData.cellName
            break
        case '5g':
            currentPopupObj.popupData.newCellName = currentPopupObj.popupData.nrCellName
            break
    }

    /* mapUtils.setPopup(olMap, e, container, closer, content, popupInner.pointPopupInner(popupObj), event => {
        popupClickEvent(event)
    }) */

    mapUtils.setPopup(olMap, e, container, closer, content, popupInner.commonPopupInner(popupObj), event => {
        popupClickEvent(event)
    })
}

// 点击多个feature弹出气泡
const setFeaturesPopup = (olMap, e, popupData) => {
    console.log('点击扇形弹出气泡', olMap)

    // 使用变量存储弹窗所需的 DOM 对象
    let container = document.getElementById('popup');
    let closer = document.getElementById('popup-closer');
    let content = document.getElementById('popup-content');

    // 经纬度
    let coordinate = transform(e.coordinate, 'EPSG:3857', 'EPSG:4326');
    // 点击尺 （这里是尺(米)，并不是经纬度）;
    let hdms = toStringHDMS(toLonLat(e.coordinate)); // 转换为经纬度显示

    const popupObj = {
        name: popupData.length + '个重叠feature',
        type: popupData[0].get('type'),
        hdms,  // 经纬度
        coordinate,  // 坐标
        popupData  // 窗口业务数据 - 这里指所有的feature
    }
    // console.log(popupObj)
    currentPopupObj = popupObj

    mapUtils.setPopup(olMap, e, container, closer, content, popupInner.featuresPopupInner(popupObj, currentDataList => {
        // console.log(currentData)
        // currentPopupObj.popupData = currentData

        // console.log("输出业务数据", currentDataList)

        currentPopupObj.currentDataList = currentDataList
    }), event => {
        popupClickEvent(event)
    })

    featuresPopupDom = content.innerHTML
    // console.log(featuresPopupDom)
}

// 气泡弹出窗点击事件
const popupClickEvent = async (e) => {
    // console.log("气泡弹出窗点击事件", e) 

    const { target } = e  // 事件对象
    // console.log("点击气泡窗返回气泡窗中的dom对象", target)

    // 当前dom绑定的函数
    let dataFunction = target.getAttribute("data-function")

    // 点击气泡窗获取更多
    if (dataFunction === 'getMore') {
        getMore()
    }

    // 点击cgi显示具体气泡信息
    if (dataFunction === 'getSingleByFeatures') {
        // console.log(target.getAttribute("data-cgi"))
        getSingleByFeatures(target.getAttribute("data-cgi"))
    }

    // 点击popupDom返回
    if (dataFunction === 'popupBack') {
        popupBack()
    }
}

// 点击气泡窗获取更多
const getMore = async () => {
    console.log('点击气泡窗获取更多11', currentPopupObj)
    // mittBus.emit('getMore', ruleForm.value.contactType)

    // 或者走接口,根据cgi获取详情
    const currentPopupAsyncObj = await apiCommon(queryCellByCgi, { cgi: currentPopupObj.popupData.cgi })

    switch (currentPopupAsyncObj.data.networkType) {
        case '4g':
            currentPopupObj.popupData = currentPopupAsyncObj.data.cell4g
            currentPopupObj.popupData.networkType = '4g'
            currentPopupObj.popupData.newCellName = currentPopupObj.cellName
            break
        case '5g':
            currentPopupObj.popupData = currentPopupAsyncObj.data.cell5g
            currentPopupObj.popupData.networkType = '5g'
            currentPopupObj.popupData.newCellName = currentPopupObj.nrCellName
            break
    }

    refPopupDetailDialog.value.show(currentPopupObj.popupData)
}

// 点击cgi显示具体气泡信息
const getSingleByFeatures = (cgi) => {
    console.log('点击cgi显示具体气泡信息', currentPopupObj)

    currentPopupObj.popupData = currentPopupObj.currentDataList.filter(item => item.cgi === cgi)[0]
    // console.log(currentPopupObj.popupData)

    let content = document.getElementById('popup-content');

    content.innerHTML = popupInner.commonPopupInner(currentPopupObj)
    const backDom = document.createElement("b")
    console.log(backDom)
    backDom.setAttribute('data-function', 'popupBack');
    backDom.innerHTML = 'back'
    content.appendChild(backDom)
}

// 点击popupDom返回
const popupBack = () => {
    let content = document.getElementById('popup-content');
    content.innerHTML = featuresPopupDom
}

/**
 * 暴露方法 - 供父组件执行
 */
defineExpose({
    showPopup,
    hidePopup,
    setPointPopup,
    setCurvePopup,
    setCommonPopup,
    setFeaturesPopup
})
</script>

<style lang="scss" scoped>
$popupBg: rgba(111, 168, 247, 0.8);

.ol-popup {
    position: absolute;
    left: -50px;
    bottom: 12px;
    padding: 15px;
    background: $popupBg;
    min-width: 200px;
    max-height: 200px;

    /* &.popup_toggle {
        display: v-bind("isShowPopup");
    } */

    .popup_wrap {
        width: 100%;
        max-height: 170px;
        overflow: auto;
    }

    &::after,
    &::before {
        top: 100%;
        border: solid transparent;
        content: " ";
        height: 0;
        width: 0;
        position: absolute;
        pointer-events: none;
    }

    .ol-popup:after {
        border-top-color: $popupBg;
        border-width: 10px;
        left: 48px;
        margin-left: -10px;
    }

    &::before {
        border-top-color: $popupBg;
        border-width: 11px;
        left: 48px;
        margin-left: -11px;
    }

    .ol-popup-closer {
        position: absolute;
        top: 1px;
        right: 3px;
        width: 10px;
        height: 10px;
        cursor: pointer;

        &::after {
            content: "✖";
        }
    }

    :deep .popup-content {
        color: #2c2c2c;

        p {
            font-size: 12px;
            color: #514b4b;
            margin-bottom: 8px;
            cursor: pointer;
        }
    }
}
</style>