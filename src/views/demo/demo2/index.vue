<template>
  <section class="demo_cont">
    <ul class="demo_btn_cont">
      <li><el-button @click="linkTo('demo2-1')">demo2-1</el-button></li>
      <li><el-button @click="linkTo('demo2-2')">demo2-2</el-button></li>
      <li><el-button @click="linkTo('demo2-3')">demo2-3</el-button></li>
      <li><el-button @click="linkTo('demo2-4')">demo2-4</el-button></li>
      <li><el-button @click="linkTo('demo2-5')">demo2-5</el-button></li>
      <p style="margin-top: 20px">当前页面：{{ currentItemPage }}</p>
    </ul>

    <div class="demo_item_cont">
      <demo2T1 v-if="currentItemPage === 'demo2-1'" />
      <demo2T2 v-if="currentItemPage === 'demo2-2'" />
      <demo2T3 v-if="currentItemPage === 'demo2-3'" />
      <demo2T4 v-if="currentItemPage === 'demo2-4'" />
      <demo2T5 v-if="currentItemPage === 'demo2-5'" />
    </div>
  </section>
</template>

<script setup>
/**
 * 引入
 */
import { ref } from 'vue'
import demo2T1 from './demo2-1.vue'
import demo2T2 from './demo2-2.vue'
import demo2T3 from './demo2-3.vue'
import demo2T4 from './demo2-4.vue'
import demo2T5 from './demo2-5.vue'

/**
 * 公共数据
 */
let currentItemPage = ref('demo2-5')

/**
 *
 * 方法
 */
const linkTo = (val) => {
  // console.log(val)

  currentItemPage.value = val
}
</script>

<style lang="scss" scoped>
@import url(../styles/demoCommonStyle.scss);
</style>
