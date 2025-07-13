// api.js
import { Method } from "alova";
import { AlovaInstance } from "./index"; // 请求头
// 请求头
const commonHeaders = {
  "x-real-ip": import.meta.env.VITE_IP_ADDRESS,
};

export const Alova = {
  // 这是get请求
  createGet(url: string, options?: Record<string, any>) {
    return AlovaInstance.Get(url, {
      cacheFor: 1000 * 60 * 10, // 缓存时间
      timeout: 10000, // 超时时间
      credentials: "include",
      ...options,
    }) as Method<any>;
  },
  // 这是post请求
  createPost(
    url: string,
    data?: Record<string, any>,
    options?: Record<string, any>,
  ) {

    // 检查 data 是否为 FormData 实例
    const isFormData = data instanceof FormData;

    // 构建请求头
    const requestHeaders = {
      ...commonHeaders, // 添加公共请求头
      ...options?.headers, // 合并用户传入的headers（如果api.js调用时有传递）
    };

    if (isFormData) {
      delete requestHeaders["Content-Type"];
    }

    return AlovaInstance.Post(url, data, {
      headers: requestHeaders,
      ...options,
      credentials: "include",
    }) as Method<any>;
  },
};
