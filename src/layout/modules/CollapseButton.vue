<script setup lang="ts">
const { collapsed, isFixed } = inject("paramsRef") as any;
</script>

<template>
  <div>
    <!-- 折叠按钮 -->
    <template v-if="!isFixed">
      <a-tooltip placement="bottomLeft" :mouseLeaveDelay="0">
        <template #title>
          <span>折叠菜单</span>
        </template>
        <AButton type="text" v-if="collapsed" @click="() => (collapsed = !collapsed)">
          <LzyIcon class="trigger" name="ant-design:menu-unfold-outlined" />
        </AButton>

        <AButton type="text" v-else @click="() => (collapsed = !collapsed)">
          <LzyIcon class="trigger" name="ant-design:menu-fold-outlined" />
        </AButton>
      </a-tooltip>
    </template>
    <template v-else>
      <AButton type="text" v-if="collapsed" @click="() => (collapsed = !collapsed)">
        <LzyIcon class="trigger" name="ant-design:menu-unfold-outlined" />
      </AButton>
      <AButton type="text" v-else @click="() => (collapsed = !collapsed)">
        <LzyIcon class="trigger" name="ant-design:menu-fold-outlined" />
      </AButton>
    </template>
  </div>
</template>

<style scoped>
button {
  padding: 8px 15px;
  margin-right: 10px;
  border: none;
  background-color: transparent;
  transition: 0.3s;
  border-radius: 5px;
  box-shadow: none;
  margin-top: 20px;
  &:hover {
    background: #99999930;
    color: var(--themeColor);
  }

  svg.trigger {
    font-size: 17px;
    cursor: pointer;
    vertical-align: initial;
  }
}
</style>
