import { Column, Params } from "@/typings/Column";
import { defineStore } from "pinia";

export const getUsersTable = defineStore("getUsersTable", () => {

  let params = ref<Params>({
    getData: () => { },
    delData: (_item: any) => { },
    openModal: (_item: any) => { },
    columns: () => { },
  });
  const columns = ref<Column[]>([])

  /* 初始化回调函数 上方params中的回调函数 */
  const setCallbackArr = (param: Params) => {
    params.value = param;
    /* 初始化列 */
    columns.value = param.columns(param)
  };

  return { columns, setCallbackArr, };
});
