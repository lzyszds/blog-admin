import { Method } from "alova";
import { ref } from "vue";

interface RequestAfterCall {
  success?: (data: any) => void;
  fail?: (data: any) => void;
}

interface useRequestParams {
  apiRequest: Method
  option: {
    throttleDelay?: number;
    requestAfterCall?: RequestAfterCall;
    immediate?: boolean;
  }
}

interface UseRequestReturn {
  data: any;
  loading: boolean | Ref<boolean>;
  error: any;
  send: (force?: boolean) => Promise<void>;
}

/**
 * @param apiRequest 请求函数
 * @param requestAfterCall 请求成功或失败后的回调
 * @param throttleDelay 节流延迟时间
 * @returns 返回一个包含 loading、data、error 和 throttledRequest 的对象
 */

export function useRequest(
  apiRequest: useRequestParams['apiRequest'],
  option: useRequestParams['option'] = { immediate: false }
): UseRequestReturn {
  const loading = ref<boolean>(false);
  const error = ref<any>(null);
  const data = ref<any>(null);
  const { requestAfterCall = {}, immediate } = option;
  const send = async (force: boolean = false) => {
    loading.value = true;
    error.value = null;

    try {
      const result = await apiRequest.send(force);
      data.value = result.data;
      requestAfterCall.success?.(data.value);
    } catch (err: any) {
      error.value = err;
      console.error(err, apiRequest);
      requestAfterCall.fail?.(err);
    } finally {
      loading.value = false;
    }
  };

  if (immediate) {
    send(false);
  }

  return { data, loading, error, send };
}
