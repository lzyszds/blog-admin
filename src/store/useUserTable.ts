import { Avatar, Tag, Button, Popconfirm, message, } from "ant-design-vue";
import LzyIcon from "@/components/LzyIcon.vue";
import { defineStore } from "pinia";

interface Params {
  getListCallbask: () => void;
  delCallback: any;
  openModal: any;
}

interface Column {
  title: string;
  dataIndex: string;
  key: string;
  width?: string;
  ellipsis?: boolean;
  checked?: boolean;
  customRender?: (params: any) => any;
}


export const getUsersTable = defineStore("getUsersTable", () => {
  let params = ref<Params>({
    getListCallbask: () => { },
    delCallback: (_item: any) => { },
    openModal: (_item: any) => { },
  });
  const setCallbackArr = (param: Params) => {
    params.value = param;
  };

  const columns = ref<Column[]>([
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
        return h(Avatar, { src: "/hono/static" + text, shape: "square" });
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
      width: "100px",
      customRender: ({ text }) => {
        return h(
          Tag,
          {
            color: text !== 0 ? "var(--themeColor)" : "#cd201f",
            icon: h(LzyIcon, {
              name: text !== 0 ? "iconoir:user-square" : "iconoir:user-crown",
              size: 16,
            }),
            style: {
              display: "flex",
              alignItems: "center",
              gap: "4px",
              width: "65px",
            },
            html: "inline-block",
          },
          () => text !== 0 ? "user" : "admin" // 使用函数形式
        );
      },
    },
    {
      title: "创建日期",
      dataIndex: "createDate",
      key: "createDate",
      customRender: ({ text }) => {
        return useDateFormat(text, "YYYY-MM-DD").value;
      },
      width: "120px",
    },
    {
      title: "登录日期",
      dataIndex: "lastLoginDate",
      key: "lastLoginDate",
      width: "100px",
      customRender: ({ text }) => {
        if (!text) return "暂无";
        return useTimeAgo(text).value;
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
          h(
            Button,
            {
              type: "primary",
              size: "small",
              style: { fontSize: "12px" },
              onClick: () => params.value.openModal(record),
            },
            { default: () => "编辑" } // 插槽内容
          ),
          h(
            Popconfirm,
            {
              title: "确定删除该用户吗？",
              cancelText: "取消",
              okText: "确定",
              onConfirm: async () => {
                const result: any = await params.value.delCallback(record);
                if (result) {
                  message.success(result);
                  params.value.getListCallbask();
                }
              },
            },
            {
              default: () =>
                h(
                  Button,
                  {
                    type: "primary",
                    size: "small",
                    danger: true,
                    style: { fontSize: "12px", marginLeft: "10px" },
                  },
                  { default: () => "删除" } // 插槽内容
                ),
            }
          ),
        ];
      },
    },
  ]);

  columns.value = columns.value.map((item) => {
    return { ...item, ellipsis: true, checked: true };
  });

  return { columns, setCallbackArr, };
});
