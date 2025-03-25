import {RouteRecordRaw} from "vue-router";

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
            uicon: "solar:pie-chart-2-broken",
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
        path: "permission",
        name: "permission",
        component: () => import("@/views/root/Permission.vue"),
        meta: {
            key: 9,
            name: "权限设置",
            uicon: "hugeicons:permanent-job",
            component: "permission",
        },
    },
    {
        path: "userCenter",
        name: "userCenter",
        component: () => import("@/views/root/UserCenter.vue"),
        meta: {
            key: 10,
            name: "个人中心",
            uicon: "ph:user-circle-duotone",
            component: "userCenter",
            isHide: true,
        },
    },
    {
        path: "resources",
        name: "resources",
        component: () => import("@/views/root/Resources.vue"),
        meta: {
            key: 11,
            name: "资源管理",
            uicon: "iconoir:media-image-folder",
            component: "resources",
        },
    },
    {
        path: "sysLogs",
        name: "sysLogs",
        component: () => import("@/views/root/SysLogs.vue"),
        meta: {
            key: 12,
            name: "系统日志",
            uicon: "iconoir:calendar",
            component: "sysLogs",
        },
    },
    {
        path: "about",
        name: "about",
        component: () => import("@/views/root/About.vue"),
        meta: {
            key: 13,
            name: "关于项目",
            uicon:  "iconoir:rss-feed-tag",
            component: "about",
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
