<script setup lang="ts">
import { getUsersList } from "@/api/usersApi";
import LzyIcon from "@/components/LzyIcon.vue";
import useResetRefState from "@/hook/useResetRefState";
import { columns } from "@/typings/UsersTable";
import { useRequest } from "@/hook/useRequest";
import { useTableScroll } from "@/hook/useTable";
/* 获取表格滚动条高度 */
const { tableWrapperRef, scrollConfig } = useTableScroll();

/* 搜索条件 */
const { state: searchCondition, reset } = useResetRefState({
  pages: 1,
  limit: 10,
  name: "",
  username: "",
  power: "",
});

/* 表格选中项 */
const selectedRowKeys = ref([]);

const { data: tableData, loading, throttledRequest } = useRequest(getUsersList, 500);
throttledRequest(searchCondition.value);
</script>

<template>
  <section style="display: flex; flex-direction: column; gap: 20px">
    <a-card title="搜索工具" :bordered="false" ref="searchWrapperRef">
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
          <a-button @click="throttledRequest(searchCondition)">
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
          :data-source="tableData ? tableData.data : []"
          :scroll="scrollConfig"
          :loading="loading"
          size="small"
          row-key="id"
          class="h-full"
        />
      </main>
    </a-card>
  </section>
</template>

<style scoped>
:deep(.searchCard) {
  display: flex;
  gap: 20px;
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
    .ant-input {
      max-width: 160px;
    }
  }
  .ant-select-selector {
    min-width: 120px;
  }
}
:deep(.ant-table-body) {
  overflow-y: hidden !important;
}

@media (max-width: 1280px) {
  :deep(.searchCard) {
    flex-wrap: wrap;
  }
}
</style>
