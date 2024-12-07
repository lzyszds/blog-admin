<script setup>
import { VueUiDonut } from "vue-data-ui";
import _ from "lodash";
import "vue-data-ui/style.css";

const frontConfig = ref({
  type: "classic",
  responsive: false,
  theme: "",
  customPalette: [],
  useCssAnimation: true,
  useBlurOnHover: false,
  userOptions: {
    show: false,
  },
  translations: {
    show: false,
  },
  table: {
    show: false,
    responsiveBreakpoint: 400,
    th: {
      backgroundColor: "#FFFFFFff",
      color: "#1A1A1Aff",
      outline: "none",
    },
    td: {
      backgroundColor: "#FFFFFFff",
      color: "#1A1A1Aff",
      outline: "none",
      roundingValue: 0,
      roundingPercentage: 0,
    },
    columnNames: {
      series: "Series",
      value: "Value",
      percentage: "Percentage",
    },
  },
  style: {
    fontFamily: "inherit",
    chart: {
      useGradient: false,
      gradientIntensity: "14",
      backgroundColor: "#ffffffff",
      color: "#1a1a1aff",
      layout: {
        labels: {
          dataLabels: {
            show: true,
            useLabelSlots: false,
            hideUnderValue: 3,
            prefix: "",
            suffix: "",
          },
          value: {
            rounding: 0,
            show: true,
            formatter: null,
          },
          percentage: {
            color: "#1A1A1Aff",
            bold: true,
            fontSize: 18,
            rounding: 0,
            formatter: null,
          },
          name: {
            color: "#1A1A1Aff",
            bold: false,
            fontSize: 14,
          },
          hollow: {
            total: {
              show: true,
              bold: false,
              color: "#000",
              fontSize: 24,
              text: "前端",
              offsetY: 10,
              value: {
                color: "transparent",
              },
            },
            average: {
              show: false,
            },
          },
        },
        donut: {
          strokeWidth: "59",
          borderWidth: "0",
          useShadow: true,
          shadowColor: "rgba(26, 26, 26, 1)",
        },
      },
      comments: {
        show: true,
        showInTooltip: true,
        width: 100,
        offsetY: 0,
        offsetX: 0,
      },
      legend: {
        show: false,
        bold: false,
        backgroundColor: "#FFFFFFff",
        color: "#1a1a1aff",
        fontSize: 16,
        roundingValue: 0,
        roundingPercentage: 0,
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
        showValue: true,
        showPercentage: true,
        roundingValue: 0,
        roundingPercentage: 0,
      },
    },
  },
});

const backendConfig = ref(_.cloneDeep(frontConfig.value));
backendConfig.value.style.chart.layout.labels.hollow.total.text = "后端";

const frontDataset = ref([
  {
    name: "Vue",
    values: [39.8],
    color: "#41B883",
  },

  {
    name: "Css",
    values: [36.3],
    color: "#663399",
  },
  {
    name: "Typescript",
    values: [23.6],
    color: "#3178C6",
  },
  {
    name: "其他",
    values: [9],
    color: "#EDEDED",
  },
]);

const backendDataset = ref([
  {
    name: "Hono",
    values: [30],
    color: "#FF3704",
  },
  {
    name: "TypeScript",
    values: [39.8],
    color: "#3178C6",
  },
  {
    name: "redis",
    values: [10],
    color: "#FF4438",
  },
  {
    name: "mysql",
    values: [30],
    color: "#005B80",
  },
]);
</script>

<template>
  <div class="circle">
    <VueUiDonut :config="frontConfig" :dataset="frontDataset" />
    <VueUiDonut :config="backendConfig" :dataset="backendDataset" />
  </div>
</template>

<style scoped>
.circle {
  display: flex;
  justify-content: space-around;
}
</style>
