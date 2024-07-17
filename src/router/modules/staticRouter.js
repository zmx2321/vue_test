// import { HOME_URL } from '@/config'

/**
 * staticRouter (静态路由)
 */
export const staticRouter = [
  {
    path: '/',
    redirect: '/demo/demo5'
  },
  {
    path: '/demo/screen',
    name: 'screen',
    component: () => import('@/views/demo/screen/index.vue')
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
    component: () => import('@/views/demo/index.vue'),
    meta: {
      title: 'Demo',
      icon: 'House'
    },
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
      },
      {
        path: '/demo/demo3',
        name: 'Demo3',
        meta: {
          title: 'demo3',
          keepAlive: true
        },
        component: () => import('@/views/demo/demo3/index.vue')
      },
      {
        path: '/demo/demo4',
        name: 'Demo4',
        meta: {
          title: 'demo4',
          keepAlive: true
        },
        component: () => import('@/views/demo/demo4/index.vue')
      },
      {
        path: '/demo/demo5',
        name: 'Demo5',
        meta: {
          title: 'demo5',
          keepAlive: true
        },
        component: () => import('@/views/demo/demo5/index.vue')
      }
    ]
  }
]
