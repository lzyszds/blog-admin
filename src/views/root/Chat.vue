<script setup lang="ts">
import LzyIcon from "@/components/LzyIcon.vue";
import md from "@/components/markdown/markdownInit";

const aiForm = ref<any>({
  input: "",
  model: "Qwen/Qwen2-7B-Instruct", // 默认模型
  baseURL: "https://api.siliconflow.cn/v1", // 阿里云硅基AI的基础URL
});

const modelVisible = ref(false); // 控制模态框的显示状态 （模型选择）
const modelArr = ref([
  // 模型列表
  {
    name: "Qwen/Qwen2-7B-Instruct",
    price: "免费",
    icon: "https://sf-maas-uat-prod.oss-cn-shanghai.aliyuncs.com/Model_LOGO/Tongyi.svg",
    description:
      "Qwen2-7B-Instruct 是 Qwen2 系列中的指令微调大语言模型，参数规模为 7B。该模型基于 Transformer 架构，采用了 SwiGLU 激活函数、注意力 QKV 偏置和组查询注意力等技术。它能够处理大规模输入。该模型在语言理解、生成、多语言能力、编码、数学和推理等多个基准测试中表现出色，超越了大多数开源模型，并在某些任务上展现出与专有模型相当的竞争力。Qwen2-7B-Instruct 在多项评测中均优于 Qwen1.5-7B-Chat，显示出显著的性能提升",
  },
  {
    name: "deepseek-ai/DeepSeek-R1-Distill-Qwen-7B",
    price: "免费",
    icon: "https://sf-maas-uat-prod.oss-cn-shanghai.aliyuncs.com/Model_LOGO/DeepSeek.svg",
    description:
      "DeepSeek-R1-Distill-Qwen-7B 是基于 Qwen2.5-Math-7B 通过知识蒸馏得到的模型。该模型使用 DeepSeek-R1 生成的 80 万个精选样本进行微调，展现出优秀的推理能力。在多个基准测试中表现出色，其中在 MATH-500 上达到了 92.8% 的准确率，在 AIME 2024 上达到了 55.5% 的通过率，在 CodeForces 上获得了 1189 的评分，作为 7B 规模的模型展示了较强的数学和编程能力",
  },
  {
    name: "deepseek-ai/DeepSeek-R1",
    price: "￥16/ M Tokens",
    icon: "https://sf-maas-uat-prod.oss-cn-shanghai.aliyuncs.com/Model_LOGO/DeepSeek.svg",
    description:
      "DeepSeek-R1-0528 是一款强化学习（RL）驱动的推理模型，解决了模型中的重复性和可读性问题。在 RL 之前，DeepSeek-R1 引入了冷启动数据，进一步优化了推理性能。它在数学、代码和推理任务中与 OpenAI-o1 表现相当，并且通过精心设计的训练方法，提升了整体效果。",
  },
  {
    name: "deepseek-ai/DeepSeek-V3",
    price: "￥8/ M Tokens",
    icon: "https://sf-maas-uat-prod.oss-cn-shanghai.aliyuncs.com/Model_LOGO/DeepSeek.svg",
    description:
      "新版 DeepSeek-V3 （DeepSeek-V3-0324）与之前的 DeepSeek-V3-1226 使用同样的 base 模型，仅改进了后训练方法。新版 V3 模型借鉴 DeepSeek-R1 模型训练过程中所使用的强化学习技术，大幅提高了在推理类任务上的表现水平，在数学、代码类相关评测集上取得了超过 GPT-4.5 的得分成绩。此外该模型在工具调用、角色扮演、问答闲聊等方面也得到了一定幅度的能力提升。",
  },
  {
    name: "Pro/deepseek-ai/DeepSeek-R1-Distill-Qwen-7B",
    price: "￥0.35/ M Tokens",
    icon: "https://sf-maas-uat-prod.oss-cn-shanghai.aliyuncs.com/Model_LOGO/DeepSeek.svg",
    description:
      "DeepSeek-R1-Distill-Qwen-7B 是基于 Qwen2.5-Math-7B 通过知识蒸馏得到的模型。该模型使用 DeepSeek-R1 生成的 80 万个精选样本进行微调，展现出优秀的推理能力。在多个基准测试中表现出色，其中在 MATH-500 上达到了 92.8% 的准确率，在 AIME 2024 上达到了 55.5% 的通过率，在 CodeForces 上获得了 1189 的评分，作为 7B 规模的模型展示了较强的数学和编程能力",
  },

  {
    name: "Qwen/Qwen3-32B",
    price: "￥4/ M Tokens",
    icon: "https://sf-maas-uat-prod.oss-cn-shanghai.aliyuncs.com/Model_LOGO/Tongyi.svg",
    description:
      "Qwen3-32B 是通义千问系列的最新大语言模型，拥有 32.8B 参数量。该模型独特地支持在思考模式（适用于复杂逻辑推理、数学和编程）和非思考模式（适用于高效的通用对话）之间无缝切换，显著增强了推理能力。模型在数学、代码生成和常识逻辑推理上表现优异，并在创意写作、角色扮演和多轮对话等方面展现出卓越的人类偏好对齐能力。此外，该模型支持 100 多种语言和方言，具备出色的多语言指令遵循和翻译能力",
  },
  {
    name: "Qwen/Qwen3-30B-A3B",
    price: "￥2.8/ M Tokens",
    icon: "https://sf-maas-uat-prod.oss-cn-shanghai.aliyuncs.com/Model_LOGO/Tongyi.svg",
    description:
      "Qwen3-30B-A3B 是通义千问系列的最新大语言模型，采用混合专家（MoE）架构，拥有 30.5B 总参数量和 3.3B 激活参数量。该模型独特地支持在思考模式（适用于复杂逻辑推理、数学和编程）和非思考模式（适用于高效的通用对话）之间无缝切换，显著增强了推理能力。模型在数学、代码生成和常识逻辑推理上表现优异，并在创意写作、角色扮演和多轮对话等方面展现出卓越的人类偏好对齐能力。此外，该模型支持 100 多种语言和方言，具备出色的多语言指令遵循和翻译能力",
  },
  {
    name: "Qwen/Qwen3-235B-A22B",
    price: "￥10/ M Tokens",
    icon: "https://sf-maas-uat-prod.oss-cn-shanghai.aliyuncs.com/Model_LOGO/Tongyi.svg",
    description:
      "Qwen3-235B-A22B 是通义千问系列的最新大语言模型，采用混合专家（MoE）架构，拥有 235B 总参数量和 22B 激活参数量。该模型独特地支持在思考模式（适用于复杂逻辑推理、数学和编程）和非思考模式（适用于高效的通用对话）之间无缝切换，显著增强了推理能力。模型在数学、代码生成和常识逻辑推理上表现优异，并在创意写作、角色扮演和多轮对话等方面展现出卓越的人类偏好对齐能力。此外，该模型支持 100 多种语言和方言，具备出色的多语言指令遵循和翻译能力",
  },
  {
    name: "THUDM/GLM-Z1-9B-0414",
    price: "免费",
    icon: "https://sf-maas-uat-prod.oss-cn-shanghai.aliyuncs.com/Model_LOGO/Zhipu.svg",
    description:
      "GLM-Z1-9B-0414 是 GLM 系列的小型模型，仅有 90 亿参数，但保持了开源传统的同时展现出惊人的能力。尽管规模较小，该模型在数学推理和通用任务上仍表现出色，其总体性能在同等规模的开源模型中已处于领先水平。研究团队采用了与大模型相同的一系列技术进行训练，使其在资源受限的场景中能够实现效率与效果的绝佳平衡，为寻求轻量级部署的用户提供强大选择。特别是在资源受限的场景下，该模型可以很好地在效率与效果之间取得平衡，为需要轻量化部署的用户提供强有力的选择",
  },
]);
const modelValue = ref(aiForm.value.model);

