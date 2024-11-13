import request from "@/utils/request";


// 获取邮箱任务配置
export const getEmailTaskConfig = ()=> {
  return request({
    url: "/plantask/getEmailTaskConfig",
    method: "get",
  })
}

//更新邮箱任务配置
export const updateEmailTaskConfig = (data: object)=> {
  return request({
    url: "/plantask/updateEmailTaskConfig",
    method: "post",
    data,
  })
}



