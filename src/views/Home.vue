<template>
  <div class="home">
    <!-- <dv-decoration-1 :color="['pink', 'yellow']" style="width: 200px; height: 50px" /> -->
    <div class="home_top">
      <div class="home_top_map">
        <div style="display: flex; position: relative">
          <div class="notice_bg" v-if="notice" flex="cross:center">
            <!-- <marquee direction="left" scrollamount="20">🔔 {{ notice }}</marquee> -->
            <img src="@/assets/images/notice.png" style="height: 32px; margin: 0 32px" alt="" />
            <notice-bar
              :slider-text="[{ title: notice }, { title: notice }]"
              width="100%"
              :amount="1"
              background-color="#ffffff00"
              color="#FCFF00"
              font-size="32px" />
          </div>
          <div class="home_top_map_logo"></div>
          <div class="home_top_map_servseName">
            <div>{{ deptName }}（{{ deptDirection }}） 欢迎您</div>
            <div style="font-size: 32px; font-weight: 400">{{ time }}</div>
          </div>
        </div>
        <img class="home_top_map_main" :src="screenImg" v-if="screenImg" />
      </div>
      <div class="home_top_box">
        <div class="home_top_box_title">天气信息</div>
        <div class="home_top_weather" flex="main:center">
          <div class="home_top_weather_cloud" flex="main:right">
            <img style="height: 130px; margin-right: 70px" :src="weatherImg" />
          </div>
          <div class="home_top_weather_tem">
            <div class="home_top_weather_tem_t">{{ wetherData.temp }}℃</div>
            <div class="home_top_weather_tem_b">{{ wetherData.weather }}</div>
          </div>
        </div>
        <div class="home_top_list">
          <div class="home_top_list_item" style="color: #32dcf8">{{ wetherData.winddirect }}</div>
          <div class="home_top_list_item" style="color: #faf2b9">{{ wetherData.pressure }} Pa</div>
          <div class="home_top_list_item" style="color: #00f9a8">{{ wetherData.aqi.pm2_5 }} up/m3</div>
          <div class="home_top_list_item" style="color: #ffc105">{{ wetherData.humidity }} %RH</div>
          <div class="home_top_list_item" style="color: #32dcf8">{{ wetherData.windspeed }} m/s</div>
          <div class="home_top_list_item" style="color: #ffb5bc">{{ wetherData.windpower }}</div>
        </div>
      </div>
    </div>
    <div class="home_bot" style="position: relative">
      <Fullscreen style="position: absolute; right: 1000px; top: -100px" />

      <div class="home_bot_tel">
        <div class="home_bot_tel_title">咨询电话</div>
        <div class="home_bot_tel_main">
          <span class="home_bot_tel_main_phone"></span>
          <div class="home_bot_tel_main_title">24小时咨询服务电话:</div>
        </div>
        <div class="home_bot_tel_phone">
          <div v-for="(item, index) in phoneNum" :key="index">
            <div class="home_bot_tel_phone_item" v-if="index != 4" v-text="item"></div>
            <div v-else style="color: #ffffff; height: 108px; font-size: 64px">-</div>
          </div>
        </div>
      </div>
      <div class="home_bot_road">
        <div class="home_bot_road_title">路况信息</div>
        <div class="home_bot_road_info">
          <div id="container" style="height: 100%; width: 100%"></div>
        </div>
      </div>
      <div class="home_bot_person">
        <div class="home_bot_person_title">值班人员信息</div>
        <div class="home_bot_person_box">
          <div class="home_bot_person_box_img">
            <!-- <el-image style="width: 100%; height: 100%" :src="'/api' + botPerson.avatar" /> -->
            <img style="width: 100%; height: 100%" :src="botPerson.avatar" />
          </div>
          <div class="home_bot_person_box_info">
            <div class="home_bot_person_box_info_box">
              <span class="home_bot_person_box_info_box_name"></span>
              <span class="home_bot_person_box_info_box_font">{{ botPerson.dutyName }}</span>
            </div>
            <div class="home_bot_person_box_info_box">
              <span class="home_bot_person_box_info_box_health"></span>
              <span class="home_bot_person_box_info_box_font">{{ botPerson.dutyHealth }}</span>
            </div>
            <div class="home_bot_person_box_info_box">
              <span class="home_bot_person_box_info_box_phone"></span>
              <span class="home_bot_person_box_info_box_font">{{ botPerson.dutyPhone }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed, nextTick, onBeforeUnmount } from 'vue'