interface ChatMessage {
  role: "user" | "assistant"; // 消息角色
  content: string; // 消息内容
}

const chatMessages = ref<ChatMessage[]>([
  // 初始聊天消息列表
]);
// 用于存储当前正在生成的 AI 消息的引用，方便追加内容
let currentAiMessage = ref();

// 用于中止 fetch 请求的 AbortController 实例
let currentAbortController: any = null;

const sendMessage = async () => {
  if (aiForm.value.input.trim() === "") {
    return;
  }

  // 这里可以添加发送消息的逻辑

  chatMessages.value.push({
    role: "user",
    content: aiForm.value.input,
  });

  currentAbortController = new AbortController();
  const signal = currentAbortController.signal;

  try {
    const response = await fetch(import.meta.env.VITE_BASE_URL + `/api/openAI/sendChat`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization:
          "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1aWQiOjEsInVzZXJuYW1lIjoiYWRtaW4iLCJwb3dlciI6MCwiaGVhZF9pbWciOiIvcGljdHVyZUJlZEltYWdlL09RbGktWTVwUmljTjl3OWNBaFVmZ0xSU0ZkTnMwWmw3Nmh6S0lYZHlveGcwZ0FBIiwidW5hbWUiOiLpu47mmbrli4ciLCJzaWduYXR1cmUiOiLkuobop6PnmoTotorlpJrotorop4nlvpfoh6rlt7Hoj5zvvIzmi7zlkb3lrabkuaDkuI3mlaLoo4XpgLzvvIzllaXpg73kuI3nn6XpgZPnmoTvvIzlpKflpKnlkLnniZvpgLwiLCJ3aGV0aGVyX3VzZSI6MSwiaWF0IjoxNzQ4OTI1NDI0LCJleHAiOjE3NDkwOTgyMjR9.pUFlsUPLQGvCVNuGTwxznSemgdZMSrdlOZEnzdW98QE",
      },
      body: JSON.stringify({
        message: {
          role: "user",
          content: aiForm.value.input,
        },
        messages: chatMessages.value, // 传递当前的聊天消息列表
        model: aiForm.value.model,
        baseURL: aiForm.value.baseURL,
      }),
      signal: signal, // 关联 AbortController
    });

    if (!response.ok) {
      // 处理 HTTP 错误（例如 404, 500）
      const errorText = await response.text();
      throw new Error(`HTTP 错误! 状态: ${response.status}, 详情: ${errorText}`);
    }

    if (!response.body) {
      throw new Error("响应体为空，无法进行流式传输。");
    }

    const reader = response.body.getReader();
    const decoder = new TextDecoder();

    try {
      aiForm.value.input = ""; // 清空输入框
      currentAiMessage.value = null; // 重置当前 AI 消息

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value, { stream: true });
        const lines = chunk.split("\n");

        for (const line of lines) {
          const trimmedLine = line.trim();
          if (!trimmedLine || !trimmedLine.startsWith("data: ")) continue;

          // 提取实际的数据内容
          const data = trimmedLine.slice(6); // 移除 "data: " 前缀

          // 跳过空数据或结束标记
          if (!data || data === "[DONE]") continue;

          // 添加动画效果
          await new Promise((resolve) => requestAnimationFrame(resolve));
          const unescapedData = JSON.parse(data);

          // 将数据追加到当前的 AI 消息内容中
          if (currentAiMessage.value) {
            currentAiMessage.value.content += unescapedData;
          } else {
            // 如果当前没有 AI 消息，创建一个新的
            currentAiMessage.value = {
              role: "assistant",
              content: data,
            } as ChatMessage;
            chatMessages.value.push(currentAiMessage.value);
          }
        }
      }
    } catch (readError) {
      console.error("处理流数据失败:", readError);
      throw new Error("处理流数据失败");
    } finally {
      // 确保释放 reader
      reader.releaseLock();
    }
  } catch (error: any) {
    if (error.name === "AbortError") {
      console.log("Fetch 请求已中止。");
    } else {
      console.error("Fetch 请求出错:", error);
      // 这里可以添加用户友好的错误提示
      // showErrorMessage(error.message);
    }
  }
};

