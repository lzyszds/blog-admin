<script setup lang="ts">
import * as echarts from "echarts";
const themeMode = useStorage<"light" | "dark">("themeMode", "light");

const echatsDom = ref(null);

let chart: echarts.ECharts | null = null;

const initChart = () => {
  if (!echatsDom.value) return;

  chart = echarts.init(echatsDom.value, 'dark', {
    renderer: "canvas",
    useDirtyRect: false, // 禁用脏矩形优化
  });
  updateChartOption();
};

// Generate data
let category: any[] = [];
let dottedBase = +new Date();
let lineData: any[] = [];
let barData: any[] = [];

for (let i = 0; i < 20; i++) {
  let date = new Date((dottedBase += 3600 * 24 * 1000));
  category.push([date.getFullYear(), date.getMonth() + 1, date.getDate()].join("-"));
  let b = Math.random() * 200;
  let d = Math.random() * 200;
  barData.push(b);
  lineData.push(d + b);
}

const updateChartOption = () => {
  if (!chart) return;

  chart.setOption({
    backgroundColor:  themeMode.value === "dark" ? "#141414" : "#fff",
    grid: {
      left: "3%", // 减小左边距
      right: "4%", // 减小右边距
      bottom: "3%", // 减小底边距
      top: "10%", // 减小顶边距，如果图例位置有影响，可能需要更大一点
      containLabel: true, // 确保轴标签不会超出图表区域
    },
    tooltip: {
      trigger: "axis",
      axisPointer: {
        type: "shadow",
      },
    },
    legend: {
      data: ["line", "bar"],
      textStyle: {
        color: "#ccc",
      },
    },
    xAxis: {
      data: category,
      axisLine: {
        lineStyle: {
          color: "#ccc",
        },
      },
    },
    // 设置y轴
    yAxis: {
      splitLine: { show: false },
      axisLine: {
        lineStyle: {
          color: "#ccc",
        },
      },
    },
    series: [
      {
        name: "line",
        type: "line",
        smooth: true,
        showAllSymbol: true,
        symbol: "emptyCircle",
        symbolSize: 15,
        data: lineData,
      },
      {
        name: "bar",
        type: "bar",
        barWidth: 10,
        itemStyle: {
          borderRadius: 5,
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            { offset: 0, color: "#14c8d4" },
            { offset: 1, color: "#545BE3" },
          ]),
        },
        data: barData,
      },
      {
        name: "line",
        type: "bar",
        barGap: "-100%",
        barWidth: 10,
        // 使用渐变色
        itemStyle: {
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            { offset: 0, color: "rgba(20,200,212,0.5)" },
            { offset: 0.2, color: "rgba(20,200,212,0.2)" },
            { offset: 1, color: "rgba(20,200,212,0)" },
          ]),
        },
        z: -12,
        data: lineData,
      },
      {
        name: "dotted",
        type: "pictorialBar",
        symbol: "rect",
        itemStyle: {
          color:  themeMode.value === "dark" ? "#141414" : "#fff",
        },
        symbolRepeat: true,
        symbolSize: [12, 4],
        symbolMargin: 1,
        z: -10,
        data: lineData,
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
    <div ref="echatsDom" class="echarts" style="height: 360px; width: 100%"></div>
  </div>
</template>

<style scoped>
.card-wrapper {
  background-color: var( --color-bg);
  border-radius: 8px;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
  padding: 16px;
  border: 1px solid #f0f0f0;

  canvas {
    margin: 0 auto;
    transition: 0.3s;
  }
}
</style>
