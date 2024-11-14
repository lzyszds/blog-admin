/* 用户信息 非管理员可见 */
export interface User {
  uid?: number;
  uname?: string;
  username?: string;
  power?: number;
  createDate?: string;
  lastLoginDate?: string | null;
  headImg?: string;
  whetherUse?: number | boolean;
  signature?: string;
  createIp?: string;
  lastLoginIp?: string | null;
}

/* 用户信息 管理员可见 */
export interface UserAdmin extends User {
  activationKey?: string;
  password?: string;
}
