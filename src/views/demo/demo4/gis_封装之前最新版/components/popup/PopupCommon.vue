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
import { ref } from "vue";
// map data
import * as popupInner from "./popupInner";
// map core
import * as mapUtils from "@/utils/mapUtils.js";
// 组件传参
import mittBus from "@/utils/mittBus"; // mitt
// 组件
import PopupDetailDialog from "./PopupDetailDialog.vue";
// api相关
import { apiCommon } from "@/utils/index.js";
import { queryCellByCgi } from "@/api/gis/gis";

// 如果popup不设置overflow的话,会在左下角显示,这里在一开始进行隐藏
let isShowPopup = ref(false);
let currentPopupObj = {};
let refPopupDetailDialog = ref(null);
let featuresPopupDom = {};

/**
 * 接收其他组件派发的方法
 */
// 显示气泡弹出窗
mittBus.on("showPopupDialog", (popupData) => {
  showPopupDialog(popupData); // 显示气泡弹出窗
});

// 显示气泡弹出窗
const showPopupDialog = (popupData) => {
  refPopupDetailDialog.value.show(popupData);
};

const showPopup = () => {
  isShowPopup.value = true;
};

const hidePopup = () => {
  isShowPopup.value = false;
};

// 通用信息展示弹窗
const setCommonPopup = (olMap, pixelPoint, popupData) => {
  // console.log("点击标注弹出气泡", olMap, popupData);

  // 经纬度
  let coordinate = mapUtils.transformToLonlat(pixelPoint);
  // 点击尺 （这里是尺(米)，并不是经纬度）;
  let hdms = mapUtils.getHdms(pixelPoint); // 转换为经纬度显示

  const popupObj = {
    name: "通用信息展示弹窗",
    hdms,
    coordinate,
    popupData, // 气泡窗业务数据
  };
  currentPopupObj = popupObj;

  switch (currentPopupObj.popupData.networkType) {
    case "4g":
      currentPopupObj.popupData.newCellName =
        currentPopupObj.popupData.cellName;
      break;
    case "5g":
      currentPopupObj.popupData.newCellName =
        currentPopupObj.popupData.nrCellName;
      break;
  }

  mapUtils.setPopup(
    olMap,
    pixelPoint,
    popupInner.commonPopupInner(popupObj),
    (event) => {
      popupClickEvent(event);
    }
  );
};

// 点击多个feature弹出气泡
const setFeaturesPopup = (olMap, pixelPoint, popupData) => {
  //   console.log("点击多个feature弹出气泡", olMap);

  // 经纬度
  let coordinate = mapUtils.transformToLonlat(pixelPoint);
  // 点击尺 （这里是尺(米)，并不是经纬度）;
  let hdms = mapUtils.getHdms(pixelPoint); // 转换为经纬度显示

  let popupTypeArr = [];
  popupData.forEach((item) => {
    switch (item.get("type")) {
      case "Marker":
        popupTypeArr.push("标注点");
        break;
      case "Curve":
        popupTypeArr.push("扇区");
        break;
    }
  });

  const popupObj = {
    name: popupData.length + "个重叠要素",
    type: Array.from(new Set(popupTypeArr)).join(","), // 去重转字符串以逗号隔开
    hdms, // 经纬度
    coordinate, // 坐标
    popupData, // 窗口业务数据 - 这里指所有的feature
  };
  // console.log(popupObj);
  //   console.log(hdms);
  currentPopupObj = popupObj;
  // console.log(currentPopupObj);

  mapUtils.setPopup(
    olMap,
    // e.coordinate,
    pixelPoint,
    popupInner.featuresPopupInner(popupObj, (currentDataList) => {
      // console.log("输出业务数据", currentDataList);

      currentPopupObj.currentDataList = currentDataList;
    }),
    (event) => {
      popupClickEvent(event);
    }
  );

  let content = document.getElementById("popup-content");
  featuresPopupDom = content.innerHTML;
};

// 气泡弹出窗点击事件
const popupClickEvent = async (e) => {
  // console.log("气泡弹出窗点击事件", e)

  const { target } = e; // 事件对象
  // console.log("点击气泡窗返回气泡窗中的dom对象", target);

  // 当前dom绑定的函数
  let dataFunction = target.getAttribute("data-function");

  // 点击气泡窗获取更多
  if (dataFunction === "getMore") {
    getMore();
  }

  // 点击cgi显示具体气泡信息
  if (dataFunction === "getSingleByFeatures") {
    // console.log(target.getAttribute("data-cgi"));

    getSingleByFeatures(target.getAttribute("data-cgi"));
  }

  // 点击popupDom返回
  if (dataFunction === "popupBack") {
    popupBack();
  }
};

