watchEffect(() => {
    // 如果当前编辑任务的类型为空且id不为空，则返回
    if (!currentEditTask.value.type && currentEditTask.value.id) return;
    // 打印当前编辑任务的类型对应的参数
    console.log(params[currentEditTask.value.type]);
    // 将当前编辑任务的类型对应的参数转换为对象，并赋值给当前编辑任务的paramsBody
    currentEditTask.value.paramsBody = Object.fromEntries(
      params[currentEditTask.value.type].map((item) => [item, ""]),
    );
    // 打印当前编辑任务的paramsBody
    console.log(currentEditTask.value.paramsBody);
  });
<script setup lang="ts">
import { onMounted, ref } from "vue";
import * as echarts from "echarts";

const domRef = ref<HTMLElement | null>(null);
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
  if (!domRef.value) return;

  chart = echarts.init(domRef.value);
  updateChartOption();
};

const updateChartOption = () => {
  if (!chart) return;

  chart.setOption({
    tooltip: {
      trigger: "item",
      formatter: "{a} <br/>{b} : {c} ({d}%)",
    },
    title: {
      text: "前端技术栈和后端技术栈",
      x: "center",
    },
    series: [
      {
        name: "前端技术栈",
        type: "pie",
        radius: ["45%", "75%"],
        avoidLabelOverlap: false,
        itemStyle: {
          borderRadius: 10,
          borderColor: "#fff",
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
          borderColor: "#fff",
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

const { width } = useElementSize(domRef);

watchDebounced(
  width,
  () => {
    handleResize();
  },
  { debounce: 0, maxWait: 200 },
);

onMounted(() => {
  initChart();
});

const handleResize = () => {
  if (chart) {
    chart.resize();
  }
};
</script>

<template>
  <div class="card-wrapper">
    <div ref="domRef" style="height: 360px; width: 100%"></div>
  </div>
</template>

<style scoped>
.card-wrapper {
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
  padding: 16px;

  canvas {
    transition: 0.3s;
  }
}
</style>
