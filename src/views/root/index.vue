<script setup lang="ts">
import Layout from "@/layout/default.vue";

const layoutMain = templateRef<HTMLElement>("layoutMain");
onMounted(() => {
  const { width } = useWindowSize();
  watchEffect(() => {
    if (width.value < 768) {
      layoutMain.value.style.padding = "0";
      //@ts-ignore
      layoutMain.value.querySelector(".ant-layout")!.style.borderRadius = "0";
    } else if (width.value < 992) {
      layoutMain.value.style.padding = "40px";
      layoutMain.value.style.height = "calc(100vh - 80px)";
    } else {
      layoutMain.value.style.padding = "80px";
      layoutMain.value.style.height = "calc(100vh - 160px)";
      //@ts-ignore
      layoutMain.value.querySelector(".ant-layout")!.style.borderRadius = "10px";
    }
  });
});
</script>

<template>
  <main class="layoutMain" ref="layoutMain">
    <Layout></Layout>
  </main>
</template>

<style scoped>
.layoutMain {
  background-color: var(--themeColor);
  height: calc(100vh - 160px);
  padding: 80px;
  overflow: hidden;
  display: flex;
  justify-content: center;
  transition: 0.1s;
}
</style>