// 点击气泡窗获取更多
const getMore = async () => {
  // 或者走接口,根据cgi获取详情
  const currentPopupAsyncObj = await apiCommon(queryCellByCgi, {
    cgi: currentPopupObj.popupData.cgi,
  });

  switch (currentPopupAsyncObj.data.networkType) {
    case "4g":
      currentPopupObj.popupData = currentPopupAsyncObj.data.cell4g;
      currentPopupObj.popupData.networkType = "4g";
      currentPopupObj.popupData.newCellName =
        currentPopupObj.popupData.cellName;
      break;
    case "5g":
      currentPopupObj.popupData = currentPopupAsyncObj.data.cell5g;
      currentPopupObj.popupData.networkType = "5g";
      currentPopupObj.popupData.newCellName =
        currentPopupObj.popupData.nrCellName;
      break;
  }

  // console.log(currentPopupObj.popupData)
  showPopupDialog(currentPopupObj.popupData); // 显示气泡弹出窗
};

// 点击cgi显示具体气泡信息
const getSingleByFeatures = (cgi) => {
  // console.log("点击cgi显示具体气泡信息", currentPopupObj);

  currentPopupObj.popupData = currentPopupObj.currentDataList.filter(
    (item) => item.cgi === cgi
  )[0];
  // console.log(currentPopupObj.popupData)

  let content = document.getElementById("popup-content");

  content.innerHTML = popupInner.commonPopupInner(currentPopupObj);
  const backDom = document.createElement("b");
  backDom.setAttribute("data-function", "popupBack");
  backDom.setAttribute("title", "返回");
  // backDom.innerHTML = 'back'
  backDom.innerHTML = "";
  content.appendChild(backDom);
};

// 点击popupDom返回
const popupBack = () => {
  let content = document.getElementById("popup-content");
  content.innerHTML = featuresPopupDom;
};

/**
 * 暴露方法 - 供父组件执行
 */
defineExpose({
  showPopup,
  hidePopup,
  setCommonPopup,
  setFeaturesPopup,
});
</script>

<style lang="scss" scoped>
// $popupBg: rgba(111, 168, 247, 0.8);
$popupBg: rgba(255, 255, 255, 0.8);

.ol-popup {
  position: absolute;
  left: -50px;
  bottom: 12px;
  padding: 15px;
  background: $popupBg;
  min-width: 300px;
  height: 242px;
  min-height: 220px;
  max-height: 260px;

  .popup_wrap {
    margin-top: 10px;
    width: 100%;
    height: 208px;
    min-height: 190px;
    max-height: 230px;
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
    top: 3px;
    right: 6px;
    width: 10px;
    height: 10px;
    cursor: pointer;

    &::after {
      content: "✖";
    }
  }

  /**
     * 此处开始气泡窗内容样式
     */
  :deep .popup-content {
    margin-right: 8px;
    margin-top: 5px;

    p,
    span,
    h3,
    li,
    dt,
    dd {
      font-size: 12px;
      color: #514b4b;
      // cursor: pointer;
    }

    // 重叠feature气泡窗样式
    ul.features_top {
      li {
        margin-bottom: 5px;
        // color: #494949;
        color: #222222;
      }
    }

    .feature_item {
      margin-bottom: 10px;
      padding: 6px;
      transition: 0.2s linear;
      border-bottom: dashed 1px #707070;
      border-radius: 3px 3px 0 0;
      cursor: pointer;

      &:hover {
        background: rgb(193 231 254 / 80%);
        transition: 0.3s linear;
      }

      span {
        display: block;
        margin-bottom: 3px;
      }

      dl {
        margin-bottom: 2px;
        dt,
        dd {
          display: inline-block;
        }
      }
    }

    // 通用气泡窗样式
    .common_popup_item {
      position: relative;

      // background: #f00;
      h3 {
        font-size: 15px;
        margin-bottom: 10px;
        color: #494949;
      }

      ul {
        li {
          margin-bottom: 6px;

          dl {
            dt,
            dd {
              display: inline-block;
            }

            dt {
              font-weight: bold;
              margin-right: 5px;
              font-size: 13px;
            }
          }
        }
      }

      span {
        position: absolute;
        right: -5px;
        bottom: -33px;
        padding: 6px 10px;
        background: #70b5fa;
        color: #fff;
        border-radius: 6px;
        transition: 0.2s linear;
        cursor: pointer;

        &:hover {
          background: #2c94fe;
          transition: 0.3s linear;
        }
      }

      & + b {
        position: absolute;
        top: 4px;
        left: 8px;
        width: 17px;
        height: 20px;
        background: url("../../icon/back.svg") center center no-repeat;
        background-size: 100% 100%;
        cursor: pointer;
      }
    }
  }
}
</style>
