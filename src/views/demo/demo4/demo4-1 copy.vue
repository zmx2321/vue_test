<template>
  <section id="olMap" class="ol_map"></section>
</template>

<script setup>
// vue core
import { onMounted } from 'vue';
// map core
/* import { Map, View, Feature, Overlay } from 'ol';
import { fromLonLat } from 'ol/proj';
import { ScaleLine, defaults as defaultControls, MousePosition } from 'ol/control'
import TileLayer from 'ol/layer/Tile';
import { Cluster, OSM, XYZ, Vector as VectorSource, DataTile } from 'ol/source';
import { Style, Icon } from 'ol/style' */

import 'ol/ol.css';
import { Map, View } from 'ol';
import TileLayer from 'ol/layer/Tile';
import { XYZ, TileImage } from 'ol/source';

// 天地图的瓦片URL模板
const TIANDITU_IMG_URL = 'http://t{0-7}.tianditu.gov.cn/vec_w/wmts?service=WMTS&request=GetTile&version=1.0.0&LAYER=vec&tileMatrixSet=w&TileMatrix={TileMatrix}&TileRow={TileRow}&TileCol={TileCol}&style=default&format=tiles';

// 创建天地图瓦片图层
const tdtyLayer = new TileLayer({
  source: new XYZ({
    url: TIANDITU_IMG_URL,
    wrapX: true,
    tileGrid: null,
  }),
});



onMounted(() => {
  // 创建地图实例
  const map = new Map({
    target: 'map', // 地图容器的id
    layers: [tdtyLayer],
    view: new View({
      center: [116.405285, 39.904989], // 地图中心点坐标
      zoom: 4, // 缩放级别
      projection: 'EPSG:4326', // 坐标系
    }),
  });
})

/* let olMap = null

const initMap = () => {
  olMap = new Map({
    target: 'olMap',
    view: new View({
      projection: 'EPSG:4326',  // 默认是3857坐标系
      center: fromLonLat([121.63, 29.88]),
      zoom: 16,
      maxZoom: 17,
      minZoom: 9
    }),
    controls: defaultControls({
      zoom: false, // 放大缩小
      rotate: false, //旋转
    }),
    layers: [
      new TileLayer({
        source: new XYZ({
          url: "http://t0.tianditu.com/DataServer?T=vec_w&x={x}&y={y}&l={z}&tk=02dd5ea16a6b869b3b37e12f269b1463",
          wrapX: false,
          crossOrigin: "anonymous",
        })
      }),
      new TileLayer({
        source: new XYZ({
          url: "http://t0.tianditu.com/DataServer?T=cva_w&x={x}&y={y}&l={z}&tk=02dd5ea16a6b869b3b37e12f269b1463"
        })
      })
    ]
  })
}

onMounted(() => {
  initMap()
}) */
</script>

<style lang="scss" scoped>
.ol_map {
  width: 100%;
  height: 400px;
  // background: #f00;
}
</style>