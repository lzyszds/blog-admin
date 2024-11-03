
export type Items = {
  key: number;
  name: string;
  uicon: string;
  component?: string;
};

const items: Items[] = [
  {
    key: 1,
    name: "首页",
    uicon: 'hugeicons:home-01',
    component: "dashboard",
  },
  {
    key: 2,
    name: "用户管理",
    uicon: 'hugeicons:edit-user-02',
    component: "users",
  },
  {
    key: 3,
    name: "文章管理",
    uicon: 'hugeicons:property-edit',
    component: "posts",
  },
  {
    key: 4,
    name: "评论管理",
    uicon: 'hugeicons:message-edit-01',
    component: "comments",
  },
  {
    key: 5,
    name: "分类管理",
    uicon: 'hugeicons:dashboard-square-edit',
    component: "categories",
  },
  {
    key: 6,
    name: "任务队列",
    uicon: 'hugeicons:task-daily-02',
    component: "plantask",
  },
  {
    key: 7,
    name: "友链管理",
    uicon: 'hugeicons:link-01',
    component: "links",
  },
  {
    key: 8,
    name: "网站设置",
    uicon: 'hugeicons:computer-settings',
    component: "webset",
  },
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
];

export default items;