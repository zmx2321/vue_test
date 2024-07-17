<template>
    <div id="popup" class="ol-popup popup_toggle" v-show="isShowPopup">
        <div class="popup_wrap">
            <a href="#" id="popup-closer" class="ol-popup-closer"></a>
            <div id="popup-content" class="popup-content"></div>
        </div>
    </div>
</template>

<script setup>
// vue core
import { ref, computed } from 'vue'
// map data
import * as popupInner from './popupInner'
// map core
import { fromLonLat, transform, toLonLat } from 'ol/proj';
import Overlay from 'ol/Overlay';
import { toStringHDMS } from 'ol/coordinate';

import * as mapUtils from '../../mapUtils'

// 如果popup不设置overflow的话,会在左下角显示,这里在一开始进行隐藏
let isShowPopup = ref(false)

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
    var container = document.getElementById('popup');
    var closer = document.getElementById('popup-closer');
    var content = document.getElementById('popup-content');

    // test
    let coordinate = transform(e.coordinate, 'EPSG:3857', 'EPSG:4326');
    // 点击尺 （这里是尺(米)，并不是经纬度）;
    let hdms = toStringHDMS(toLonLat(e.coordinate)); // 转换为经纬度显示

    const popupObj = {
        name: '111',
        hdms,
        coordinate,
        popupData
    }

    mapUtils.setPopup(olMap, e, container, closer, content, popupInner.pointPopupInner(popupObj))
}

// 点击扇形弹出气泡
const setCurvePopup = (olMap, e, popupData) => {
    console.log('点击扇形弹出气泡', olMap)

    // 使用变量存储弹窗所需的 DOM 对象
    var container = document.getElementById('popup');
    var closer = document.getElementById('popup-closer');
    var content = document.getElementById('popup-content');

    // test
    let coordinate = transform(e.coordinate, 'EPSG:3857', 'EPSG:4326');
    // 点击尺 （这里是尺(米)，并不是经纬度）;
    let hdms = toStringHDMS(toLonLat(e.coordinate)); // 转换为经纬度显示

    const popupObj = {
        name: '111',
        hdms,
        coordinate,
        popupData
    }

    mapUtils.setPopup(olMap, e, container, closer, content, popupInner.curvePopupInner(popupObj))
}

// 点击多个feature弹出气泡
const setFeaturesPopup = (olMap, e, popupData) => {
    console.log('点击扇形弹出气泡', olMap)

    // 使用变量存储弹窗所需的 DOM 对象
    var container = document.getElementById('popup');
    var closer = document.getElementById('popup-closer');
    var content = document.getElementById('popup-content');

    // test
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

    mapUtils.setPopup(olMap, e, container, closer, content, popupInner.featuresPopupInner(popupObj))
}

/**
 * 暴露方法 - 供父组件执行
 */
defineExpose({
    showPopup,
    hidePopup,
    setPointPopup,
    setCurvePopup,
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
        }
    }
}
</style>