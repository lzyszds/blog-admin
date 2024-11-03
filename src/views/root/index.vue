<script setup lang="ts">
import Layout from "@/layout/default.vue";

const layoutMain = templateRef<HTMLElement>("layoutMain");
</script>

<template>
  <main class="layoutMain" ref="layoutMain">
    <Suspense>
      <Layout></Layout>
    </Suspense>
  </main>
</template>

<style scoped>
.layoutMain {
  background-color: var(--themeColor);
  overflow: hidden;
  display: flex;
  justify-content: center;
  transition: 0.1s;
  padding: 0;
  height: calc(100vh);
  border-radius: 0; /* 默认样式 */

  .ant-layout {
    border-radius: 0;
  }
}

@media screen and (min-width: 768px) and (max-width: 991px) {
  .layoutMain {
    padding: 15px;
    height: calc(100vh - 30px);
    .ant-layout {
      border-radius: 10px;
    }
  }
}

@media screen and (min-width: 992px) and (max-width: 1299px) {
  .layoutMain {
    padding: 30px;
    height: calc(100vh - 60px);
    .ant-layout {
      border-radius: 10px;
    }
  }
}

@media screen and (min-width: 1300px) {
  .layoutMain {
    padding: 40px 60px;
    height: calc(100vh - 80px);
    .ant-layout {
      border-radius: 10px;
    }
  }
}
</style>
