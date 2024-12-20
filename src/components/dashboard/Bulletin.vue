<script setup lang="ts">
import { useUserInfoState } from "@/store/useUserInfoStore.ts";
import { getWeather } from "@/api/toolkit.ts";

const userState = useUserInfoState();

//获取天气
const { data: weather } = await getWeather();

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
    <div class="item">
      <a-avatar
        :size="64"
        width="100%"
        src="/pictureBedImage/OQli-X5pRicN9w9cAhUfgLRSFdNs0Zl76hzKIXdyoxg0gAA"
      >
      </a-avatar>

      <p>
        {{ timeName() }} {{ userState.userInfo.uname }},今天又是充满活力的一天!
      </p>
      <p>
        {{ weather.province + weather.city }} 今日 {{ weather.weather }}
        {{ weather.windpower }}级{{ weather.winddirection }}风
        {{ weather.temperature }} °C 🎉持续学习，不断进步
      </p>
    </div>
  </ACard>
</template>

<style scoped>
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
      font-family: var(--font);
    }
  }
}

@media screen and (max-width: 568px) {
  .item {
    grid-template-rows: 1fr 25px;
  }
}
</style>
