<script setup lang="ts">
import { TokenService } from "@/hook/useTokenService";
import { useUserInfoState } from "@/store/useUserInfoStore";
import { useUserOnlineStore } from "@/store/useUserOnline.ts";
/* 获取用户信息 */
const userStore = useUserInfoState();

const userOnlineStore = useUserOnlineStore();

userStore.fetchUserInfo().then(() => {
  const url = import.meta.env.VITE_BASE_URL.replace("http", "ws").replace(
    "https",
    "wss",
  );
  //发送在线长连接
  const socket = new WebSocket(url + "/websocket");

  socket.addEventListener("open", () => {
    console.log("已连接到服务器");

    // 登录，发送 userId 给服务器
    const userId = userStore.userInfo.uid; // 假设这是用户的唯一标识，你需要根据你的实际情况生成或获取
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
});
</script>

<template>
  <!-- 个人中心 -->
  <ADropdown :trigger="['click']">
    <AButton type="text">
      <LzyIcon size="20" name="ph:user-circle-gear" />
      <span>
        {{ userStore.userInfo.uname ?? "Jz" }}
      </span>
    </AButton>
    <template #overlay>
      <AMenu>
        <AMenu-item key="1" @click="userStore.goToUserCenter">
          <LzyIcon size="18" name="ph:user-circle-duotone" />
          个人中心
        </AMenu-item>
        <AMenu-divider />
        <AMenu-item key="2" @click="userStore.logout">
          <LzyIcon size="18" name="ph:sign-out" />
          退出登陆
        </AMenu-item>
      </AMenu>
    </template>
  </ADropdown>
</template>

<style scoped>
.ant-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 5px;
  margin-left: 0;

  span {
    font-family: "dindin";
    font-size: 18px;
  }
}
</style>
