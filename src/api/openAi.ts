import { Alova } from "@/alova/api.ts";

// 获取 ai key 列表
export const getAiKeysList = () => {
  return Alova.createGet("/openAI/getAiKeysList");
};

//设置ai key
export const addAiKeyApi = (data: object) => {
  return Alova.createPost("/openAI/addAiKey", data);
};

//更新ai key
export const updateAiKeyApi = (data: object) => {
  return Alova.createPost("/openAI/updateAiKey", data);
};
