<script setup lang="ts">
import { login } from "@/api/user";
import { useRequest } from "@/hook/useRequest";
import { TokenService } from "@/hook/useTokenService";
import { useTabsState } from "@/store/useTabsStore.ts"; // const baseURL = import.meta.env.VITE_BASE_URL;

const isTransition = ref(false);
const router = useRouter();
const tabsState = useTabsState();
// const openSliderVerificationCode = ref(false); // 验证码弹窗

//进入页面先判断是否登陆着,localStorage.getItem('token')是登陆时候存的token
if (TokenService.isAuthenticated()) {
  //路由重定向
  router.replace("/" + tabsState.tabsKeyArr[tabsState.activeKey].path);
}

// 账号密码数据，用于提交
const ruleForm = reactive({
  username: "",
  password: "",
  email: "",
  code: "",
  remember: false,
});

const { loading, send } = useRequest(login(ruleForm), {
  requestAfterCall: {
    success: (token: string) => {
      // console.log(res);
      TokenService.setToken(token,ruleForm.remember);
      router.replace("/" + tabsState.tabsKeyArr[tabsState.activeKey].path);
    },
  },
});

// 表单验证规则
const rules = reactive({
  username: [
    { required: true, message: "请输入账号", trigger: "blur" },
    { min: 3, max: 16, message: "账号长度应该是6到16", trigger: "blur" },
  ],
  password: [
    { required: true, message: "请输入密码", trigger: "blur" },
    { min: 6, max: 16, message: "密码长度应该是6到16", trigger: "blur" },
  ],
});

// const isPassed = (value) => {
//   if (!value) return;
//   openSliderVerificationCode.value = false;
//   send(true);
// };

onMounted(() => {
  isTransition.value = true;
});
</script>

<template>
  <div class="login">
    <Transition name="router">
      <div class="card" v-if="isTransition">
        <div class="item center" :class="{ loadBtn: loading }">
          <AForm
            :model="ruleForm"
            name="basic"
            :label-col="{ span: 8 }"
            :wrapper-col="{ span: 16 }"
            autocomplete="off"
            @finish="send"
          >
            <p class="title">如约而至</p>

            <AFormItem name="username" :rules="rules.username">
              <AInput v-model:value="ruleForm.username">
                <template #prefix>
                  <LzyIcon name="ant-design:user-outlined" />
                  账号：
                </template>
              </AInput>
            </AFormItem>

            <AFormItem name="password" :rules="rules.password">
              <AInputPassword v-model:value="ruleForm.password">
                <template #prefix>
                  <LzyIcon name="ant-design:lock-filled" />
                  密码：
                </template>
              </AInputPassword>
            </AFormItem>

            <AFormItem name="remember">
              <ACheckbox v-model:checked="ruleForm.remember"> 记住密码 </ACheckbox>
            </AFormItem>

            <AFormItem>
              <AButton type="primary" html-type="submit">
                <Transition>
                  <LzyIcon
                    name="majesticons:scan-fingerprint-line"
                    style="margin-right: 5px"
                    size="18px"
                  ></LzyIcon>
                </Transition>
                立即登陆
              </AButton>
            </AFormItem>
          </AForm>
        </div>
        <div class="illustartion">
          <img
            :src="'/pictureBedImage/O-ZPA__Gg5S9ju7bNWAXyhcyFsLLFYjvlekUK7YYm9f8AAA'"
            alt="logo"
          />
        </div>
      </div>
    </Transition>
    <!--    <a-modal-->
    <!--      v-model:open="openSliderVerificationCode"-->
    <!--      :closable="false"-->
    <!--      width="600px"-->
    <!--      :body-style="{-->
    <!--        height: '300px',-->
    <!--        display: 'flex',-->
    <!--        justifyContent: 'right',-->
    <!--      }"-->
    <!--    >-->
    <!--      <SliderVerificationCode @isPassed="isPassed" />-->
    <!--      <template #footer></template>-->
    <!--    </a-modal>-->
  </div>
</template>

