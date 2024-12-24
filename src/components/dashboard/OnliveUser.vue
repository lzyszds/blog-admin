<script lang="ts" setup>
import {useUserOnlineStore} from "@/store/useUserOnline";

const userOnlineStore = useUserOnlineStore();
</script>
<template>
  <div class="onliveUser">
    <a-tooltip placement="top" v-for="item in userOnlineStore.userOnline" :key="item.uid">
      <template #title>
        <span>{{ item.uname }}{{ item.lastLoginIp }}</span>
      </template>
      <ACard :body-style="{padding:'13px'}">
        <ABadge status="processing" color="green" :dot="true">
          <AAvatar :src="item.headImg" :size="45"/>
        </ABadge>
      </ACard>
    </a-tooltip>

  </div>
</template>

<style scoped>
.onliveUser {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(60px, 1fr));
  grid-template-rows: repeat(auto-fill, minmax(60px, 1fr));
  gap: 10px;
  height: 400px;
}

:deep(h4),
:deep(p) {
  margin: 0;
}
</style>
