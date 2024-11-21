import request from "@/utils/request";


// 获取邮箱任务配置
export const getEmailTaskConfig = () => {
  return request({
    url: "/plantask/getEmailTaskConfig",
    method: "get",
  })
}

//更新邮箱任务配置
export const updateEmailTaskConfig = (data: object) => {
  return request({
    url: "/plantask/updateEmailTaskConfig",
    method: "post",
    data,
  })
}

//获取所有任务
export const getAllTask = () => {
  return request({
    url: "/plantask/tasks",
    method: "get",
  })
}

//更新任务
export const updateTask = (data: object) => {
  return request({
    url: "/plantask/updateTask",
    method: "post",
    data,
  })
}


//立即执行任务
export const runTask = (taskId: number) => {
  return request({
    url: `/plantask/tasks/${taskId}/execute`,
    method: "post",
  })
}


