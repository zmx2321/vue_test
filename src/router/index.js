import { createRouter, /* createWebHistory */ createWebHashHistory } from 'vue-router'
import { staticRouter } from '@/router/modules/staticRouter'
import NProgress from '@/config/nprogress'
import { setStorage } from '@/utils/storage.js'

const router = createRouter({
  // history: createWebHistory(import.meta.env.VITE_PUBLIC_PATH), // createWebHashHistory
  history: createWebHashHistory(import.meta.env.VITE_PUBLIC_PATH), // createWebHashHistory
  routes: [...staticRouter],
  strict: false,
  scrollBehavior: () => ({ left: 0, top: 0 })
})

/**
 * @description 路由拦截 beforeEach
 * */
router.beforeEach(async (to, from, next) => {
  // 1.NProgress 开始
  NProgress.start()
  if (to.query.screenId) {
    setStorage('screenId', to.query.screenId)
  }

  // 2.动态设置标题
  const title = import.meta.env.VITE_GLOB_APP_TITLE
  document.title = to.meta.title ? `${to.meta.title} - ${title}` : title

  next()
})

/**
 * @description 路由跳转错误
 * */
router.onError((error) => {
  NProgress.done()
  console.warn('路由错误', error.message)
})

/**
 * @description 路由跳转结束
 * */
router.afterEach(() => {
  NProgress.done()
})

export default router
