import { Avatar, Tag, Button } from 'ant-design-vue';
import LzyIcon from '@/components/LzyIcon.vue';


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
    width: "70px",
    customRender: ({ text }) => {

      return h(Tag, {
        color: text !== 0 ? 'var(--themeColor)' : '#cd201f',
        icon: h(LzyIcon, {
          name: text !== 0 ? 'iconoir:user-square' : 'iconoir:user-crown',
          size: 16
        }),
        style: {
          display: 'flex',
          alignItems: 'center',
          gap: '4px',
          maxWidth: '70px'
        }
      }, text !== 0 ? 'user' : 'admin')
    },
  },
  {
    title: "创建日期",
    dataIndex: "createDate",
    key: "createDate",
    customRender: ({ text }) => {
      return useDateFormat(text, 'YYYY-MM-DD').value
    },
    width: "120px",
  },
  {
    title: "登录日期",
    dataIndex: "lastLoginDate",
    key: "lastLoginDate",
    width: "100px",
    customRender: ({ text }) => {
      if (!text) return '暂无'
      return useTimeAgo(text).value
      // return useDateFormat(text, 'YYYY-MM-DD').value
    },
  },
  {
    title: "上次登录 IP",
    dataIndex: "lastLoginIp",
    key: "lastLoginIp",
    width: "120px",
  },
  {
    title: "操作",
    dataIndex: "action",
    key: "action",
    width: "120px",
    customRender: ({ record }) => {
      return [
        h(Button, {
          type: 'primary',
          size: 'small',
          style: {
            fontSize: '12px'
          },
        },
          { default: () => '编辑' } // 插槽内容
        ),
        h(Button, {
          type: 'primary',
          size: 'small',
          danger: true,
          style: {
            fontSize: '12px',
            marginLeft: '10px'
          },
        },
          { default: () => '删除' } // 插槽内容
        )
      ]
    }
  }

];
