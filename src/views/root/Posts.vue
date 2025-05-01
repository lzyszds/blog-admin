<script setup lang="ts">
import {
  articleAdd,
  articleDelete,
  articleEditor,
  articleList,
} from "@/api/posts";
import useResetRefState from "@/hook/useResetRefState";
import { getTableStore } from "@/store/useTableStore";
import { useScrollY } from "@/hook/useTableConfig";
import { multDelData } from "@/utils/tableHandles.ts";
import { Key } from "ant-design-vue/es/_util/type";
import TableHeaderOperation from "@/components/TableHeaderOperation.vue";
import { TableProps } from "ant-design-vue";
import { getArticleColumns } from "@/table/postsColumns";
import { ArticleDataType } from "@/typings/Posts.ts";
import { RequestResult } from "@/typings/Request";

const PostsForm = defineAsyncComponent(
  () => import("@/components/form/PostsForm.vue"),
);

/* 获取表格滚动条高度 */
const { scrollConfig } = useScrollY();
/* 搜索条件 */
const { state: searchCondition, reset } = useResetRefState({
  pages: 1,
  limit: 10,
  aid: "",
  title: "",
  username: "",
});

/* 表格选中项 */
const selectedRowKeys = ref<Key[]>([]);

/* 表格选择 */
const onSelectChange = (keys: Key[]) => {
  selectedRowKeys.value = keys;
};
/* 弹窗参数 */
const modalParams = ref<any>({
  isOpen: false,
  title: "添加文章",
  params: {},
  headimgs: [],
  sureCallback: {
    callback: articleAdd,
    refreshData: (force: boolean = false) => send(force),
  },
});

//这里不能封装hook，否则效果不好使
const loading = ref(false);
const tableData = ref<RequestResult["data"]>();

const send = async (force: boolean = false) => {
  loading.value = true;
  const { data } = await articleList(searchCondition).send(force);
  tableData.value = data;
  loading.value = false;
};
send();

/* 分页参数 */
const pagination = computed(() => {
  return {
    total: tableData.value && tableData.value.total,
    current: searchCondition.value.pages,
    pageSize: searchCondition.value.limit,
    showSizeChanger: true,
    pageSizeOptions: ["5", "8", "10", "15", "20"],
    onShowSizeChange: (current, pageSize) => {
      //切换每页条数，会触发这里
      searchCondition.value.pages = current;
      searchCondition.value.limit = pageSize;
      send();
    },
  };
});

/* 表格列表数据 提供的部分方法 */
const usersTableData = getTableStore();

/* 设置表格列表数据的回调方法 */
usersTableData.setCallbackArr({
  refreshData: send,
  delData: ({ aid }) => articleDelete({ id: aid }),
  openModal: (params) => setUserModal(params),
  columns: getArticleColumns,
});

//真正的数据Columns
const columns = computed(() => {
  if (isRef(usersTableData.columns)) {
    return (usersTableData.columns as any).value.filter((item) => item.checked);
  } else {
    return usersTableData.columns.filter((item) => item.checked);
  }
});
const handleTableChange: TableProps["onChange"] = (pagination) => {
  searchCondition.value.pages = pagination.current;
  send();
};

/* 添加/编辑弹窗 */
const setUserModal = async (params: ArticleDataType) => {
  const isEdit = !!params.uid;
  if (typeof params.tags === "string") {
    params.tags = params.tags.split(",");
  }
  modalParams.value.params = isEdit ? params : {};
  modalParams.value.isOpen = true;
  modalParams.value.title = isEdit ? "修改文章" : "添加文章";
  modalParams.value.sureCallback.callback = isEdit ? articleEditor : articleAdd;
};

// 动画控制 为了解决模态框关闭时 动画直接被if销毁
const isFormHide = ref(false);
watchEffect(async () => {
  const { isOpen } = modalParams.value;
  if (!isOpen) {
    await new Promise((resolve) => setTimeout(resolve, 300));
  }
  isFormHide.value = isOpen;
});

//多选删除列表事件
const multipleDel = () => {
  multDelData(selectedRowKeys.value, articleDelete, () => {
    selectedRowKeys.value = [];
    send(true);
  });
};
</script>

<template>
  <section
    style="display: flex; flex-direction: column; gap: 10px; height: 100%"
  >
    <ACard title="搜索工具" :bordered="false">
      <main class="searchCard">
        <section>
          <span>文章ID：</span>
          <AInput
            @pressEnter="send"
            v-model:value="searchCondition.aid"
            placeholder="请输入文章ID"
          />
        </section>
        <section>
          <span>文章名：</span>
          <AInput
            @pressEnter="send"
            v-model:value="searchCondition.title"
            placeholder="请输入文章名称"
          />
        </section>
        <section>
          <span>文章账号：</span>
          <AInput
            @pressEnter="send"
            v-model:value="searchCondition.username"
            placeholder="请输入文章账号"
          />
        </section>

        <section style="display: flex; gap: 10px">
          <AButton @click="reset" style="flex: 1">
            <LzyIcon name="hugeicons:exchange-01" />
            重置
          </AButton>
          <AButton @click="send" style="flex: 1">
            <LzyIcon name="hugeicons:search-area" />
            搜索
          </AButton>
        </section>
      </main>
    </ACard>

    <ACard
      title="文章列表"
      :bordered="false"
      :body-style="{ flex: 1, overflow: 'hidden', paddingBottom: '0' }"
      style="height: calc(100% - 20px)"
    >
      <template #extra>
        <TableHeaderOperation
          :selectedRowKeys="selectedRowKeys"
          :addModal="setUserModal"
          :loading="loading"
          @refresh="send(true)"
          @multipleDel="multipleDel"
          :usersTableData="usersTableData"
        />
      </template>

      <main class="contentCard">
        <!--   scroll如果你想表格进行滚动，那么table的父元素一定不能是grid     -->
        <ATable
          ref="tableWrapperRef"
          :row-selection="{ selectedRowKeys, onChange: onSelectChange }"
          :columns="columns"
          :data-source="tableData ? tableData.data : []"
          :scroll="scrollConfig"
          :loading="loading"
          :pagination="pagination"
          size="small"
          row-key="aid"
          @change="handleTableChange"
        />
      </main>
    </ACard>
    <PostsForm :modalParams="modalParams" v-if="isFormHide" />
  </section>
</template>

<style scoped>
@import url("@/style/main.css");
</style>
