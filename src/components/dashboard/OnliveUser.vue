<script lang="ts" setup>
import { useUserOnlineStore } from "@/store/useUserOnline";

const userOnlineStore = useUserOnlineStore();
</script>
<template>
  <div class="onliveUser">
    <ACard v-for="item in userOnlineStore.userOnline">
      <ABadge status="processing" color="green" :dot="true">
        <AAvatar :src="item.headImg" :size="45" />
      </ABadge>
      <h4>{{ item.uname }}</h4>
      <p>{{ item.lastLoginIp }}</p>
    </ACard>
  </div>
</template>

<style scoped>
.onliveUser {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
  grid-template-rows: repeat(auto-fill, minmax(120px, 1fr));
  gap: 10px;
  height: 400px;
}
:deep(h4),
:deep(p) {
  margin: 0;
}
</style>
