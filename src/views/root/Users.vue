<script setup lang="ts">
import {
  getUsersList,
  addUser,
  editUser,
  delUser,
  getAllHeadImg,
  uploadHeadImg,
} from "@/api/userApi";
import LzyIcon from "@/components/LzyIcon.vue";
import UserForm from "@/components/form/User.vue";
import useResetRefState from "@/hook/useResetRefState";
import { getUsersTable } from "@/store/usersTable";
import { useRequest } from "@/hook/useRequest";
import { useTableScroll } from "@/hook/useTable";
import { Key } from "ant-design-vue/es/_util/type";
import TableHeaderOperation from "@/components/TableHeaderOperation.vue";
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
const selectedRowKeys = ref<Key[]>([]);

/* 表格选择 */
const onSelectChange = (keys: Key[]) => {
  selectedRowKeys.value = keys;
};
/* 弹窗参数 */
const modalParams = ref({
  isOpen: false,
  title: "添加用户",
  params: {},
  headimgs: [],
  sureCallback: {
    uploadHeadImg,
    callback: addUser,
    refreshData: () => throttledRequest(searchCondition),
  },
});

/* 获取表格数据 并生成防抖函数  */
const { data: tableData, loading, throttledRequest } = useRequest(getUsersList);
throttledRequest(searchCondition);

/* 表格列表数据 提供的部分方法 */
const usersTableData = getUsersTable();

//真正的数据Columns
const columns = computed(() => usersTableData.columns.filter((item) => item.checked));

/* 设置表格列表数据的回调方法 */
usersTableData.setCallbackArr({
  getListCallbask: () => throttledRequest(searchCondition),
  delCallback: ({ uid }) => delUser({ uid }),
  openModal: (params) => setUserModal(params),
});

/* 获取所有可用头像 */
getAllHeadImg().then(({ data }) => {
  modalParams.value.headimgs = data;
});
/* 添加/编辑用户弹窗 */
const setUserModal = async (params) => {
  const isEdit = !!params.uid;

  modalParams.value.params = isEdit ? params : {};
  modalParams.value.isOpen = true;
  modalParams.value.title = isEdit ? "修改用户" : "添加用户";
  modalParams.value.sureCallback.callback = isEdit ? editUser : addUser;
};

// 动画控制 为了解决模态框关闭时 动画直接被if销毁
const userFormHide = ref(false);
watchEffect(async () => {
  const { isOpen } = modalParams.value;
  if (!isOpen) {
    await new Promise((resolve) => setTimeout(resolve, 300));
  }
  userFormHide.value = isOpen;
});
</script>

<template>
  <section style="display: flex; flex-direction: column; gap: 20px; height: 100%">
    <ACard title="搜索工具" :bordered="false" ref="searchWrapperRef">
      <main class="searchCard">
        <section>
          <span>用户名：</span>
          <AInput v-model:value="searchCondition.name" placeholder="请输入用户名称" />
        </section>
        <section>
          <span>用户账号：</span>
          <AInput v-model:value="searchCondition.username" placeholder="请输入用户账号" />
        </section>

        <section>
          <span>用户权限：</span>
          <ASelect
            v-model:value="searchCondition.power"
            style="width: 100%"
            allowClear
            placeholder="请选择用户权限"
          >
            <ASelect-option value="0">超级管理员</ASelect-option>
            <ASelect-option value="1">普通用户</ASelect-option>
          </ASelect>
        </section>
        <section style="display: flex; gap: 10px">
          <AButton @click="reset">
            <LzyIcon name="hugeicons:exchange-01" /> 重置
          </AButton>
          <AButton @click="throttledRequest(searchCondition)">
            <LzyIcon name="hugeicons:search-area" /> 搜索
          </AButton>
        </section>
      </main>
    </ACard>

    <a-card title="角色列表" style="flex: 1">
      <template #extra>
        <TableHeaderOperation
          :selectedRowKeys="selectedRowKeys"
          :addModal="setUserModal"
          :loading="loading"
          @refresh="throttledRequest(searchCondition)"
        />
      </template>

      <main class="contentCard">
        <ATable
          ref="tableWrapperRef"
          :row-selection="{ selectedRowKeys, onChange: onSelectChange }"
          :columns="columns"
          :data-source="tableData ? tableData.data : []"
          :scroll="scrollConfig"
          :loading="loading"
          size="small"
          row-key="uid"
          class="h-full"
        />
      </main>
    </a-card>
    <UserForm :modalParams="modalParams" v-if="userFormHide" />
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
.actionBtn {
  display: flex;
  gap: 10px;
  svg {
    margin-right: 4px;
  }
}

@keyframes custom-fade {
  0% {
    opacity: 0;
    transform: translateY(-10px);
  }
  100% {
    opacity: 1;
    transform: translateY(0);
  }
}

.custom-dropdown {
  animation: custom-fade 0.3s ease-in-out;
}

@media (max-width: 1280px) {
  :deep(.searchCard) {
    flex-wrap: wrap;
  }
}
</style>
