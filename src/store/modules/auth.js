import { defineStore } from 'pinia'
// import { http } from '@/api'
// import { getStorage } from '@/utils/storage'
// import { isEmpty } from '@/utils/validate'

export const useAuthStore = defineStore({
  id: 'store-auth',
  state: () => ({
    authButtonList: []
  }),
  getters: {
    authButtonListGet: (state) => state.authButtonList
  },

  actions: {
    async apiUserConfig() {
      // let { content } = await http('apiUserConfig')
      // return Promise.resolve(true)
    }
  }
})
