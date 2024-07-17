<template>
  <section id="olMap" class="ol_map"></section>
</template>

<script setup name="gis">
// vue - core
import { ref, reactive, onMounted } from 'vue';
// map - core
import { Map, View, Feature, Overlay } from 'ol';
import TileLayer from 'ol/layer/Tile';
import { Vector as VectorLayer, WebGLTile } from "ol/layer";
import { fromLonLat, transformExtent } from 'ol/proj';
import { Cluster, OSM, XYZ, Vector as VectorSource, DataTile } from 'ol/source';
import { Style, Icon } from 'ol/style'
import { Point } from 'ol/geom'
import { ScaleLine, defaults as defaultControls, MousePosition } from 'ol/control'
import { createStringXY } from 'ol/coordinate'
import macroLogo from '@/assets/images/macro-station.svg'
import micrositeLogo from '@/assets/images/microsite.svg'
import indoorSiteLogo from '@/assets/images/indoorSite.svg'
import WKT from 'ol/format/WKT.js';
// import { get PhysicalSiteInfo, getGridLisInfo } from '@/api/gis/gis.js'
import { Search, } from '@element-plus/icons-vue'

const radio1 = ref('tianditu')
const radio2 = ref('physicalSite')
const longAndLati = ref({})
const currentZoomLevel = ref(0)
const heading = ref(0)
var mapObj = undefined

// 搜索并定位
const searchFormInfo1 = [
  { desc: '基站编号', code: 'physicalSiteId', value: '1' },
  { desc: '基站名称', code: 'siteName', value: '2' },
];
const searchFormInfo2 = [
  { desc: '网格编号', code: 'grid_id', value: '3' },
  { desc: '网格名称', code: 'grid_name', value: '4' },
];
const typeValue = ref('');
const typeSelect = ref('1');
const typeInputkey = ref('');
const physicalSiteData = ref([]);
const gridData = ref();
const searchInput = ref("");
const totalData = ref([]);
let timeOut = reactive();
const targetLongititude = ref()
const targetLatitude = ref()

// var amap = new TileLayer({
//     name: 'base-layer',
//     source: new XYZ({
//         url: "http://webrd02.is.autonavi.com/appmaptile?lang=zh_cn&size=1&scale=1&style=8&x={x}&y={y}&z={z}"
//     })
// })

// 天地图底图
var tianMapLayer = new TileLayer({
  source: new XYZ({
    url: "http://t0.tianditu.com/DataServer?T=vec_w&x={x}&y={y}&l={z}&tk=02dd5ea16a6b869b3b37e12f269b1463",
    wrapX: false,
    crossOrigin: "anonymous",
  })
});

// 天地图注记
var tianMapLayer2 = new TileLayer({
  source: new XYZ({
    url: "http://t0.tianditu.com/DataServer?T=cva_w&x={x}&y={y}&l={z}&tk=02dd5ea16a6b869b3b37e12f269b1463"
  })
});
const map = ref()
onMounted(async () => {
  map.value = new Map({
    target: 'olMap',
    view: new View({
      center: fromLonLat([121.63, 29.88]),
      zoom: 16,
      maxZoom: 17,
      minZoom: 9
    }),
    //加载控件到地图容器中
    controls: defaultControls({
      zoom: false, // 放大缩小
      rotate: false, //旋转
    })
  });

  //加载高德与天地图
  // map.addLayer(amap)
  map.value.addLayer(tianMapLayer)
  map.value.addLayer(tianMapLayer2)

  var layers = map.value.getLayers()
  mapObj = map.value


  //获取鼠标位置经纬度
  var mousePositionControl = new MousePosition({
    coordinateFormat: function (e) { // 这里格式化成 X: **  Y: **
      let stringifyFunc = createStringXY(4)
      let str = stringifyFunc(e)
      var view = map.value.getView();
      var zoom = view.getZoom();
      return '经度: ' + str.split(',')[0] + '&nbsp;' + ' 纬度: ' + str.split(',')[1]
    },
    projection: 'EPSG:4326', // 和地图坐标系保持一致
    className: 'custom-mouse-position', // css类名
    target: document.getElementById('info') // 显示位置鼠标坐标位置DOM

  })
  // 添加控制控件到地图上即可
  map.value.addControl(mousePositionControl)

  //加载物理站
  // loadPhysicalSite(map.value);

  //添加overlayer
  map.value.on('pointermove', function (event) {
    var feature = map.value.forEachFeatureAtPixel(event.pixel, function (feature) {
      return feature;
    });
    if (feature) {

      var container = document.getElementById("popup");
      var closer = document.getElementById("popup-closer");
      var content = document.getElementById("popup-content");


      // 创建一个弹窗 Overlay 对象
      this.overlay = new Overlay({
        element: container, //绑定 Overlay 对象和 DOM 对象的
        autoPan: false, // 定义弹出窗口在边缘点击时候可能不完整 设置自动平移效果
        autoPanAnimation: {
          duration: 250 //自动平移效果的动画时间 9毫秒）
        }
      });
      map.value.addOverlay(this.overlay);

      let _that = this;
      closer.onclick = function () {
        _that.overlay.setPosition(undefined);
        closer.blur();
        return false;
      };

      var type = feature.get("type");
      if (type == 'physicalSite') {
        var city = feature.get("city");
        var county = feature.get("county");
        var siteName = feature.get("siteName");
        var physicalSiteId = feature.get("physicalSiteId");
        var siteType = feature.get("siteType");
        var longitude = feature.get("longitude");
        var latitude = feature.get("latitude");


        content.innerHTML = `
              <p style='font-size:12px;margin:2px;font-weight:bolder'>${siteName}</p><hr>
              <p style='font-size:14px'>地市：${city}</p>
              <p style='font-size:14px'>区县：${county}</p>
              <p style='font-size:14px'>物理站编号：${physicalSiteId}</p>
              <p style='font-size:14px'>基站类型：${siteType}</p>
              <p style='font-size:14px'>经度：${longitude}</p>
              <p style='font-size:14px'>纬度：${latitude}</p>
              `;
        this.overlay.setPosition(event.coordinate);
      } else if (type == 'grid') {
        var name = feature.get("name");
        var gridId = feature.get("grid_id");
        content.innerHTML = `
              <p style='font-size:12px;margin:2px;font-weight:bolder'>${name}</p><hr>
              <p style='font-size:14px'>网格ID${gridId}</p>
              `
        this.overlay.setPosition(event.coordinate);
      }
    }

  })

  //监听地图放大缩小
  map.value.on('moveend', function (event) {
    var view = map.value.getView();
    var zoom = view.getZoom();
    currentZoomLevel.value = zoom.toFixed(2)
    console.log("当前缩放级别为：" + zoom);
  });

  //加载网格信息
  // await loadGridList(map.value);
})


