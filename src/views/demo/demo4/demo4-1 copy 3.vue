<template>
  <section id="olMap" class="ol_map"></section>
</template>

<script setup name="gis">
// vue - core
import { ref, onMounted } from 'vue';
// map - core
import * as mapUtils from './mapUtils.js'
import { Map, View } from 'ol';

// import TileLayer from 'ol/layer/Tile';
import { fromLonLat } from 'ol/proj';
// import { XYZ } from 'ol/source';
import LinearRing from 'ol/geom/LinearRing';
import { Point, MultiLineString, LineString, Polygon } from "ol/geom";
import Feature from 'ol/Feature';
import { Circle as CircleStyle, Fill, Stroke, Style } from 'ol/style';
import { OSM, Vector as VectorSource } from 'ol/source';
import { Tile as TileLayer, Vector as VectorLayer } from 'ol/layer';

onMounted(() => {
  // 初始化地图
  const olMap = mapUtils.initOlMap()

  // 设置地图
  setOlmap(olMap)
})

// 设置地图
const setOlmap = (olMap) => {
  // 获取可视区域的四个坐标
  getCurrentViewPosition(olMap)

  // console.log(olMap)
  // addCurve(olMap)

  // setPoint(olMap)

  // mapEvent(olMap)
}

// 获取可视区域的四个坐标
const getCurrentViewPosition = (olMap) => {
  console.log(olMap)
}


const mapEvent = (olMap) => {
  const olExtent = ol.extent;
  olMap.on('moveend', e => {

    console.log(ol)
    // console.log('zoom', olMap.frameState_.viewState.zoom);
    // const extent = olMap.frameState_.extent;
    // console.log('extent', extent);
    // console.log('TopLeft', olExtent.getTopLeft(extent));
    // console.log('BottomRight', olExtent.getBottomRight(extent));
    // console.log(e, olMap)
    // const extent = olMap.frameState_.extent
    // console.log('extent', extent)
    // console.log('topLeft', olMap.extent)


    /* var extent = view.calculateExtent(map.value.getSize());
    var topLeftCoord = getTopLeft(extent);
    var bottomRightCoord = getBottomRight(extent);
    var topLeftCoordProj = transform(topLeftCoord, 'EPSG:3857', 'EPSG:4326');
    var bottomRightCoordProj = transform(bottomRightCoord, 'EPSG:3857', 'EPSG:4326'); */




  })

}

const setPoint = () => {
  // 绘制点、线、面要素
  const pointFeature = new Feature({
    geometry: new Point(fromLonLat([116.410819, 39.916263])),
    name: "Point"
  });

  /* const styles = {
    Point: new Style({
      image: new Circle({
        radius: 10,
        fill: new Fill({
          color: "rgba(255, 0, 0, 0.6)"
        })
      })
    })
  } */

  /* pointFeature.setStyle(
    new Style({
      image: new Circle({
        radius: 10,
        fill: new Fill({
          color: "rgba(255, 0, 0, 0.6)"
        })
      })
    })
  ) */

  // 创建矢量图层
  const vectorLayer = new VectorLayer({
    source: new VectorSource({
      features: [pointFeature]
    }),
    style: new Style({
      image: new Circle({
        radius: 10,
        fill: new Fill({
          color: "rgba(255, 0, 0, 0.6)"
        })
      })
    })
  })

  olMap.addLayer(vectorLayer)

  // 创建矢量图层
  /* const vectorLayer = new VectorLayer({
    source: new VectorSource({
      features: [pointFeature]
    }),
    style: styleFunction
  }); */
}

/**
       * APIMethod:OpenLayers绘制扇形的接口扩展
       * @param origin 圆心
       * @param radius 半径
       * @param sides 边数
       * @param r 弧度
       * @param angel 旋转角度（扇形右边半径与x正向轴的角度）
       * @returns {OpenLayers.Geometry.Polygon}
       */
const createRegularPolygonCurve = (origin, radius, sides, r, angel) => {
  let rotation = 360 - r;
  let angle = Math.PI * ((1 / sides) - (1 / 2));
  if (rotation) {
    angle += (rotation / 180) * Math.PI;
  }
  let rotatedAngle, x, y;
  let points = [];
  for (let i = 0; i < sides; ++i) {
    let an = i * ((360 - rotation) / 360);
    rotatedAngle = angle + (an * 2 * Math.PI / sides);
    x = origin[0] + (radius * Math.cos(rotatedAngle));
    y = origin[1] + (radius * Math.sin(rotatedAngle));
    points.push([x, y]);
  }
  if (rotation != 0) {
    points.push(origin);
  }
  var ring = new LinearRing(points);
  ring.rotate(angel / 57.3, origin);
  let list = ring.getCoordinates()

  return new Polygon([list]);
}

// 绘制扇形
const addCurve = () => {
  let origi_point = fromLonLat([116.410819, 39.916263]);  // 绘制扇形的顶点
  let circle = createRegularPolygonCurve(origi_point, 500, 100, 30, 90) // 调用绘制扇形的方法得到扇形
  let feature = new Feature(circle);  // 把扇形加入 feature
  feature.setStyle(  // 设置一下这个扇形的样式
    new Style({
      fill: new Fill({
        color: 'rgba(32, 157, 230, 0.3)'
      }),
      stroke: new Stroke({
        color: 'rgba(255, 205, 67, 0.3)',
        width: 2
      }),
    })
  )
  feature.set('type', 'Curve')  // 这是给这个扇形添加额外的参数 ， 如果是设置id 用 setId方法
  feature.set('curve', {   // 这是给这个扇形添加额外的参数，这里的id和 setId的id没关系
    id: 1,
    title: '测试001',
    msg: '测试001-1',
    msg2: '测试001-2',
  })

  // 创建第二个扇形，和第一个一样
  let circle1 = createRegularPolygonCurve(origi_point, 500, 100, 30, 45)
  let feature1 = new Feature(circle1);
  feature1.setStyle(
    new Style({
      fill: new Fill({
        color: 'rgba(32, 157, 230, 0.3)'
      }),
      stroke: new Stroke({
        color: 'rgba(255, 205, 67, 0.3)',
        width: 2
      }),
    })
  )
  feature1.set('type', 'Curve')
  feature1.set('curve', {
    id: 2,
    title: '超级无敌炫酷爆龙战神',
    msg: '超级无敌炫酷爆龙战神 描述001',
    msg2: '超级无敌炫酷爆龙战神 描述002',
  })

  let vectorSource = new VectorSource();  // 创建一个数据源
  vectorSource.addFeatures([feature, feature1]);   // 把两个扇形加进数据源
  let vectorLayer = new VectorLayer({     // 创建一个图层，把数据源加进图层
    source: vectorSource
  });
  olMap.addLayer(vectorLayer);   // 把图层加进地图
}

</script>

<style lang="scss">
.ol_map {
  width: 100%;
  height: 580px;
}
</style>