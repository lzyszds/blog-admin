<script setup lang="ts">
import UpdateLogLeft from "@/components/dashboard/UploadLog.vue";
import StatisticsChart from "@/components/dashboard/StatisticsChart.vue";
import { getAdminHomeData } from "@/api/toolkit";
import LzyIcon from "@/components/LzyIcon.vue";
import Bulletin from "@/components/dashboard/Bulletin.vue";
import OnliveUser from "@/components/dashboard/OnliveUser.vue";
import IncomeChart from "@/components/dashboard/IncomeChart.vue";

const stats = ref([
  {
    title: "总用户",
    value: 0,
    key: "userCount",
    icon: "iconoir:user-crown",
    style: { color: "#5161ce" },
  },
  {
    title: "总文章数",
    value: 0,
    key: "articleCount",
    icon: "iconoir:energy-usage-window",
    style: { color: "#EE6666" },
  },
  {
    title: "总评论数",
    value: 0,
    key: "commentCount",
    icon: "iconoir:chat-bubble",
    style: { color: "#1890ff" },
  },
  {
    title: "总浏览",
    value: 0,
    key: "articleAccess",
    icon: "iconoir:reports-solid",
    style: { color: "#91CC75" },
  },
]);

// 自定义缓动函数，例如 easeInOutCubic
function easeInOutCubic(t) {
  return t < 0.5 ? 4 * t * t * t : (t - 1) * (2 * t - 2) * (2 * t - 2) + 1;
}

getAdminHomeData().then((res) => {
  stats.value.forEach((item, index) => {
    const source = ref(stats.value[index].value);
    const output = useTransition(source, {
      duration: 1000,
      transition: easeInOutCubic, // 使用自定义的缓动函数
    });

    watch(output, (newValue) => {
      stats.value[index].value = Math.floor(newValue);
    });

    source.value = res.data[item.key];
  });
});
</script>
<template>
  <div class="dashboard-content">
    <Bulletin />
    <ARow :gutter="[8, 8]" style="margin-top: 16px" :wrap="true">
      <ACol :xs="12" :md="12" :lg="12" :xl="6" v-for="item in stats">
        <ACard>
          <AStatistic :title="item.title" :value="item.value" :value-style="item.style">
            <template #prefix>
              <LzyIcon size="26" :name="item.icon" />
            </template>
          </AStatistic>
        </ACard>
      </ACol>
    </ARow>

    <ARow :gutter="[16, 16]" style="margin-top: 16px">
      <ACol :span="24" :lg="14">
        <StatisticsChart />
      </ACol>
      <ACol :span="24" :lg="10">
        <IncomeChart />
      </ACol>
    </ARow>
    <ARow :gutter="[16, 16]" style="margin-top: 16px">
      <ACol :span="24" :lg="14">
        <ACard title="更新日志 ">
          <UpdateLogLeft />
        </ACard>
      </ACol>
      <ACol :span="24" :lg="10">
        <ACard title="在线用户 ">
          <OnliveUser />
        </ACard>
      </ACol>
    </ARow>
  </div>
</template>
<style scoped>
.header {
  background: #001529;
  padding: 0 20px;
}

:deep(.ant-card) {
  box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.03), 0 1px 6px -1px rgba(0, 0, 0, 0.02),
    0 2px 4px 0 rgba(0, 0, 0, 0.02);
}

@media screen and (max-width: 568px) {
  :deep(.ant-card-body) {
    padding: 8px 16px;
  }
}
</style>
