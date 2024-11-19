import request from "@/utils/request";


// 获取系统配置
export const getSystemConfig = () => {
     return request({
          url: "/system/getSystemConfig?type=admin",
          method: "get",
     });
}


//新增系统配置
export const addSystemConfig = (data: object) => {
     return request({
          url: "/system/addSystemConfig",
          method: "post",
          data
     });
}

// 更新系统配置
export const updateSystemConfig = (data: object) => {
     return request({
          url: "/system/updateSystemConfig",
          method: "post",
          data
     });
}


// 获取系统图片懒加载的图片
export const getSystemLoadImages = () => {
     return request({
          url: "/system/getSystemLoadImages",
          method: "get",
     });
}

// 获取底部信息
export const getFooterInfo = () => {
     return request({
          url: "/system/getFooterInfo",
          method: "get",
     });
}

// 新增底部信息
export const addFooterInfo = (data: object) => {
     return request({
          url: "/system/addFooterInfo",
          method: "post",
          data,
     })
}

// 新增二级底部信息
export const addFooterLink = (data: object) => {
     return request({
          url: "/system/addFooterLink",
          method: "post",
          data,
     })
}

// 更新底部信息
export const updateFooterInfo = (data: object) => {
     return request({
          url: "/system/updateFooterInfo",
          method: "post",
          data,
     })
}

//更新页脚一级分类信息
export const updateFooterCategory = (data: object) => {
     return request({
          url: "/system/updateFooterCategory",
          method: "post",
          data,
     })
}

//更新页脚二级分类信息
export const updateFooterLink = (data: object) => {
     return request({
          url: "/system/updateFooterLink",
          method: "post",
          data,
     })
}
