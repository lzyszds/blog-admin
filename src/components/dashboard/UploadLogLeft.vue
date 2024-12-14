<script setup lang="ts">
import { getGithubFrontCommit } from "@/api/toolkit";
import { setTimeAgoLocalMessages } from "@/utils/comment";

type StepData = {
  title: string;
  description: string;
  conclusion: string;
  id: number;
};
const response = await getGithubFrontCommit();

// const dataset = ref([]);
const stepsData = ref<StepData[]>([]);

// dataset.value = response.data.typeMap.map((item) => {
//   return {
//     name: item.title,
//     value: item.value,
//     color: item.color,
//   };
// });
//
stepsData.value = response.data.runInfoList.map((item) => {
  const description = useTimeAgo(item.createdAt, setTimeAgoLocalMessages).value;
  return {
    title: item.commitMessage,
    description: description + " by " + item.commitAuthor,
    conclusion: item.conclusion,
    id: item.id,
  };
});
</script>

<template>
  <a-timeline>
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
  </a-timeline>
</template>

<style scoped>
.ant-timeline {
  height: 337.5px;
  overflow-y: auto;
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
