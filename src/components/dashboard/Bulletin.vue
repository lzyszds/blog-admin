<script setup lang="ts">
import { useUserInfoState } from "@/store/useUserInfoStore.ts";
import { getWeather } from "@/api/toolkit.ts";
import { useRequest } from "alova/client";

const userState = useUserInfoState();

const weather = ref();

//获取天气
useRequest(getWeather, {
  immediate: true,
  cacheKey: "weather",
}).onSuccess((res) => {
  weather.value = res.data.data;
});

//早上好，下午好，晚上好
const timeName = () => {
  const now = new Date();
  const hour = now.getHours();
  if (hour < 6) {
    return "凌晨好";
  } else if (hour < 9) {
    return "早上好";
  } else if (hour < 12) {
    return "上午好";
  } else if (hour < 14) {
    return "中午好";
  } else if (hour < 17) {
    return "下午好";
  } else if (hour < 19) {
    return "傍晚好";
  } else if (hour < 22) {
    return "晚上好";
  } else {
    return "夜深了，请注意休息";
  }
};
</script>

<template>
  <ACard>
    <a-skeleton
      v-if="!weather"
      id="card-skeleton"
      :avatar="{
        shape: 'circle',
        size: 64,
      }"
      :paragraph="{ rows: 1 }"
      active
    />

    <div class="item" v-else>
      <a-avatar
        :size="64"
        width="100%"
        src="/pictureBedImage/OQli-X5pRicN9w9cAhUfgLRSFdNs0Zl76hzKIXdyoxg0gAA"
      >
      </a-avatar>

      <p>{{ timeName() }} {{ userState.userInfo.uname }},今天又是充满活力的一天!</p>
      <p>
        {{ weather.province + weather.city }}
        <template v-if="weather.weather">今日 {{ weather.weather }}</template>
        <template v-if="weather.windpower">&nbsp;{{ weather.windpower }}级</template> 
        <template v-if="weather.winddirection">&nbsp;{{ weather.winddirection }}风</template> 
        <template v-if="weather.temperature">&nbsp;&nbsp;{{ weather.temperature }}°C  </template>🎉持续学习，不断进步
      </p>
    </div>
  </ACard>
</template>

<style scoped>
#card-skeleton :deep(.ant-skeleton-paragraph) {
  margin-block-start: 0;
}

.item {
  display: grid;
  grid-template-columns: 60px 1fr;
  grid-template-rows: 1fr 1fr;

  grid-template-areas:
    "avatar text"
    "avatar weather";
  align-items: center;
  gap: 0 20px;

  .ant-avatar {
    grid-area: avatar;
  }

  p {
    margin: 0;
    font-family: "dindin", monospace;
    grid-area: text;
    font-size: clamp(16px, 2vw, 20px);

    &:last-child {
      font-size: clamp(10px, 2vw, 12px);
      color: #666;
      grid-area: weather;
      font-family: var(--font), serif;
    }
  }
}

@media screen and (max-width: 568px) {
  .item {
    grid-template-rows: 1fr 25px;
  }
}
</style>
