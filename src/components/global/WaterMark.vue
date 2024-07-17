<template>
  <section class="tool_wrap">
    <!-- 水印 -->
    <div class="watermark_wrap">
      <div class="itemWarp1" v-for="(item1, i1) in 8" :key="i1" :style="`top:${140 * i1}px`">
        <div class="item" v-for="(item, i) in 10" :key="i" :style="`left:${200 * i + 20}px`">
          <p style="margin-bottom: 3px">{{ urlObj.userName }}&nbsp;&nbsp;{{ urlObj.suffixPhone }}</p>
          <p>
            {{ `${new Date().getFullYear()}`.slice(2) }}
            {{ `${new Date().getMonth() + 1}`.padStart(2, '0') }}
            {{ `${new Date().getDate()}`.padStart(2, '0') }}
          </p>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref } from 'vue'

const urlObj = ref({
  userName: '111',
  suffixPhone: '111'
})
</script>

<style lang="scss" scoped>
.watermark_wrap {
  position: fixed;
  width: 100%;
  height: 1080px;
  top: 0;
  left: 0;

  .itemWarp1 {
    position: absolute;
    height: 50px;
    width: 100%;
    left: 0;
    .item {
      position: absolute;
      top: 10px;
      font-size: 14px;
      font-weight: 400;
      color: rgba(255, 255, 255, 0.2);
      transform: rotateZ(-25deg);
      font-family: 'Microsoft YaHei';
    }
  }
}
</style>
