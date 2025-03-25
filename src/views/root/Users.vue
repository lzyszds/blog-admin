<script setup lang="ts">
import {addUser, delUser, editUser, getAllHeadImg, getUserList, uploadHeadImg,} from '@/api/user';
import UserForm from '@/components/form/UserForm.vue';
import useResetRefState from '@/hook/useResetRefState';
import {getTableStore} from '@/store/useTableStore';
import {useScrollY} from '@/hook/useTableConfig';
import {multDelData} from '@/utils/tableHandles.ts';
import {Key} from 'ant-design-vue/es/_util/type';
import TableHeaderOperation from '@/components/TableHeaderOperation.vue';
import {TableProps} from 'ant-design-vue';
import {getUserColumns} from '@/table/userColumns';
import {RequestResult} from '@/typings/Request';

/* 获取表格滚动条高度 */
const {scrollConfig} = useScrollY();
/* 搜索条件 */
const {state: searchCondition, reset} = useResetRefState({
  pages: 1,
  limit: 10,
  name: '',
  username: '',
  power: '',
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
  title: '添加用户',
  params: {},
  headimgs: [],
  sureCallback: {
    uploadHeadImg,
    callback: addUser,
    refreshData: (force: boolean = false) => send(force),
  },
});

// // 请求数据 自带防抖监听
// const { loading, data, send } = useRequest(, {
//   immediate: true,
// });
const loading = ref(false);
const data = ref<RequestResult['data']>();

const send = async (force: boolean = false) => {
  loading.value = true;
  data.value = await getUserList(searchCondition).send(force);
  loading.value = false;
};
send();

// 表格数据
const tableData = computed(() => data.value?.data);

/* 分页参数 */
const pagination = computed(() => {
  return {
    total: tableData.value && tableData.value.total,
    current: searchCondition.value.pages,
    pageSize: searchCondition.value.limit,
    showSizeChanger: true,
    pageSizeOptions: ['5', '8', '10', '15', '20'],
    onShowSizeChange: (current, pageSize) => {
      searchCondition.value.pages = current;
      searchCondition.value.limit = pageSize;
      send();
    },
  };
});

/* 表格列表数据 提供的部分方法 */
const getTable = getTableStore();

/* 设置表格列表数据的回调方法 */
getTable.setCallbackArr({
  refreshData: () => send(),
  delData: ({uid}) => delUser({uid}),
  openModal: (params) => setUserModal(params),
  columns: getUserColumns,
});

//真正的数据Columns
const columns = computed(() => {
  if (isRef(getTable.columns)) {
    return (getTable.columns as any).value.filter((item) => item.checked);
  } else {
    return getTable.columns.filter((item) => item.checked);
  }
});

const handleTableChange: TableProps['onChange'] = (pagination) => {
  searchCondition.value.pages = pagination.current;
  send(); // 强制发送请求，忽略缓存
};

/* 获取所有可用头像 */
getAllHeadImg().then(({data}) => {
  modalParams.value.headimgs = data;
});

/* 添加/编辑弹窗 */
const setUserModal = async (params) => {
  const isEdit = !!params.uid;

  modalParams.value.params = isEdit ? params : {};
  modalParams.value.isOpen = true;
  modalParams.value.title = isEdit ? '修改用户' : '添加用户';
  modalParams.value.sureCallback.callback = isEdit ? editUser : addUser;
};

// 动画控制 为了解决模态框关闭时 动画直接被if销毁
const userFormHide = ref(false);
watchEffect(async () => {
  const {isOpen} = modalParams.value;
  if (!isOpen) {
    await new Promise((resolve) => setTimeout(resolve, 300));
  }
  userFormHide.value = isOpen;
});

//多选删除列表事件
const multipleDel = () => {
  multDelData(selectedRowKeys.value, delUser, () => {
    selectedRowKeys.value = [];
    send();
  });
};
</script>

<template>
  <section style="display: flex; flex-direction: column; gap: 10px; height: 100%">
    <ACard title="搜索工具" :bordered="false">
      <main class="searchCard">
        <section>
          <span>用户名：</span>
          <AInput
              @pressEnter="send()"
              v-model:value="searchCondition.name"
              placeholder="请输入用户名称"
          />
        </section>
        <section>
          <span>用户账号：</span>
          <AInput
              @pressEnter="send()"
              v-model:value="searchCondition.username"
              placeholder="请输入用户账号"
          />
        </section>

        <section>
          <span>用户权限：</span>
          <ASelect v-model:value="searchCondition.power" style="width: 160px" allowClear>
            <ASelectOption value="0">超级管理员</ASelectOption>
            <ASelectOption value="1">普通用户</ASelectOption>
          </ASelect>
        </section>
        <section style="display: flex; gap: 10px">
          <AButton @click="reset" style="flex: 1">
            <LzyIcon name="hugeicons:exchange-01"/>
            重置
          </AButton>
          <AButton @click="send()" style="flex: 1">
            <LzyIcon name="hugeicons:search-area"/>
            搜索
          </AButton>
        </section>
      </main>
    </ACard>

    <ACard
        title="角色列表"
        :bordered="false"
        :body-style="{ flex: 1, overflow: 'hidden', paddingBottom: '0' }"
        style="height: calc(100% - 20px)"
    >
      <template #extra>
        <TableHeaderOperation
            :selectedRowKeys="selectedRowKeys"
            :addModal="setUserModal"
            :loading="loading"
            @refresh="send()"
            @multipleDel="multipleDel"
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
            :pagination="pagination"
            size="small"
            row-key="uid"
            @change="handleTableChange"
        />
      </main>
    </ACard>
    <UserForm :modalParams="modalParams" v-if="userFormHide"/>
  </section>
</template>

<style scoped>
@import url("@/style/main.css");
</style>
