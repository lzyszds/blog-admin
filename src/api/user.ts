import { convertKeysToSnakeCase } from "@/utils";
import { Alova } from "@/alova/api.ts"; /* 根据id获取用户信息 */


/* 根据id获取用户信息 */
export const getUserInfo = (params: any) => {
  if (isRef(params)) params = unref(params);
  return Alova.createGet(`/user/getUserInfo`, { params });
};

/* 根据token获取用户信息 */
export const getUserInfoToken = () => {
  return Alova.createGet(`/user/getUserInfoToken`);
};

/* 获取用户列表 */
export const getUserList = (params: any) => {
  if (isRef(params)) params = unref(params);
  params.pages = params.pages;
  return Alova.createGet(`/user/getUserList`, { params });
};

/* 添加用户 */
export const addUser = (params: any) => {
  if (isRef(params)) params = unref(params);
  // 将参数转换为 snake_case 下划线形式
  params = convertKeysToSnakeCase(params);
  return Alova.createPost("/user/addUser", params);
};

/* 修改用户 */
export const editUser = (params: any) => {
  if (isRef(params)) params = unref(params);
  // 将参数转换为 snake_case 下划线形式
  params = convertKeysToSnakeCase(params);
  return Alova.createPost("/user/updateUser", params);
};

/* 删除用户 */
export const delUser = (params: any) => {
  if (isRef(params)) params = unref(params);
  return Alova.createPost("/user/deleteUser", params);
};

/* 账号登陆 */
export const login = (params: any) => {
  if (isRef(params)) params = unref(params);
  return Alova.createPost("/user/login", params);
};

//获取所有可选头像
export const getAllHeadImg = () => {
  return Alova.createGet("/user/getAllHeadImg");
};

//上传头像
export const uploadHeadImg = (file: any) => {
  if (isRef(file)) file = unref(file);

  // 检查 file 是否为有效的文件
  if (!(file instanceof File || file instanceof Blob)) {
    throw new Error("Invalid file type. Expected a File or Blob.");
  }

  // 创建 FormData 对象
  const formData = new FormData();
  formData.append("file", file); // 'headImg' 为服务器端预期的字段名
  console.log(formData);

  return Alova.createPost("/user/uploadHeadImg", formData);
};
