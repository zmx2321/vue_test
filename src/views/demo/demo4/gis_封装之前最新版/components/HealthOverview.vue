<template>
  <section class="health_overview_wrap">
    <div class="health_overview_cont">健康度概览</div>
  </section>
</template>

<script setup></script>

<style lang="scss" scoped>
.health_overview_wrap {
  display: block;
  position: absolute;
  top: 70px;
  right: 12px;
  padding: 0;
  width: 550px;

  .health_overview_cont {
    width: 95%;
    min-height: 100px;
    max-height: 70vh;
    padding: 10px 0 0 10px;
    overflow: auto;
    background: rgba(255, 255, 255, 0.8);
    border-radius: 10px;
  }
}
</style>
