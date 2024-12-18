import { Column, Params } from "@/typings/Column";
import { defineStore } from "pinia";

export const getTableStore = defineStore("getTableStore", () => {

  let params = ref<Params>({
    refreshData: () => { },
    delData: (_item: any) => { },
    openModal: (_item: any) => { },
    columns: () => { },
  });
  const columns = ref<Column[]>([])

  /* 初始化回调函数 上方params中的回调函数 */
  const setCallbackArr = (param: Params) => {
    params.value = param;
    /* 初始化列 判断 是否是ref 避免出现 ref.value.value */
    if (isRef(param.columns(param))) {
      columns.value = param.columns(param).value
    } else {
      columns.value = param.columns(param)
    }
  };

  return { columns, setCallbackArr, };
});
