<script setup lang="ts">
import { message } from "ant-design-vue";
import zhCN from "ant-design-vue/es/locale/zh_CN";


const themeMode = useStorage<"light" | "dark">("themeMode", "light");

const theme = computed(() => {
  const isDark = themeMode.value == "dark";
  if (isDark) document.documentElement.setAttribute("data-theme", themeMode.value);
  else document.documentElement.removeAttribute("data-theme");
  return {
    token: {
      colorPrimary: "#5161ce",
      colorPrimaryBg: "#5161ce15",
      colorPrimaryBgHover: "#bae0ff",
      colorBgContainer: isDark ? "#141414" : "#ffffff",
      colorText: isDark ? "#FFFFFF75" : "#000000",
      colorBgElevated: isDark ? "#1f1f1f" : "#ffffff",
      colorBorder: isDark ? "#434343" : "#d9d9d9",
      colorTextHeading: isDark ? "#FFFFFF" : "#000000",
      colorTextPlaceholder: isDark ? "#FFFFFF75" : "#00000080",
      colorFillSecondary: isDark ? "rgb(255 255 255 / 0.12)" : "#00000010",
      fontFamily:
        "PingFang SC,HarmonyOS_Regular,Helvetica Neue,Microsoft YaHei,sans-serif",
    },
  };
});

message.config({
  duration: 2,
  maxCount: 3,
  rtl: true,
  prefixCls: "my-message",
});
</script>

<template>
  <!-- antd 配置基础样式 -->
  <AConfigProvider :theme="theme" :locale="zhCN">
    <RouterView />
  </AConfigProvider>
</template>

<style scoped></style>