const textareaEnter = (event: KeyboardEvent) => {
  if (event.key === "Enter" && !event.shiftKey) {
    event.preventDefault(); // 阻止默认的换行行为
    sendMessage(); // 调用发送消息函数
  } else {
    // 如果是 Shift + Enter，则允许换行
    aiForm.value.input += "\n"; // 在输入框中添加换行符
  }
};

const selectModel = () => {
  aiForm.value.model = modelValue.value;
  modelVisible.value = false;
};
</script>

<template>
  <ACard style="height: 100%" :bodyStyle="{ height: '100%' }">
    <div class="chat-container">
      <!-- 聊天界面 -->
      <div class="chat-messages">
        <div
          v-for="(message, index) in chatMessages"
          :key="index"
          :class="['row-chat', message.role]"
        >
          <span class="message-role" v-if="message.role != 'user'">
            <LzyIcon name="iconoir:brain" size="20" />
          </span>
          <div class="message-content" v-html="md.render(message.content)"></div>
          <span class="message-role" v-if="message.role == 'user'">
            <LzyIcon name="iconoir:profile-circle" size="20" />
          </span>
        </div>
      </div>

      <!-- 输入内容 -->
      <div class="chat-input">
        <a-textarea
          v-model:value="aiForm.input"
          :autosize="{ minRows: 2, maxRows: 6 }"
          style="max-height: 50px"
          placeholder="在这里输入内容..."
          @keyup.enter="textareaEnter"
        />

        <div class="inputTools">
          <div class="tools-left">
            <a-tooltip>
              <template #title>新话题</template>
              <LzyIcon name="iconoir:chat-plus-in" class="left-icon" size="20" />
            </a-tooltip>
            <a-tooltip>
              <template #title>上传图片或文档</template>
              <LzyIcon name="iconoir:attachment" class="left-icon" size="20" />
            </a-tooltip>
            <a-tooltip>
              <template #title>开启网络搜索</template>
              <LzyIcon name="iconoir:internet" class="left-icon" size="20" />
            </a-tooltip>
            <a-tooltip>
              <template #title>选择模型</template>
              <LzyIcon
                @click="modelVisible = true"
                name="iconoir:ios-settings"
                class="left-icon"
                size="20"
              />
            </a-tooltip>
          </div>
          <div class="tools-right">
            <LzyIcon
              @click="sendMessage"
              name="iconoir:arrow-up-circle-solid"
              class="send-icon"
              size="24"
            />
          </div>
        </div>
      </div>
    </div>
    <a-modal
      ref="modalRef"
      v-model:open="modelVisible"
      :wrap-style="{ overflow: 'hidden' }"
      width="720px"
      :maskClosable="false"
      :keyboard="false"
      @ok="selectModel"
    >
      <div class="modal-content">
        <p
          v-for="item in modelArr"
          @click="modelValue = item.name"
          :class="{ active: item.name == modelValue }"
        >
          <img :src="item.icon" alt="" />
          {{ item.name }} ({{ item.price }})

          <a-tooltip placement="left">
            <template #title>{{ item.description }}</template>
            <LzyIcon name="iconoir:warning-circle-solid" />
          </a-tooltip>
        </p>
      </div>

      <template #title>
        <div ref="modalTitleRef" style="width: 100%; cursor: move">模型选择</div>
      </template>
    </a-modal>
  </ACard>
