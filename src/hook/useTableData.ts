import { ExclamationCircleOutlined } from "@ant-design/icons-vue";
import { message, Modal } from "ant-design-vue";
import { createVNode } from "vue";

//多选删除列表事件
export const multDelData = (uids, request, callback) => {
  Modal.confirm({
    title: "温馨提醒",
    icon: createVNode(ExclamationCircleOutlined),
    content: "确定要删除这些内容吗？",
    okText: "确定",
    cancelText: "取消",
    onOk() {
      request({ uid: uids.join(",") }).then(() => {
        callback()
        message.success("删除成功");
      });
    },
  });
};