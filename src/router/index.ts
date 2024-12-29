import { createRouter, createWebHashHistory, createWebHistory } from 'vue-router'
import type { RouteRecordRaw } from 'vue-router'
import routesChildren from './config'
import NProgress from 'nprogress' // 进度条
import 'nprogress/nprogress.css' // 引入样式
import { App } from 'vue'
import { TokenService } from '@/hook/useTokenService'
const routes: RouteRecordRaw[] = [
  {
    path: '/',
    name: 'root',
    component: () => import('@/views/root/index.vue'),
    children: routesChildren
  },
  {
    path: '/login',
    name: 'login',
    component: () => import('@/views/login/index.vue'),
    meta: {
      title: '登录',
      requiresAuth: false
    }
  }
  // {
  //     path: "/:catchAll(.*)",
  //     name: 'undefind404',
  //     component: undefind404 // 注意，没有重定向就会出现两个一模一样的home页面
  // },
]
export const router = createRouter({
  history: import.meta.env.VITE_ROUTER_MODE === 'hash'
    ? createWebHashHistory()
    : createWebHistory(),
  routes,
  strict: true,
})

// 简单配置
NProgress.inc(0.4)
NProgress.configure({ easing: 'ease', speed: 1000, showSpinner: false })

// 进度条开始
router.beforeEach((_to, _from, next) => {
  NProgress.start()
  /* 登陆验证 */
  if (!TokenService.isAuthenticated()) {
    if (_to.path !== '/login') {
      next('/login')
    } else {
      next()
    }
  } else {
    next()
  }
})

// 进度条结束
router.afterEach(() => {
  NProgress.done()
})


/** Setup Vue Router */
export async function setupRouter(app: App) {
  app.use(router);
  // await router.isReady();
}


export default router; // 确保有默认导出
