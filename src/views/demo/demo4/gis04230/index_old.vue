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
import { ref, onMounted, nextTick } from 'vue';
// map - core
import * as mapUtils from './mapUtils.js'
// 组件
import MapSearch from './components/map-search/index.vue'
import PopupCommon from './components/popup/PopupCommon.vue'  // 气泡窗
import Lend from './components/Lend.vue'
// test
import { fromLonLat, transform } from 'ol/proj';
import info from './components/test-data/info.json'
import { Circle as CircleStyle, Fill, Stroke, Style } from 'ol/style';
// 工具
import { apiCommon } from '@/utils/index.js'
// 组件传参
import mittBus from '@/utils/mittBus' // mitt
// store
import { gisDataStore } from '@/store/modules/gis.js'
// 业务
import * as lgApi from "@/api/gis/gis";

const refPopupCommon = ref(null)
const refLend = ref(null)
let myOlMap = ref(null)
let currentContactType = 'all'  // 当前网络制式
let currentCoverType = ''  // 当前基站类型
const currentZoomLevel = ref(0)

const gisStoreData = gisDataStore()
const { setGisSearchOptionData } = gisDataStore() // store
const { proxy } = getCurrentInstance();

// 地图加载完初始化做的一些操作
const mapInit = (olMap) => {
    console.log('地图加载完初始化做的一些操作', olMap)
    myOlMap = olMap  // 赋值全局变量,为后续业务操作做准备

    // 移除控件
    mapUtils.clearControls(olMap)
}

// 地图加载完初始化后获取地图的一些信息
const getMapInitInfo = (olMap) => {
    console.log("地图加载完初始化后获取地图的一些信息", olMap)

    // 获取可视区域数据
    getCurrentViewData(olMap)  // 地图加载时会自动触发一次 - 这里做测试
}

// 设置地图
const setOlmap = (olMap) => {
    // setPoint(olMap)  // 设置标注点 - 测试时使用
    // setCurve(olMap)  // 设置扇形区
    mapEvent(olMap)  // 地图事件
}

/* // 初始化地图
const resetOlMap = (olMap, next) => {
    // console.log("初始化地图")

    mapUtils.removeAllLayer(olMap)

    switch (currentContactType) {
        case '4g':
            getCurrentViewPosition4G(olMap)
            break
        case '5g':
            getCurrentViewPosition5G(olMap)
            break
        default:
            getCurrentViewPosition(olMap)
    }

    next(olMap)
} */

/**
 * 业务方法
 */
