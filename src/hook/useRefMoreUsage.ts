import { cloneDeep } from "lodash";

/*
 *  创建一个响应式的对象，提供重置方法
 *  使用场景：
 *  提交完成表单之后 ，重置表单 并关闭弹窗和loading状态
 * */

export const useRefMoreUsage = <T extends object>(originalValue: any) => {
  const data = ref<T>(cloneDeep(originalValue));

  const reset = () => {
    data.value = cloneDeep(originalValue);
  };

  return {
    data,
    reset,
  };
};
