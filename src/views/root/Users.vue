<script setup lang="ts">
import { getUsersList } from "@/api/usersApi";
import LzyIcon from "@/components/LzyIcon.vue";
import useResetRefState from "@/hook/useResetRefState";
import { columns } from "@/typings/usersTable";
import { useTableScroll } from "@/hook/useTable";

const { tableWrapperRef, scrollConfig } = useTableScroll();

/* 搜索条件 */
const { state: searchCondition, reset } = useResetRefState({
  pages: 1,
  limit: 10,
  name: "",
  username: "",
  power: "",
});
const data = ref([]); //表格数据
const loading = ref(false); //加载中

function handleSearch() {
  loading.value = true;
  getUsersList(searchCondition.value).then((res) => {
    data.value = res.data;
    setTimeout(() => {
      loading.value = false;
    }, 500);
  });
}

handleSearch();
/* 表格选中项 */
const selectedRowKeys = ref([]);

const search = () => {
  handleSearch();
};
</script>

<template>
  <section style="display: grid; grid-template-rows: auto 1fr; gap: 20px">
    <a-card title="搜索工具" :bordered="false">
      <main class="searchCard">
        <section>
          <span>用户名：</span>
          <a-input v-model:value="searchCondition.name" placeholder="请输入用户名称" />
        </section>
        <section>
          <span>用户账号：</span>
          <a-input
            v-model:value="searchCondition.username"
            placeholder="请输入用户账号"
          />
        </section>

        <section>
          <span>用户权限：</span>
          <a-select
            v-model:value="searchCondition.power"
            style="width: 100%"
            allowClear
            placeholder="请选择用户权限"
          >
            <a-select-option value="0">超级管理员</a-select-option>
            <a-select-option value="1">普通用户</a-select-option>
          </a-select>
        </section>
        <section style="display: flex; gap: 10px">
          <a-button @click="reset">
            <LzyIcon name="hugeicons:exchange-01" /> 重置
          </a-button>
          <a-button @click="search">
            <LzyIcon name="hugeicons:search-area" /> 搜索
          </a-button>
        </section>
      </main>
    </a-card>

    <a-card title="角色列表">
      <main class="contentCard">
        <a-table
          ref="tableWrapperRef"
          :row-selection="{ selectedRowKeys }"
          :columns="columns"
          :data-source="data"
          :scroll="scrollConfig"
          :loading="loading"
        />
      </main>
    </a-card>
  </section>
</template>

<style scoped>
:deep(.searchCard) {
  display: grid;
  gap: 20px;
  grid-template-columns: repeat(6, 1fr);
  section {
    display: flex;
    align-items: center;
    span {
      text-wrap: nowrap;
      user-select: none;
    }
    button {
      letter-spacing: 3px;
      svg {
        font-size: 16px;
        margin-right: 5px;
      }
    }
  }
}
</style>
