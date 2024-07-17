<template>
  <section class="ol_map_wrap">
    <!-- 搜索组件 -->
    <map-search />

    <section id="olMap" class="ol_map"></section>

    <!--  气泡窗 -->
    <popup-common ref="refPopupCommon" />

    <!-- 图例 -->
    <lend ref="refLend" />

    <!-- 右侧信息 - 健康度概览 -->
    <health-overview />

    <!-- 点击圆信息 -->
    <circle-detail-dialog ref="refCircleDetailDialog" />

    <!-- 底部信息 -->
    <div class="copyright_info">
      <p>Copyright © CMDI.vip All Rights Reserved.</p>
      <ul>
        <li>
          <dl>
            <dt>经纬度：</dt>
            <dd>{{ currentLonlat }}</dd>
          </dl>
        </li>
        <li>
          <dl>
            <dt>当前层级：</dt>
            <dd>{{ currentZoomLevel }}</dd>
          </dl>
        </li>
      </ul>
    </div>
  </section>
</template>

<script setup name="gis">
// vue - core
import { ref, onMounted } from "vue";
// map - core
import * as mapUtils from "@/utils/mapUtils.js";
// 组件
import MapSearch from "./components/map-search/index.vue";
import PopupCommon from "./components/popup/PopupCommon.vue"; // 气泡窗
import Lend from "./components/Lend.vue"; // 图例
import HealthOverview from "./components/HealthOverview.vue"; // 健康度概览
import CircleDetailDialog from "./components/CircleDetailDialog.vue"; // 点击圆信息
// 工具
import { apiCommon, copyTextToClipboard } from "@/utils/index.js";
// 组件传参
import mittBus from "@/utils/mittBus"; // mitt
// 业务
import * as lgApi from "@/api/gis/gis";
// 其他工具
import * as popupInner from "./components/popup/popupInner.js";

const refPopupCommon = ref(null);
const refLend = ref(null);
const refCircleDetailDialog = ref(null);

const currentZoomLevel = ref(0);
const currentLonlat = ref("");

let myOlMap = ref(null);
let currentContactType = "all"; // 当前网络制式
let currentCoverType = "all"; // 当前基站类型

const { proxy } = getCurrentInstance();

const isRemoveMap = ref(true); // 判断渲染地图时是否移除当前地图要素

// 地图加载完初始化做的一些操作
const mapInit = (olMap) => {
  // console.log('地图加载完初始化做的一些操作', olMap)
  myOlMap = olMap; // 赋值全局变量,为后续业务操作做准备

  mapUtils.resetControls(olMap); // 初始化所有控件

  // 设置鼠标右键属性
  mapUtils.setContextmenu(olMap, (option) => {
    // console.log(option, mapUtils.menuMethods);
    setMenuMethods(option);
  });
};

// 设置鼠标右键菜单栏方法
const setMenuMethods = ({ option, feature, pixelPoint }) => {
  // console.log("设置鼠标右键菜单栏方法", option, feature, pixelPoint);

  // 点击地图隐藏气泡窗
  refPopupCommon.value.hidePopup();

  switch (option) {
    // 刷新地图
    case mapUtils.menuMethods[0]:
      // console.log("刷新地图");
      mittBus.emit("resetBtn");
      mittBus.emit("reflashMap", "true");
      break;
    // 拷贝当前经纬度
    case mapUtils.menuMethods[1]:
      // console.log("拷贝当前经纬度");
      copyTextToClipboard(`[${currentLonlat.value}]`, () => {
        proxy.$modal.msgSuccess(`[${currentLonlat.value}] 拷贝成功`);
      });
      break;
    // 显示当前信息
    case mapUtils.singleMenuMethod1:
      // console.log("显示当前信息");
      singleFeaturesClick(myOlMap, feature, pixelPoint);
      break;
  }
};

