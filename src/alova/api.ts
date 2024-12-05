// api.js
import { AlovaInstance } from "./index"; // 请求头
// 请求头
const headers = {
  "Content-Type": "application/json;charset=UTF-8",
  "x-real-ip": import.meta.env.VITE_IP_ADDRESS,
};

export const Alova = {
  // 这是get请求
  createGet(url: string, options?: Record<string, any>) {
    return AlovaInstance.Get(url, {
      ...options,
      cacheFor: 1000 * 60 * 10, // 缓存时间
      timeout: 10000, // 超时时间
      credentials: "include",
    });
  },
  // 这是post请求
  createPost(
    url: string,
    data?: Record<string, any>,
    options?: Record<string, any>,
  ) {
    return AlovaInstance.Post(url, data, {
      headers,
      ...options,
      credentials: "include",
    });
  },
};
