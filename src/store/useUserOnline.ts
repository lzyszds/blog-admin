import { User } from "@/typings/User";
import { defineStore } from "pinia";


export const useUserOnlineStore = defineStore("useUserOnline", () => {
  // 用户在线列表 存放的是用户id
  const userOnline = ref<User[]>([]);
  const onlinePeople = computed(() => userOnline.value.length);

  const setUserOnline = (value: User[]) => {
    userOnline.value = value;
  };

  return {
    userOnline,
    onlinePeople,
    setUserOnline,
  };
});
