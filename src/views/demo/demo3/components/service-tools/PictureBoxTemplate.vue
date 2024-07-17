<template>
  <section class="picture_box" @mouseover="getDataByEvent" @click="getDataByEvent">
    <img :src="areaImage" />

    <slot />
  </section>
</template>

<script setup>
// 引入库
// import { ref } from 'vue'
import mittBus from '@/utils/mittBus' // mitt
// store
import { demoStoreData } from '@/store/modules/demo-store-data.js'

/**
 * 父组件参数
 */
defineProps({
  areaImage: {
    type: String,
    default: () => {}
  }
})

/**
 * 定义常量、变量
 */
const { setCurrentBunkNo } = demoStoreData() // store
let tipNum = '' // 当前编号
// ref
// const refAreaDetail = ref(null)

/**
 * 定义方法
 */
// 根据事件对象获取数据
const getDataByEvent = (e) => {
  let { target, type } = e
  let { nodeName } = target

  if (nodeName === 'DIV') {
    tipNum = target.parentNode.textContent
  }
  if (target.nodeName === 'B') {
    tipNum = target.textContent
  }

  if (type === 'click' && (nodeName === 'DIV' || nodeName === 'B')) {
    // console.log(mittBus)
    mittBus.emit('clickArea', tipNum)
  }

  setCurrentBunkNo(tipNum)
}
</script>

<style lang="scss" scoped>
// @import '../scss//common.scss';

.picture_box {
  position: relative;
  padding: 0;
  width: 800px;
  height: 280px;
  overflow: hidden;
  animation: fadeRightBig 0.8s 0.2s ease both;

  ::v-deep .blank,
  ::v-deep .blank1,
  ::v-deep .blank2 {
    display: none;
    position: absolute;
    left: 0;
    top: 0;
    opacity: 1;
    width: 100px;
    height: 100px;
    // background: $normalColor;
    transition: 0.2s linear;
    // background: #fff;

    &.soon {
      // background: $soonColor;
    }
    &.empty {
      // background: $emptyColor;
    }
    // 空白
    &.white {
      opacity: 1 !important;
      background: #fff !important;
      cursor: default;
    }
  }

  img {
    width: 100%;
    height: 100%;
  }
}

@keyframes fadeRightBig {
  0% {
    opacity: 0;
    transform: translateX(800px);
  }
  100% {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
