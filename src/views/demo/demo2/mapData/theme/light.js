export default {
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
    }
  },
  glyphs: 'http://decision.cncico.com/gis/dist/fonts/{fontstack}/{range}.pbf',
  sprite: 'http://decision.cncico.com/gis/dist/sprite/sprite',
  layers: [
    {
      id: 'background',
      type: 'background',
      paint: {
        'background-color': 'rgba(178, 206, 254, 1)'
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
            [6, 'rgba(252, 247, 229, 1)'],
            [10, 'rgba(252, 247, 229, 1)'],
            [14, 'rgba(246, 241, 229, 1)'],
            [15, 'rgba(246, 241, 229, 1)']
          ]
        },
        'fill-outline-color': '#bbc5ea'
      }
    },
    {
      id: 'landuse_forestland',
      type: 'fill',
      source: 'cico',
      'source-layer': '1561885517834928130',
      minzoom: 4,
      paint: {
        'fill-color': 'rgba(171, 217, 170, 1)',
        'fill-opacity': {
          base: 1,
          stops: [
            [4, 1],
            [14, 0]
          ]
        }
      },
      filter: ['all', ['==', 'fclass', 'forest']]
    },
    {
      id: 'landcover_wood',
      type: 'fill',
      source: 'cico',
      'source-layer': '1561885517834928130',
      minzoom: 4,
      paint: {
        'fill-color': 'hsla(98, 61%, 72%, 0.7)',
        'fill-opacity': 0.6,
        'fill-antialias': false
      },
      metadata: {},
      filter: ['all', ['in', 'fclass', 'nature_reserve', 'park']]
    },
    {
      id: 'landcover_grass',
      type: 'fill',
      source: 'cico',
      'source-layer': '1561885517834928130',
      minzoom: 4,
      paint: {
        'fill-color': 'rgba(224, 232, 201, 1)',
        'fill-opacity': 0.5,
        'fill-antialias': false
      },
      metadata: {},
      filter: ['all', ['in', 'fclass', 'scrub', 'grass']]
    },
    {
      id: 'landuse_residential',
      type: 'fill',
      source: 'cico',
      'source-layer': '1561885517834928130',
      maxzoom: 24,
      minzoom: 9,
      filter: ['all', ['in', 'fclass', 'residential', 'suburbs', 'neighbourhood']],
      paint: {
        'fill-color': {
          base: 1,
          stops: [
            [9, 'rgba(233, 227, 210, 0.80)'],
            [12, 'rgba(233, 227, 210, 0.55)'],
            [16, 'rgba(233, 227, 210, 0.35)']
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
        'fill-color': 'hsl(75, 37%, 81%)'
      }
    },
    {
      id: 'water',
      type: 'fill',
      source: 'cico',
      'source-layer': '1561883584248201217',
      minzoom: 4,
      paint: {
        'fill-color': 'rgba(178, 206, 254, 1)'
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
        'line-color': '#c1c4d3',
        'line-width': {
          stops: [
            [3, 1],
            [16, 5]
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
        'line-color': 'rgba(195, 189, 187, 1)',
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
        'line-color': '#e9ac77',
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
        'line-color': '#e9ac77',
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
        'line-color': '#e9ac77',
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
        'line-color': '#fc8',
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
        'line-color': 'rgba(245, 245, 243, 1)',
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
        'line-color': '#fff4c6',
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
        'line-color': '#ffdaa6',
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
        'line-color': '#e9ac77',
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
        'line-color': '#e9ac77',
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
        'line-color': 'rgba(195, 189, 187, 1)',
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
        'line-color': '#e9ac77',
        'line-width': {
          base: 1.2,
          stops: [
            [5, 0.4],
            [6, 0.7],
            [7, 1.75],
            [20, 22]
          ]
        },
        'line-opacity': 1
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
        'line-color': '#e9ac77',
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
        'line-color': '#fea',
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
        'line-color': '#fc8',
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
        'line-color': 'rgba(245, 245, 243, 1)',
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
        'line-color': '#fea',
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
        'line-color': {
          base: 1,
          stops: [
            [5, 'hsl(26, 87%, 62%)'],
            [6, '#fc8']
          ]
        },
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
        'line-color': '#e9ac77',
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
        'line-color': 'rgba(195, 189, 187, 1)',
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
        'line-color': '#e9ac77',
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
        'line-color': '#e9ac77',
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
        'line-color': '#fc8',
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
        'line-color': 'rgba(245, 245, 243, 1)',
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
        'line-color': '#fea',
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
        'line-color': '#fc8',
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
        'icon-image': 'oneway-large',
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
        'icon-image': 'oneway-large',
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
        'text-color': '#765',
        'text-halo-blur': 0.5,
        'text-halo-width': 1
      },
      metadata: {},
      filter: ['all', ['in', 'fclass', 'motorway', 'primary', 'secondary', 'tertiary', 'trunk']]
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
        'text-color': 'rgba(66, 62, 62, 1)',
        'text-halo-color': 'rgba(255,255,255,0.8)',
        'text-halo-width': 1.2
      },
      metadata: {},
      filter: ['all', ['in', 'fclass', 'hamlet', 'island', 'islet', 'neighbourhood', 'suburb']]
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
        'text-color': '#333',
        'text-halo-color': 'rgba(255,255,255,0.8)',
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
        'text-color': '#333',
        'text-halo-color': 'rgba(255,255,255,0.8)',
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
        'icon-image': {
          base: 1,
          stops: [
            [0, 'circle-stroked-13'],
            [12, '']
          ]
        },
        'text-field': ['get', 'name'],
        'text-anchor': 'bottom',
        'text-offset': [0, 0],
        'icon-optional': false,
        'text-max-width': 8,
        'icon-allow-overlap': true
      },
      paint: {
        'text-color': '#333',
        'text-halo-color': 'rgba(255,255,255,0.8)',
        'text-halo-width': 1.2
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
            [0, 'circle-stroked-13'],
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
        'text-color': '#333',
        'text-halo-color': 'rgba(255,255,255,0.8)',
        'text-halo-width': 1.2
      },
      metadata: {},
      filter: ['all', ['==', 'fclass', 'city']]
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
        'text-field': '{name}',
        'text-max-width': 6.25,
        'text-transform': 'none'
      },
      paint: {
        'text-color': '#334',
        'text-halo-blur': 1,
        'text-halo-color': 'rgba(255,255,255,0.8)',
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
        'text-field': '{name}',
        'text-max-width': 6.25,
        'text-transform': 'none'
      },
      paint: {
        'text-color': '#334',
        'text-halo-blur': 1,
        'text-halo-color': 'rgba(255,255,255,0.8)',
        'text-halo-width': 0.8
      },
      metadata: {},
      filter: ['==', 'fclass', 'country']
    }
  ]
}
