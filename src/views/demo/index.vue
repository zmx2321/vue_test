<template>
  <section class="demo_wrap">
    <el-menu :default-active="activeIndex" class="el-menu-demo" mode="horizontal" @select="handleSelect">
      <el-menu-item index="0">大屏自适应</el-menu-item>
      <el-menu-item index="1">图表demo</el-menu-item>
      <el-menu-item index="2">地图demo</el-menu-item>
      <el-menu-item index="3">demo3</el-menu-item>
      <el-menu-item index="4">openlayer</el-menu-item>
      <el-menu-item index="5">demo5</el-menu-item>
    </el-menu>

    <div class="demo_main">
      <router-view />
    </div>
  </section>
</template>

<script setup>
import { ref, defineProps } from 'vue'
import { useRouter /* useRoute */ } from 'vue-router'

const router = useRouter()
// const route = useRoute()

defineProps({
  /* message: {
    type: String,
    default: '',
    required: true
  } */
})

const activeIndex = ref('5')
const handleSelect = (key) => {
  console.log(key)

  switch (key) {
    case '0':
      router.push('/demo/screen')
      break
    case '1':
      router.push('/demo/demo1')
      break
    case '2':
      router.push('/demo/demo2')
      break
    case '3':
      router.push('/demo/demo3')
      break
    case '4':
      router.push('/demo/demo4')
      break
    case '5':
      router.push('/demo/demo5')
      break
    default:
      break
  }
}
</script>

<style lang="scss" scoped>
.demo_wrap {
  position: fixed;
  width: 100vw;
  height: 100vh;
  left: 0;
  top: 0;

  .demo_main {
    width: 98%;
    margin: 20px auto;
    height: 75vh;
    border: solid 1px #a7a7a7;
    overflow: auto;
  }
}
</style>