// 地图加载完初始化后获取地图的一些信息
const getMapInitInfo = (olMap) => {
  // console.log("地图加载完初始化后获取地图的一些信息", olMap)

  // 获取可视区域数据
  getCurrentViewData(olMap); // 地图加载时会自动触发一次 - 这里做测试
};

// 设置地图
const setOlmap = (olMap) => {
  mapEvent(olMap); // 地图事件

  // mittEventUtils()  // mitt管理
};

/**
 * 业务方法
 */
// 根据数据渲染Feature
const renderFeatureByData = (olMap, dataList) => {
  if (isRemoveMap.value) {
    mapUtils.removeAllLayer(myOlMap); // 移除所有图层
  }

  setTimeout(() => {
    // console.log(dataList)
    dataList.forEach((item) => {
      // console.log('渲染的图层数据', JSON.stringify(item))
      // console.log(item)

      if (item.coverType === "室内") {
        let innerPoint = [];
        innerPoint.push({
          lonlat: [item.longitude, item.latitude],
          pointData: item,
        });

        // 批量添加点
        mapUtils.addPoint(olMap, innerPoint);
      }

      if (item.coverType === "室外") {
        // console.log(item.workFrequency)

        let outPoint = [];
        outPoint.push({
          lonlat: [item.longitude, item.latitude],
          curveData: item,
        });
        // 批量添加扇形
        mapUtils.addCurve(olMap, outPoint);
      }

      // 添加圆测试
      if (!item.coverType) {
        // console.log(item)

        // 添加圆
        mapUtils.addCircle(olMap, item);
      }
    });
  }, 500);
};

// 设置Feature样式
const setSingleFeatureStyle = (feature) => {
  console.log("设置Feature样式");

  let currentStyle = null;

  if (feature.get("type") === "Marker") {
    currentStyle = new Style({
      image: new CircleStyle({
        radius: 5,
        fill: new Fill({
          color: "#00",
        }),
        stroke: new Stroke({
          color: "#00",
          width: 10,
        }),
      }),
    });
  }

  if (feature.get("type") === "Curve") {
    currentStyle = new Style({
      fill: new Fill({
        color: "#f00",
      }),
      stroke: new Stroke({
        color: "#f00",
        width: 202,
      }),
    });
  }

  feature.setStyle(currentStyle);
};

// 通过单条数据设置地图
const setMapBySingleData = (olMap, itemData) => {
  // console.log('通过单条数据设置地图', olMap, itemData)

  switch (itemData.networkType) {
    case "4g":
      itemData.newCellName = itemData.cellName;
      break;
    case "5g":
      itemData.newCellName = itemData.nrCellName;
      break;
  }

  // 选择数据隐藏气泡
  refPopupCommon.value.hidePopup();

  olMap.getView().setZoom(18);

  // 调用函数飞到指定的坐标
  mapUtils.flyToCoordinate(myOlMap, [itemData.longitude, itemData.latitude]);

  // 只显示一个Feature暂时使用此方案
  mapUtils.removeAllLayer(myOlMap); // 移除所有图层
  renderFeatureByData(olMap, [itemData]);

  // console.log([itemData.longitude, itemData.latitude])

  // 将经纬度转换为屏幕坐标
  const pixelPoint = mapUtils.transformToPixelPoint(
    itemData.longitude,
    itemData.latitude
  );
  // console.log(pixelPoint)

  mapUtils.setAutoPopup(pixelPoint, itemData, (popupObj) => {
    // console.log(popupObj)

    mapUtils.popupCommonConfig(
      olMap,
      pixelPoint,
      popupInner.commonPopupInner(popupObj),
      (e) => {
        const { target } = e; // 事件对象

        // 点击气泡窗获取更多
        if (target.getAttribute("data-function") === "getMore") {
          mittBus.emit("showPopupDialog", itemData);
        }
      }
    );
  });
};

