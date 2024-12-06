import { ref } from "vue";

interface RequestAfterCall {
  success?: (data: any) => void;
  fail?: (data: any) => void;
}

interface UseRequestReturn {
  data: any;
  loading: boolean | Ref<boolean>;
  error: any;
  throttledRequest: (...args: any[]) => Promise<void>;
}

/**
 * @param apiFunction 请求函数
 * @param requestAfterCall 请求成功或失败后的回调
 * @param throttleDelay 节流延迟时间
 * @returns 返回一个包含 loading、data、error 和 throttledRequest 的对象
 */

export function useRequest(
  apiFunction: (...args: any[]) => Promise<any>,
  requestAfterCall: RequestAfterCall = {},
  throttleDelay = 1000,
): UseRequestReturn {
  const loading = ref<boolean>(false); /* 加载状态 */
  const error = ref<any>(null); /* 错误信息 */
  const data = ref<any>(null); /* 请求结果 */

  /*  节流函数 */
  const throttledRequest = useThrottleFn(async (...args: any[]) => {
    loading.value = true;
    error.value = null;

    try {
      /* 执行请求 */
      const result = (await apiFunction(...args)).data;
      data.value = result;
      requestAfterCall.success?.(data.value); // 使用可选链调用
    } catch (err: any) {
      /* 请求失败 */
      error.value = err;
      // message.error(err.message + " 请稍后重试");
      console.error(err, apiFunction);
      /* 请求失败，调用失败回调函数 */
      requestAfterCall.fail?.(err); // 使用可选链调用
    } finally {
      /* 请求完成，重置加载状态 */
      loading.value = false;
    }

  }, throttleDelay);


  return { data, loading, error, throttledRequest };
}
