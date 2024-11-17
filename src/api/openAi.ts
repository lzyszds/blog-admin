import request from "@/utils/request";

// 获取 ai key 列表
export const getAiKeysList = () => {
  return request({
    url: "/openAI/getAiKeysList",
    method: "get",
  });
};

//设置ai key
export const addAiKeyApi = (data: object) => {
  return request({
    url: "/openAI/addAiKey",
    method: "post",
    data,
  });
};

//更新ai key
export const updateAiKeyApi = (data: object) => {
  return request({
    url: "/openAI/updateAiKey",
    method: "post",
    data,
  });
};
