<template>
  <section class="info_content">
    <ul>
      <li>
        <dl>
          <dt>归属：</dt>
          <dd>{{ currentBoxData.type === 1 ? '嘉兴二楼' : '嘉兴三楼' }}</dd>
        </dl>
      </li>
      <li>
        <dl>
          <dt>编号：</dt>
          <dd>{{ currentBoxData.bunkNo }}</dd>
        </dl>
      </li>
      <li>
        <dl>
          <dt>名称：</dt>
          <dd>{{ currentBoxData.name }}</dd>
        </dl>
      </li>
      <li>
        <dl>
          <dt>详情：</dt>
          <dd>{{ currentBoxData.detail }}</dd>
        </dl>
      </li>
      <li>
        <dl>
          <dt>状态：</dt>
          <dd>{{ currentBoxData.status }}</dd>
        </dl>
      </li>
    </ul>
  </section>
</template>

<script setup>
// 引入库
import { ref } from 'vue'
// store
import { demoStoreData } from '@/store/modules/demo-store-data.js'

/**
 * 定义常量、变量
 */
const demoDataStore = demoStoreData()
const currentBunkNo = demoDataStore.currentBunkNo
const currentBunkList = demoDataStore.currentBunkList
const currentBoxData = ref(...currentBunkList.filter((item) => item.bunkNo === currentBunkNo))
</script>

<style lang="scss" scoped>
.info_content {
  ul {
    li {
      dl {
        dt,
        dd {
          display: inline-block;
        }
      }
    }
  }
}
</style>
