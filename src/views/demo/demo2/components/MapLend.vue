<template>
  <!-- 图例 -->
  <section class="glmap_lend" @click="getLend" id="glmapLend">
    <!-- 图例 -->
    <ul v-if="currentCompany === 'main'">
      <li>
        <dl>
          <dt>
            <img src="../mapIco/map0/kx.png" alt="" />
          </dt>
          <dd>空闲</dd>
        </dl>
      </li>
      <li>
        <dl>
          <dt>
            <img src="../mapIco/map0/fm.png" alt="" />
          </dt>
          <dd>繁忙</dd>
        </dl>
      </li>
    </ul>
  </section>
</template>

<script setup>
import { ref } from 'vue'

// 全局变量
let currentCompany = ref('main')

// 自定义事件
const emit = defineEmits(['removePopup'])

// 返回
const goBack = () => {
  console.log('点击标注-返回')
  // currentCompany.value = 'main'
}

// 点击显示隐藏
const toggleLend = (calss) => {
  // console.log(refLend.value.parentNode)
  let dnCls = 'f-dn'

  document
    .getElementById('glmapLend')
    .parentNode.querySelectorAll(calss)
    .forEach((item) => {
      if (!item.classList.contains(dnCls)) {
        item.classList.add(dnCls)
      } else {
        item.classList.remove(dnCls)
      }
    })
}

// 配置lend封装
const setLendConfig = (nodeTxt, txt, nodeDom) => {
  if (nodeTxt === txt) {
    toggleLend(nodeDom)
  }
}
// lend事件
const getLend = (e) => {
  let { target } = e
  let { nodeName, textContent } = target
  let nodeTxt = ''
  // console.log(target)

  if (nodeName === 'IMG') {
    nodeTxt = target.parentNode.parentNode.textContent
  }
  if (nodeName === 'DL' || nodeName === 'DD') {
    nodeTxt = textContent
  }

  // 移除气泡
  emit('removePopup')

  // console.log(nodeTxt)
  lendConfig(nodeTxt) // lend配置
}
// lend配置 - 显示隐藏
const lendConfig = (nodeTxt) => {
  // console.log(nodeTxt)
  /**
   * 首页大屏图例
   */
  setLendConfig(nodeTxt, '空闲', '.map0_mksty0')
  setLendConfig(nodeTxt, '繁忙', '.map0_mksty1')
}

/**
 * 暴露方法 - 供父组件执行
 */
defineExpose({
  goBack
})
</script>

<style lang="scss" scoped>
// 图例
.glmap_lend {
  position: absolute;
  bottom: 0;
  right: 28px;

  ul {
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
    width: 188px;

    li {
      width: 88px;
      height: 26px;
      margin-bottom: 13px;
      cursor: pointer;
      text-align: right;

      &:nth-child(even) {
        margin-right: 0;
      }

      dl {
        width: 100%;
        padding-right: 10px;

        &::after {
          content: '';
          display: block;
          clear: both;
          height: 0;
          overflow: hidden;
          visibility: hidden;
        }

        dt,
        dd {
          float: left;
        }

        dt {
          width: 21px;
          height: 24px;
          overflow: hidden;

          img {
            width: 100%;
            height: 100%;
          }
        }

        dd {
          position: relative;
          top: 2px;
          left: 6px;
          font-size: 14px;
          color: #adb1bc;
        }
      }
    }
  }
}
</style>
