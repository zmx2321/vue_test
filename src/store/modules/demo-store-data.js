import { defineStore } from 'pinia'

export const demoStoreData = defineStore({
  id: 'demo-store-data',

  state: () => ({
    currentBunkList: [], // 过滤后的店铺数据
    currentBunkNo: '' // 当前选择的tooltip编号
  }),

  actions: {
    setCurrentBunkList(currentBunkList) {
      this.currentBunkList = currentBunkList
    },
    setCurrentBunkNo(currentBunkNo) {
      this.currentBunkNo = currentBunkNo
    }
  }
})
