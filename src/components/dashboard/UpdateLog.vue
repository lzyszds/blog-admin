<script setup>
import { ref } from "vue";
import { getGithubFrontCommit } from "@/api/toolkit";
import { setTimeAgoLocalMessages } from "@/utils/comment";

const response = await getGithubFrontCommit();

const dataset = ref([]);
const stepsData = ref([]);

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
    title:
      item.commitMessage + (item.conclusion === "success" ? "✅" : "❌"),
    description: description + " by " + item.commitAuthor,
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