// gis通用接口封装
const gisDataAsync = async (params, next, isMerge) => {
  let gisData = await apiCommon(lgApi.queryGisList, params);
  gisData = gisData.data;

  if (gisData.cell4gList) {
    gisData.cell4gList.forEach((item) => {
      item.networkType = "4g";
    });
  }

  if (gisData.cell5gList) {
    gisData.cell5gList.forEach((item) => {
      item.networkType = "5g";
    });
  }

  if (isMerge) {
    next([...gisData.cell4gList, ...gisData.cell4gList]);
  } else {
    next(gisData);
  }
};

// 根据类型刷新当前可视区域地图
const reflashCurrentMapByType = (next) => {
  // console.log(currentContactType, currentCoverType)

  let params = {
    ...getCurrentPositionParams(myOlMap),
    networkType: currentContactType,
    coverType: currentCoverType === "all" ? undefined : currentCoverType,
  };
  // console.log(params)

  gisDataAsync(params, (gisDataList) => {
    const { cell4gList, cell5gList } = gisDataList;
    // console.log(cell4gList, cell5gList)

    // 加载数据
    switch (currentContactType) {
      case "4g":
        renderFeatureByData(myOlMap, cell4gList);
        break;
      case "5g":
        renderFeatureByData(myOlMap, cell5gList);
        break;
      default:
        renderFeatureByData(myOlMap, [...cell4gList, ...cell5gList]);
        break;
    }
  });

  if (next) {
    next();
  }
};

// 根据cgi搜索详情
const searchByCGIAsync = async (cgi) => {
  let params = {
    cgi,
  };

  let gisData = await apiCommon(lgApi.queryCellByCgi, params);

  if (!gisData.data) {
    console.log(gisData.msg);
    proxy.$modal.msgError(gisData.msg);
  } else {
    gisData = gisData.data;
    console.log(gisData);
  }

  switch (gisData.networkType) {
    case "4g":
      gisData.cell4g.networkType = "4g";
      setMapBySingleData(myOlMap, gisData.cell4g);
      break;
    case "5g":
      gisData.cell5g.networkType = "5g";
      setMapBySingleData(myOlMap, gisData.cell5g);
      break;
  }
};

/**
 * 接收其他组件派发的方法
 */
// 刷新地图
mittBus.on("reflashMap", (resetFlag) => {
  // console.log("刷新地图", currentCoverType, currentContactType, myOlMap);
  // console.log(Boolean(resetFlag));

  // currentCoverType = undefined;

  if (Boolean(resetFlag)) {
    currentCoverType = undefined;
    currentContactType = "all";
  }

  reflashCurrentMapByType(); // 根据类型刷新当前可视区域地图
});
// 获取网络制式
mittBus.on("getContactType", (val) => {
  // console.log("获取网络制式", val, myOlMap)

  currentContactType = val;

  reflashCurrentMapByType(); // 根据类型刷新当前可视区域地图
});
// 查询基站类型
mittBus.on("getCoverType", (val) => {
  // console.log("查询基站类型", val, myOlMap)

  currentCoverType = val;

  reflashCurrentMapByType(); // 根据类型刷新当前可视区域地图
});

// 加载kml
mittBus.on("loadKML", (text) => {
  // console.log('加载kml', text, myOlMap)

  mapUtils.loadKML(myOlMap, text);

  // 加载当前4g5g
  currentCoverType = undefined;
  currentContactType = "all";
  isRemoveMap.value = false;
  reflashCurrentMapByType(); // 根据类型刷新当前可视区域地图

  // 通知弹窗关闭
  mittBus.emit("closeLoadKfmlFileDialog");
});

// 绘制多边形
mittBus.on("drawPolygon", () => {
  // console.log('drawPolygon')

  mapUtils.drawPolygon(myOlMap); // 绘制多边形
});

// 取消绘制多边形
mittBus.on("cancelPolygon", () => {
  // console.log('取消绘制多边形')

  mapUtils.cancelPolygon(myOlMap); // 绘制多边形
});

