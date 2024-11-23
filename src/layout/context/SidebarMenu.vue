<script setup lang="ts">
import routeItem from "@/router/config";
const { isFixed, selectedKeys, collapsed } = inject<any>("paramsRef");

const emit = defineEmits(["breakpoint", "push-router"]);

let routeItems = routeItem.filter((item) => !item.meta.isHide);
</script>

<template>
  <ALayoutSider
    v-model:collapsed="collapsed"
    :trigger="null"
    collapsible
    :collapsed-width="!isFixed ? 80 : 0"
    breakpoint="sm"
    :class="{ fixed: isFixed, menu: true }"
    @breakpoint="emit('breakpoint', $event)"
  >
    <div class="ant-layout-sider-children-item">
      <div class="logo" @click="emit('push-router', routeItems[0])">
        <h2>{{ collapsed ? "Jz" : "Jz 博客管理系统" }}</h2>
      </div>

      <AMenu v-model:selectedKeys="selectedKeys" mode="inline">
        <AMenu-item
          v-for="item in routeItems"
          :key="item.meta.key"
          @click="emit('push-router', item)"
          class="menuitem"
        >
          {{ item.meta.isHide }}
          <span class="anticon anticon-user">
            <LzyIcon :name="item.meta.uicon" style="font-weight: 600" />
          </span>
          <span class="menu-title-item">{{ item.meta.name }}</span>
        </AMenu-item>
      </AMenu>

      <!--  萌萌计数器  https://count.getloli.com/ -->
      <img
        class="moeCounter"
        src="https://count.getloli.com/@blogWb16?name=blogWb16&theme=asoul&padding=7&offset=0&align=top&scale=1&pixelated=1&darkmode=auto&num="
      />
    </div>
  </ALayoutSider>
</template>

<style scoped>
.ant-layout-sider {
  background-color: var(--color-bg);
  z-index: 2;
  box-shadow: 2px 0 8px 0px rgb(29, 35, 41, 0.05);
  .ant-layout-sider-children-item {
    height: 100%;
    display: flex;
    flex-direction: column;
    .ant-menu {
      flex: 1;
    }
  }
  .logo {
    height: 60px;
    margin: 16px;
    text-align: center;
    color: var(--themeColor);
    font-family: "dindin";
    overflow: hidden;
    cursor: pointer;
    background-color: transparent;
    h2 {
      text-wrap: nowrap;
    }
  }
  .moeCounter {
    width: 100%;
    padding: 10%;
  }
  ul.ant-menu {
    border-inline-end: none !important;
  }
}
</style>
