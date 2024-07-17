/**
 * 地图相关工具方法
 */
import maplibregl from 'maplibre-gl'

import { glMapConfig, glMapConfigDev, glMapConfigTest3, glMapConfigTest0, glMapConfigTest1 } from './mapData/mapConfig' // config

import chinaGeo from './mapData/geoData/china.json' // 全国
import zhejiangIndexGeo from './mapData/geoData/zhejiangIndex' // 首页浙江
import zhejiangGeo from './mapData/geoData/zhejiang' // 普通浙江
import shanghaiGeo from './mapData/geoData/shanghai' // 上海
import jiangsuGeo from './mapData/geoData/jiangsu' // 江苏
import xinJiangGeo from './mapData/geoData/xinjiang' // 新疆
import guangXiGeo from './mapData/geoData/guangxi' // 广西
import sichuanGeo from './mapData/geoData/sichuan' // 四川
import jiangXiGeo from './mapData/geoData/jiangxi' // 江西

/** ****************************
 * 地图工具
 * ****************************
 */
// 初始化地图
const mapInitTool = (mapConfig, geoData, center, zoom, minZoom) => new maplibregl.Map(mapConfig('glMap', geoData, center, zoom, minZoom)) // 初始化地图

// 渲染geojson
const renderGeo = (geoData, map, className, isSet = false, next) => {
  // console.log(geoData)

  geoData.features.forEach((item) => {
    let { properties } = item
    let { name, centroid } = properties

    if (!centroid) {
      centroid = properties.center
    }

    let el = document.createElement('div')
    el.innerHTML = `<div class="title">${name}</div>`
    el.className = `city-label ${className}`

    // 是否需要定制化
    if (isSet) {
      next(el, item, name)
    }

    if (centroid) {
      new maplibregl.Marker({ element: el, anchor: 'center' }).setLngLat(centroid).addTo(map)
    }
  })
}
// 添加面和线图层
const addMapLayer = (map, geoData, idName, color, opacity) => {
  // 添加Source，类型是geojson
  map.addSource(idName, {
    type: 'geojson',
    data: geoData
  })
  // 添加面
  map.addLayer({
    id: idName,
    type: 'fill', // fill类型layer
    source: idName,
    layout: {},
    paint: {
      'fill-color': color, // fill颜色
      'fill-opacity': opacity || 0.7 // fill透明度
    }
  })
  // 添加线
  map.addLayer({
    id: `${idName}_line`,
    type: 'line',
    source: idName,
    layout: {},
    // eslint-disable-next-line no-dupe-keys
    layout: {
      'line-join': 'round',
      'line-cap': 'round'
    },
    paint: {
      'line-color': '#fff',
      'line-width': 1,
      'line-dasharray': [2, 4]
    }
  })
}
// 根据开发环境区分底图
const setMapLayer = (geoData, center, zoom, minZoom) => {
  if (false) {
    mapInitTool(glMapConfigTest3, geoData, center, zoom)
    mapInitTool(glMapConfig, geoData, center, zoom)
    mapInitTool(glMapConfigDev, geoData, center, zoom)
    mapInitTool(glMapConfigTest0, geoData, center, zoom)
    mapInitTool(glMapConfigTest1, geoData, center, zoom)
  }

  if (process.env.NODE_ENV === 'development') {
    if (minZoom) {
      return mapInitTool(glMapConfigDev, geoData, center, zoom, minZoom)
    }
    return mapInitTool(glMapConfigDev, geoData, center, zoom)

    // return mapInitTool(glMapConfigTest1, geoData, center, zoom)
    // return mapInitTool(glMapConfig, geoData, center, zoom)
    // return mapInitTool(glMapConfigTest3, geoData, center, zoom)
  }
  // return mapInitTool(glMapConfigDev, geoData, center, zoom)
  return mapInitTool(glMapConfig, geoData, center, zoom)
}

/** ****************************
 * 地图供出方法
 * ****************************
 */
/**
 * 地图核心方法供出
 */
