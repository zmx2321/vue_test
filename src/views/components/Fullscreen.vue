<template>
  <div class="fullscreen">
    <el-icon style="font-size: 60px; color: #fff; font-weight: bold" @click="toggle" v-if="!isFullscreen"><FullScreen /></el-icon>
  </div>
</template>

<script setup>
import { useFullscreen } from '@vueuse/core'
import { ElIcon } from 'element-plus'

const { toggle, isFullscreen } = useFullscreen()
</script>