// 根据数据渲染Feature
const renderFeatureByData = (olMap, dataList) => {
    // mapUtils.removeAllLayer(myOlMap)  // 移除所有图层
    mapUtils.removeAllLayer(myOlMap)  // 移除所有图层

    setTimeout(() => {
        // console.log(dataList)
        dataList.forEach(item => {
            // console.log(JSON.stringify(item))

            if (item.coverType === '室内') {
                let innerPoint = []
                // innerPoint.push([item.longitude, item.latitude])
                innerPoint.push({
                    lonlat: [item.longitude, item.latitude],
                    pointData: {
                        cgi: item.cgi
                    }
                })

                // 批量添加点
                mapUtils.addPoint(olMap, innerPoint)
            }

            if (item.coverType === '室外') {
                // console.log(item.workFrequency)

                let outPoint = []
                outPoint.push({
                    lonlat: [item.longitude, item.latitude],
                    curveData: {
                        cgi: item.cgi,
                        city: item.city,
                        county: item.county,
                        coverType: item.coverType,
                        // machineRoom: item.machineRoom,
                        antDirectionAngle: item.antDirectionAngle,  // 方位角 - 重要
                        workFrequency: item.workFrequency  // 频段 - 重要
                    }
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
    console.log('通过单条数据设置地图', olMap, itemData)

    // 选择数据隐藏气泡
    refPopupCommon.value.hidePopup()

    olMap.getView().setZoom(18)

    // 调用函数飞到指定的坐标
    mapUtils.flyToCoordinate(myOlMap, [itemData.longitude, itemData.latitude]);

    // 测试
    mapUtils.removeAllLayer(myOlMap)  // 移除所有图层
    renderFeatureByData(olMap, [itemData])

    // // 获取所有feature
    // mapUtils.getAllFeature(olMap, feature => {
    //     let featureData = {}

    //     switch (feature.get('type')) {
    //         case 'Marker':
    //             featureData = feature.get('pointData')
    //             break
    //         case 'Curve':
    //             featureData = feature.get('curveData')
    //             break
    //     }

    //     // 获取当前选中的feature与数据
    //     if (featureData.cgi === itemData.cgi) {
    //         console.log(feature, itemData, feature.get('type'))

    //         // mapUtils.removeAllLayer(myOlMap)  // 移除所有图层

    //         /* // 加载数据
    //         switch (currentContactType) {
    //             case '4g':
    //                 getCurrentViewPosition4G(myOlMap)
    //                 break
    //             case '5g':
    //                 getCurrentViewPosition5G(myOlMap)
    //                 break
    //             default:
    //                 getCurrentViewPosition(myOlMap)
    //                 break
    //         }

    //         setTimeout(() => {
    //             setSingleFeatureStyle(feature)
    //         }, 3000) */

    //     }
    // })
}

// gis通用接口封装
const gisDataAsync = async (params, next, isMerge) => {
    let gisData = await apiCommon(lgApi.queryGisList, params)
    gisData = gisData.data

    if (isMerge) {
        next([...gisData.cell4gList, ...gisData.cell4gList])
    } else {
        next(gisData)
    }
}

// 根据类型刷新当前可视区域地图
const reflashCurrentMapByType = (next) => {
    let params = {
        ...getCurrentPositionParams(myOlMap),
        'networkType': currentContactType,
        'coverType': currentCoverType
    }
    // console.log(params)

    gisDataAsync(params, gisDataList => {
        const { cell4gList, cell5gList } = gisDataList

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

/**
 * 接收其他组件派发的方法
 */
// 刷新地图
mittBus.on('reflashMap', () => {
    console.log("刷新地图", currentCoverType, currentContactType, myOlMap)

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
    console.log("查询基站类型", val, myOlMap)

    currentCoverType = val

    reflashCurrentMapByType()  // 根据类型刷新当前可视区域地图

    /* let params = {
        ...getCurrentPositionParams(myOlMap),
        'coverType': val,
        networkType: currentContactType
    }

    gisDataAsync(params, gisDataList => {
        renderFeatureByData(myOlMap, gisDataList)
    }, true) */
})
/* // 查询cgi
mittBus.on('searchByCGI', async (val) => {
    console.log("查询cgi", val, myOlMap, info)

    // 根据CGI获取数据
    // let itemData = await apiCommon(lgApi.getDataByCGI, '460-00-11615405-133')
    let itemData = await apiCommon(lgApi.getDataByCGI, val)
    // console.log("itemData", itemData)
    // let itemData = info

    setMapBySingleData(myOlMap, itemData.data)
}) */
// 获取为查询小区名称被选择的网络制式,并返回相对应的数据
// mittBus.on('selectContactType', async (val) => {
//     console.log("获取为查询小区名称被选择的网络制式,并返回相对应的数据", val, myOlMap)

//     let params = {
//         name: "",
//         type: parseInt(val)
//     }

//     // 获取为查询小区名称被选择的网络制式,并返回相对应的数据
//     let getCellNameSelectData = await apiCommon(lgApi.getSelectDataByContactType, params)
//     // console.log('获取为查询小区名称被选择的网络制式,并返回相对应的数据', getCellNameSelectData)

//     // 改造数据
//     getCellNameSelectData.data.forEach(item => {
//         item.value = item.newCellName
//     })

//     // 获取测试数据
//     // console.log("获取测试数据", params, test4GData, test5GData)

//     /* // 改造数据
//     test4GData.forEach(item => {
//         item.newCellName = item.cellName
//         item.value = item.cellName
//     })
//     test5GData.forEach(item => {
//         item.newCellName = item.nrCellName
//         item.value = item.nrCellName
//     })

//     let testCellNameSelectData = []
//     switch (val) {
//         case '4g':
//             testCellNameSelectData = test4GData
//             break
//         case '5g':
//             testCellNameSelectData = test5GData
//             break
//     }
//     // console.log('获取测试数据', testCellNameSelectData) */

//     // 获取CellName数据
//     mittBus.emit('getCellNameSelectData', getCellNameSelectData.data)
// })
/* // 选择小区名称
mittBus.on('selectcCellName', itemData => {
    // console.log("选择数据", itemData)

    setMapBySingleData(myOlMap, itemData)
}) */

/**
 * gisSubmit循环派发事件
 */
// 根据cgi搜索
mittBus.on('searchByCGI', async cgi => {
    console.log('根据cgi搜索', cgi)

    let params = {
        cgi
        // cgi: '460-00-1034805-138'  // 4g
        // cgi: '460-00-11615405-733'  // 5g
    }
    let gisData = await apiCommon(lgApi.queryCellByCgi, params)

    if (!gisData.data) {
        console.log(gisData.msg)
        proxy.$modal.msgError(gisData.msg);
    } else {
        gisData = gisData.data
    }
    // console.log(gisData)

    switch (gisData.networkType) {
        case '4g':
            setMapBySingleData(myOlMap, gisData.cell4g)
            break
        case '5g':
            setMapBySingleData(myOlMap, gisData.cell5g)
            break
    }
})
// 根据小区名称搜索
mittBus.on('searchByCellName', async cellName => {
    // console.log('根据小区名称搜索', cellName)

    let params = {
        // cellName: '移动'
        cellName
    }
    let gisData = await apiCommon(lgApi.queryCellListByCellName, params)
    gisData = gisData.data
    // console.log(gisData)

    gisData.forEach(item => {
        item.value = item.cellName
    })

    // 获取CellName数据
    // mittBus.emit('getCellNameSelectData', gisData)
    // console.log('22', gisData)
    setGisSearchOptionData(gisData)
    // console.log('55555', gisStoreData.gisSearchOptionData)

    switch (gisData.networkType) {
        case '4g':
            setMapBySingleData(myOlMap, gisData.cell4g)
            break
        case '5g':
            setMapBySingleData(myOlMap, gisData.cell5g)
            break
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



// // 设置4g
// const getCurrentViewPosition4G = async (olMap) => {
//     let viewPosition = mapUtils.getCurrentViewPosition(olMap)
//     // console.log("获取可视区域的左上角和右下角坐标", viewPosition)

//     let params4G = {
//         "minLatitude": viewPosition.bottomRight[1],
//         "maxLatitude": viewPosition.topLeft[1],
//         "minLongitude": viewPosition.topLeft[0],
//         "maxLongitude": viewPosition.bottomRight[0]
//     }

//     /**
//      * 4g接口
//      */
//     let params4GData = await apiCommon(lgApi.queryCell4gList, params4G)
//     renderFeatureByData(olMap, params4GData.data)
//     // console.log(JSON.stringify(params4GData.data[10]))

//     test4GData = params4GData.data
// }
// // 设置5g
// const getCurrentViewPosition5G = async (olMap) => {
//     let viewPosition = mapUtils.getCurrentViewPosition(olMap)
//     // console.log("获取可视区域的左上角和右下角坐标", viewPosition)

//     let params5G = {
//         "minLatitude": viewPosition.bottomRight[1],
//         "maxLatitude": viewPosition.topLeft[1],
//         "minLongitude": viewPosition.topLeft[0],
//         "maxLongitude": viewPosition.bottomRight[0]
//     }

//     /**
//      * 5g接口
//      */
//     let params5GData = await apiCommon(lgApi.queryCell5gList, params5G)
//     renderFeatureByData(olMap, params5GData.data)

//     test5GData = params5GData.data
// }

// 获取可视区域数据
const getCurrentViewData = (olMap) => {
    let params = {
        ...getCurrentPositionParams(olMap),
        'networkType': 'all'
    }
    // console.log(params)

    gisDataAsync(params, gisDataList => {
        // console.log("2222", gisDataList)

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
        // 这里的features是点击位置上的所有feature数组
        // console.log('点击时获取所有feature', featureList[0].get('type'))

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
                console.log('有重叠,多个feature', featureList)

                // 点击扇形弹出气泡
                refPopupCommon.value.setFeaturesPopup(olMap, e, featureList)

                // 点击扇形弹出气泡
                // refPopupCommon.value.setCurvePopup(olMap, e, JSON.stringify(popupData))
                // refFeatureDetailDialog.value.show(olMap, featureList)
            }
        }
    })

    // 监听鼠标拖动地图事件
    olMap.on('moveend', e => {
        console.log('拖拽移动触发事件', e)

        var view = myOlMap.getView();
        var zoom = view.getZoom();
        currentZoomLevel.value = zoom.toFixed(2)
        console.log("当前缩放级别为：" + zoom);

        // getCurrentViewPosition(olMap)
    })
}

// 点击单个feature - map - click事件
const singleFeaturesClick = (olMap, featureList, e) => {
    if (featureList.length === 1) {
        // console.log('无重叠,单个feature')

        // 获取图层
        const feature = olMap.forEachFeatureAtPixel(e.pixel, (feature) => {
            return feature
        })
        // 点击点标注
        if (feature && feature.get('type') === 'Marker') {
            // console.log('Marker点标注', feature);

            const popupData = feature.get('pointData')
            console.log('获取点标注数据', popupData)

            // 点击标注弹出气泡测试方法
            refPopupCommon.value.setPointPopup(olMap, e, JSON.stringify(popupData))
        }

        // 点击扇形区域
        if (feature && feature.get('type') === 'Curve') {
            // console.log('点击扇形区域', feature);

            const popupData = feature.get('curveData')
            console.log('获取扇形区数据', popupData)

            // 点击扇形弹出气泡
            refPopupCommon.value.setCurvePopup(olMap, e, JSON.stringify(popupData))
        }
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

// 设置标注点 - 测试
const setPoint = (olMap) => {
    // mapUtils.addPoint(olMap)

    // 添加多个点
    const points = [
        [121.63, 29.88],
        [121.6355502376645, 29.884027098077965],
        // ... 更多点
    ];

    mapUtils.addPoint(olMap, points)
}

// 设置扇形区
const setCurve = (olMap) => {
    // 扇形测试数据 - 测试
    const curveDataList = [
        {
            lonlat: [121.63, 29.88],
            curveData: {   // 这是给这个扇形添加额外的参数，这里的id和 setId的id没关系
                id: 1,
                title: '测试001',
                msg: '测试001-1',
                msg2: '测试001-2',
            }
        },
        {
            lonlat: [121.62734448609538, 29.882481380845533],
            curveData: {   // 这是给这个扇形添加额外的参数，这里的id和 setId的id没关系
                id: 2,
                title: '超级无敌炫酷爆龙战神',
                msg: '超级无敌炫酷爆龙战神 描述001',
                msg2: '超级无敌炫酷爆龙战神 描述002',
            }
        },
        {
            lonlat: [121.62663909818951, 29.87877807366553],
            curveData: {   // 这是给这个扇形添加额外的参数，这里的id和 setId的id没关系
                id: 2,
                title: '333',
                msg: '222 描述001',
                msg2: '3444 描述002',
            }
        },
    ]

    mapUtils.addCurve(olMap, curveDataList)
}
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