// 地图功能测试
mittBus.on("olMapTestCommon", () => {
  // 获取所有图层
  mapUtils.getAllFeature(myOlMap, (featureItem) => {
    // console.log(featureItem)
    console.log(featureItem.get("type") === "Polygon");
  });

  // 创建多边形
  let coordinates = [
    [
      [13539800.880677564, 3488510.6789422887],
      [13539751.306711342, 3488448.0606687507],
      [13539806.124526428, 3488435.8001395557],
      [13539800.880677564, 3488510.6789422887],
    ],
  ];
  mapUtils.createPolygon(myOlMap, coordinates);

  /* mapUtils.addCircle(myOlMap, {
        site: [121.62764126289443, 29.892497327454393],
        size: 200,
    }) */
});

/**
 * gisSubmit循环派发事件
 */
// 根据cgi搜索
mittBus.on("searchByCGI", async (cgi) => {
  // console.log('根据cgi搜索', cgi)

  searchByCGIAsync(cgi); // 根据cgi搜索详情
});
// 根据小区名称搜索
mittBus.on("searchByCellName", async (cellName) => {
  // console.log('根据小区名称搜索', cellName)

  let params = {
    cellName,
  };
  let gisData = await apiCommon(lgApi.queryCellListByCellName, params);
  gisData = gisData.data;
  // console.log(gisData)

  // mittBus.emit('gisSearchOptionData', gisData)
  /* setGisSearchOptionData(gisData)
    console.log(gisStoreData.gisSearchOptionData) */

  // 如果只有一条数据
  if (gisData.length === 1) {
    searchByCGIAsync(gisData[0].cgi); // 根据cgi搜索详情
  }
});
// 根据站点名称搜索
mittBus.on("searchByStationName", async (stationName) => {
  console.log("根据站点名称搜索", stationName);

  let params = {
    stationName,
  };
  let gisData = await apiCommon(lgApi.queryCellListByStationName, params);
  gisData = gisData.data;
  // console.log(gisData)

  // 如果只有一条数据
  if (gisData.length === 1) {
    searchByCGIAsync(gisData[0].cgi); // 根据cgi搜索详情
  }
});
// 搜索框下拉选择
mittBus.on("selectGisSearchSubmit", (val) => {
  searchByCGIAsync(val.cgi); // 根据cgi搜索详情
});

/**
 * 图层管理
 */
// 选择默认图层
mittBus.on("selectDefaultLayer", (val) => {
  // console.log("selectDefaultLayer", val)

  currentCoverType = undefined;
  let currentType = "";

  if (val.length === 0) {
    mapUtils.removeAllLayer(myOlMap); // 移除所有图层
  }

  if (val.length === 1) {
    switch (val[0]) {
      case "LTE资源":
        currentType = "4g";
        break;
      case "5G资源":
        currentType = "5g";
        break;
    }
    currentContactType = currentType;
    reflashCurrentMapByType();
  }

  if (val.length === 2) {
    currentContactType = "all";
    reflashCurrentMapByType();
  }
});

/**
 * 地图工具方法
 */
// 设置圆数据(投诉)
const getCircleData = (olMap) => {
  /* let params = {
        ...getCurrentPositionParams(olMap),
        'networkType': 'all'
    }

    gisDataAsync(params, gisDataList => {
        const { cell4gList, cell5gList } = gisDataList
        renderFeatureByData(olMap, cell4gList)
        renderFeatureByData(olMap, cell5gList)

    }) */
  let circleList = [
    {
      site: [121.63, 29.88],
      size: 200,
      name: "覆盖物1",
    },
    {
      site: [121.6204, 29.883],
      size: 134,
      name: "覆盖物2",
    },
    {
      site: [121.63748, 29.8813],
      size: 444,
      name: "覆盖物3",
    },
  ];

  renderFeatureByData(olMap, circleList);
};

