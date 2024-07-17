<template>
  <scale-box :width="scaleConfig.pageWidth" :height="scaleConfig.pageHight">
    //自适应内容
  </scale-box>
</template>

<script setup>
import { ref } from "vue";

import ScaleBox from '@/components/SacaleAuto/index.vue'

const scaleConfig = ref({
  pageWidth: 1920,
  pageHight: 1080,
});

// scaleConfig.value.pageHight = window.screen.availHeight;
// scaleConfig.value.pageWidth = window.screen.availWidth;
</script>

<style lang="scss" scoped></style>