<script setup lang="ts">
import { getGithubFrontCommit } from "@/api/toolkit";
import { setTimeAgoLocalMessages } from "@/utils";

type StepData = {
  title: string;
  description: string;
  conclusion: string;
  id: number;
};
const response = await getGithubFrontCommit();

const stepsData = ref<StepData[]>([]);

stepsData.value = response.data.runInfoList.map((item) => {
  const description = useTimeAgo(item.createdAt, setTimeAgoLocalMessages).value;
  return {
    title: item.commitMessage,
    description: description + " by " + item.commitAuthor,
    conclusion: item.conclusion,
    id: item.id,
  };
});

const { list, containerProps, wrapperProps } = useVirtualList(stepsData.value, {
  // Keep `itemHeight` in sync with the item's row.
  itemHeight: 22,
});
</script>

<template>
  <div v-bind="containerProps" style="height: 400px">
    <a-timeline v-bind="wrapperProps">
      <a-timeline-item
        v-for="item in list"
        :key="item.data.id"
        :color="item.data.conclusion == 'success' ? '#5161ce' : 'red'"
      >
        {{ item.data.title }}
      </a-timeline-item>
    </a-timeline>
  </div>
  <!-- <a-timeline>
    <a-timeline-item
      v-for="item in stepsData"
      :key="item.id"
      :color="item.conclusion == 'success' ? '#5161ce' : 'red'"
    >
      <p class="item">
        <span>{{ item.title }}</span>
        <span>{{ item.description }}</span>
      </p>
    </a-timeline-item>
  </a-timeline> -->
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
