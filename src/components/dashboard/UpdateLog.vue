<script setup lang="ts">
import { getGithubFrontCommit } from "@/api/toolkit";
import { setTimeAgoLocalMessages } from "@/utils";

type StepData = {
  title: string;
  description: string;
  conclusion: string;
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
    title: item.commitMessage + (item.conclusion === "success" ? "✅" : "❌"),
    description: description + " by " + item.commitAuthor,
    conclusion: item.conclusion,
  };
});
</script>

<template>
  <a-steps
    :current="100"
    direction="vertical"
    :items="stepsData"
    size="small"
  ></a-steps>
</template>
<style scoped>
.card-wrapper {
  height: 360px;
  overflow-y: auto;
}

.ant-steps-item {
  cursor: pointer !important;
}
</style>
