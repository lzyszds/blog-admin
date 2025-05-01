<script setup lang="ts">
const themeArr = {
  light: "iconoir:sun-light",
  dark: "iconoir:half-moon",
  // system: "material-symbols:brightness-auto-rounded",
};
const themeMode = useStorage<"light" | "dark">("themeMode", "light");

const toggleTheme = () => {
  themeMode.value = themeMode.value === "light" ? "dark" : "light";
};
</script>

<template>
  <!-- 主题配置 -->
  <ATooltip placement="bottom">
    <template #title> 主题模式 </template>
    <AButton type="text" @click="toggleTheme">
      <LzyIcon size="20" :name="themeArr[themeMode]" />
    </AButton>
  </ATooltip>
</template>

<style scoped></style>