import dayjs from 'dayjs'
import AMapLoader from '@amap/amap-jsapi-loader'
import noticeBar from './components/noticeBar.vue' // 消息滚屏
import Fullscreen from './components/Fullscreen.vue' // 消息滚屏
import { http } from '@/api'
import { getStorage } from '@/utils/storage.js'
/* 在Vue3中使用时,需要引入Vue3中的shallowRef方法(使用shallowRef进行非深度监听,
因为在Vue3中所使用的Proxy拦截操作会改变JSAPI原生对象,所以此处需要区别Vue2使用方式对地图对象进行非深度监听,
否则会出现问题,建议JSAPI相关对象采用非响应式的普通对象来存储) */
// import { shallowRef } from '@vue/reactivity'

// let map = shallowRef(null);
// const path = ref([]);
// const current_position = ref([]);

let phoneNum = ref('0571-96268')
let botPerson = ref({})
let deptName = ref({})

let screenImg = ref('')
let deptDirection = ref('')
let notice = ref('')
let wetherData = ref({ aqi: {} })

let time = ref(dayjs().format('YYYY-MM-DD HH:mm:ss'))

const weatherImg = computed(() => {
  if (wetherData.value.img) {
    return new URL(`../assets/icons/weathercn02/${wetherData.value.img}.png`, import.meta.url).href
  }
  return ''
})

// 天气接口
const queryWeather = async () => {
  const params = { city: '杭州' }
  try {
    let res = await http('apiQueryWeather', params)
    wetherData.value = res.data
  } catch (error) {
    console.log(error)
  }
}

// 获取大屏主图
const getScreenImg = async () => {
  const params = { screenId: getStorage('screenId') }
  try {
    let res = await http('getScreenImg', params)
    screenImg.value = res.data.screenImg
  } catch (error) {
    console.log(error)
  }
}

// 服务区基础信息：电话服务区名方向
const getTel = async () => {
  const params = { screenId: getStorage('screenId') }
  try {
    let res = await http('getTel', params)
    phoneNum.value = res.data.screenTel
    deptName.value = res.data.deptName
    deptDirection.value = res.data.deptDirection
  } catch (error) {
    console.log(error)
  }
}
// 消息通知
const getNotice = async () => {
  const params = { screenId: getStorage('screenId') }
  try {
    let res = await http('getNotice', params)
    notice.value = res.data.noticeTitle
  } catch (error) {
    console.log(error)
  }
}

// 人员信息接口
const apiGetStaff = async () => {
  const params = { screenId: getStorage('screenId') }
  try {
    let res = await http('apiGetStaff', params)
    botPerson.value = res.data
    botPerson.value.avatar = import.meta.env.VITE_IMAGE_PREFIX + botPerson.value.userId
  } catch (error) {
    console.log(error)
  }
}
// 路况接口
const apiRoad = async () => {
  // const params = { token: '60e5645459c9ac3f29852f90e374db84' }
  // const params = { screenId: getStorage('screenId') }
  // try {
  //   let res = await http('apiRoad', params)
  //   console.log(res)
  //   // botPerson.value = res.data
  // } catch (error) {
  //   console.log(error)
  // }
}
function getWeek() {
  let datas = dayjs().day()
  let week = ['日', '一', '二', '三', '四', '五', '六']
  return `星期${week[datas]}`
}
function initMap() {
  window._AMapSecurityConfig = {
    securityJsCode: '2e68355b80904be5a4e3b7e5c2d114c5'
  }
  AMapLoader.load({
    key: '	1b3914ae421dfce5d81ee48438d9f33c', // 申请好的Web端开发者Key，首次调用 load 时必填
    version: '2.0', // 指定要加载的 JSAPI 的版本，缺省时默认为 1.4.15
    plugins: [''] // 需要使用的的插件列表，如比例尺'AMap.Scale'等
  })
    .then((AMap) => {
      let map = new AMap.Map('container', {
        // 设置地图容器id
        viewMode: '3D', // 是否为3D地图模式
        zoom: 12, // 初始化地图级别
        center: [120.25, 29.97], // 初始化地图中心点位置
        mapStyle: 'amap://styles/34d0c5beba1822e4be6001e4090853ab',
        features: ['bg', 'road']
      })
      const marker = new AMap.Marker({
        icon: '//a.amap.com/jsapi_demos/static/demo-center/icons/poi-marker-default.png',
        position: [120.25, 29.97]
        // 通过设置 offset 来添加偏移量
        // offset: new AMap.Pixel(-26, -54),
      })
      marker.setMap(map)
      const marker1 = new AMap.Marker({
        icon: '//a.amap.com/jsapi_demos/static/demo-center/icons/poi-marker-default.png',
        position: [121.25, 29.97]
        // 通过设置 offset 来添加偏移量
        // offset: new AMap.Pixel(-26, -54),
      })
      marker1.setMap(map)
    })
    .catch((e) => {
      console.log(e)
    })
}
const changeScale = () => {
  // 设计稿：1920 * 1080
  // 设配目标：1920 * 1080 ( 1 : 1) | 3840* 2160 ( 2 : 2 ) | 7680 * 2160 ( 4 : 2)

  // 1.设计稿尺寸
  let targetWidth = 3840
  let targetHeight = 2160

  let targetRatio = 16 / 9 // 宽高比率 （宽 / 高）

  // 2.拿到当前设备（浏览器）的宽度
  let currentWidth = document.documentElement.clientWidth || document.body.clientWidth
  let currentHeight = document.documentElement.clientHeight || document.body.clientHeight
  // 3.计算缩放比率(屏幕过宽，根据高度计算缩放比例)
  let scaleRatio = currentWidth / targetWidth // 参照宽度进行缩放（默认情况下）
  console.log(scaleRatio)
  // 当前宽高比例
  let currentRatio = currentWidth / currentHeight

  if (currentRatio > targetRatio) {
    scaleRatio = currentHeight / targetHeight // 参照高度进行缩放（屏幕很宽的情况下）
    document.querySelector('.home').style = `transform: scale(${scaleRatio})`
  } else {
    // 4.开始缩放网页
    document.querySelector('.home').style = `transform: scale(${scaleRatio})`
  }
}

