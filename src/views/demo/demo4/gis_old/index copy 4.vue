<template>
    <section class="ol_map_wrap">
        <!-- 搜索组件 -->
        <map-search class="map_search_wrap" />

        <section id="olMap" class="ol_map"></section>

        <!--  气泡窗 -->
        <popup-common ref="refPopupCommon" />

        <!-- 图例 -->
        <lend ref="refLend" />
    </section>
</template>

<script setup name="gis">
// vue - core
import { ref, onMounted } from 'vue';
// map - core
import * as mapUtils from './mapUtils.js'
// 组件
import MapSearch from './components/MapSearch.vue'
import PopupCommon from './components/popup/PopupCommon.vue'  // 气泡窗
import Lend from './components/Lend.vue'
// test
import { fromLonLat, transform } from 'ol/proj';
// 工具
import { apiCommon } from '@/utils/index.js'
// 业务
import * as lgApi from "@/api/gis/gis";

const refPopupCommon = ref(null)
const refLend = ref(null)

// const isRenderFlag = false

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
    // getCurrentViewPosition(olMap)  // 地图加载时会自动触发一次 - 这里做测试
}

// 设置地图
const setOlmap = (olMap) => {
    // setPoint(olMap)  // 设置标注点 - 测试时使用
    // setCurve(olMap)  // 设置扇形区
    mapEvent(olMap)  // 地图事件
}

/**
 * 业务方法
 */
// 根据数据渲染Feature
const renderFeatureByData = (olMap, dataList) => {
    dataList.forEach(item => {
        // console.log(JSON.stringify(item))

        if (item.coverType === '室内') {
            let innerPoint = []
            // innerPoint.push([item.longitude, item.latitude])
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
            // console.log(item.workFrequency)

            let outPoint = []
            outPoint.push({
                lonlat: [item.longitude, item.latitude],
                curveData: {
                    city: item.city,
                    county: item.county,
                    coverType: item.coverType,
                    machineRoom: item.machineRoom,
                    antDirectionAngle: item.antDirectionAngle,  // 方位角 - 重要
                    workFrequency: item.workFrequency  // 频段 - 重要
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
    let params4GData = await apiCommon(lgApi.queryCell4gList, params4G)
    renderFeatureByData(olMap, params4GData.data)

    /**
     * 5g接口
     */
    let params5GData = await apiCommon(lgApi.queryCell5gList, params5G)
    renderFeatureByData(olMap, params5GData.data)
}

// 设置标注点
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
    // 扇形测试数据
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

        getCurrentViewPosition(olMap)
    })
}

// 点击单个feature - map - click事件
const singleFeaturesClick = (olMap, featureList, e) => {
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

    .map_search_wrap {
        width: 100%;
    }

    .ol_map {
        width: 100%;
        height: 100%;
        overflow: hidden;
    }
}
</style>