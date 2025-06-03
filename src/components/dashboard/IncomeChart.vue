<script setup lang="ts">
import { onMounted, ref } from "vue";
import * as echarts from "echarts";

const themeMode = useStorage<"light" | "dark">("themeMode", "light");
const echatsDom = ref<HTMLElement | null>(null);
let chart: echarts.ECharts | null = null;

const frontDataset = ref([
  { name: "Vue", value: 39.8, color: "#41B883" },
  { name: "Css", value: 36.3, color: "#663399" },
  { name: "Typescript", value: 23.6, color: "#3178C6" },
  { name: "其他", value: 9, color: "#EDEDED" },
]);

const backendDataset = ref([
  { name: "Hono", value: 30, color: "#FF3704" },
  { name: "TypeScript", value: 39.8, color: "#3178C6" },
  { name: "redis", value: 10, color: "#FF4438" },
  { name: "mysql", value: 30, color: "#005B80" },
]);

const initChart = () => {
  if (!echatsDom.value) return;

  chart = echarts.init(echatsDom.value);
  chart = echarts.init(echatsDom.value, "dark", {
    renderer: "canvas",
    useDirtyRect: false, // 禁用脏矩形优化
  });
  updateChartOption();
};

const updateChartOption = () => {
  if (!chart) return;

  chart.setOption({
    backgroundColor: themeMode.value === "dark" ? "#141414" : "#fff",
    tooltip: {
      trigger: "item",
      formatter: "{a} <br/>{b} : {c} ({d}%)",
    },
    title: {
      text: "前端技术栈和后端技术栈",
      x: "center",
      textStyle: {
        color: themeMode.value === "dark" ? "#fff" : "#141414",
        fontSize: 20,
      },
    },
    series: [
      {
        name: "前端技术栈",
        type: "pie",
        radius: ["45%", "75%"],
        avoidLabelOverlap: false,
        itemStyle: {
          borderRadius: 10,
          borderColor: themeMode.value === "dark" ? "#fff" : "#141414",
          borderWidth: 1,
        },
        emphasis: {
          label: {
            show: true,
            fontSize: 40,
            fontWeight: "bold",
          },
        },
        data: frontDataset.value,
        label: {
          show: false,
          position: "center",
        },
      },
      {
        name: "后端技术栈",
        type: "pie",
        radius: ["20%", "40%"],
        avoidLabelOverlap: false,
        itemStyle: {
          borderRadius: 5,
          borderColor: themeMode.value === "dark" ? "#fff" : "#141414",
          borderWidth: 1,
        },
        emphasis: {
          label: {
            show: true,
            fontSize: 40,
            fontWeight: "bold",
          },
        },
        data: backendDataset.value,
        label: {
          show: false,
          position: "center",
        },
      },
    ],
  });
};

const { width } = useElementSize(echatsDom);

watchDebounced(
  [width, themeMode],
  () => {
    if (chart) {
      chart.dispose();
      initChart();
    }
  },
  { debounce: 0, maxWait: 200 }
);

onMounted(() => {
  initChart();
});
</script>

<template>
  <div class="card-wrapper">
    <div ref="echatsDom" style="height: 360px; width: 100%"></div>
  </div>
</template>

<style scoped>
.card-wrapper {
  background-color: var(--color-bg);
  border-radius: 8px;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
  padding: 16px;
  border: 1px solid #f0f0f0;

  canvas {
    transition: 0.3s;
  }
}
</style>
