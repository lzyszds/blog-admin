<template>
  <div class="dashboard-content">
    <!-- 顶部四个卡片 -->
    <ARow :gutter="[16, 16]">
      <ACol :span="6" v-for="stat in stats" :key="stat.title">
        <ACard>
          <a-statistic
            :title="stat.title"
            :value="stat.value"
            :precision="stat.precision"
            :valueStyle="stat.style"
          >
            <template #prefix>
              <component :is="stat.icon" />
            </template>
            <template #suffix>
              <span v-if="stat.suffix">{{ stat.suffix }}</span>
            </template>
          </a-statistic>
        </ACard>
      </ACol>
    </ARow>
    <ARow :gutter="[16, 16]" style="margin-top: 16px">
      <ACol :span="12">
        <ACard title="销售统计">
          <SalesChart />
        </ACard>
      </ACol>
      <ACol :span="12">
        <ACard title="用户分布">
          <UserDistributionChart />
        </ACard>
      </ACol>
    </ARow>
    <ARow :gutter="[16, 16]" style="margin-top: 16px">
      <ACol :span="24">
        <ACard title="收入趋势" style="height: 100%" >
          <IncomeChart />
        </ACard>
      </ACol>
    </ARow>
  </div>
</template>

<script setup>
import {
  UserOutlined,
  ShoppingCartOutlined,
  DollarOutlined,
  RiseOutlined,
} from "@ant-design/icons-vue";
import SalesChart from "@/components/dashboard/SalesChart.vue";
import UserDistributionChart from "@/components/dashboard/UserDistributionChart.vue";
import IncomeChart from "@/components/dashboard/IncomeChart.vue";

const stats = ref([
  { title: "总用户", value: 5840, icon: UserOutlined, style: { color: "#3f8600" } },
  {
    title: "总销售",
    value: 12456,
    icon: ShoppingCartOutlined,
    style: { color: "#cf1322" },
  },
  {
    title: "总收入",
    value: 54320,
    precision: 2,
    icon: DollarOutlined,
    style: { color: "#1890ff" },
    suffix: "元",
  },
  {
    title: "增长率",
    value: 15.8,
    precision: 2,
    icon: RiseOutlined,
    style: { color: "#3f8600" },
    suffix: "%",
  },
]);
</script>

<style scoped>
.header {
  background: #001529;
  padding: 0 20px;
}

.dashboard-content {
  height: 100%;
  overflow: hidden;
  display: grid;
  grid-template-rows: 1fr 4fr 5fr;
}

:deep(.ant-card) {
  box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.03), 0 1px 6px -1px rgba(0, 0, 0, 0.02),
    0 2px 4px 0 rgba(0, 0, 0, 0.02);
}
</style>
