import { convertKeysToSnakeCase } from "@/utils/comment";
import request from "@/utils/request";


/* 根据id获取用户信息 */
export const getUserInfo = async (params: any) => {
  return await request({
    url: `/users/getUserInfo`,
    method: "get",
    params,
  });
};

/* 根据token获取用户信息 */
export const getUserInfoToken = async () => {
  return await request({
    url: `/users/getUserInfoToken`,
    method: "get",
  });
};

/* 获取用户列表 */
export const getUsersList = async (params: any) => {
  if (isRef(params)) params = unref(params);
  params.pages = params.pages
  // let { pages, limit } = params;
  return await request({
    url: `/users/getUserList`,
    method: "get",
    params,
  });
};

/* 添加用户 */
export const addUser = async (params: any) => {
  if (isRef(params)) params = unref(params);
  // 将参数转换为 snake_case 下划线形式
  params = convertKeysToSnakeCase(params)
  return await request({
    url: "/users/addUser",
    method: "post",
    data: params,
  });
};

/* 修改用户 */
export const editUser = async (params: any) => {
  if (isRef(params)) params = unref(params);
  // 将参数转换为 snake_case 下划线形式
  params = convertKeysToSnakeCase(params)
  return await request({
    url: "/users/updateUser",
    method: "post",
    data: params,
  });
};

/* 删除用户 */
export const delUser = async (params: any) => {
  if (isRef(params)) params = unref(params);
  return await request({
    url: "/users/deleteUser",
    method: "post",
    data: params,
  });
};

/* 账号登陆 */
export const login = async (params: any) => {
  if (isRef(params)) params = unref(params);
  return await request({
    url: "/users/login",
    method: "post",
    data: params,
  });
};

//获取所有可选头像
export const getAllHeadImg = async () => {
  return await request({
    url: "/users/getAllHeadImg",
    method: "get",
  });
};

//上传头像
export const uploadHeadImg = async (file: any) => {
  if (isRef(file)) file = unref(file);

  // 检查 file 是否为有效的文件
  if (!(file instanceof File || file instanceof Blob)) {
    throw new Error('Invalid file type. Expected a File or Blob.');
  }

  // 创建 FormData 对象
  const formData = new FormData();
  formData.append('file', file); // 'headImg' 为服务器端预期的字段名
  return await request({
    url: "/users/uploadHeadImg",
    method: "post",
    headers: {
      "Content-Type": "multipart/form-data",
    },
    data: formData,
  });
};