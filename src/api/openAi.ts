import request from "@/utils/request";


// 获取 ai key 列表
export const getAiKeysList = () => {
     return request({
          url: "/openAI/getAiKeysList",
          method: "get",
     })
}



//设置ai key
export const addAiKeyApi = (data: object) => {
     return request({
          url: "/aiService/addAiKey",
          method: "post",
          data,
     })
}



