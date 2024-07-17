<template>
    <section class="ol_map_wrap">
        <!-- 搜索组件 -->
        <map-search />

        <section id="olMap" class="ol_map"></section>

        <!--  气泡窗 -->
        <popup-common ref="refPopupCommon" />

        <!-- 图例 -->
        <lend ref="refLend" />

        <!-- 底部信息 -->
        <div class="copyright_info">
            <p style="margin-left: 50px;font-size: 12px;">Copyright © CMDI.vip All Rights Reserved.</p>
            <p style="margin-right: -600px;font-size:  12px;">当前层级：{{ currentZoomLevel }}</p>
            <p style="margin-right: 120px;font-size:  12px;" id="info"></p>
        </div>
    </section>
</template>

<script setup name="gis">
// vue - core
import { ref, onMounted } from 'vue';
// map - core
import * as mapUtils from './mapUtils.js'
import { fromLonLat, transform } from 'ol/proj';  // 经纬度坐标相关
// 组件
import MapSearch from './components/map-search/index.vue'
import PopupCommon from './components/popup/PopupCommon.vue'  // 气泡窗
import Lend from './components/Lend.vue'
import { Circle as CircleStyle, Fill, Stroke, Style } from 'ol/style';
// 工具
import { apiCommon } from '@/utils/index.js'
// 组件传参
import mittBus from '@/utils/mittBus' // mitt
// import mittEventUtils from './mittEventUtils.js'
// 业务
import * as lgApi from "@/api/gis/gis";

const refPopupCommon = ref(null)
const refLend = ref(null)
let myOlMap = ref(null)
let currentContactType = 'all'  // 当前网络制式
let currentCoverType = 'all'  // 当前基站类型
const currentZoomLevel = ref(0)

const { proxy } = getCurrentInstance();

const isRemoveMap = ref(true)  // 判断渲染地图时是否移除当前地图要素

// 地图加载完初始化做的一些操作
const mapInit = (olMap) => {
    // console.log('地图加载完初始化做的一些操作', olMap)
    myOlMap = olMap  // 赋值全局变量,为后续业务操作做准备

    // 移除控件
    mapUtils.clearControls(olMap)
}

// 地图加载完初始化后获取地图的一些信息
const getMapInitInfo = (olMap) => {
    // console.log("地图加载完初始化后获取地图的一些信息", olMap)

    // 获取可视区域数据
    getCurrentViewData(olMap)  // 地图加载时会自动触发一次 - 这里做测试
}

// 设置地图
const setOlmap = (olMap) => {
    mapEvent(olMap)  // 地图事件

    // mittEventUtils()  // mitt管理
}

/**
 * 业务方法
 */
// 根据数据渲染Feature
const renderFeatureByData = (olMap, dataList) => {
    if (isRemoveMap.value) {
        mapUtils.removeAllLayer(myOlMap)  // 移除所有图层
    }

    setTimeout(() => {
        // console.log(dataList)
        dataList.forEach(item => {
            // console.log('渲染的图层数据', JSON.stringify(item))  

            if (item.coverType === '室内') {
                let innerPoint = []
                innerPoint.push({
                    lonlat: [item.longitude, item.latitude],
                    pointData: item
                })

                // 批量添加点
                mapUtils.addPoint(olMap, innerPoint)
            }

            if (item.coverType === '室外') {
                // console.log(item.workFrequency)

                let outPoint = []
                outPoint.push({
                    lonlat: [item.longitude, item.latitude],
                    curveData: item
                })
                // 批量添加扇形
                mapUtils.addCurve(olMap, outPoint)
            }
        })
    }, 500);
}

// 设置Feature样式
const setSingleFeatureStyle = (feature) => {
    console.log('设置Feature样式')

    let currentStyle = null

    if (feature.get('type') === 'Marker') {
        currentStyle = new Style({
            image: new CircleStyle({
                radius: 5,
                fill: new Fill({
                    color: '#00'
                }),
                stroke: new Stroke({
                    color: '#00',
                    width: 10
                })
            }),
        })
    }

    if (feature.get('type') === 'Curve') {
        currentStyle = new Style({
            fill: new Fill({
                color: '#f00'
            }),
            stroke: new Stroke({
                color: '#f00',
                width: 202
            }),
        })
    }

    feature.setStyle(currentStyle)
}

