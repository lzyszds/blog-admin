<script setup lang="ts">
const searchCondition = ref({
  name: "",
  username: "",
  power: "",
});
</script>

<template>
  <section style="display: grid; gap: 20px">
    <a-card title="搜索工具" :bordered="false">
      <div class="searchCard">
        <p>
          <span>用户名：</span>
          <a-input v-model:value="searchCondition.name" placeholder="请输入用户名称" />
        </p>
        <p>
          <span>用户账号：</span>
          <a-input
            v-model:value="searchCondition.username"
            placeholder="请输入用户账号"
          />
        </p>
      </div>
    </a-card>
    <a-card title="角色列表" :bordered="false">
      <p></p>
    </a-card>
  </section>
</template>

<style scoped>
:deep(.searchCard) {
  display: grid;
  gap: 20px;
  grid-template-columns: repeat(6, 1fr);
  p {
    display: flex;
    align-items: center;
    span {
      text-wrap: nowrap;
      user-select: none;
    }
  }
}
</style>
