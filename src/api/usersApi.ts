import request from '@/utils/request';


export const getUsersList = async (params: any) => {
  let { pages, limit, search } = params
  return await request({
    url: `/users/getUserList?pages=${pages || ''}&limit=${limit || ''}&search=${''}`,
    method: 'get',
    params,
  });
};