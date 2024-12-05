<template>
  <div style="height: 100%;">
    <Line :data="chartData" :options="chartOptions" />
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { Line } from 'vue-chartjs';
import { Chart as ChartJS, Title, Tooltip, Legend, LineElement, PointElement, CategoryScale, LinearScale } from 'chart.js';

ChartJS.register(Title, Tooltip, Legend, LineElement, PointElement, CategoryScale, LinearScale);

const chartData = ref({
  labels: ['一月', '二月', '三月', '四月', '五月', '六月'],
  datasets: [{
    label: '收入',
    data: [65, 59, 80, 81, 56, 55],
    fill: false,
    borderColor: 'rgb(75, 192, 192)',
    // tension: 0.1
  }]
});

const chartOptions = ref({
  responsive: true,
  maintainAspectRatio: false,
  scales: {
    x: {
      grid: {
        display: false
      }
    },
    y: {
      grid: {
        display: false
      }
    }
  }
});
</script>