//切换矢量地图
// function changeVectorMap(value) {
//     if (value == 'tianditu') {
//         amap.setVisible(false);
//         tianMapLayer.setVisible(true);
//         tianMapLayer2.setVisible(true);
//     } else if (value == 'amap') {
//         amap.setVisible(true);
//         tianMapLayer.setVisible(false);
//         tianMapLayer2.setVisible(false);
//     }
// }

//加载物理站
/* function loadPhysicalSite(map) {
  getPhysicalSiteInfo().then(res => {
    var arr = [];
    var response = res.data;
    physicalSiteData.value = res.data
    for (var i = 0; i < response.length; i++) {
      let point = response[i];
      var coordinates = fromLonLat([point.longitude, point.latitude]);
      var logo = "";
      if (point.siteType == "宏站") {
        logo = macroLogo
      } else if (point.siteType == "微站") {
        logo = micrositeLogo
      } else {
        logo = indoorSiteLogo
      }
      var iconStyle = new Style({
        image: new Icon({
          anchor: [0.5, 1],
          src: logo,
        }),
      });
      var pointFeature = new Feature(new Point(coordinates));
      pointFeature.setStyle(iconStyle);
      pointFeature.set("type", "physicalSite")
      pointFeature.set("city", point.city)
      pointFeature.set("county", point.county)
      pointFeature.set("areaType", point.areaType)
      pointFeature.set("physicalSiteId", point.physicalSiteId)
      pointFeature.set("siteName", point.siteName)
      pointFeature.set("siteType", point.siteType)
      pointFeature.set("siteInDoorType", point.siteInDoorType)
      pointFeature.set("coverageScene", point.coverageScene)
      pointFeature.set("longitude", point.longitude)
      pointFeature.set("latitude", point.latitude)
      arr.push(pointFeature)
    }

    var vectorLayer = new VectorLayer({
      id: "physicalSiteLayer",
      minZoom: 14.7,
      source: new VectorSource({
        features: arr,
      }),
    });

    map.addLayer(vectorLayer);
  })
} */


//加载网格信息
/* function loadGridList(map) {
  // 添加要素到矢量图层
  getGridLisInfo().then(res => {
    gridData.value = res.data
    var arr = []
    for (var i = 0; i < res.data.length; i++) {
      var grid = res.data[i]
      var wkt = grid.polygon
      var format = new WKT();

      var feature = format.readFeature(wkt, {
        dataProjection: 'EPSG:4326',
        featureProjection: 'EPSG:3857'
      });
      feature.set("type", "grid")
      feature.set("grid_id", grid.grid_id)
      feature.set("name", grid.name)
      arr.push(feature)
    }

    // 添加要素到矢量图层
    var vectorLayer = new VectorLayer({
      id: "girdLayer",
      source: new VectorSource({
        features: arr,
      }),
    });
    map.addLayer(vectorLayer);
    vectorLayer.setVisible(false);
  })
} */

