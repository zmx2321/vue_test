<template>
  <section class="demo_cont">
    <div class="map_wrap">
      <tab
        ref="tabRef"
        class="map_tab f-fl"
        :tab-list="tabListData"
        :current-index="currentIndex"
        @checkTab="checkTab"
        v-if="tabListData.length !== 0" />

      <div id="glMap" class="gl_map_cont" v-loading="mapLoading"></div>
    </div>
  </section>
</template>

<script setup>
// 引入库
import { ref, onMounted, nextTick /* computed */ /* unmounted */ } from 'vue' // vue-core
import * as mapUtils from './mapUtils' // map-core
// 引入组件
import Tab from './components/Tab.vue'
// 引入工具
import { http } from '@/api'
import { showReqError } from '@/hooks/useError'
// mock
// import serverArea from './mapData/mock/serverArea.json'

/**
 * 全局变量
 */
const tabListData = ref(['全国', '浙江定制', '浙江普通', '上海', '江苏', '新疆', '广西', '四川', '江西']) // 选项卡
let glMapData = null // 地图核心数据
let tabCurrent = '浙江普通'
let currentIndex = 0
let mapLoading = ref(true)
const mapMarkDataList = ref([]) // 地图点位数据
const mainPopupData = ref({})

/**
 * 计算属性数据
 */
// 首页大屏气泡
/* const mainPopup = computed(
  () => `<section class="popupp_wrap main_popupp">
                <ul>
                  <li>${mainPopupData.value.mpdt0}</li>
                </ul>
              </section>`
) */

const mainPopup = `<section class="popupp_wrap main_popupp">
                <ul>
                  <li>${mainPopupData.value.mpdt0}</li>
                </ul>
              </section>`

/**
 * 组件挂在时执行
 */
onMounted(() => {
  initPage() // 初始化页面
  initMap() // 渲染地图
})

/**
 * 初始化页面
 */
const initPage = () => {
  // 获取数据
  getServerAreaMapData()
}

/**
 * map init
 */
// 重置地图
const resetMap = (next) => {
  // removeAllMarker()

  if (glMapData) {
    glMapData.remove()
  }

  if (next) {
    next()
  }
}

// 初始化地图
const initMapConfig = (next) => {
  resetMap(() => {
    next()

    mapUtils.setMapConfig(glMapData) // 地图初始化配置

    glMapEvent() // 地图所有事件绑定
  })
}
// 移除气泡
const removePopup = () => {
  let mapNode = document.querySelector('#glMap')
  // console.log(mapNode)

  let popupNode = document.querySelectorAll('.maplibregl-popup')
  if (popupNode.length !== 0) {
    mapNode.removeChild(popupNode[0])
  }
}
// 移除所有标注
/* const removeAllMarker = () => {
  // console.log("移除所有标注")

  // 清除气泡
  this.removePopup()

  // 清除标注
  let markerList = document.querySelectorAll('.map_marker')
  // console.log(markerList)
  if (markerList.length !== 0) {
    let markerParentNode = markerList[0].parentNode

    markerList.forEach((item) => {
      // console.log(item)
      markerParentNode.removeChild(item)
    })
  }
} */

/**
 * map core
 */
// 地图所有事件绑定
const glMapEvent = () => {
  glMapData.on('click', (e) => {
    // 点击非layer请求所有数据
    let isOut = e.target.queryRenderedFeatures(e.point).length === 0
    if (isOut) {
      // console.log('点击非layer请求所有数据')
      console.log('点击地图外,执行自定义事件')
    }
  })

  // reload - 地图加载时执行
  glMapData.on('load', () => {
    // 业务
    nextTick(() => {
      setImgMarker() // 设置图片标注
    })
  })

  indexMapClick() // 首页地图点击
}

/**
 * 配置标注
 * @param {*} lonlat 经纬度  [120.5, 30]
 * @param {*} mapPopup  气泡
 * @param {*} markerClass  标注样式
 */
