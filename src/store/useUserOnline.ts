import { defineStore } from "pinia";


export const useUserOnlineStore = defineStore("useUserOnline", () => {
  // 用户在线列表 存放的是用户id
  const userOnline = ref<number[]>([]);
  const onlinePeople = computed(() => userOnline.value.length);

  const setUserOnline = (value: number[]) => {
    userOnline.value = value;
  };

  return {
    userOnline,
    onlinePeople,
    setUserOnline,
  };
});
