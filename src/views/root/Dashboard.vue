<template>
  <div class="dashboard-content">
    <ARow :gutter="[16, 16]">
      <ACol :span="24" :lg="14"></ACol>
      <ACol :span="24" :lg="10">
        <UserDistributionChart />
      </ACol>
    </ARow>
    <ARow :gutter="[16, 16]" style="margin-top: 16px">
      <ACol :span="24" :lg="14">
        <ACard title="销售统计" style="height: 100%">
          <!--          <SalesChart />-->
        </ACard>
      </ACol>
      <ACol :span="24" :lg="10">
        <ACard
          title="更新日志"
          :body-style="{ maxHeight: '400px', overflowY: 'auto' }"
        >
          <IncomeChart />
        </ACard>
      </ACol>
    </ARow>
  </div>
</template>

<script setup>
import {
  DollarOutlined,
  RiseOutlined,
  ShoppingCartOutlined,
  UserOutlined,
} from "@ant-design/icons-vue";
import UserDistributionChart from "@/components/dashboard/UserDistributionChart.vue";
import IncomeChart from "@/components/dashboard/IncomeChart.vue";

const stats = ref([
  {
    title: "总用户",
    value: 5840,
    icon: UserOutlined,
    style: { color: "#3f8600" },
  },
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

:deep(.ant-card) {
  box-shadow:
    0 1px 2px 0 rgba(0, 0, 0, 0.03),
    0 1px 6px -1px rgba(0, 0, 0, 0.02),
    0 2px 4px 0 rgba(0, 0, 0, 0.02);
}
</style>
