<script setup>
import { ref } from "vue";
import "vue-data-ui/style.css";
import { getGithubFrontCommit } from "@/api/toolkit";

const response = await getGithubFrontCommit();
console.log(response);

const config = ref({
  theme: "",
  customPalette: [],
  style: {
    fontFamily: "inherit",
    backgroundColor: "#FFFFFFff",
    animation: { show: true, animationFrames: 60 },
    bar: {
      gradient: { show: true, intensity: 40, underlayerColor: "#FFFFFF" },
    },
    legend: {
      show: false,
      textAlign: "left",
      fontSize: 12,
      margin: "6px 0 0 0",
      name: { color: "#1A1A1Aff", bold: false },
      value: {
        show: true,
        bold: false,
        color: "#1A1A1Aff",
        prefix: "",
        suffix: "",
        rounding: 0,
        formatter: null,
      },
      percentage: { show: true, bold: true, color: "#1A1A1Aff", rounding: 1 },
    },
    title: {
      text: "",
      color: "#1A1A1Aff",
      fontSize: 16,
      bold: true,
      textAlign: "left",
      paddingLeft: 0,
      paddingRight: 0,
      subtitle: { color: "#A1A1A1ff", text: "", fontSize: 12, bold: false },
      margin: "0 0 6px 0",
    },
    tooltip: {
      show: true,
      color: "#1A1A1Aff",
      backgroundColor: "#FFFFFFff",
      fontSize: 14,
      customFormat: null,
      borderRadius: 4,
      borderColor: "#e1e5e8",
      borderWidth: 1,
      backgroundOpacity: 30,
      position: "center",
      offsetY: 24,
    },
  },
});

const dataset = ref([]);

dataset.value = response.data.typeMap.map((item) => {
  return {
    name: item.title,
    value: item.value,
    color: item.color,
  };
});
</script>

<template>
  <!--    <a-steps-->
  <!--      progress-dot-->
  <!--      :current="1"-->
  <!--      direction="vertical"-->
  <!--      :items="[-->
  <!--        {-->
  <!--          title: 'Finished',-->
  <!--          description: 'This is a description. This is a description.',-->
  <!--        },-->
  <!--        {-->
  <!--          title: 'Finished',-->
  <!--          description: 'This is a description. This is a description.',-->
  <!--        },-->
  <!--        {-->
  <!--          title: 'In Progress',-->
  <!--          description: 'This is a description. This is a description.',-->
  <!--        },-->
  <!--        {-->
  <!--          title: 'Waiting',-->
  <!--          description: 'This is a description.',-->
  <!--        },-->
  <!--        {-->
  <!--          title: 'Waiting',-->
  <!--          description: 'This is a description.',-->
  <!--        },-->
  <!--      ]"-->
  <!--    ></a-steps>-->
  <ACard :bordered="false" class="card-wrapper"> </ACard>
</template>
