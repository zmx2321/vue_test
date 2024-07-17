// import { HOME_URL } from '@/config'

/**
 * staticRouter (静态路由)
 */
export const staticRouter = [
  {
    path: '/',
    redirect: '/home'
  },
  {
    path: '/home',
    name: 'Index',
    component: () => import('@/views/Index.vue'),
    meta: {
      title: '首页',
      icon: 'House'
    }
  },
  {
    path: '/demo',
    name: 'Demo',
    redirect: '/demo/demo1',
    meta: {
      title: 'demo'
    },
    component: () => import('@/views/demo/index.vue'),
    children: [
      {
        path: '/demo/demo1',
        name: 'Demo1',
        meta: {
          title: 'demo1',
          keepAlive: true
        },
        component: () => import('@/views/demo/demo1/index.vue')
      },
      {
        path: '/demo/demo2',
        name: 'Demo2',
        meta: {
          title: 'demo2',
          keepAlive: true
        },
        component: () => import('@/views/demo/demo2/index.vue')
      }
    ]
  },
  {
    path: '/single',
    name: 'Single',
    redirect: '/single/single1',
    // redirect: '/single/index',
    component: () => import('@/views/single/index.vue'),
    meta: {
      title: 'Single'
    },
    children: [
      {
        path: '/single/single1',
        name: 'Single1',
        meta: {
          title: 'single1',
          keepAlive: true
        },
        component: () => import('@/views/single/single1/index.vue')
      },
      {
        path: '/single/single2',
        name: 'Single2',
        meta: {
          title: 'single2',
          keepAlive: true
        },
        component: () => import('@/views/single/single2/index.vue')
      }
    ]
  }
]