onBeforeUnmount(() => {
  window.removeEventListener('resize', changeScale)
})

onMounted(() => {
  nextTick(() => {
    changeScale()
    window.addEventListener('resize', changeScale)
  })

  initMap()
  queryWeather()
  getNotice()
  apiGetStaff()
  apiRoad()
  getScreenImg()
  getTel()
  setInterval(() => {
    queryWeather()
  }, 3600000)
  setInterval(() => {
    getNotice()
  }, 1800000)
  setInterval(() => {
    time.value = `${dayjs().format('YYYY-MM-DD HH:mm:ss')}   ${getWeek()}`
  }, 1000)
})
</script>

<style lang="scss" scoped>
.home {
  //！自定义内容！
  width: 3840px;
  height: 2160px;
  //！自定义内容！
  transform-origin: left top; //此处必须加上这个属性,让屏幕一直处于左上角
  background: url(@/assets/images/long_bg.png) no-repeat;
  background-size: cover;
  background-position: center center;
  .notice_bg {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 80px;
    font-size: 32px;
    color: #fcff00;
    line-height: 80px;
    font-weight: bold;
    background: url(@/assets/images/notice-bg.png) no-repeat;
    background-size: cover;
    background-position: center center;
    .scroll-container {
      position: relative;
      height: 50px;
      overflow: hidden;
    }
    .text-container {
      position: absolute;
      left: 0;
      top: 0;
      white-space: nowrap;
    }
  }
  .home_top {
    display: flex;
    height: 74%;
    width: 100%;
    .home_top_map {
      width: 75%;
      // background-color:#030925;
      .home_top_map_logo {
        width: 220px;
        height: 55px;
        margin-top: 57px;
        margin-left: 72px;
        background: url(@/assets/images/zshl_logo.png) no-repeat;
        background-size: cover;
        background-position: center center;
      }
      .home_top_map_servseName {
        width: 1376px;
        height: 113px;
        font-size: 58px;
        font-family: Source Han Sans SC;
        text-align: center;
        font-weight: 800;
        color: #ffffff;
        line-height: 114px;
        margin-top: 46px;
        margin-left: 590px;
        background: url(@/assets/images/title_bg.png) no-repeat;
        background-size: cover;
        background-position: center center;
      }
      .home_top_map_main {
        width: 2108px;
        height: 1239px;
        margin-left: 450px;
        margin-top: 122px;
      }
    }
    .home_top_box {
      width: 927px;
      margin-left: 5px;
      height: 1518px;
      margin-top: 48px;
      background: rgba(18, 21, 103, 0.05);
      box-shadow: 0px 0px 88px 7px rgba(16, 93, 222, 0.22), 0px 0px 11px 3px rgba(0, 114, 255, 0.4);
      background: url(@/assets/images/tianqi_bg.png) no-repeat;
      background-size: cover;
      background-position: center center;
      .home_top_box_title {
        height: 155px;
        font-size: 42px;
        font-family: Source Han Sans SC;
        font-weight: bold;
        color: #32dcf8;
        line-height: 102px;
        text-align: center;
      }
    }
    .home_top_weather {
      display: flex;
      padding: 0px 10px 10px;
      // background-color: #f1f;
      .home_top_weather_cloud {
        width: 50%;
      }
      .home_top_weather_tem {
        width: 50%;

        .home_top_weather_tem_t {
          font-size: 111px;
          font-family: Source Han Sans SC;
          font-weight: bold;
          color: #ffffff;
          line-height: 91px;
        }
        .home_top_weather_tem_b {
          padding-left: 15px;
          font-size: 44px;
          font-family: Source Han Sans SC;
          font-weight: 400;
          color: #ffffff;
          // line-height: 36px;
        }
      }
    }
    .home_top_list {
      width: 832px;
      height: 1104px;
      margin: 0 47px;
      background: url(@/assets/images/list_bg.png) no-repeat;
      background-size: cover;
      background-position: center center;
      .home_top_list_item {
        text-align: right;
        font-size: 40px;
        // font-family: Source Han Sans SC;
        font-weight: bold;
        color: #32dcf8;
        padding-top: 53px;
        padding-bottom: 80px;
        padding-right: 40px;
      }
    }
  }
  .home_bot {
    display: flex;
    justify-content: space-around;
    height: 26%;
    width: 100%;
    .home_bot_title {
      height: 155px;
      font-size: 42px;
      font-family: Source Han Sans SC;
      font-weight: bold;
      color: #32dcf8;
      line-height: 102px;
      text-align: center;
    }
    .home_bot_tel {
      width: 927px;
      height: 514px;
      margin-top: 30px;
      background: url(@/assets/images/phone_bg.png) no-repeat;
      background-size: cover;
      background-position: center center;
      .home_bot_tel_title {
        height: 155px;
        font-size: 42px;
        font-family: Source Han Sans SC;
        font-weight: bold;
        color: #32dcf8;
        line-height: 102px;
        text-align: center;
      }
      .home_bot_tel_main {
        // width: 100%;
        // padding: 80px 10px 0;
        display: flex;
        text-align: center;
        align-items: center;
        justify-content: center;
        .home_bot_tel_main_phone {
          width: 76px;
          height: 72px;
          background: url(@/assets/images/phone.png) no-repeat;
          background-size: cover;
          background-position: center center;
        }
        .home_bot_tel_main_title {
          font-size: 40px;
          font-family: Source Han Sans SC;
          font-weight: 400;
          color: #ffffff;
          line-height: 48px;
          margin-left: 40px;
        }
      }
      .home_bot_tel_phone {
        display: flex;
        align-items: center;
        justify-content: space-evenly;
        margin-top: 87px;
        .home_bot_tel_phone_item {
          width: 75px;
          height: 108px;
          font-size: 64px;
          font-family: DIN Alternate;
          font-weight: bold;
          color: #ffffff;
          line-height: 102px;
          text-align: center;
          background: url(@/assets/images/font_bg.png) no-repeat;
          background-size: cover;
          background-position: center center;
        }
      }
    }
    .home_bot_road {
      width: 1826px;
      height: 514px;
      margin-top: 30px;
      background: url(@/assets/images/road_bg.png) no-repeat;
      background-size: cover;
      background-position: center center;
      .home_bot_road_title {
        height: 95px;
        font-size: 42px;
        font-family: Source Han Sans SC;
        font-weight: bold;
        color: #32dcf8;
        line-height: 102px;
        text-align: center;
      }
      .home_bot_road_info {
        box-sizing: border-box;
        width: 100%;
        height: 80%;
        padding: 0px 20px 10px;
        // background-color: rgb(1,8,99);
      }
    }
    .home_bot_person {
      width: 927px;
      height: 514px;
      margin-top: 30px;
      background: url(@/assets/images/person_bg.png) no-repeat;
      background-size: cover;
      background-position: center center;
      .home_bot_person_title {
        height: 95px;
        margin-bottom: 20px;
        font-size: 42px;
        font-family: Source Han Sans SC;
        font-weight: bold;
        color: #32dcf8;
        line-height: 102px;
        text-align: center;
      }
      .home_bot_person_box {
        display: flex;
        justify-content: space-evenly;
        align-items: center;
      }
      .home_bot_person_box_img {
        width: 300px;
        height: 340px;
        background: url(@/assets/images/img_bg.png) no-repeat;
        background-size: cover;
        background-position: center center;
      }
      .home_bot_person_box_info {
        height: 340px;
        .home_bot_person_box_info_box {
          display: flex;
          align-content: center;
          height: 25%;
          padding-top: 30px;
          // justify-content: space-between;
          .home_bot_person_box_info_box_font {
            font-size: 40px;
            font-family: Source Han Sans SC;
            font-weight: 400;
            color: #ffffff;
            line-height: 34px;
            margin-left: 25px;
          }
          .home_bot_person_box_info_box_name {
            width: 35px;
            height: 35px;
            background: url(@/assets/images/info_name.png) no-repeat;
            background-size: 35px 35px;
            background-position: center center;
          }
          .home_bot_person_box_info_box_health {
            width: 35px;
            height: 35px;
            background: url(@/assets/images/info_health.png) no-repeat;
            background-size: 35px 35px;
            background-position: center center;
          }
          .home_bot_person_box_info_box_phone {
            width: 35px;
            height: 35px;
            background: url(@/assets/images/info_phone.png) no-repeat;
            background-size: 35px 35px;
            background-position: center center;
          }
        }
      }
    }
  }
}
</style>