//切换默认图层
const nowIsphysicalSiteLayer = ref(true)
function changeDefalutMap(value) {
  var layers = mapObj.getLayers().getArray();
  console.log("value==" + value);
  searchInput.value = "";
  typeSelect.value = "";
  if (value == 'physicalSite') {
    nowIsphysicalSiteLayer.value = true;
    for (var i = 0; i < layers.length; i++) {
      if (layers[i] instanceof VectorLayer) {
        if (layers[i].get("id") == 'physicalSiteLayer') {
          layers[i].setVisible(true);
        } else {
          layers[i].setVisible(false);
        }
      }
    }
  } else {
    nowIsphysicalSiteLayer.value = false;
    for (var i = 0; i < layers.length; i++) {
      if (layers[i] instanceof VectorLayer) {
        if (layers[i].get("id") == 'girdLayer') {

          layers[i].setVisible(true);
        } else {
          layers[i].setVisible(false);
        }
      }
    }
  }
}


// 修改搜索类型清空搜索框
function selectChange() {
  searchInput.value = "";
}

// 通过value获取对应选择的枚举值
function fnGetDescByValue(inputValue, data, inputKey = 'value', outputKey = 'desc') {
  let outputValue = ''
  if (data && data.length > 0) {
    for (let i = 0; i < data.length; i++) {
      const item = data[i]
      const itemValue = item[inputKey]
      if (inputValue + '' === itemValue + '') {
        outputValue = item[outputKey]
        break
      }
    }
  }
  return outputValue
}

// 根据输入显示输入建议
function querySearch(querySearch, cb) {
  // 判断是目前是基站图层还是网格图层
  if (nowIsphysicalSiteLayer.value === true) {
    typeInputkey.value = fnGetDescByValue(typeSelect.value, searchFormInfo1, 'value', 'code');
    totalData.value = Object.values(JSON.parse(JSON.stringify(physicalSiteData.value)));
  } else {
    typeInputkey.value = fnGetDescByValue(typeSelect.value, searchFormInfo2, 'value', 'code');
    totalData.value = Object.values(JSON.parse(JSON.stringify(gridData.value)));
  }
  let results = [];
  if (querySearch) {
    const findout = totalData.value.filter((x) => nameFilter(x, querySearch));
    if (typeInputkey.value === 'physicalSiteId') {
      results = findout.map(x => ({ ...x, value: x.physicalSiteId }))
    } else if (typeInputkey.value === 'siteName') {
      results = findout.map(x => ({ ...x, value: x.siteName }))
    } else if (typeInputkey.value === 'grid_id') {
      results = findout.map(x => ({ ...x, value: x.grid_id }))
    } else if (typeInputkey.value === 'grid_name') {
      results = findout.map(x => ({ ...x, value: x.name }))
    }
  } else {
    if (typeInputkey.value === 'physicalSiteId') {
      results = totalData.value.map(x => ({ ...x, value: x.physicalSiteId }))
    } else if (typeInputkey.value === 'siteName') {
      results = totalData.value.map(x => ({ ...x, value: x.siteName }))
    } else if (typeInputkey.value === 'grid_id') {
      results = totalData.value.map(x => ({ ...x, value: x.grid_id }))
    } else if (typeInputkey.value === 'grid_name') {
      results = totalData.value.map(x => ({ ...x, value: x.name }))
    }
  }
  console.log(results, '结果')
  clearTimeout(timeOut)
  timeOut = setTimeout(() => {
    cb(results)
  }, 1000);
}

const nameFilter = (item, querySearch) => {
  if (typeInputkey.value === 'physicalSiteId') {
    return item.physicalSiteId.toLowerCase().match(querySearch.toLowerCase()) ? true : false
  } else if (typeInputkey.value === 'siteName') {
    return item.siteName.toLowerCase().match(querySearch.toLowerCase()) ? true : false
  } else if (typeInputkey.value === 'grid_id') {
    return item.grid_id.toString().toLowerCase().match(querySearch.toLowerCase()) ? true : false
  } else if (typeInputkey.value === 'grid_name') {
    return item.name.toLowerCase().match(querySearch.toLowerCase()) ? true : false
  }
}

// 选择目标后跳转到其经纬度
function handleSelect(item) {
  if (typeInputkey.value === 'physicalSiteId' || typeInputkey.value === 'siteName') {
    targetLongititude.value = item.longitude;
    targetLatitude.value = item.latitude;
  } else if (typeInputkey.value === 'grid_id' || typeInputkey.value === 'grid_name') {
    console.log(item.center);
    let pointString = item.center;
    let coordString = pointString.slice(6, -1);
    let [longitude, latitude] = coordString.split(' ');
    targetLongititude.value = longitude;
    targetLatitude.value = latitude;
  }
  map.value.getView().animate({
    center: fromLonLat([targetLongititude.value, targetLatitude.value]),
    zoom: 17,
    rotation: undefined,
    duation: 1000
  });
}


</script>

<style lang="scss" scoped>
.ol_map {
  width: 100%;
  height: 580px;
}
</style>