import request from '@/utils/request';

/* 获取用户列表 */
export const getUsersList = async (params: any) => {
  if (isRef(params)) params = unref(params);
  let { pages, limit, search } = params
  return await request({
    url: `/users/getUserList?pages=${pages || ''}&limit=${limit || ''}&search=${''}`,
    method: 'get',
    params,
  });
};

/* 添加用户 */
export const addUser = async (params: any) => {
  if (isRef(params)) params = unref(params);
  return await request({
    url: '/users/addUser',
    method: 'post',
    data: params,
  });
};

/* 删除用户 */
export const delUser = async (params: any) => {
  if (isRef(params)) params = unref(params);
  return await request({
    url: '/users/deleteUser',
    method: 'post',
    data: params,
  });
};

/* 账号登陆 */
export const login = async (params: any) => {
  if (isRef(params)) params = unref(params);
  return await request({
    url: '/users/login',
    method: 'post',
    data: params,
  });
};
