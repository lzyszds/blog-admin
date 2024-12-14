<script setup lang="ts">
import UpdateLog from "@/components/dashboard/IncomeChart.vue";
import UpdateLogLeft from "@/components/dashboard/UploadLogLeft.vue";
import IncomeChart from "@/components/dashboard/UpdateLog.vue";
import StatisticsChart from "@/components/dashboard/StatisticsChart.vue";
import { getAdminHomeData } from "@/api/toolkit";
import LzyIcon from "@/components/LzyIcon.vue";
import Bulletin from "@/components/dashboard/Bulletin.vue";

const stats = ref([
  {
    title: "总用户",
    value: 5840,
    icon: "iconoir:user-crown",
    style: { color: "#5161ce" },
  },
  {
    title: "总文章数",
    value: 12456,
    icon: "iconoir:energy-usage-window",
    style: { color: "#EE6666" },
  },
  {
    title: "总评论数",
    value: 54320,
    icon: "iconoir:chat-bubble",
    style: { color: "#1890ff" },
  },
  {
    title: "总浏览",
    value: 15.8,
    icon: "iconoir:reports-solid",
    style: { color: "#91CC75" },
  },
]);

getAdminHomeData().then((res) => {
  stats.value.forEach((item) => {
    if (item.title === "总用户") {
      item.value = res.data.userCount;
    } else if (item.title === "总文章数") {
      item.value = res.data.articleCount;
    } else if (item.title === "总评论数") {
      item.value = res.data.commentCount;
    } else if (item.title === "总浏览") {
      item.value = res.data.articleAccess;
    }
  });
});
</script>
<template>
  <div class="dashboard-content">
    <Bulletin />
    <ARow :gutter="[8, 8]" style="margin-top: 16px" :wrap="true">
      <ACol :xs="12" :md="12" :lg="12" :xl="6" v-for="item in stats">
        <ACard>
          <AStatistic
            :title="item.title"
            :value="item.value"
            :value-style="item.style"
          >
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
        <UpdateLog />
      </ACol>
    </ARow>
    <ARow :gutter="[16, 16]" style="margin-top: 16px">
      <ACol :span="24" :lg="14">
        <ACard title="更新日志">
          <UpdateLogLeft />
        </ACard>
      </ACol>
      <ACol :span="24" :lg="10">
        <ACard
          title="更新日志"
          :body-style="{ maxHeight: '385px', overflowY: 'auto' }"
        >
          <IncomeChart />
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
  box-shadow:
    0 1px 2px 0 rgba(0, 0, 0, 0.03),
    0 1px 6px -1px rgba(0, 0, 0, 0.02),
    0 2px 4px 0 rgba(0, 0, 0, 0.02);
}

@media screen and (max-width: 568px) {
  :deep(.ant-card-body) {
    padding:8px 16px;
  }
}
</style>