// 获取可视区域坐标参数
const getCurrentPositionParams = (olMap) => {
  let viewPosition = mapUtils.getCurrentViewPosition(olMap);
  // console.log("获取可视区域的左上角和右下角坐标", viewPosition)

  return {
    minLatitude: viewPosition.bottomRight[1],
    maxLatitude: viewPosition.topLeft[1],
    minLongitude: viewPosition.topLeft[0],
    maxLongitude: viewPosition.bottomRight[0],
    networkType: "all",
  };
};

// 获取可视区域数据
const getCurrentViewData = (olMap) => {
  let params = {
    ...getCurrentPositionParams(olMap),
    networkType: "all",
  };

  gisDataAsync(params, (gisDataList) => {
    const { cell4gList, cell5gList } = gisDataList;
    renderFeatureByData(olMap, cell4gList);
    renderFeatureByData(olMap, cell5gList);
  });

  // getCircleData(olMap)  // 设置圆数据(投诉)
};

// 地图事件
const mapEvent = (olMap) => {
  // 监听鼠标移动事件
  olMap.on("pointermove", (e) => {
    // 鼠标移动到feature区域时变为手形
    let pixel = olMap.getEventPixel(e.originalEvent);
    let hit = olMap.hasFeatureAtPixel(pixel);
    olMap.getTargetElement().style.cursor = hit ? "pointer" : "";

    currentLonlat.value = mapUtils.transformToLonlat(e.coordinate);
  });

  // 监听鼠标单击事件
  olMap.on("singleclick", (e) => {
    // console.log("点击地图", mapUtils.transformToLonlat(e.coordinate));

    // 点击地图隐藏气泡窗
    refPopupCommon.value.hidePopup();

    // 点击地图隐藏右键菜单
    mapUtils.resetContextMenu();

    // const pixelPoint = e.coordinate; // 屏幕坐标
    let pixel = olMap.getEventPixel(e.originalEvent);
    let featureList = olMap.getFeaturesAtPixel(pixel); // 点击时获取所有features

    // 如果feature数组存在(不为空)
    if (featureList) {
      // 点击单个feature
      if (featureList.length === 1) {
        // console.log('无重叠,单个feature', featureList)
        refPopupCommon.value.showPopup(); // 需要气泡时弹出

        // 屏幕坐标
        singleFeaturesClick(olMap, featureList[0], e.coordinate);
      }

      // 多个feature
      if (featureList.length > 1) {
        // console.log("有重叠,多个feature", featureList);

        const judgeShape = (shape) => {
          return (
            JSON.stringify(
              featureList.filter((item) => item.get("type") === shape)
            ) !== "[]"
          );
        };

        // 如果重叠区存在圆形
        if (judgeShape("Circle")) {
          setCircleDialogData();
        } else if (judgeShape("Polygon")) {
          let featureItem = featureList.filter(
            (item) => item.get("type") === "Polygon"
          );
          setPolygonDialogData(featureItem[0]);
        } else {
          // 点击扇形弹出气泡
          if (
            featureList[0].get("type") === "Curve" ||
            featureList[0].get("type") === "Marker"
          ) {
            refPopupCommon.value.showPopup(); // 需要气泡时弹出
            refPopupCommon.value.setFeaturesPopup(
              olMap,
              e.coordinate,
              featureList
            );
          }
        }
      }
    }
  });

  // 监听鼠标拖动地图事件
  olMap.on("moveend", (e) => {
    // console.log('拖拽移动触发事件', e)

    var view = myOlMap.getView();
    var zoom = view.getZoom();
    currentZoomLevel.value = zoom.toFixed(2);
    // console.log("当前缩放级别为：" + zoom);
  });
};

