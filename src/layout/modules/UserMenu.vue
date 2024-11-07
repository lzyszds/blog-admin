<script setup lang="ts">
import { useUserInfoState } from "@/store/useUserInfoStore";
/* 获取用户信息 */
const userStore = useUserInfoState();
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
