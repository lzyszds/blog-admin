<script setup lang="ts">
import {useUserInfoState} from "@/store/useUserInfoStore";
import LzyIcon from "@/components/LzyIcon.vue";
/* 获取用户信息 */
const userStore = useUserInfoState();

const handleMenuList = [
  {
    key: "1",
    icon: "ph:github-logo",
    title: "Github",
    click: () => window.open("https://github.com/lzyszds/blog-admin")
  },
  {
    key: "2",
    icon: "ph:user-circle-duotone",
    title: "个人中心",
    click: userStore.goToUserCenter
  },
  {
    key: "3",
    icon: "ph:sign-out",
    title: "退出登陆",
    click: userStore.logout
  }
]

</script>

<template>
  <!-- 个人中心 -->
  <ADropdown :trigger="['click']">
    <AButton type="text">
      <LzyIcon size="20" name="ph:user-circle-gear"/>
      <span>
        {{ userStore.userInfo.uname ?? "Jz" }}
      </span>
    </AButton>
    <template #overlay>
      <AMenu>
        <AMenu-item v-for="item in handleMenuList" :key="item.key" @click="item.click">
          <LzyIcon size="18" :name="item.icon"/>
          <span style="text-align: center;margin-left: 8px">{{ item.title }}</span>
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
