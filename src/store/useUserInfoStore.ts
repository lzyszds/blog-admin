import { defineStore } from "pinia";
import { getUserInfoToken } from "@/api/user";
import { UserAdmin } from "@/typings/User";
import { useTabsState } from "@/store/useTabsStore";
import routeItem from "@/router/config";
import { TokenService } from "@/hook/useTokenService";
import { useUserOnlineStore } from "@/store/useUserOnline.ts";

const userOnlineStore = useUserOnlineStore();

const tabsState = useTabsState();

export const useUserInfoState = defineStore("useUserInfoState", () => {
  const userInfo = ref<UserAdmin>({});
  const isLogin = ref(false);
  const isAdmin = ref(false);
  const isEditor = ref(false);
  const isUser = ref(false);
  const isSuperAdmin = ref(false);
  const router = useRouter();

  // 获取用户信息的函数
  const fetchUserInfo = async () => {
    const res = await getUserInfoToken();
    if (res.code === 200) {
      userInfo.value = res.data;
      isLogin.value = true;
      isAdmin.value = res.data.role === "admin";
      isEditor.value = res.data.role === "editor";
      isUser.value = res.data.role === "user";


      const url = import.meta.env.VITE_BASE_URL.replace("http", "ws").replace(
        "https",
        "wss",
      );
      //发送在线长连接
      const socket = new WebSocket(url + "/websocket");

      socket.addEventListener("open", () => {
        console.log("已连接到服务器");

        // 登录，发送 userId 给服务器
        const userId = userInfo.value.uid; // 假设这是用户的唯一标识，你需要根据你的实际情况生成或获取
        socket.send(
          JSON.stringify({ type: "在线", userId, token: TokenService.getToken() }),
        );
      });

      socket.addEventListener("message", (event) => {
        const data = JSON.parse(event.data);
        
        if (data.type === "onlineUsers") {
          console.log("Online users:", userOnlineStore.onlinePeople);
          // 在这里更新页面上的在线用户列表
          userOnlineStore.setUserOnline(data.data);
        }
      });

    } else {
      await router.push("/login");
    }
  };

  /* 退出登录 */
  const logout = async () => {
    TokenService.removeToken();
    await router.push("/login");
    setTimeout(() => {
      router.go(0);
    }, 0);
  };

  /* 前往个人中心 */
  const goToUserCenter = async () => {
    tabsState.setKeyArr(routeItem.find((item) => item.name === "userCenter")!);
    router.push({ name: "userCenter" });
  };

  // 初始化时调用一次
  fetchUserInfo();

  return {
    userInfo, // 用户信息
    isLogin, // 是否登录
    isAdmin, // 是否是管理员
    isEditor, // 是否是编辑者
    isUser, // 是否是普通用户
    isSuperAdmin, // 是否是超级管理员
    fetchUserInfo, // 获取用户信息
    logout, // 注销登陆
    goToUserCenter, // 前往个人中心
  };
});
