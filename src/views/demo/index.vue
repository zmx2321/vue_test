<template>
  <section class="demo_wrap">
    <el-menu :default-active="activeIndex" class="el-menu-demo" mode="horizontal" @select="handleSelect">
      <el-menu-item index="1">demo1</el-menu-item>
      <el-menu-item index="2">demo2</el-menu-item>
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

const activeIndex = ref('1')
const handleSelect = (key) => {
  switch (key) {
    case '1':
      router.push('/demo/demo1')
      break
    case '2':
      router.push('/demo/demo2')
      break
    default:
      break
  }
}
</script>

<style lang="scss" scoped>
.demo_wrap {
  .demo_main {
    width: 98%;
    height: calc(100vh - $headNavHeight - 40px);
    min-height: 300px;
    margin: 20px auto;
    border: solid 1px #a7a7a7;
    overflow: hidden;
  }
}
</style>
