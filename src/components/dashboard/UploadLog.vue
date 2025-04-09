<script setup lang="ts">
import { getGithubFrontCommit } from "@/api/toolkit";
import { setTimeAgoLocalMessages } from "@/utils";
import { useRequest } from "alova/client";

type StepData = {
  title: string;
  description: string;
  conclusion: string;
  id: number;
};

const loading = ref<boolean>(true);

const stepsData = ref<StepData[]>([]);

useRequest(getGithubFrontCommit, {
  immediate: true,
  cacheKey: "getGithubFrontCommit",
}).onSuccess(({ data }) => {
  stepsData.value = data.data.runInfoList.map((item) => {
    const description = useTimeAgo(item.createdAt, setTimeAgoLocalMessages).value;
    return {
      title: item.commitMessage,
      description: description + " by " + item.commitAuthor,
      conclusion: item.conclusion,
      id: item.id,
    };
  });
  loading.value = false;
});

//虚拟滚动
const { list, containerProps, wrapperProps } = useVirtualList(stepsData, {
  // Keep `itemHeight` in sync with the item's row.
  itemHeight: 22,
});

//标题处理 换行
const titleHandler = (title: string) => {
  return title.replaceAll("- ", "<br/>- ");
};
</script>

<template>
  <a-space direction="vertical" style="width: 100%" :size="16">
    <a-skeleton :loading="loading">
      <div v-bind="containerProps" style="height: 400px">
        <a-timeline v-bind="wrapperProps">
          <a-timeline-item
            v-for="item in list"
            :key="item.data.id"
            :color="item.data.conclusion == 'success' ? '#5161ce' : 'red'"
          >
            <span v-html="titleHandler(item.data.title)"></span>
            <!--        <span :title="item.data.title">-->
            <!--          {{ item.data.title.split("\n")[0] }}-->
            <!--        </span>-->
          </a-timeline-item>
        </a-timeline>
      </div>
    </a-skeleton>
  </a-space>
</template>

<style scoped>
.scroller {
  height: 100%;
}

.user {
  height: 32%;
  padding: 0 12px;
  display: flex;
  align-items: center;
}

.ant-timeline {
  height: 337.5px;
  padding: 10px 0 0 0;

  p {
    margin: 0;
    padding: 0;
    font-size: 14px;
    line-height: 1.5;
    color: #333;
    display: flex;
    justify-content: space-between;
    flex-direction: column;

    &:hover {
      color: #5161ce;
    }

    span {
      cursor: pointer;
      margin: 0;

      &:last-child {
        font-size: 12px;
        color: #888;
      }
    }
  }
}
</style>
