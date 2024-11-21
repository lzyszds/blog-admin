import { RouteRecordRaw } from "vue-router";

export type Meta = {
  key: number;
  name: string;
  uicon: string;
  componentName?: string;
  isHide?: boolean;
  noClose?: boolean;
};

export type RouteItem = RouteRecordRaw & {
  meta: Meta;
};

const routeItem: RouteItem[] = [
  {
    path: "",
    name: "dashboard",
    component: () => import("@/views/root/Dashboard.vue"),
    meta: {
      key: 1,
      name: "首页数据",
      uicon: "hugeicons:home-01",
      component: "dashboard",
      noClose: true,
    },
  },
  {
    path: "users",
    name: "users",
    component: () => import("@/views/root/Users.vue"),
    meta: {
      key: 2,
      name: "用户管理",
      uicon: "hugeicons:edit-user-02",
      component: "users",
    },
  },
  {
    path: "posts",
    name: "posts",
    component: () => import("@/views/root/Posts.vue"),
    meta: {
      key: 3,
      name: "文章管理",
      uicon: "hugeicons:property-edit",
      component: "posts",
    },
  },
  {
    path: "comments",
    name: "comments",
    component: () => import("@/views/root/Comments.vue"),
    meta: {
      key: 4,
      name: "评论管理",
      uicon: "hugeicons:message-edit-01",
      component: "comments",
    },
  },
  {
    path: "categories",
    name: "categories",
    component: () => import("@/views/root/Categories.vue"),
    meta: {
      key: 5,
      name: "分类管理",
      uicon: "hugeicons:dashboard-square-edit",
      component: "categories",
    },
  },
  {
    path: "plantask",
    name: "plantask",
    component: () => import("@/views/root/Plantask.vue"),
    meta: {
      key: 6,
      name: "任务队列",
      uicon: "hugeicons:task-daily-02",
      component: "plantask",
    },
  },
  {
    path: "links",
    name: "links",
    component: () => import("@/views/root/Links.vue"),
    meta: {
      key: 7,
      name: "友链管理",
      uicon: "hugeicons:link-01",
      component: "links",
    },
  },
  {
    path: "webset",
    name: "webset",
    component: () => import("@/views/root/WebSet.vue"),
    meta: {
      key: 8,
      name: "网站设置",
      uicon: "hugeicons:computer-settings",
      component: "webset",
    },
  },
  {
    path: "userCenter",
    name: "userCenter",
    component: () => import("@/views/root/UserCenter.vue"),
    meta: {
      key: 9,
      name: "个人中心",
      uicon: "user-icon",
      component: "userCenter",
      isHide: true,
    },
  },
  {
    path: "sysLogs",
    name: "sysLogs",
    component: () => import("@/views/root/SysLogs.vue"),
    meta: {
      key: 10,
      name: "系统日志",
      uicon: "iconoir:calendar",
      component: "sysLogs",
    },
  },
];

// {
//   name: "退出登陆",
//   uicon: '<i class="iconfont">&#xe60b;</i>',
//   handle: () => {
//     localStorage.removeItem("lzy_token");
//     localStorage.removeItem("nowWeatherData");
//     router.push("/login");
//   },
// },
// {
//   name: "前往首页",
//   uicon: '<i class="iconfont">&#xe60b;</i>',
//   handle: () => {
//     window.open("http://localhost:1024/");
//   },
// },

export default routeItem;