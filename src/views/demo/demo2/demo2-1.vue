<template>
  <section class="demo_cont">
    <!-- <div id='map' style='width: 400px; height: 300px;'></div> -->
    <div ref="mapEl" class="map_wrap" id="glMap"></div>
  </section>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import maplibregl from 'maplibre-gl'
import zhejiangGeo from './mapData/geoData/zhejiang.json' // 普通浙江

const map = ref({})

// const geoData = ref({})

const SOURCES = {
  WMS: 'WMS',
  CITIES: 'CITIES'
}
const LAYERS = {
  STATE_FILL: 'city-fills'
}

onMounted(() => {
  map.value = new maplibregl.Map({
    container: 'glMap', // 容器的id
    style: {
      version: 8,
      sources: {
        cico: {
          type: 'vector',
          url: 'http://decision.cncico.com/gis/dist/styles/tiles/cico-map.json'
        },
        tianditu: {
          type: 'raster',
          tiles: [
            'http://t0.tianditu.gov.cn/img_w/wmts?SERVICE=WMTS&REQUEST=GetTile&VERSION=1.0.0&LAYER=img&STYLE=default&TILEMATRIXSET=w&FORMAT=tiles&TILEMATRIX={z}&TILEROW={y}&TILECOL={x}&tk=3c6db3961ea04621c421e49227049f7d'
          ],
          tileSize: 256
        },
        // 配置1内容，传入geojson
        [SOURCES.CITIES]: {
          type: 'geojson',
          data: zhejiangGeo,
          generateId: true
        }
      },
      glyphs: 'http://decision.cncico.com/gis/dist/fonts/{fontstack}/{range}.pbf',
      sprite: 'http://decision.cncico.com/gis/dist/sprite/sprite',
      layers: [
        {
          id: 'background',
          type: 'background',
          paint: {
            'background-color': '#061329'
          }
        },
        {
          id: 'land',
          type: 'fill',
          source: 'cico',
          'source-layer': '1562233264056352769',
          paint: {
            'fill-color': {
              stops: [
                [6, '#14263e'],
                [10, '#14263e'],
                [17, '#2b3c51'],
                [18, '#2b3c51']
              ]
            },
            'fill-outline-color': '#223557'
          }
        },
        {
          id: 'landuse_forestland',
          type: 'fill',
          source: 'cico',
          'source-layer': '1561885517834928130',
          minzoom: 4,
          paint: {
            'fill-color': 'rgba(19, 47, 51, 1)',
            'fill-opacity': {
              base: 1,
              stops: [
                [4, 1],
                [14, 0]
              ]
            }
          },
          filter: ['==', 'fclass', 'forest']
        },
        {
          id: 'landcover_wood',
          type: 'fill',
          source: 'cico',
          'source-layer': '1561885517834928130',
          minzoom: 4,
          paint: {
            'fill-color': 'rgba(22, 56, 56, 1)',
            'fill-opacity': 0.6,
            'fill-antialias': false
          },
          metadata: {},
          filter: ['in', 'fclass', 'nature_reserve', 'park']
        },
        {
          id: 'landcover_grass',
          type: 'fill',
          source: 'cico',
          'source-layer': '1561885517834928130',
          minzoom: 4,
          paint: {
            'fill-color': 'rgba(19, 51, 46, 1)',
            'fill-opacity': 0.5,
            'fill-antialias': false
          },
          metadata: {},
          filter: ['in', 'fclass', 'scrub', 'grass']
        },
        {
          id: 'landuse_residential',
          type: 'fill',
          source: 'cico',
          'source-layer': '1561885517834928130',
          maxzoom: 24,
          minzoom: 9,
          filter: ['in', 'fclass', 'residential', 'suburbs', 'neighbourhood'],
          paint: {
            'fill-color': {
              base: 1,
              stops: [
                [9, 'rgba(29, 50, 68, 0.80)'],
                [12, 'rgba(29, 50, 68, 0.55)'],
                [16, 'rgba(29, 50, 68, 0.35)']
              ]
            }
          }
        },
        {
          id: 'landuse_cemetery',
          type: 'fill',
          source: 'cico',
          'source-layer': '1561885517834928130',
          minzoom: 9,
          filter: ['==', 'fclass', 'cemetery'],
          paint: {
            'fill-color': '#1D3244'
          }
        },
        {
          id: 'water',
          type: 'fill',
          source: 'cico',
          'source-layer': '1561883584248201217',
          minzoom: 4,
          paint: {
            'fill-color': 'rgba(4, 19, 38, 1)'
          },
          metadata: {},
          filter: ['in', 'fclass', 'water', 'riverbank']
        },
        {
          id: 'satellite',
          type: 'raster',
          source: 'tianditu',
          layout: {
            visibility: 'none'
          },
          paint: {}
        },
        {
          id: 'province_outline',
          type: 'line',
          source: 'cico',
          'source-layer': '1564080509093462018',
          minzoom: 3,
          layout: {
            visibility: 'visible'
          },
          paint: {
            'line-color': '#223557',
            'line-width': {
              stops: [
                [3, 1],
                [14, 5]
              ]
            },
            'line-opacity': 1
          }
        },
        {
          id: 'tunnel_secondary_tertiary_casing',
          type: 'line',
          source: 'cico',
          'source-layer': '1562240792513265666',
          minzoom: 8,
          layout: {
            'line-join': 'round',
            visibility: 'visible'
          },
          paint: {
            'line-color': '#2b3c51',
            'line-width': {
              base: 1.2,
              stops: [
                [8, 1.5],
                [20, 17]
              ]
            },
            'line-opacity': 1,
            'line-dasharray': [0.5, 0.25]
          },
          metadata: {},
          filter: ['all', ['==', 'bridge', 'F'], ['==', 'tunnel', 'T'], ['in', 'fclass', 'secondary', 'secondary_link', 'tertiary', 'tertiary_link']]
        },
        {
          id: 'tunnel_trunk_primary_casing',
          type: 'line',
          source: 'cico',
          'source-layer': '1562240792513265666',
          minzoom: 7,
          layout: {
            'line-join': 'round',
            visibility: 'visible'
          },
          paint: {
            'line-color': '#445263',
            'line-opacity': ['interpolate', ['linear'], ['zoom'], 5, 0.1, 15, 1],
            'line-width': {
              base: 1.2,
              stops: [
                [5, 0.4],
                [6, 0.7],
                [7, 1.75],
                [20, 22]
              ]
            },
            'line-dasharray': [0.5, 0.25]
          },
          metadata: {},
          filter: ['all', ['==', 'bridge', 'F'], ['==', 'tunnel', 'T'], ['in', 'fclass', 'primary', 'trunk']]
        },
        {
          id: 'tunnel_motorway_link_casing',
          type: 'line',
          source: 'cico',
          'source-layer': '1562240792513265666',
          minzoom: 5,
          layout: {
            'line-join': 'round',
            visibility: 'visible'
          },
          paint: {
            'line-color': '#445263',
            'line-width': {
              base: 1.2,
              stops: [
                [12, 1],
                [13, 3],
                [14, 4],
                [20, 15]
              ]
            },
            'line-opacity': 1,
            'line-dasharray': [0.5, 0.25]
          },
          metadata: {},
          filter: ['all', ['==', 'fclass', 'motorway_link'], ['==', 'bridge', 'F'], ['==', 'tunnel', 'T']]
        },
        {
          id: 'tunnel_motorway_casing',
          type: 'line',
          source: 'cico',
          'source-layer': '1562240792513265666',
          minzoom: 5,
          layout: {
            'line-join': 'round',
            visibility: 'visible'
          },
          paint: {
            'line-color': '#445263',
            'line-width': {
              base: 1.2,
              stops: [
                [5, 0.4],
                [6, 0.7],
                [7, 1.75],
                [20, 22]
              ]
            },
            'line-dasharray': [0.5, 0.25]
          },
          metadata: {},
          filter: ['all', ['==', 'fclass', 'motorway'], ['==', 'bridge', 'F'], ['==', 'tunnel', 'T']]
        },
        {
          id: 'tunnel_motorway_link',
          type: 'line',
          source: 'cico',
          'source-layer': '1562240792513265666',
          minzoom: 5,
          layout: {
            'line-join': 'round',
            visibility: 'visible'
          },
          paint: {
            'line-color': '#2e5e8d',
            'line-width': {
              base: 1.2,
              stops: [
                [12.5, 0],
                [13, 1.5],
                [14, 2.5],
                [20, 11.5]
              ]
            }
          },
          metadata: {},
          filter: ['all', ['==', 'fclass', 'motorway_link'], ['==', 'bridge', 'F'], ['==', 'tunnel', 'T']]
        },
        {
          id: 'tunnel_secondary_tertiary',
          type: 'line',
          source: 'cico',
          'source-layer': '1562240792513265666',
          minzoom: 8,
          layout: {
            'line-join': 'round',
            visibility: 'visible'
          },
          paint: {
            'line-color': '#000000',
            'line-width': {
              base: 1.2,
              stops: [
                [6.5, 0],
                [8, 0.5],
                [20, 13]
              ]
            }
          },
          metadata: {},
          filter: ['all', ['==', 'tunnel', 'T'], ['==', 'bridge', 'F'], ['in', 'fclass', 'secondary', 'secondary_link', 'tertiary', 'tertiary_link']]
        },
        {
          id: 'tunnel_trunk_primary',
          type: 'line',
          source: 'cico',
          'source-layer': '1562240792513265666',
          minzoom: 7,
          layout: {
            'line-join': 'round',
            visibility: 'visible'
          },
          paint: {
            'line-color': '#475a74',
            'line-width': {
              base: 1.2,
              stops: [
                [5, 0],
                [7, 1],
                [20, 18]
              ]
            }
          },
          metadata: {},
          filter: ['all', ['in', 'fclass', 'primary', 'trunk'], ['==', 'bridge', 'F'], ['==', 'tunnel', 'T']]
        },
        {
          id: 'tunnel_motorway',
          type: 'line',
          source: 'cico',
          'source-layer': '1562240792513265666',
          minzoom: 5,
          layout: {
            'line-join': 'round',
            visibility: 'visible'
          },
          paint: {
            'line-color': '#3a75b0',
            'line-width': {
              base: 1.2,
              stops: [
                [5, 0],
                [7, 1],
                [20, 18]
              ]
            }
          },
          metadata: {},
          filter: ['all', ['==', 'fclass', 'motorway'], ['==', 'bridge', 'F'], ['==', 'tunnel', 'T']]
        },
        {
          id: 'road_trunk_primary_link_casing',
          type: 'line',
          source: 'cico',
          'source-layer': '1562240792513265666',
          minzoom: 7,
          layout: {
            'line-cap': 'butt',
            'line-join': 'round',
            visibility: 'visible'
          },
          paint: {
            'line-color': '#445263',
            'line-opacity': ['interpolate', ['linear'], ['zoom'], 5, 0.1, 15, 1],
            'line-width': {
              base: 1.2,
              stops: [
                [5, 0],
                [7, 0.7],
                [20, 14]
              ]
            }
          },
          metadata: {},
          filter: ['all', ['==', 'tunnel', 'F'], ['==', 'bridge', 'F'], ['in', 'fclass', 'primary_link', 'trunk_link']]
        },
        {
          id: 'road_motorway_link_casing',
          type: 'line',
          source: 'cico',
          'source-layer': '1562240792513265666',
          minzoom: 10,
          layout: {
            'line-cap': 'butt',
            'line-join': 'round',
            visibility: 'visible'
          },
          paint: {
            'line-color': '#445263',
            'line-width': {
              base: 1.2,
              stops: [
                [9.9, 0],
                [10, 1.4],
                [14, 8],
                [20, 12]
              ]
            },
            'line-opacity': 1
          },
          metadata: {},
          filter: ['all', ['==', 'tunnel', 'F'], ['==', 'bridge', 'F'], ['==', 'fclass', 'motorway_link']]
        },
        {
          id: 'road_secondary_tertiary_casing',
          type: 'line',
          source: 'cico',
          'source-layer': '1562240792513265666',
          minzoom: 8,
          layout: {
            'line-cap': 'round',
            'line-join': 'round',
            visibility: 'visible'
          },
          paint: {
            'line-color': '#2b3c51',
            'line-width': {
              base: 1.2,
              stops: [
                [8, 1.5],
                [20, 17]
              ]
            },
            'line-opacity': 1
          },
          metadata: {},
          filter: ['all', ['==', 'tunnel', 'F'], ['==', 'bridge', 'F'], ['in', 'fclass', 'secondary', 'secondary_link', 'tertiary', 'tertiary_link']]
        },
        {
          id: 'road_trunk_primary_casing',
          type: 'line',
          source: 'cico',
          'source-layer': '1562240792513265666',
          minzoom: 7,
          layout: {
            'line-cap': 'butt',
            'line-join': 'round',
            visibility: 'visible'
          },
          paint: {
            'line-color': '#445263',
            'line-opacity': ['interpolate', ['linear'], ['zoom'], 5, 0.1, 15, 1],
            'line-width': {
              base: 1.2,
              stops: [
                [5, 0.4],
                [6, 0.7],
                [7, 1.75],
                [20, 22]
              ]
            }
          },
          metadata: {},
          filter: ['all', ['==', 'tunnel', 'F'], ['==', 'bridge', 'F'], ['in', 'fclass', 'primary', 'trunk']]
        },
        {
          id: 'road_motorway_casing',
          type: 'line',
          source: 'cico',
          'source-layer': '1562240792513265666',
          minzoom: 5,
          layout: {
            'line-cap': 'butt',
            'line-join': 'round',
            visibility: 'visible'
          },
          paint: {
            'line-color': '#445263',
            'line-width': {
              base: 1.2,
              stops: [
                [5, 0.4],
                [6, 0.7],
                [7, 1.75],
                [20, 22]
              ]
            }
          },
          metadata: {},
          filter: ['all', ['==', 'tunnel', 'F'], ['==', 'bridge', 'F'], ['==', 'fclass', 'motorway']]
        },
        {
          id: 'road_trunk_primary_link',
          type: 'line',
          source: 'cico',
          'source-layer': '1562240792513265666',
          minzoom: 7,
          layout: {
            'line-cap': 'round',
            'line-join': 'round',
            visibility: 'visible'
          },
          paint: {
            'line-color': '#334864',
            'line-width': {
              base: 1.2,
              stops: [
                [5, 0],
                [7, 0.5],
                [20, 10]
              ]
            }
          },
          metadata: {},
          filter: ['all', ['==', 'tunnel', 'F'], ['==', 'bridge', 'F'], ['in', 'fclass', 'primary_link', 'trunk_link']]
        },
        {
          id: 'road_motorway_link',
          type: 'line',
          source: 'cico',
          'source-layer': '1562240792513265666',
          minzoom: 10,
          layout: {
            'line-cap': 'round',
            'line-join': 'round',
            visibility: 'visible'
          },
          paint: {
            'line-color': '#2e5e8d',
            'line-width': {
              base: 1.2,
              stops: [
                [9.9, 0],
                [10, 1],
                [14, 6],
                [20, 10]
              ]
            }
          },
          metadata: {},
          filter: ['all', ['==', 'tunnel', 'F'], ['==', 'bridge', 'F'], ['==', 'fclass', 'motorway_link']]
        },
        {
          id: 'road_secondary_tertiary',
          type: 'line',
          source: 'cico',
          'source-layer': '1562240792513265666',
          minzoom: 8,
          layout: {
            'line-cap': 'round',
            'line-join': 'round',
            visibility: 'visible'
          },
          paint: {
            'line-color': '#000000',
            'line-width': {
              base: 1.2,
              stops: [
                [6.5, 0],
                [8, 0.5],
                [20, 13]
              ]
            }
          },
          metadata: {},
          filter: ['all', ['==', 'tunnel', 'F'], ['==', 'bridge', 'F'], ['in', 'fclass', 'secondary', 'secondary_link', 'tertiary', 'tertiary_link']]
        },
        {
          id: 'road_trunk_primary',
          type: 'line',
          source: 'cico',
          'source-layer': '1562240792513265666',
          minzoom: 7,
          layout: {
            'line-cap': 'round',
            'line-join': 'round',
            visibility: 'visible'
          },
          paint: {
            'line-color': '#334864',
            'line-width': {
              base: 1.2,
              stops: [
                [5, 0],
                [7, 1],
                [20, 18]
              ]
            }
          },
          metadata: {},
          filter: ['all', ['==', 'tunnel', 'F'], ['==', 'bridge', 'F'], ['in', 'fclass', 'primary', 'trunk']]
        },
        {
          id: 'road_motorway',
          type: 'line',
          source: 'cico',
          'source-layer': '1562240792513265666',
          minzoom: 5,
          layout: {
            'line-cap': 'round',
            'line-join': 'round',
            visibility: 'visible'
          },
          paint: {
            'line-color': '#2e5e8d',
            'line-width': {
              base: 1.2,
              stops: [
                [5, 0],
                [7, 1],
                [20, 18]
              ]
            }
          },
          metadata: {},
          filter: ['all', ['==', 'tunnel', 'F'], ['==', 'bridge', 'F'], ['==', 'fclass', 'motorway']]
        },
        {
          id: 'bridge_motorway_link_casing',
          type: 'line',
          source: 'cico',
          'source-layer': '1562240792513265666',
          minzoom: 5,
          layout: {
            'line-join': 'round'
          },
          paint: {
            'line-color': '#445263',
            'line-width': {
              base: 1.2,
              stops: [
                [9.9, 0],
                [10, 1.4],
                [14, 8],
                [20, 12]
              ]
            },
            'line-opacity': 1
          },
          metadata: {},
          filter: ['all', ['==', 'fclass', 'motorway_link'], ['==', 'tunnel', 'F'], ['==', 'bridge', 'T']]
        },
        {
          id: 'bridge_secondary_tertiary_casing',
          type: 'line',
          source: 'cico',
          'source-layer': '1562240792513265666',
          minzoom: 8,
          layout: {
            'line-join': 'round'
          },
          paint: {
            'line-color': '#2b3c51',
            'line-width': {
              base: 1.2,
              stops: [
                [8, 1.5],
                [20, 17]
              ]
            },
            'line-opacity': 1
          },
          metadata: {},
          filter: ['all', ['==', 'tunnel', 'F'], ['==', 'bridge', 'T'], ['in', 'fclass', 'secondary', 'secondary_link', 'tertiary', 'tertiary_link']]
        },
        {
          id: 'bridge_trunk_primary_casing',
          type: 'line',
          source: 'cico',
          'source-layer': '1562240792513265666',
          minzoom: 7,
          layout: {
            'line-join': 'round'
          },
          paint: {
            'line-color': '#445263',
            'line-opacity': ['interpolate', ['linear'], ['zoom'], 5, 0.1, 15, 1],
            'line-width': {
              base: 1.2,
              stops: [
                [5, 0.4],
                [6, 0.7],
                [7, 1.75],
                [20, 22]
              ]
            }
          },
          metadata: {},
          filter: ['all', ['==', 'tunnel', 'F'], ['==', 'bridge', 'T'], ['in', 'fclass', 'primary', 'trunk']]
        },
        {
          id: 'bridge_motorway_casing',
          type: 'line',
          source: 'cico',
          'source-layer': '1562240792513265666',
          minzoom: 5,
          layout: {
            'line-join': 'round'
          },
          paint: {
            'line-color': '#445263',
            'line-width': {
              base: 1.2,
              stops: [
                [5, 0.4],
                [6, 0.7],
                [7, 1.75],
                [20, 22]
              ]
            }
          },
          metadata: {},
          filter: ['all', ['==', 'fclass', 'motorway'], ['==', 'tunnel', 'F'], ['==', 'bridge', 'T']]
        },
        {
          id: 'bridge_motorway_link',
          type: 'line',
          source: 'cico',
          'source-layer': '1562240792513265666',
          minzoom: 5,
          layout: {
            'line-join': 'round'
          },
          paint: {
            'line-color': '#2e5e8d',
            'line-width': {
              base: 1.2,
              stops: [
                [9.9, 0],
                [10, 1],
                [14, 6],
                [20, 10]
              ]
            }
          },
          metadata: {},
          filter: ['all', ['==', 'fclass', 'motorway_link'], ['==', 'tunnel', 'F'], ['==', 'bridge', 'T']]
        },
        {
          id: 'bridge_secondary_tertiary',
          type: 'line',
          source: 'cico',
          'source-layer': '1562240792513265666',
          minzoom: 8,
          layout: {
            'line-join': 'round'
          },
          paint: {
            'line-color': '#000000',
            'line-width': {
              base: 1.2,
              stops: [
                [6.5, 0],
                [8, 0.5],
                [20, 13]
              ]
            }
          },
          metadata: {},
          filter: ['all', ['==', 'tunnel', 'F'], ['==', 'bridge', 'T'], ['in', 'fclass', 'secondary', 'secondary_link', 'tertiary', 'tertiary_link']]
        },
        {
          id: 'bridge_trunk_primary',
          type: 'line',
          source: 'cico',
          'source-layer': '1562240792513265666',
          minzoom: 7,
          layout: {
            'line-join': 'round',
            visibility: 'visible'
          },
          paint: {
            'line-color': '#334864',
            'line-width': {
              base: 1.2,
              stops: [
                [5, 0],
                [7, 1],
                [20, 18]
              ]
            }
          },
          metadata: {},
          filter: ['all', ['==', 'tunnel', 'F'], ['==', 'bridge', 'T'], ['in', 'fclass', 'primary', 'trunk']]
        },
        {
          id: 'bridge_motorway',
          type: 'line',
          source: 'cico',
          'source-layer': '1562240792513265666',
          minzoom: 5,
          layout: {
            'line-join': 'round'
          },
          paint: {
            'line-color': '#2e5e8d',
            'line-width': {
              base: 1.2,
              stops: [
                [5, 0],
                [7, 1],
                [20, 18]
              ]
            }
          },
          metadata: {},
          filter: ['all', ['==', 'fclass', 'motorway'], ['==', 'tunnel', 'F'], ['==', 'bridge', 'T']]
        },
        {
          id: 'road_oneway',
          type: 'symbol',
          source: 'cico',
          'source-layer': '1562240792513265666',
          minzoom: 15,
          layout: {
            'icon-size': {
              stops: [
                [15, 0.5],
                [19, 1]
              ]
            },
            'icon-image': 'oneway-white-large',
            visibility: 'visible',
            'icon-padding': 2,
            'symbol-spacing': 75,
            'symbol-placement': 'line',
            'icon-rotation-alignment': 'map'
          },
          paint: {
            'icon-opacity': 0.5
          },
          filter: ['all', ['==', 'oneway', 'F'], ['in', 'fclass', 'motorway', 'primary', 'secondary', 'tertiary', 'trunk']]
        },
        {
          id: 'road_oneway_opposite',
          type: 'symbol',
          source: 'cico',
          'source-layer': '1562240792513265666',
          minzoom: 15,
          layout: {
            'icon-size': {
              stops: [
                [15, 0.5],
                [19, 1]
              ]
            },
            'icon-image': 'oneway-white-large',
            'icon-rotate': -180,
            'icon-padding': 2,
            'symbol-spacing': 75,
            'symbol-placement': 'line',
            'icon-rotation-alignment': 'map'
          },
          paint: {
            'icon-opacity': 0.5
          },
          filter: ['all', ['==', 'oneway', 'T'], ['in', 'fclass', 'motorway', 'primary', 'secondary', 'tertiary', 'trunk']]
        },
        {
          id: 'road_label',
          type: 'symbol',
          source: 'cico',
          'source-layer': '1562240792513265666',
          minzoom: 13,
          layout: {
            'text-font': ['NotoSansSCRegular'],
            'text-size': {
              base: 1,
              stops: [
                [13, 10],
                [14, 12]
              ]
            },
            'text-field': '{name}',
            'text-anchor': 'center',
            'text-offset': [0, 0.15],
            'symbol-placement': 'line'
          },
          paint: {
            'text-color': '#e4e0dd',
            'text-halo-blur': 0.5,
            'text-halo-width': 1
          },
          metadata: {},
          filter: ['in', 'fclass', 'motorway', 'primary', 'secondary', 'tertiary', 'trunk']
        },
        {
          id: 'place_other',
          type: 'symbol',
          source: 'cico',
          'source-layer': '1562597969350410241',
          minzoom: 10,
          layout: {
            'text-font': ['NotoSansSCRegular'],
            'text-size': {
              base: 1.2,
              stops: [
                [12, 10],
                [15, 14]
              ]
            },
            'text-field': ['get', 'name'],
            visibility: 'visible',
            'text-max-width': 9,
            'text-transform': 'uppercase',
            'text-letter-spacing': 0.1
          },
          paint: {
            'text-color': '#91a3b0',
            'text-halo-color': '#162639',
            'text-halo-width': 1.2
          },
          metadata: {},
          filter: ['in', 'fclass', 'hamlet', 'island', 'islet', 'neighbourhood', 'suburb']
        },
        {
          id: 'place_village',
          type: 'symbol',
          source: 'cico',
          'source-layer': '1562597859849715713-1',
          minzoom: 10,
          layout: {
            'text-font': ['NotoSansSCRegular'],
            'text-size': {
              base: 1.2,
              stops: [
                [10, 12],
                [15, 22]
              ]
            },
            'text-field': ['get', 'name'],
            'text-max-width': 8
          },
          paint: {
            'text-color': '#91a3b0',
            'text-halo-color': '#162639',
            'text-halo-width': 1.2
          },
          metadata: {},
          filter: ['==', 'fclass', 'village']
        },
        {
          id: 'place_town',
          type: 'symbol',
          source: 'cico',
          'source-layer': '1562597969350410241',
          minzoom: 8,
          layout: {
            'text-font': ['NotoSansSCRegular'],
            'text-size': {
              base: 1.2,
              stops: [
                [7, 8],
                [11, 14]
              ]
            },
            'text-field': ['get', 'name'],
            'text-max-width': 8
          },
          paint: {
            'text-color': '#91a3b0',
            'text-halo-color': '#162639',
            'text-halo-width': 1.2
          },
          metadata: {},
          filter: ['==', 'fclass', 'town']
        },
        {
          id: 'place_county',
          type: 'symbol',
          source: 'cico',
          'source-layer': '1562597969350410241',
          minzoom: 5,
          maxzoom: 12,
          layout: {
            'text-font': ['NotoSansSCRegular'],
            'text-size': {
              base: 1.2,
              stops: [
                [7, 12],
                [11, 18]
              ]
            },
            'text-field': ['get', 'name'],
            visibility: 'visible',
            'text-padding': 2,
            'text-transform': 'uppercase',
            'text-letter-spacing': 0.1
          },
          paint: {
            'text-color': '#91a3b0',
            'text-halo-color': '#162639',
            'text-halo-width': 0.8
          },
          metadata: {},
          filter: ['in', 'fclass', 'region', 'county']
        },
        {
          id: 'place_city',
          type: 'symbol',
          source: 'cico',
          'source-layer': '1562597969350410241',
          minzoom: 5,
          maxzoom: 10,
          layout: {
            'text-font': ['NotoSansSCRegular'],
            'text-size': {
              base: 1.2,
              stops: [
                [7, 14],
                [11, 24]
              ]
            },
            'icon-image': {
              base: 1,
              stops: [
                [0, ''],
                [10, '']
              ]
            },
            'text-field': ['get', 'name'],
            'text-anchor': 'bottom',
            'text-offset': [0, 0],
            'icon-optional': false,
            'text-max-width': 8,
            'text-allow-overlap': true,
            'icon-allow-overlap': true
          },
          paint: {
            'text-color': '#91a3b0',
            'text-halo-color': '#162639',
            'text-halo-width': 1.2
          },
          metadata: {},
          filter: ['==', 'fclass', 'city']
        },
        {
          id: 'place_province',
          type: 'symbol',
          source: 'cico',
          'source-layer': '1562597969350410241',
          minzoom: 3,
          maxzoom: 7,
          layout: {
            'text-font': ['NotoSansSCRegular'],
            'text-size': {
              stops: [
                [2, 11],
                [5, 19]
              ]
            },
            'text-overlap': 'never',
            'text-field': '{name}',
            'text-max-width': 6.25,
            'text-transform': 'none'
          },
          paint: {
            'text-color': '#91a3b0',
            'text-halo-blur': 1,
            'text-halo-color': '#162639',
            'text-halo-width': 0.8
          },
          metadata: {},
          filter: ['==', 'fclass', 'province']
        },
        {
          id: 'place_country',
          type: 'symbol',
          source: 'cico',
          'source-layer': '1562597969350410241',
          layout: {
            'text-font': ['NotoSansSCRegular'],
            'text-size': {
              stops: [
                [1, 11],
                [4, 17],
                [6, 19]
              ]
            },
            'text-overlap': 'never',
            'text-field': '{name}',
            'text-max-width': 6.25,
            'text-transform': 'none'
          },
          paint: {
            'text-color': '#91a3b0',
            'text-halo-blur': 1,
            'text-halo-color': '#162639',
            'text-halo-width': 0.8
          },
          metadata: {},
          filter: ['==', 'fclass', 'country']
        },
        // 配置1内容-不带底图
        {
          id: 'city-shadow',
          type: 'fill',
          source: SOURCES.CITIES,
          layout: {},
          paint: {
            'fill-color': '#0239A8',
            'fill-translate': [5, 10],
            'fill-translate-anchor': 'viewport'
          }
        },
        {
          id: 'city-shadow-light',
          type: 'line',
          source: SOURCES.CITIES,
          layout: {},
          paint: {
            'line-color': '#02FDFE',
            'line-width': 2,
            'line-translate': [5, 10],
            'line-translate-anchor': 'viewport'
          }
        },
        {
          // 市
          id: LAYERS.STATE_FILL,
          type: 'fill',
          source: SOURCES.CITIES,
          layout: {},
          paint: {
            'fill-color': ['case', ['boolean', ['feature-state', 'hover'], false], '#26E3F0', '#1151B1']
          }
        },
        {
          // 市界
          id: 'city-borders',
          type: 'line',
          source: SOURCES.CITIES,
          layout: {},
          paint: {
            'line-color': '#1cccff',
            'line-width': 0.5,
            'line-opacity': 0.7
          }
        }
      ]
    }, // 地图描述数据的路径
    center: [120.5, 28.8], // 初始位置，经度纬度 [lng, lat]
    zoom: 6.5, // 初始缩放
    minZoom: 6,
    pitch: 20,
    antialias: true // 抗锯齿
  })
})
</script>

<style lang="scss" scoped>
@import url(../styles/demoCommonStyle.scss);

.map_wrap {
  width: 800px;
  height: 600px;
}
</style>