/* const setMarkerConfig = (lonlat, mapPopup, markerClass, isTab = false, item) => {
  // console.log()
  let popup = mapUtils.setPopupCommon(this.glMap, lonlat, mapPopup) // 气泡

  let el = document.createElement('div')
  el.className = `map_marker ${markerClass}`

  if (isTab) {
    el.addEventListener('click', (e) => {
      console.log(e, item)

      // this.$emit('getMarkerData', item)
    })
  }

  // 设置标注
  mapUtils.setMarkerCommon(el, lonlat, popup, this.glMap)
} */
// 判断标注是否有气泡
/* const checkMapMarker = (item, label, popup, node) => {
  if (item.latitude <= -90 || item.latitude > 90) {
    // item.latitude = 30
    return
  }

  if (node) {
    if (item.business_type.search(label) === 0) {
      setMarkerConfig([item.longitude, item.latitude], popup, node)
    }
  } else {
    node = popup
    popup = label

    // this.setMarkerConfig([item.longitude, item.latitude], this.zheShangJianRongPopup, 'map3_mksty1')
    setMarkerConfig([item.longitude, item.latitude], popup, node)
  }
} */

/**
 * 地图相关业务
 */
// 设置图片标注
const setImgMarker = () => {
  switch (tabCurrent) {
    case '全国':
      console.log('全国')
      break
    case '浙江定制':
      break
    case '浙江普通':
    case '省内':
      // console.log('浙江标注渲染')
      setMainMarker() // 浙江标注渲染
      break
    case '上海':
      console.log('上海')
      break
    case '江苏':
      console.log('江苏')
      break
    case '新疆':
      console.log('新疆')
      break
    case '广西':
      console.log('广西')
      break
    case '四川':
      console.log('四川')
      break
    case '江西':
      console.log('江西')
      break
    default:
      console.log('默认-浙江普通')
  }
}

// 定制首页地图标注
const setIndexMarkerConfig = (lonlat, markerClass, item) => {
  if (item.latitude <= -90 || item.latitude > 90) {
    // item.latitude = 30
    return
  }

  // console.log('ss', item.serverpart_name)

  let el = document.createElement('div')
  el.className = `map_marker no_popup_map_marker index_marker ${markerClass}`

  el.addEventListener('click', (e) => {
    e.stopPropagation()

    console.log('ss', item.serverpart_name)

    // console.log(item)

    // 是否为服务区  1 是   2 不是  isServer
    // item.isServer = '1'
    // this.$emit('getMarkerData', item)
  })
  el.addEventListener('mouseout', () => {
    removePopup()
  })
  el.addEventListener('mouseover', () => {
    mainPopupData.value = {
      mpdt0: item.serverpart_name
    }
    mapUtils.setPopupCommon(glMapData, lonlat, mainPopup) // 首页大屏气泡
  })

  // 设置标注
  mapUtils.setMarkerCommon(el, lonlat, glMapData)
}

// 浙江标注渲染
const setMainMarker = () => {
  console.log('浙江标注渲染')

  mapMarkDataList.value.forEach((item) => {
    // console.log(item)
    setIndexMarkerConfig([item.longitude, item.latitude], 'map0_mksty1', item)
  })
}

// 首页地图点击
const indexMapClick = () => {
  // 浙北
  glMapData.on('click', 'zhebei', () => {
    console.log('点击面-浙北')
  })
  // 浙南 - 浙东
  glMapData.on('click', 'zhenan', () => {
    console.log('点击面-浙东')
  })
  // 浙西 - 浙南
  glMapData.on('click', 'zhexi', () => {
    console.log('点击面-浙南')
  })
  // 浙东 - 浙西
  glMapData.on('click', 'zhedong', () => {
    console.log('点击面-浙西')
  })
}

/**
 * 获取接口数据
 */