// 点击单个feature - map - click事件
const singleFeaturesClick = (olMap, featureItem, pixelPoint) => {
  // console.log("无重叠,单个feature", featureItem);

  let popupData = null;

  // 点击点标注
  if (featureItem && featureItem.get("type") === "Marker") {
    // console.log('Marker点标注', featureItem);

    popupData = featureItem.get("pointData");
    // console.log('获取点标注数据', popupData)

    refPopupCommon.value.setCommonPopup(olMap, pixelPoint, popupData);
  }

  // 点击扇形区域
  if (featureItem && featureItem.get("type") === "Curve") {
    // console.log('点击扇形区域', featureItem);

    popupData = featureItem.get("curveData");
    // console.log('获取扇形区数据', popupData)

    refPopupCommon.value.setCommonPopup(olMap, pixelPoint, popupData);
  }

  // 点击圆形区域
  if (featureItem && featureItem.get("type") === "Circle") {
    console.log("点击圆形区域", featureItem);

    setCircleDialogData();
  }

  // 点击多边形
  if (featureItem && featureItem.get("type") === "Polygon") {
    console.log("点击多边形", featureItem.get("polygonData"));

    setPolygonDialogData(featureItem);
  }
};

const setCircleDialogData = () => {
  refCircleDetailDialog.value.show();
};

const setPolygonDialogData = (featureItem) => {
  const { coords, lonlat } = featureItem.get("polygonData");
  // console.log(coords)

  mittBus.emit("setMyPolygonInfoDialog", lonlat);
};

/**
 * vue生命周期函数
 * 挂载后触发
 */
onMounted(() => {
  const olMap = mapUtils.initOlMap("olMap"); // 初始化地图

  mapInit(olMap); // 地图加载完初始化做的一些操作
  getMapInitInfo(olMap); // 地图加载完初始化后获取地图的一些信息
  setOlmap(olMap); // 设置地图
});
</script>

<style lang="scss">
$zoomMargin: 10em;

.ol_map_wrap {
  position: relative;
  width: 100%;
  height: 850px;
  min-width: 1250px;

  .ol_map {
    width: 100%;
    height: 100%;
    // overflow: hidden;

    .ol-viewport {
      overflow: initial !important;
    }

    // 控件相关
    .ol-overlaycontainer-stopevent {
      // 全屏
      .ol-full-screen {
        position: absolute;
        top: -34px;
        right: 108px;
      }

      // 缩放
      .ol-zoom,
      .ol-zoomslider {
        left: initial;
        right: 0.5em;
      }

      .ol-zoom {
        top: calc(0.5em + $zoomMargin);
      }

      .ol-zoomslider {
        top: calc(4.5em + $zoomMargin);
      }

      // 比例尺
      .ol-scale-line {
        position: absolute;
        bottom: 76px;
        background: initial;
      }

      /* // 鹰眼
      .ol-overviewmap {
        position: absolute;
        left: 0;
        bottom: 20px;
        z-index: 999999;

        .ol-overviewmap-map {
          width: 100px;
          height: 100px;
          z-index: 9999999;
        }
      } */
    }
  }
}

.menu_wrap {
  padding: 3px;
  // background: #fff;
  background: rgba(255, 255, 255, 0.8);
  border: solid 1px #777777;
  border-radius: 5px;

  ul {
    padding-bottom: 3px;

    li {
      padding: 5px 10px;
      font-size: 12px;
      color: #000;
      border-bottom: solid 1px #b3b3b3;
      border-radius: 3px 3px 0 0;
      cursor: pointer;
      transition: 0.3s linear;

      &:hover {
        color: #715f5f;
        background: rgba(128, 128, 128, 0.25);
        transition: 0.3s linear;
      }

      &:not(:last-child) {
        margin-bottom: 3px;
      }
    }
  }
}

.copyright_info {
  position: absolute;
  left: 0;
  bottom: 0;
  width: 100%;
  min-width: 800px;
  min-height: 20px;
  display: flex;
  justify-content: space-between;
  padding: 0 25px 0 12px;
  z-index: 1;
  background: #8a8888c4;

  p,
  dt,
  dd {
    height: 25px;
    line-height: 28px;
    font-size: 12px;
  }

  ul {
    li {
      display: inline-block;

      &:first-child {
        dd {
          min-width: 350px;
        }
      }

      dl {
        dt,
        dd {
          display: inline-block;
        }
      }
    }
  }
}
</style>
