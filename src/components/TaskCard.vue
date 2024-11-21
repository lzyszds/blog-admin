<!--任务列表卡片-->

<script setup lang="ts">
import { useDateFormat } from "@vueuse/shared";
import LzyIcon from "@/components/LzyIcon.vue";
import { MenuData, Task } from "@/typings/Plantask.ts";

interface Props {
  item: Task;
  menuData: (item: Task) => MenuData[];
}

const { item, menuData: menuDataFn } = defineProps<Props>();
const menuData = menuDataFn(item);
</script>

<template>
  <a-card>
    <h2>{{ item.name }}</h2>

    <p><span>执行服务：</span>{{ item.type }}()</p>
    <p><span>计划执行：</span>{{ item.cronExpression }}</p>
    <p>
      <span> 上次执行：</span>
      {{
        item.lastExecutedAt
          ? useDateFormat(item.lastExecutedAt, "YYYY-MM-DD HH:mm:ss")
          : "暂无"
      }}
    </p>
    <p>
      <span> 创建时间：</span>
      {{ useDateFormat(item.createdAt, "YYYY-MM-DD HH:mm:ss") }}
    </p>
    <p>
      <span> 更新时间：</span>
      {{ useDateFormat(item.updatedAt, "YYYY-MM-DD HH:mm:ss") }}
    </p>
    <a-divider />

    <div class="bottom">
      <section v-if="item.isEnabled == 0">
        <ATag color="#dc143c" style="color: #fff">已暂停</ATag>
        <a-divider type="vertical" />
        <LzyIcon
          size="20"
          name="solar:stopwatch-play-broken"
          style="color: #dc143c"
        />
      </section>
      <section v-else>
        <ATag color="#00CE3E" style="color: #fff">启动中</ATag>
        <a-divider type="vertical" />
        <LzyIcon
          size="20"
          name="solar:stopwatch-pause-broken"
          style="color: #00ce3e"
          @click="menuData[0].click"
        />
      </section>
      <section>
        <AButton type="text" @click="menuData[4].click">
          <LzyIcon name="material-symbols:edit-calendar" size="20" />
        </AButton>
        <AButton type="text" @click="menuData[3].click">
          <LzyIcon name="material-symbols:auto-delete-outline" size="20" />
        </AButton>
      </section>
    </div>
  </a-card>
</template>

<style scoped></style>
