<template>
  <section id="olMap" class="ol_map"></section>

  <!--  气泡窗测试 -->
  <PopupCommon ref="refPopupCommon" />

  <!-- 重叠Feature -->
  <FeatureDetailDialog ref="refFeatureDetailDialog" />
</template>

<script setup name="gis">
// vue - core
import { ref, onMounted } from 'vue';
// map - core
import * as mapUtils from './mapUtils.js'
// 组件
import PopupCommon from './components/popup/PopupCommon.vue'
import FeatureDetailDialog from './components/dialog/FeatureDetailDialog.vue'
// test
import { fromLonLat, transform } from 'ol/proj';
// 工具
// import { apiCommon } from '@/utils/index.js'
// 业务
// import * as lgApi from "@/api/gis/gis";

const refPopupCommon = ref(null)
const refFeatureDetailDialog = ref(null)

// 地图加载完初始化做的一些操作
const mapInit = (olMap) => {
  console.log('地图加载完初始化做的一些操作', olMap)

  // 移除控件
  mapUtils.clearControls(olMap)
}

// 地图加载完初始化后获取地图的一些信息
const getMapInitInfo = (olMap) => {
  console.log("地图加载完初始化后获取地图的一些信息", olMap)

  // 获取可视区域的左上角和右下角坐标
  getCurrentViewPosition(olMap)  // 地图加载时会自动触发一次 - 这里做测试
}

// 设置地图
const setOlmap = (olMap) => {
  setPoint(olMap)  // 设置标注点 - 测试时使用
  setCurve(olMap)  // 设置扇形区 - 测试时使用
  mapEvent(olMap)  // 地图事件
}

/**
* 业务方法
*/
// 根据数据渲染
const renderFeatureByData = (olMap, dataList) => {
  dataList.forEach(item => {
    if (item.coverType === '室内') {
      let innerPoint = []
      innerPoint.push({
        lonlat: [item.longitude, item.latitude],
        pointData: {
          machineRoom: item.machineRoom
        }
      })
      // 批量添加点
      mapUtils.addPoint(olMap, innerPoint)
    }

    if (item.coverType === '室外') {
      let outPoint = []
      outPoint.push({
        lonlat: [item.longitude, item.latitude],
        curveData: {
          city: item.city,
          county: item.county,
          coverType: item.coverType,
          machineRoom: item.machineRoom
        }
      })
      // 批量添加扇形
      mapUtils.addCurve(olMap, outPoint)
    }
  })
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

  /**
   * 4g接口
   */
  // let params4GData = await apiCommon(lgApi.queryCell4gList, params4G)
  // renderFeatureByData(olMap, params4GData.data)

  /**
   * 5g接口
   */
  // let params5GData = await apiCommon(lgApi.queryCell5gList, params5G)
  // renderFeatureByData(olMap, params5GData.data)
}

// 设置标注点
const setPoint = (olMap) => {
  mapUtils.addPoint(olMap, mapUtils.pointPopupTestDataList)
}

// 设置扇形区
const setCurve = (olMap) => {
  mapUtils.addCurve(olMap, mapUtils.curvePopupTestDataList)
}

// 地图事件
const mapEvent = (olMap) => {
  // 监听鼠标移动事件
  olMap.on('pointermove', (e) => {
    // 鼠标移动到feature区域时变为手形
    let pixel = olMap.getEventPixel(e.originalEvent);
    let hit = olMap.hasFeatureAtPixel(pixel);
    olMap.getTargetElement().style.cursor = hit ? 'pointer' : '';
  });

  // 监听鼠标单击事件
  olMap.on('singleclick', e => {
    console.log('点击地图', transform(e.coordinate, 'EPSG:3857', 'EPSG:4326'))

    let pixel = olMap.getEventPixel(e.originalEvent);
    let featureList = olMap.getFeaturesAtPixel(pixel);  // 点击时获取所有features
    // 这里的features是点击位置上的所有feature数组
    // console.log('点击时获取所有feature', featureList[0].get('type'))

    // 如果feature数组存在(不为空)
    if (featureList) {
      if (featureList.length === 1) {
        // console.log('无重叠,单个feature')

        // 获取图层
        const Feature = olMap.forEachFeatureAtPixel(e.pixel, (feature) => {
          return feature
        })
        // 点击点标注
        if (Feature && Feature.get('type') === 'Marker') {
          // console.log('Marker点标注', Feature);

          const popupData = Feature.get('pointData')
          console.log('获取点标注数据', popupData)

          // 点击标注弹出气泡测试方法
          refPopupCommon.value.setPointPopup(olMap, e, JSON.stringify(popupData))
        }

        // 点击扇形区域
        if (Feature && Feature.get('type') === 'Curve') {
          // console.log('点击扇形区域', Feature);

          const popupData = Feature.get('curveData')
          console.log('获取扇形区数据', popupData)

          // 点击扇形弹出气泡
          refPopupCommon.value.setCurvePopup(olMap, e, JSON.stringify(popupData))
        }
      }
      if (featureList.length > 1) {
        console.log('有重叠,多个feature')

        // 点击扇形弹出气泡
        // refPopupCommon.value.setCurvePopup(olMap, e, JSON.stringify(popupData))

        refFeatureDetailDialog.value.show(olMap, featureList)
      }
    }
  })

  // 监听鼠标拖动地图事件
  olMap.on('moveend', e => {
    console.log('拖拽移动触发事件', e)

    /* const feature = map.forEachFeatureAtPixel(e.pixel, function (feature, layer) {
      return feature;
    })
    console.log(feature) */

    // getCurrentViewPosition(olMap)
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

<style lang="scss">
.ol_map {
  width: 100%;
  height: 580px;
}
</style>