<style scoped>
.login {
  width: 100vw;
  height: 100vh;
  background-color: var(--theme-bg-color);
  background-position: center;
  display: flex;
  justify-content: center;
  align-items: center;
  position: fixed;
  top: 0;
  left: 0;

  &::after {
    content: "";
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 45vw;
    height: 45vw;
    border-radius: 50%;
    background: url("/pictureBedImage/OT1RprU1MQX5TKg7gwZAQsbCk8T6K5xafdjbGxzYgsoJ8AA")
      no-repeat center;
    background-size: 120%;
    border: 5px solid #000;
    z-index: -1;
  }

  .card {
    width: 80%;
    height: 80%;
    background-color: var(--color-login-bg);
    backdrop-filter: blur(10px);
    border-radius: 30px;
    box-shadow: 0 1px 8px 10px rgba(0, 0, 0, 0.2);
    transition: 0.6s;
    display: grid;
    grid-template-columns: 0.8fr 1fr;
    grid-template-rows: 1fr;
    justify-content: center;
    align-items: center;
    font-family: "almama";
    overflow: hidden;
    border: 10px solid #000;

    &:focus-within {
      box-shadow: 0 10px 10px rgba(0, 0, 0, 0.1),
        0px -30px 4px -10px rgba(255, 255, 255, 0.3),
        0px -60px 4px -20px rgba(255, 255, 255, 0.2),
        0px -90px 4px -30px rgba(255, 255, 255, 0.1);
    }

    .illustartion {
      text-align: center;

      img {
        width: 40vw;
        min-width: 300px;
        max-width: 600px;
        position: absolute;
        right: 5%;
        bottom: -20%;
        user-select: none;
        pointer-events: none;
      }
    }

    .item {
      width: 100%;
      height: 100%;
      display: flex;
      justify-content: center;
      align-items: center;

      &.loadBtn {
        &:after {
          content: "";
          position: absolute;
          top: 0;
          left: 0;
          height: 8px;
          width: 100%;
          background: content-box radial-gradient(#5161ce, #3fefef);
          border-radius: 8px;
          filter: drop-shadow(0 0 20px #3fefef) drop-shadow(0 0 100px #3fefef);
          animation: animate_line 3s ease-in-out infinite;
        }
      }

      &.top {
        height: 40%;

        p {
          font-size: 40px;
          font-weight: 600;
          color: var(--color-bg);
          flex: 3;
        }

        img {
          flex: 1;
          width: 100px;
          height: 75px;
          margin-left: 45px;
        }
      }

      &.center {
        padding: 20px 20px 0;
        margin-top: 10px;

        p.title {
          font-size: 60px;
          font-weight: 600;
          color: var(--color-text);
          text-shadow: 2px 2px 1px var(--color-bg);
          flex: 3;
          font-family: "dindin", serif;
          pointer-events: none;
          user-select: none;
          filter: drop-shadow(3px 2px 1px var(--themeColor));
        }

        :deep(.ant-form-item-control-input) {
          width: 150%;

          input {
            font-family: "dindin", monospace;
          }
        }

        :deep(.ant-input-prefix) {
          color: var(--color-text) !important;
          gap: 10px;
          font-family: "dindin", ui-serif;
        }
      }
    }
  }
}

@keyframes animate_line {
  0% {
    transform: translateY(0);
  }

  50% {
    transform: translateY(100vh);
  }

  100% {
    transform: translateY(0);
  }
}

.router-enter-active {
  transition: 0.15s;
}

.router-leave-active {
  transition: 0.3s;
}

.router-enter-from {
  transform: scale(1.2);
}

.router-leave-to {
  transform: scale(0.7);
}

@media screen and (max-width: 700px) {
  #app {
    .login {
      .card {
        grid-template-columns: 1fr;

        .title {
          margin: 15px;
          text-align: center;
        }

        .item {
          padding: 0;
          align-items: baseline;

          button {
            width: 100%;
          }
        }

        :deep(.ant-form-item-control-input) {
          width: 100%;
        }

        :deep(.ant-form-item-control) {
          max-width: 100%;
        }

        .illustartion {
          img {
            left: 50%;
            transform: translateX(-50%);
          }
        }
      }
    }
  }
}
</style>