// 地图数据
const getServerAreaMapData = async () => {
  const params = { pageSize: 999 }
  console.log(params)

  mapLoading.value = true

  try {
    let res = await http('getMapData', params)
    if (res.isError) return showReqError(res)
    mapMarkDataList.value = res.content

    /* let res = await serverArea
    // console.log(res)
    mapMarkDataList.value = res.content
    console.log(mapMarkDataList.value) */

    mapLoading.value = false
  } catch (error) {
    console.log(error)
  }
}

/**
 * 各地图geojson数据
 */
// 设置地图
const initMap = () => {
  initMapConfig(() => {
    switch (tabCurrent) {
      case '全国':
        // console.log('全国')
        initChina() // 全国渲染
        break
      case '浙江定制':
        initZheJiangIndex() // 浙江定制渲染
        break
      case '浙江普通':
      case '省内':
        initZheJiang() // 浙江普通渲染
        break
      case '上海':
        initShangHai()
        break
      case '江苏':
        initJiangSu()
        break
      case '新疆':
        initXingJiang()
        break
      case '广西':
        initGuangXi()
        break
      case '四川':
        initSichuan()
        break
      case '江西':
        initJiangXi()
        break
      default:
        initZheJiang()
    }
  })
}
// 全国渲染
const initChina = () => {
  glMapData = mapUtils.chinaMap()
  mapUtils.renderGeoToChina(glMapData, (textContent) => {
    console.log('点击文字标注', textContent)
    // 为字符串时为区域
    // $emit('getMapAreaData', textContent)
  })
}
// 浙江定制渲染
const initZheJiangIndex = () => {
  glMapData = mapUtils.zhejiangMapIndex()
  mapUtils.renderGeoToZheJiangIndex(glMapData, (textContent) => {
    console.log('点击文字标注', textContent)
    // 为字符串时为区域
    // $emit('getMapAreaData', textContent)
  })
}
// 浙江普通渲染
const initZheJiang = () => {
  glMapData = mapUtils.zhejiangMap()
  mapUtils.renderGeoToZheJiang(glMapData, (textContent) => {
    console.log(textContent)
    // 为字符串时为区域
    // $emit('getMapAreaData', textContent)
  })
}
// 初始化上海
const initShangHai = () => {
  glMapData = mapUtils.shanghaiMap()
  mapUtils.renderGeoToShangHai(glMapData)
}
// 初始化江苏
const initJiangSu = () => {
  glMapData = mapUtils.jiangsuMap()
  mapUtils.renderGeoToJiangSu(glMapData)
}
// 初始化新疆
const initXingJiang = () => {
  glMapData = mapUtils.xinJiangMap()
  mapUtils.renderGeoToXingJiang(glMapData)
}
// 初始化广西
const initGuangXi = () => {
  glMapData = mapUtils.guangXiMap()
  mapUtils.renderGeoToGuangXi(glMapData)
}
// 初始化四川
const initSichuan = () => {
  glMapData = mapUtils.sichuanMap()
  mapUtils.renderGeoToSichuan(glMapData)
}
// 初始化江西
const initJiangXi = () => {
  glMapData = mapUtils.jiangXiMap()
  mapUtils.renderGeoToJiangXi(glMapData)
}

/**
 * 其他工具方法
 */
// 点击选项卡
const checkTab = (val) => {
  // console.log(val)
  tabCurrent = val

  initMap()
}

// 默认tab
const setDefaultTab = () => {
  // 默认tab
  tabListData.value.forEach((item, index) => {
    if (item === tabCurrent) {
      currentIndex = index
    }
  })
}

/**
 * 组件挂在前执行，created生命周期vue3在setup中
 */
setDefaultTab()
</script>

<style lang="scss" scoped>
@import url(../styles/demoCommonStyle.scss);
@import url(./scss/mapCommon.scss);
@import url(./scss/marker.scss);

$popupBg: rgba(12, 38, 77, 0.75);

.map_tab {
  position: absolute;
  z-index: 1;
  opacity: 0.76;
}
</style>
