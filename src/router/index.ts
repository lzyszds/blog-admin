import { createRouter, createWebHashHistory, createWebHistory } from 'vue-router'
import type { RouteRecordRaw } from 'vue-router'
import NProgress from 'nprogress' // 进度条
import 'nprogress/nprogress.css' // 引入样式
import { App } from 'vue'
const routes: RouteRecordRaw[] = [
  {
    path: '/',
    name: 'root',
    component: () => import('@/views/root/index.vue'),
    children: [
      {
        path: '',
        name: 'dashboard',
        component: () => import('@/views/root/Dashboard.vue'),
        meta: { icon: 'dashboard-icon', title: '仪表盘' }
      },
      {
        path: 'users',
        name: 'users',
        component: () => import('@/views/root/Users.vue'),
        meta: { icon: 'user-icon', title: '用户管理' }
      },
      {
        path: 'posts',
        name: 'posts',
        component: () => import('@/views/root/Posts.vue'),
        meta: { icon: 'post-icon', title: '文章管理' }
      },
      {
        path: 'comments',
        name: 'comments',
        component: () => import('@/views/root/Comments.vue'),
        meta: { icon: 'comment-icon', title: '评论管理' }
      },
      {
        path: 'categories',
        name: 'categories',
        component: () => import('@/views/root/Categories.vue'),
        meta: { icon: 'category-icon', title: '分类管理' }
      },
      {
        path: 'plantask',
        name: 'plantask',
        component: () => import('@/views/root/Plantask.vue'),
        meta: { icon: 'task-icon', title: '任务队列' }
      },
      {
        path: 'links',
        name: 'links',
        component: () => import('@/views/root/Links.vue'),
        meta: { icon: 'link-icon', title: '友链管理' }
      },
      {
        path: 'webset',
        name: 'webset',
        component: () => import('@/views/root/WebSet.vue'),
        meta: { icon: 'computer-settings-icon', title: '网站设置' }
      }
    ]
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
  scrollBehavior(_to, _from, _savedPosition) { // 始终滚动到顶部
    return { top: 0 }
  }
})

// 简单配置
NProgress.inc(0.4)
NProgress.configure({ easing: 'ease', speed: 1000, showSpinner: false })

// 进度条开始
router.beforeEach((_to, _from, next) => {
  NProgress.start()
  /* 登陆验证 */
  if (!localStorage.getItem('lzy_token')) {
    if (_to.path !== '/login') {
      next('/login')
    } else {
      next()
    }
  }else{
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
  await router.isReady();
}


export default router; // 确保有默认导出
