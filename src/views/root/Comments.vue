<script setup lang="ts">
import { getCommentList, deleteComment } from "@/api/comment";
import useResetRefState from "@/hook/useResetRefState";
import { getTableStore } from "@/store/useTableStore";
import { useScrollY } from "@/hook/useTableConfig";
import { multDelData } from "@/utils/tableHandles.ts";
import { Key } from "ant-design-vue/es/_util/type";
import TableHeaderOperation from "@/components/TableHeaderOperation.vue";
import { TableProps } from "ant-design-vue";
import { getcommentColumns } from "@/table/commentColumns";
import dayjs from "dayjs";
import { RequestResult } from "@/typings/Request";
import LzyIcon from "@/components/LzyIcon.vue";

/* 获取表格滚动条高度 */
const { scrollConfig } = useScrollY();
/* 搜索条件 */
const { state: searchCondition, reset } = useResetRefState({
  pages: 1,
  limit: 8,
  email: "",
  comment_id: "",
  content: "",
  create_date: "",
});

/* 表格选中项 */
const selectedRowKeys = ref<Key[]>([]);

/* 表格选择 */
const onSelectChange = (keys: Key[]) => {
  console.log(keys);
  
  selectedRowKeys.value = keys;
};

//这里不能封装hook，否则效果不好使
const loading = ref(false);
const tableData = ref<RequestResult["data"]>();

const send = async (force: boolean = false) => {
  loading.value = true;
  const { data } = await getCommentList(searchCondition).send(force);
  tableData.value = data;
  loading.value = false;
};
send();

/* 分页参数 */
const pagination = computed(() => {
  console.log(tableData.value && tableData.value);

  return {
    total: tableData.value && tableData.value.total,
    current: searchCondition.value.pages,
    pageSize: searchCondition.value.limit,
    showSizeChanger: true,
    pageSizeOptions: ["5", "8", "10", "15", "20"],
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
  delData: ({ commentId }) => deleteComment({ ids: commentId }),
  columns: getcommentColumns,
});

//真正的数据Columns
const columns = computed(() => {
  if (isRef(getTable.columns)) {
    return (getTable.columns as any).value.filter((item) => item.checked);
  } else {
    return getTable.columns.filter((item) => item.checked);
  }
});

const handleTableChange: TableProps["onChange"] = (pagination) => {
  searchCondition.value.pages = pagination.current;
  send();
};

//多选删除列表事件
const multipleDel = () => {
  multDelData(selectedRowKeys.value, deleteComment, () => {
    selectedRowKeys.value = [];
    send();
  });
};
</script>

<template>
  <section style="display: flex; flex-direction: column; gap: 10px; height: 100%">
    <ACard title="搜索工具" :bordered="false" :body-style="{ padding: '16px 24px' }">
      <main class="searchCard">
        <section>
          <span>评论邮箱</span>
          <AInput
            @pressEnter="send()"
            v-model:value="searchCondition.email"
            placeholder="请输入邮箱"
          />
        </section>
        <section>
          <span>评论ID</span>
          <AInput
            @pressEnter="send()"
            v-model:value="searchCondition.comment_id"
            placeholder="请输入评论ID"
          />
        </section>
        <section>
          <span>评论内容</span>
          <AInput
            @pressEnter="send()"
            v-model:value="searchCondition.content"
            placeholder="请输入评论内容"
          />
        </section>
        <section>
          <span>评论日期</span>
          <a-date-picker
            format="YYYY-MM-DD"
            @change="(value) => (searchCondition.create_date = dayjs(value).format('X'))"
            placeholder="选择需要查询的时间"
          />
        </section>

        <section style="display: flex; gap: 10px">
          <AButton @click="reset" style="flex: 1">
            <LzyIcon name="hugeicons:exchange-01" /> 重置
          </AButton>
          <AButton @click="send()" style="flex: 1">
            <LzyIcon name="hugeicons:search-area" /> 搜索
          </AButton>
        </section>
      </main>
    </ACard>

    <ACard
      title="评论列表"
      :bordered="false"
      :body-style="{ flex: 1, overflow: 'hidden', paddingBottom: '0' }"
      style="height: calc(100% - 20px)"
    >
      <template #extra>
        <TableHeaderOperation
          :selectedRowKeys="selectedRowKeys"
          :loading="loading"
          @refresh="send(true)"
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
          row-key="commentId"
          @change="handleTableChange"
        />
      </main>
    </ACard>
  </section>
</template>

<style scoped>
@import url("@/style/main.css");
</style>