</template>

<style scoped>
.chat-container {
  display: flex;
  flex-direction: column;
  gap: 16px;
  height: 100%;
  position: relative;
  font-size: 10px;
}

.chat-messages {
  flex: 1;
  overflow-y: auto;
  padding: 10px;
  border-radius: 8px;

  p {
    margin: 0;
  }

  .row-chat {
    margin-bottom: 10px;
    padding: 16px;
    border-radius: 8px;
    background-color: var(--color-bg-light);
    max-width: 100%;
    word-break: break-word;
    display: flex;
    justify-content: flex-start;
    font-size: 16px;

    :deep(p),
    :deep(ul) {
      margin: 0;
      margin-bottom: 4px;
      font-family: "微软雅黑", "PingFang SC", "Helvetica Neue", Helvetica, Arial,
        sans-serif;
    }

    :deep(h1),
    :deep(h2),
    :deep(h3),
    :deep(h4),
    :deep(h5),
    :deep(h6) {
      margin: 0;
      margin-bottom: 8px;
      font-size: 1.05rem;
      color: #222;
      font-family: "微软雅黑", "PingFang SC", "Helvetica Neue", Helvetica, Arial,
        sans-serif;
    }

    :deep(a) {
      color: var(--themeColor);
      text-decoration: none;
      font-family: "微软雅黑", "PingFang SC", "Helvetica Neue", Helvetica, Arial,
        sans-serif;
    }

    :deep(pre) {
      padding: 0.75rem;
      border-radius: 0.25rem;
      margin-bottom: 1rem;
      overflow-x: auto;
      line-height: 23px;
      background-color: #282c34;

      code {
        border-radius: 0.25rem;
        font-family: "Fira Code";
        font-weight: 400;
        /* 初始化计数器 */
        counter-reset: line-number;
        color: #fff;

        .line::before {
          counter-increment: line-number;
          /* 计数器自增 */
          content: counter(line-number);
          /* 显示行号 */
          display: inline-block;
          /* 行号的宽度，可以调整 */
          text-align: left;
          margin-right: 10px;
          width: 30px;
          /* 行号和代码的间距 */
          color: #495162;
        }
      }
    }

    .message-role {
      margin-right: 8px;
    }

    &.user {
      background-color: #5163ce30;
      position: relative;
      justify-content: flex-end;

      .message-role {
        margin-left: 8px;
      }
    }
  }
}