// 通过单条数据设置地图
const setMapBySingleData = (olMap, itemData) => {
    // console.log('通过单条数据设置地图', olMap, itemData)

    switch (itemData.networkType) {
        case '4g':
            itemData.newCellName = itemData.cellName
            break
        case '5g':
            itemData.newCellName = itemData.nrCellName
            break
    }

    // 选择数据隐藏气泡
    refPopupCommon.value.hidePopup()

    olMap.getView().setZoom(18)

    // 调用函数飞到指定的坐标
    mapUtils.flyToCoordinate(myOlMap, [itemData.longitude, itemData.latitude]);

    // 只显示一个Feature暂时使用此方案
    mapUtils.removeAllLayer(myOlMap)  // 移除所有图层
    renderFeatureByData(olMap, [itemData])

    // console.log([itemData.longitude, itemData.latitude])

    // 将经纬度转换为屏幕坐标
    const pixelPoint = fromLonLat([itemData.longitude, itemData.latitude]);
    // console.log(pixelPoint)

    mapUtils.setAutoPopup(myOlMap, pixelPoint, itemData)
}

// gis通用接口封装
const gisDataAsync = async (params, next, isMerge) => {
    let gisData = await apiCommon(lgApi.queryGisList, params)
    gisData = gisData.data

    if (gisData.cell4gList) {
        gisData.cell4gList.forEach(item => {
            item.networkType = '4g'
        })
    }

    if (gisData.cell5gList) {
        gisData.cell5gList.forEach(item => {
            item.networkType = '5g'
        })
    }

    if (isMerge) {
        next([...gisData.cell4gList, ...gisData.cell4gList])
    } else {
        next(gisData)
    }
}

// 根据类型刷新当前可视区域地图
const reflashCurrentMapByType = (next) => {
    // console.log(currentContactType, currentCoverType)

    let params = {
        ...getCurrentPositionParams(myOlMap),
        'networkType': currentContactType,
        'coverType': currentCoverType === 'all' ? undefined : currentCoverType
    }
    console.log(params)

    gisDataAsync(params, gisDataList => {
        const { cell4gList, cell5gList } = gisDataList
        // console.log(cell4gList, cell5gList)

        // 加载数据
        switch (currentContactType) {
            case '4g':
                renderFeatureByData(myOlMap, cell4gList)
                break
            case '5g':
                renderFeatureByData(myOlMap, cell5gList)
                break
            default:
                renderFeatureByData(myOlMap, [...cell4gList, ...cell5gList])
                break
        }
    })

    if (next) {
        next()
    }
}

// 根据cgi搜索详情
const searchByCGIAsync = async (cgi) => {
    let params = {
        cgi
    }

    let gisData = await apiCommon(lgApi.queryCellByCgi, params)

    if (!gisData.data) {
        console.log(gisData.msg)
        proxy.$modal.msgError(gisData.msg);
    } else {
        gisData = gisData.data
        console.log(gisData)
    }

    switch (gisData.networkType) {
        case '4g':
            gisData.cell4g.networkType = '4g'
            setMapBySingleData(myOlMap, gisData.cell4g)
            break
        case '5g':
            gisData.cell5g.networkType = '5g'
            setMapBySingleData(myOlMap, gisData.cell5g)
            break
    }
}

/**
 * 接收其他组件派发的方法
 */
// 刷新地图
mittBus.on('reflashMap', () => {
    console.log("刷新地图", currentCoverType, currentContactType, myOlMap)

    currentCoverType = undefined

    reflashCurrentMapByType()  // 根据类型刷新当前可视区域地图
})
// 获取网络制式
mittBus.on('getContactType', val => {
    // console.log("获取网络制式", val, myOlMap)

    currentContactType = val

    reflashCurrentMapByType()  // 根据类型刷新当前可视区域地图
})
// 查询基站类型
mittBus.on('getCoverType', val => {
    // console.log("查询基站类型", val, myOlMap)

    currentCoverType = val

    reflashCurrentMapByType()  // 根据类型刷新当前可视区域地图
})

// 加载kml
mittBus.on('loadKML', text => {
    // console.log('加载kml', text, myOlMap)

    mapUtils.loadKML(myOlMap, text)

    // 加载当前4g5g
    currentCoverType = undefined
    currentContactType = 'all'
    isRemoveMap.value = false
    reflashCurrentMapByType()  // 根据类型刷新当前可视区域地图

    // 通知弹窗关闭
    mittBus.emit('closeLoadKfmlFileDialog')
})

/**
 * gisSubmit循环派发事件
 */
// 根据cgi搜索
mittBus.on('searchByCGI', async cgi => {
    // console.log('根据cgi搜索', cgi)

    searchByCGIAsync(cgi)  // 根据cgi搜索详情
})
// 根据小区名称搜索
mittBus.on('searchByCellName', async cellName => {
    // console.log('根据小区名称搜索', cellName)

    let params = {
        cellName
    }
    let gisData = await apiCommon(lgApi.queryCellListByCellName, params)
    gisData = gisData.data
    // console.log(gisData)

    // mittBus.emit('gisSearchOptionData', gisData)
    /* setGisSearchOptionData(gisData)
    console.log(gisStoreData.gisSearchOptionData) */

    // 如果只有一条数据
    if (gisData.length === 1) {
        searchByCGIAsync(gisData[0].cgi)  // 根据cgi搜索详情
    }
})
// 根据站点名称搜索
mittBus.on('searchByStationName', async stationName => {
    console.log('根据站点名称搜索', stationName)

    let params = {
        stationName
    }
    let gisData = await apiCommon(lgApi.queryCellListByStationName, params)
    gisData = gisData.data
    // console.log(gisData)

    // 如果只有一条数据
    if (gisData.length === 1) {
        searchByCGIAsync(gisData[0].cgi)  // 根据cgi搜索详情
    }
})
// 搜索框下拉选择
mittBus.on('selectGisSearchSubmit', val => {
    searchByCGIAsync(val.cgi)  // 根据cgi搜索详情
})

