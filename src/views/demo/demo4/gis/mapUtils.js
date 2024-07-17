// map core
import { Map, View } from 'ol';
// map 加载底图相关
import { XYZ } from 'ol/source';
// map 坐标相关
import { fromLonLat, transform } from 'ol/proj';
import * as olExtent from 'ol/extent';
// map 图层相关
import Feature from 'ol/Feature';
import { Point, MultiLineString, LineString, Polygon } from "ol/geom";
import { OSM, Vector as VectorSource } from 'ol/source';
import { Tile as TileLayer, Vector as VectorLayer } from 'ol/layer';  // VectorLayer表示珊格图层
import LinearRing from 'ol/geom/LinearRing';
import Overlay from 'ol/Overlay';  // 气泡
// map 样式
import { Circle as CircleStyle, Fill, Stroke, Style } from 'ol/style';

/******************************
 * 变量(非地图)
 * ****************************
 */
let count = 0  // 地图点击打点变量
let overlay = null  // 气泡窗对象

// 扇形测试数据
const curveTestDataList = [
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

/******************************
 * 地图变量(工具)
 * ****************************
 */
// 地图初始化配置
const mapInitConfig = {
  // ol地图底图
  layers: [
    // 天地图底图
    new TileLayer({
      source: new XYZ({
        url: "http://t0.tianditu.com/DataServer?T=vec_w&x={x}&y={y}&l={z}&tk=02dd5ea16a6b869b3b37e12f269b1463",
        wrapX: false,
        crossOrigin: "anonymous",
      })
    }),
    // 天地图注记
    new TileLayer({
      source: new XYZ({
        url: "http://t0.tianditu.com/DataServer?T=cva_w&x={x}&y={y}&l={z}&tk=02dd5ea16a6b869b3b37e12f269b1463"
      })
    })
  ],
  // ol地图基本配置
  view: new View({
    center: fromLonLat([121.63, 29.88]),
    zoom: 16,
    maxZoom: 17,
    minZoom: 15,
    // center: fromLonLat([116.400819, 39.916263]),
    // View默认使用EPSG3857坐标系
    // projection: 'EPSG:4326',
    // zoom: 15,
    constrainResolution: true,  // 设置缩放级别为整数 
    smoothResolutionConstraint: false,  // 关闭无级缩放地图
  })
}

/**
 * 绘制扇形核心方法
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

/******************************
 * 地图核心方法供出
 * ****************************
 */
// 初始化地图
export const initOlMap = (target)=> {
  return new Map({
    target,
    layers: mapInitConfig.layers,
    view: mapInitConfig.view
  });
}

// 获取可视区域的左上角和右下角坐标
export const getCurrentViewPosition = (olMap) => {
  const extent = olMap.getView().calculateExtent(olMap.getSize());

  // 获取投影坐标系
  const topLeftCoord = olExtent.getTopLeft(extent);  // 左上角
  const bottomRightCoord = olExtent.getBottomRight(extent);  // 右下角
  // console.log(topLeftCoord, bottomRightCoord)

  // 将投影坐标转换为地理坐标
  const topLeft = transform(topLeftCoord, 'EPSG:3857', 'EPSG:4326');
  const bottomRight = transform(bottomRightCoord, 'EPSG:3857', 'EPSG:4326');
  // console.log(topLeft, bottomRight)

  return {
    topLeft,
    bottomRight,
  }

}

// 移除所有控件
export const clearControls = (olMap) => {
  olMap.getControls().clear()

  // 重新添加一个默认的缩放控件（如果需要）
  // olMap.addControl(new control.ZoomSlider());
}

// 设置标注点
export const addPoint = (olMap, pointDataList) => {
  // mapUtils.setPointTest(olMap)

  // 创建点的数据源
  const vectorSource = new VectorSource({
    features: [],
  });

  // 创建点图层
  const vectorLayer = new VectorLayer({
    source: vectorSource,
    style: new Style({
      image: new CircleStyle({
        /* image: new Icon({
          src: 'data/icon.png',
        }), */
        /* fill: new Fill({ color: 'red' }),
        stroke: new Stroke({ color: 'black', width: 1 }), */
        radius: 5,
        fill: new Fill({
          color: '#f49d41'
        }),
        stroke: new Stroke({
          color: '#836365',
          width: 1
        })
      }),
    }),
  });

  olMap.addLayer(vectorLayer);

  pointDataList.forEach((item) => {
    const point = new Point(fromLonLat(item.lonlat));
    const feature = new Feature({
      geometry: point,
      type: 'Marker',
      pointData: item.pointData
    });
    vectorSource.addFeature(feature);
  });
}

// 设置扇形区样式
const setCurveStyle = (fillColor, strokeColor = 'rgba(255, 205, 67, 0.3)')=> {
  return new Style({
    fill: new Fill({
      color: fillColor
    }),
    stroke: new Stroke({
      color: strokeColor,
      width: 2
    }),
  })
}

// 添加扇形
/**
 * 绘制扇形核心方法
 * APIMethod:OpenLayers绘制扇形的接口扩展
 * @param origin 圆心
 * @param radius 半径
 * @param sides 边数
 * @param r 弧度
 * @param angel 旋转角度（扇形右边半径与x正向轴的角度）
 * @returns {OpenLayers.Geometry.Polygon}
 */
// 根据频段展示不同颜色 有边缘  
// 先写死,后期需要可配置
export const addCurve = (olMap, curveDataList)=> {
  let featureList = []  // 扇区feature列表

  // 根据业务数据修改feature数据
  curveDataList.forEach(item=> {
    // 频率
    // console.log(item.curveData.workFrequency)
    
    let curveStyle = null  // 扇区样式
    let curveRadius = 0  // 扇区半径

    /**
     * 根据频率获取数据
     * 
     * A频段  100  填充: rgba(200, 22, 100, 0.4)   线:
     * D频段  110  填充: rgba(55, 33, 188, 0.4)   线:
     * E频段  120  填充: rgba(88, 99, 200, 0.4)   线:
     * F频段  130  填充: rgba(255, 255, 0, 0.4)   线:
     * FDD  140   填充:  rgba(255, 76, 127, 0.4)  线:
     * 其他  150  填充:  rgba(32, 222, 230, 0.4)   线 : rgba(255, 205, 67, 0.3)
     */
    switch(item.curveData.workFrequency) {
      case 'A频段':
        curveStyle = setCurveStyle('rgba(200, 22, 100, 0.4)')
        curveRadius = 100
        break;
      case 'D频段':
        curveStyle = setCurveStyle('rgba(55, 33, 188, 0.4)')
        curveRadius = 110
        break;
      case 'E频段':
        curveStyle = setCurveStyle('rgba(88, 99, 200, 0.4)')
        curveRadius = 120
        break;
      case 'F频段':
        curveStyle = setCurveStyle('rgba(255, 255, 0, 0.4)')
        curveRadius = 130
        break;
      case 'FDD':
        curveStyle = setCurveStyle('rgba(255, 76, 127, 0.4)')
        curveRadius = 140
        break;
      default:
        curveStyle = setCurveStyle('rgba(32, 222, 230, 0.4)')
        curveRadius = 150
        break
    }

    let origi_point = fromLonLat(item.lonlat);  // 绘制扇形的顶点
    // let circle = createRegularPolygonCurve(origi_point, 150, 100, 45, 90) // 调用绘制扇形的方法得到扇形
    let circle = createRegularPolygonCurve(origi_point, curveRadius, 100, 45, item.curveData.antDirectionAngle) // 调用绘制扇形的方法得到扇形
    let feature = new Feature(circle);  // 把扇形加入 feature

    feature.setStyle(curveStyle)
    feature.set('type', 'Curve')  // 这是给这个扇形添加额外的参数 ， 如果是设置id 用 setId方法
    // 这是给这个扇形添加额外的参数，这里的id和 setId的id没关系
    feature.set('curveData', item.curveData)
    featureList.push(feature)
  })

  let vectorSource = new VectorSource();  // 创建一个数据源
  vectorSource.addFeatures(featureList);   // 把两个扇形加进数据源
  let vectorLayer = new VectorLayer({     // 创建一个图层，把数据源加进图层
    source: vectorSource
  });
  olMap.addLayer(vectorLayer);   // 把图层加进地图
}
/* export const addCurve = (olMap, curveDataList)=> {
  let featureList = []
  curveDataList.forEach(item=> {
    console.log(item.curveData.workFrequency)
    let origi_point = fromLonLat(item.lonlat);  // 绘制扇形的顶点
    // let circle = createRegularPolygonCurve(origi_point, 150, 100, 45, 90) // 调用绘制扇形的方法得到扇形
    let circle = createRegularPolygonCurve(origi_point, 150, 100, 45, item.curveData.antDirectionAngle) // 调用绘制扇形的方法得到扇形
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
    // 这是给这个扇形添加额外的参数，这里的id和 setId的id没关系
    feature.set('curveData', item.curveData)
    featureList.push(feature)
  })

  let vectorSource = new VectorSource();  // 创建一个数据源
  vectorSource.addFeatures(featureList);   // 把两个扇形加进数据源
  let vectorLayer = new VectorLayer({     // 创建一个图层，把数据源加进图层
    source: vectorSource
  });
  olMap.addLayer(vectorLayer);   // 把图层加进地图
} */

/**
 * 设置气泡窗
 * @param {*} olMap 地图对象
 * @param {*} e 地图事件对象
 * @param {*} container 气泡窗dom容器
 * @param {*} closer 气泡窗关闭dom容器
 * @param {*} content 气泡窗内容dom容器
 * @param {*} popupData 气泡窗数据
 */
export const setPopup = (olMap, e, container, closer, content, popupData)=> {
  overlay = new Overlay({
      element: container, //绑定 Overlay 对象和 DOM 对象的
      autoPan: true, // 定义弹出窗口在边缘点击时候可能不完整 设置自动平移效果
      /* autoPanAnimation: {
          duration: 250, // 自动平移效果的动画时间 9毫秒）
      }, */
  });
  olMap.addOverlay(overlay);
  closer.onclick = function () {
      overlay.setPosition(undefined);
      closer.blur();
      return false;
  };

  content.innerHTML = popupData;
  overlay.setPosition(e.coordinate); //把 overlay 显示到指定的 x,y坐标
}

// 移除所有图层
export const removeAllLayer = (olMap)=> {
  // console.log(olMap)

  // 获取当前地图上的所有图层
  let layers = olMap.getLayers().getArray();

  // 从地图中移除所有图层
  for (var i = layers.length - 1; i >= 0; --i) {
    if (layers[i] instanceof VectorLayer) olMap.removeLayer(layers[i]);
  }
}

// 飞到指定坐标
export const flyToCoordinate = (olMap, lonlat)=> {
  olMap.getView().animate({
    center: fromLonLat(lonlat),
    duration: 800, // 飞行时间，单位毫秒
  });
}

// 获取所有feature
export const getAllFeature = (olMap, next)=> {
  olMap.getLayers().forEach(item => {
    let source = null;
    if(item) {
      source = item.getSource();
    }
    if (source instanceof VectorSource) {
        source.forEachFeature(feature => {
            // console.log(feature.get('type'))

            next(feature)
        });
    }
  });
}

/******************************
 * 测试
 * ****************************
 */
// 打点测试
export const setPointTest = (olMap)=> {
  // fromLonLat([121.63, 29.88])

  const features = [];
  // console.log(e.coordinate); // 获取坐标

  const iconFeature = new Feature({
    geometry: new Point(fromLonLat([121.63, 29.88])),
    // name: count++,
    location: fromLonLat([121.63, 29.88])
  });
  const style = new Style({
    image: new CircleStyle({
      radius: 10,
      fill: new Fill({
        color: '#f49d41'
      }),
      stroke: new Stroke({
        color: '#836365',
        width: 1
      })
    })
  });
  iconFeature.setStyle(style);
  features.push(iconFeature);
  const vectorSource = new VectorSource({
    features
  });
  const vectorLayer = new VectorLayer({
    source: vectorSource,
    opacity: 0.8
  });
  olMap.addLayer(vectorLayer);
}

// 移除标注测试
export const removePointTest = (olMap)=> {
  const layers = olMap.getLayers();
  layers.forEach(item => {
    if (item instanceof VectorLayer) olMap.removeLayer(item);
  });
}

// 点击打点测试
export const clickSetPointTest = (olMap, e)=> {
  const features = [];
  // console.log(e.coordinate); // 获取坐标

  const iconFeature = new Feature({
    geometry: new Point(e.coordinate),
    name: count++,
    location: e.coordinate
  });
  const style = new Style({
    image: new CircleStyle({
      radius: 10,
      fill: new Fill({
        color: '#f49d41'
      }),
      stroke: new Stroke({
        color: '#836365',
        width: 1
      })
    })
  });
  iconFeature.setStyle(style);
  features.push(iconFeature);
  const vectorSource = new VectorSource({
    features
  });
  const vectorLayer = new VectorLayer({
    source: vectorSource,
    opacity: 0.8
  });
  olMap.addLayer(vectorLayer);
}

// 绘制扇形测试
export const addCurveTest = (olMap) => {
  let origi_point = fromLonLat([121.63, 29.88]);  // 绘制扇形的顶点
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