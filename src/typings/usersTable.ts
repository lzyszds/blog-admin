import { Avatar } from 'ant-design-vue';
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

export const columns = [
  {
    title: "UID",
    dataIndex: "uid",
    key: "uid",
    width: "80px",
  },
  {
    title: "头像",
    dataIndex: "headImg",
    key: "headImg",
    width: "80px",
    // 可用于显示图片或设置渲染方法
    customRender: ({ text }) => {
      return h(Avatar, { src: '/hono/static' + text, shape: "square" })
    },
  },
  {
    title: "昵称",
    dataIndex: "uname",
    key: "uname",
    width: "120px",
  },
  {
    title: "用户名",
    dataIndex: "username",
    key: "username",
    width: "120px",
  },
  {
    title: "权限",
    dataIndex: "power",
    key: "power",
    width: "80px",
  },
  {
    title: "创建日期",
    dataIndex: "createDate",
    key: "createDate",
    customRender: ({ text }) => {
      return useDateFormat(text, 'YYYY-MM-DD').value
    },
    width: "100px",
  },
  {
    title: "登录日期",
    dataIndex: "lastLoginDate",
    key: "lastLoginDate",
    width: "100px",
    customRender: ({ text }) => {
      if (!text) return '暂无'
      return useDateFormat(text, 'YYYY-MM-DD').value
    },
  },
  {
    title: "上次登录 IP",
    dataIndex: "lastLoginIp",
    key: "lastLoginIp",
    width: "120px",
  },
];