/**
 * 图层管理
 */
// 选择默认图层
mittBus.on('selectDefaultLayer', val => {
    console.log("selectDefaultLayer", val.length)

    currentCoverType = undefined

    if (val.length === 0) {
        mapUtils.removeAllLayer(myOlMap)  // 移除所有图层
    }

    if (val.length === 1) {
        currentContactType = val[0]
        reflashCurrentMapByType()
    }

    if (val.length === 2) {
        currentContactType = 'all'
        reflashCurrentMapByType()
    }
})


/**
 * 地图工具方法
 */
// 获取可视区域坐标参数
const getCurrentPositionParams = (olMap) => {
    let viewPosition = mapUtils.getCurrentViewPosition(olMap)
    // console.log("获取可视区域的左上角和右下角坐标", viewPosition)

    return {
        "minLatitude": viewPosition.bottomRight[1],
        "maxLatitude": viewPosition.topLeft[1],
        "minLongitude": viewPosition.topLeft[0],
        "maxLongitude": viewPosition.bottomRight[0],
        'networkType': 'all'
    }
}

// 获取可视区域数据
const getCurrentViewData = (olMap) => {
    let params = {
        ...getCurrentPositionParams(olMap),
        'networkType': 'all'
    }

    gisDataAsync(params, gisDataList => {
        const { cell4gList, cell5gList } = gisDataList
        renderFeatureByData(olMap, cell4gList)
        renderFeatureByData(olMap, cell5gList)

    })

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

        // 点击地图隐藏气泡窗
        refPopupCommon.value.hidePopup()

        let pixel = olMap.getEventPixel(e.originalEvent);
        let featureList = olMap.getFeaturesAtPixel(pixel);  // 点击时获取所有features

        // 未点击时,popup是隐藏状态,在点击时显示,为了避免左下角出现
        refPopupCommon.value.showPopup()

        // 如果feature数组存在(不为空)
        if (featureList) {
            // 单个feature
            if (featureList.length === 1) {
                // console.log('无重叠,单个feature')

                // 点击单个feature
                singleFeaturesClick(olMap, featureList, e)
            }

            // 多个feature
            if (featureList.length > 1) {
                // console.log('有重叠,多个feature', featureList)

                // 点击扇形弹出气泡
                refPopupCommon.value.setFeaturesPopup(olMap, e, featureList)
            }
        }
    })

    // 监听鼠标拖动地图事件
    olMap.on('moveend', e => {
        // console.log('拖拽移动触发事件', e)

        var view = myOlMap.getView();
        var zoom = view.getZoom();
        currentZoomLevel.value = zoom.toFixed(2)
        // console.log("当前缩放级别为：" + zoom);
    })
}

// 点击单个feature - map - click事件
const singleFeaturesClick = (olMap, featureList, e) => {
    if (featureList.length === 1) {
        // console.log('无重叠,单个feature')

        let popupData = null

        // 获取图层
        const feature = olMap.forEachFeatureAtPixel(e.pixel, (feature) => {
            return feature
        })
        // 点击点标注
        if (feature && feature.get('type') === 'Marker') {
            // console.log('Marker点标注', feature);

            popupData = feature.get('pointData')
            // console.log('获取点标注数据', popupData)
        }

        // 点击扇形区域
        if (feature && feature.get('type') === 'Curve') {
            // console.log('点击扇形区域', feature);

            popupData = feature.get('curveData')
            // console.log('获取扇形区数据', popupData)
        }

        refPopupCommon.value.setCommonPopup(olMap, e, popupData)
    }
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
.ol_map_wrap {
    position: relative;
    width: 100%;
    height: 800px;

    .ol_map {
        width: 100%;
        height: 100%;
        overflow: hidden;
    }
}

.copyright_info {
    position: fixed;
    bottom: 0%;
    height: 25px;
    width: 100%;
    /* background-color: rgba(255, 255, 255, 0.5); */
    z-index: 1;
    background: #8a8888c4;
    display: flex;
    justify-content: space-between;
    /* 右对齐 */
    align-items: center;
    /* 垂直居中 */
}
</style>