// 地图配置
export const setMapConfig = (map) => {
  // 添加相关的地图控件
  map.addControl(new maplibregl.FullscreenControl(), 'top-right')

  // this.glMap.addControl(new maplibregl.NavigationControl());
  // this.glMap.scrollZoom.disable();  // 禁用地图缩放
}
// 设置标注
export const setMarkerCommon = (el, lonlat, popup, map) => {
  // 如果map为空，表示三个参数
  if (!map) {
    // 无气泡
    // eslint-disable-next-line no-shadow
    let map = popup
    new maplibregl.Marker(el).setLngLat(lonlat).addTo(map)
  } else {
    // 有气泡
    new maplibregl.Marker(el)
      .setLngLat(lonlat)
      .setPopup(popup) // sets a popup on this marker
      .addTo(map)
  }
}
// 设置气泡
export const setPopupCommon = (map, linlat, inner) => new maplibregl.Popup({ closeOnClick: true }).setLngLat(linlat).setHTML(inner).addTo(map)

/**
 * 地图数据及渲染方法供出
 */
/**
 * 全国
 */
export const chinaMap = () => setMapLayer(chinaGeo, [106, 31], 3.3, 2)
export const renderGeoToChina = (map) => {
  renderGeo(chinaGeo, map, 'china')
}

/**
 * 首页浙江
 */
// 地图初始化
export const zhejiangMapIndex = () => setMapLayer(zhejiangIndexGeo)
// 渲染geoData
export const renderGeoToZheJiangIndex = (map, next) => {
  // 定制首页地图geojson
  renderGeo(zhejiangIndexGeo, map, 'zhejiang_index', true, (el, item, name) => {
    // console.log(el, item, name)

    setTimeout(() => {
      // eslint-disable-next-line default-case
      switch (name) {
        case '浙北':
          // console.log(name, item)
          // addMapLayer(map, item, 'zhebei', '#1B346A')
          addMapLayer(map, item, 'zhebei', '#73BBBF', 0.4)
          break
        case '浙南':
          // console.log(name, item)  // 浙东
          // addMapLayer(map, item, 'zhenan', '#f00')
          addMapLayer(map, item, 'zhenan', '#C29E35')
          break
        case '浙西':
          // console.log(name, item)  // 浙南
          // addMapLayer(map, item, 'zhexi', '#f00')
          addMapLayer(map, item, 'zhexi', '#7BAD84', 0.6)
          break
        case '浙东':
          // console.log(name, item)  // 浙西
          // addMapLayer(map, item, 'zhedong', '#f00')
          addMapLayer(map, item, 'zhedong', '#C6716D')
          break
      }
    }, 0)

    // 标注点击事件
    el.addEventListener('click', (e) => {
      e.stopPropagation() // 阻止冒泡，防止父层事件影响到文字标注事件

      let { textContent } = e.target
      // console.log(textContent)

      // 获取城市标注数据
      next(textContent)
    })
  })
}

/**
 * 普通浙江
 */
export const zhejiangMap = () => setMapLayer(zhejiangGeo)
export const renderGeoToZheJiang = (map) => {
  renderGeo(zhejiangGeo, map, 'zhejiang')
}

/**
 * 上海
 */
export const shanghaiMap = () => setMapLayer(shanghaiGeo, [121.4, 31.2], 8.9, 7)
export const renderGeoToShangHai = (map) => {
  renderGeo(shanghaiGeo, map, 'shanghai')
}

/**
 * 江苏
 */
export const jiangsuMap = () => setMapLayer(jiangsuGeo, [119.5, 33.1], 6.3)
export const renderGeoToJiangSu = (map) => {
  renderGeo(jiangsuGeo, map, 'jiangsu')
}

/**
 * 新疆
 */
export const xinJiangMap = () => setMapLayer(xinJiangGeo, [85, 41], 5)
export const renderGeoToXingJiang = (map) => {
  renderGeo(xinJiangGeo, map, 'xinjiang')
}

/**
 * 广西
 */
export const guangXiMap = () => setMapLayer(guangXiGeo, [108.3, 23.7], 6)
export const renderGeoToGuangXi = (map) => {
  renderGeo(guangXiGeo, map, 'guangxi')
}

/**
 * 四川
 */
export const sichuanMap = () => setMapLayer(sichuanGeo, [103, 30.28], 5.5)
export const renderGeoToSichuan = (map) => {
  renderGeo(sichuanGeo, map, 'sichuan')
}

/**
 * 江西
 */
export const jiangXiMap = () => setMapLayer(jiangXiGeo, [116, 26.6], 6)
export const renderGeoToJiangXi = (map) => {
  renderGeo(jiangXiGeo, map, 'sichuan')
}
