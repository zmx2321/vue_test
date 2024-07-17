<template>
  <section class="tab_wrap">
    <ul @click="checkTab">
      <li ref="refLiList" v-for="(item, index) in tabList" :key="index">{{ item }}</li>
    </ul>
  </section>
</template>

<script setup>
import { ref, onMounted } from 'vue' // vue-core

// 父组件参数
const props = defineProps({
  tabList: {
    type: Array,
    default: () => []
  },
  currentIndex: {
    type: Number,
    default: 0
  }
})

// 全局变量
const refLiList = ref({})

// 子组件自定义事件
const emit = defineEmits(['checkTab'])

/**
 * 业务方法
 */
const initTab = () => {
  refLiList.value.forEach((item) => {
    item.classList.remove('selected')
  })
  refLiList.value[props.currentIndex].classList.add('selected')
}

// 选项卡
const checkTab = (e) => {
  let { target } = e
  let { textContent } = target

  refLiList.value.forEach((item) => {
    item.classList.remove('selected')
  })

  target.className = 'selected'

  emit('checkTab', textContent)
}

onMounted(() => {
  initTab()
})
</script>

<style lang="scss" scoped>
$titleMargin: 14px;
$tabRadius: 5px;

.tab_wrap {
  line-height: 38px;

  ul {
    margin-right: $titleMargin;
    background: #305392;
    border-radius: $tabRadius;

    li {
      display: inline-block;
      padding: 0 15px;
      font-size: 16px;
      border-radius: $tabRadius;
      color: #fff;
      cursor: pointer;
      transition: 0.2s linear;

      &:hover {
        background: #447acd;
        transition: 0.3s linear;
      }

      &.selected {
        font-weight: bold;
        background: #447acd;
      }
    }
  }
}
</style>
