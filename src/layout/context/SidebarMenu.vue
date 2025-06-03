<script setup lang="ts">
import { getComponent } from "@/api/permission";
import routeItem from "@/router/config";
import { useUserInfoState } from "@/store/useUserInfoStore";

const { isFixed, selectedKeys, collapsed } = inject<any>("paramsRef");

const emit = defineEmits(["breakpoint", "push-router"]);

const { data: datas } = await getComponent();
const { userInfo } = useUserInfoState();
const permissionMap: any = {
  1: [0, 1], // 普通用户和管理员
  2: [0], // 仅管理员
  3: [2], // 特殊权限
};
// 根据用户权限过滤路由
const routeItems = computed(() =>
  routeItem
    .filter((item) => !item.meta.isHide)
    .filter((item) => {
      const info = datas.find((data) => {
        return data.componentKey == item.name;
      });
      if (!info || !info.componentPermissions) {
        return true; // 如果没有权限信息，则显示该路由
      }

      const power = permissionMap[info.componentPermissions];

      if (power && power.includes(userInfo.power)) {
        return item;
      }
    })
);
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
      <div
        :class="{ collapsed: collapsed, logo: true }"
        @click="emit('push-router', routeItems[0])"
      >
        <span>Jz</span>
        <h2>博客管理系统</h2>
      </div>

      <AMenu v-model:selectedKeys="selectedKeys" mode="inline">
        <AMenu-item
          v-for="item in routeItems"
          :key="item.meta.key"
          @click="emit('push-router', item)"
          class="menuitem"
          style="display: flex; align-items: center"
        >
          {{ item.meta.isHide }}
          <span class="anticon">
            <LzyIcon :name="item.meta.uicon" style="font-weight: 600" size="16" />
          </span>
          <span class="menu-title-item">{{ item.meta.name }}</span>
        </AMenu-item>
      </AMenu>

      <!--  萌萌计数器  https://count.getloli.com/ -->
      <img
        class="moeCounter"
        width="315"
        height="100"
        src="https://count.getloli.com/@blogWb16?name=blogWb16&theme=asoul&padding=7&offset=0&align=top&scale=1&pixelated=1&darkmode=auto&num="
        alt=""
      />
    </div>
  </ALayoutSider>
</template>

<style scoped>
.ant-layout-sider {
  background-color: var(--color-bg);
  z-index: 2;
  box-shadow: 2px 0 8px 0px rgb(29, 35, 41, 0.05);
  overflow-x: hidden;

  .ant-layout-sider-children-item {
    height: 100%;
    display: flex;
    flex-direction: column;

    .ant-menu {
      flex: 1;
      overflow-y: auto;
    }
  }

  .logo {
    height: 60px;
    margin: 16px;
    text-align: center;
    color: var(--themeColor);
    font-family: "dindin", serif;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    background-color: transparent;

    span {
      font-size: 1.5em;
    }

    h2 {
      text-wrap: nowrap;
      transition: 0.2s;
    }

    &.collapsed {
      h2 {
        opacity: 0;
      }

      span {
        position: absolute;
        padding: 10px 15px;
        font-size: 2em;
      }
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
<style>
.ant-menu-inline-collapsed {
  .menu-title-item {
    display: none !important;
  }
}

.menuitem {
  display: flex;
  align-items: center;

  svg {
    transition: 0.13s;
  }

  &:hover {
    svg {
      transform: scale(1.15);
    }
  }

  span:nth-child(1) {
    display: flex;
    align-items: center;
  }
}
</style>