.chat-input {
  width: 100%;
  height: 90px;
  padding: 10px;
  background-color: var(--color-bg-light);
  border: 1px solid #999;
  padding: 0;
  padding-top: 2px;
  border-radius: 8px;
  overflow: hidden;
  position: relative;

  & > textarea {
    background-color: var(--color-bg-light);
    max-height: 40px !important;
    border: none;
    transition: none;
    color: #222;
  }

  .inputTools {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0 10px;
    background-color: var(--color-bg-light);
  }

  .tools-left {
    display: flex;
    align-items: center;
    gap: 12px;
  }

  .tools-right {
    display: flex;
    align-items: center;
    gap: 8px;
  }

  .left-icon {
    cursor: pointer;
    transition: color 0.3s;
    color: #666;
    outline: none;

    &:hover {
      color: var(--themeColor);
    }
  }

  .send-icon {
    cursor: pointer;
    transition: color 0.3s;
    outline: none;

    &:hover {
      color: var(--themeColor);
    }
  }
}

.modal-content {
  max-height: 300px;
  overflow-y: auto;
  padding: 16px;
  padding-left: 0;

  p {
    margin: 0;
    margin-top: 8px;
    height: 30px;
    line-height: 30px;
    border-radius: 8px;
    padding: 4px 8px;
    transition: 0.2s ease;
    cursor: pointer;
    border: 1px solid #666;
    display: flex;
    justify-content: space-between;
    align-items: center;

    &.active {
      background-color: var(--themeColor);
      color: #fff;
      img {
        filter: brightness(0.1);
      }
    }
    &:hover {
      background-color: var(--themeColor);
      transform: scale(1.01) translate(2px, -2px);
      box-shadow: -1px 1px 8px 0px #00000030;
      color: #fff;
      img {
        filter: brightness(0.1);
      }
    }
    &:active {
      background-color: var(--themeColor);
      transform: scale(1.01) translate(2px, -2px);
      box-shadow: inset -1px 1px 8px 0px #00000030;
      color: #fff;
      img {
        filter: brightness(0.1);
      }
    }

    img {
      width: 20px;
      height: 20px;
    }
  }
}
</style>
