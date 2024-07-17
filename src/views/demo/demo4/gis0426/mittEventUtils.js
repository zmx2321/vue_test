/**
 * 接收其他组件派发的方法
 */

// 组件传参
import mittBus from '@/utils/mittBus' // mitt

const mittEventOption = {
    // index下核心方法
    main() {
        console.log('index下核心方法mittEvent')
        // 刷新地图
        mittBus.on('reflashMap', () => {
            // console.log("刷新地图", currentCoverType, currentContactType, myOlMap)

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
    },
    // 基本信息相关
    baseInfo() {
        console.log('基本信息相关mittEvent')
    },
    // 图层管理相关
    layerManager() {
        console.log('图层管理相关mittEvent')

        // 加载kml
        mittBus.on('loadKML', text => {
            // console.log('加载kml', text, myOlMap)

            mapUtils.loadKML(myOlMap, text)

            // 通知弹窗关闭
            mittBus.emit('closeLoadKfmlFileDialog')
        })
    },
}

// 管理index下所有mitt事件
const mittEvent = () => {
    mittEventOption.main()  // index下核心方法
    mittEventOption.baseInfo()  // 基本信息相关
    mittEventOption.layerManager()  // 图层管理相关





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

    // 选择默认图层
    mittBus.on('selectDefaultLayer', val => {
        console.log("selectDefaultLayer", val)
    })
}

export default mittEvent