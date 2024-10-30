

export interface DataType {
  uid: number;
  uname: string;
  username: string;
  password: string;
  power: number;
  createDate: string; // 或者 Date 类型
  lastLoginDate: string | null; // 或者 Date 类型
  headImg: string;
  whetherUse: number;
  signature: string;
  activationKey: string;
  createIp: string;
  lastLoginIp: string | null;
}


