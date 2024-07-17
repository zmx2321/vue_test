import { createApp } from 'vue'
import App from './App.vue'
// 页面样式
import '@/styles/index.scss'
// eslint-disable-next-line import/order
import * as ElementPlusIconsVue from '@element-plus/icons-vue'
import components from '@/components/index.js'

// svg-icons
import 'virtual:svg-icons-register'
//  vue router
import router from './router'
// pinia store
import pinia from '@/store'
// errorHandler
import errorHandler from '@/utils/errorHandler'
// custom directives
import directives from '@/directives/index'

const app = createApp(App)

app.config.errorHandler = errorHandler
Object.entries(ElementPlusIconsVue).forEach(([key, component]) => {
  app.component(key, component)
})

app.use(pinia).use(directives).use(router).use(components).mount('#app')
