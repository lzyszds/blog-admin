<script setup lang="ts">
import { login } from "@/api/userApi";
import { useRouter } from "vue-router";
import { useRequest } from "@/hook/useRequest";
const isTransition = ref(false);
const router = useRouter();
//进入页面先判断是否登陆着,localStorage.getItem('token')是登陆时候存的token
if (localStorage.getItem("lzy_token")) {
  //路由重定向
  router.replace("/");
}

const { loading, throttledRequest } = useRequest(
  login,
  {
    success: (data) => {
      localStorage.setItem("lzy_token", data);
      router.replace("/");
    },
  },
  500
);

// 账号密码数据，用于提交
const ruleForm = reactive({
  username: "",
  password: "",
  email: "",
  code: "",
  remember: false,
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
            @finish="throttledRequest"
          >
            <p class="title">欢迎登陆</p>

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
              <ACheckbox v-model:checked="ruleForm.remember">记住密码</ACheckbox>
            </AFormItem>

            <AFormItem>
              <AButton type="primary" html-type="submit">
                <LzyIcon
                  name="majesticons:scan-fingerprint-line"
                  style="margin-right: 5px"
                  size="18px"
                ></LzyIcon>
                立即登陆
              </AButton>
            </AFormItem>
          </AForm>
        </div>
        <div class="illustartion">
          <img :src="'/hono/static/img/loginCover.png'" alt="logo" />
        </div>
      </div>
    </Transition>
  </div>
</template>

<style scoped>
.login {
  width: 100vw;
  height: 100vh;
  background-color: var(--themeColor);
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
    background: url("/hono/static/img/moon.png") no-repeat center;
    background-size: 120%;
    border: 5px solid #000;
    z-index: -1;
  }

  .card {
    width: 80%;
    height: 80%;
    background-color: rgba(255, 255, 255, 0.85);
    backdrop-filter: blur(10px);
    border-radius: 30px;
    box-shadow: 0 1px 8px 10px rgba(0, 0, 0, 0.2);
    transition: 0.6s;
    display: grid;
    grid-template-columns: 0.5fr 1fr;
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
        width: 600px;
        position: absolute;
        right: 10%;
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
          background: #3fefef;
          border-radius: 8px;
          filter: drop-shadow(0 0 20px #3fefef) drop-shadow(0 0 60px #3fefef);
          animation: animate_line 2s ease-in-out infinite;
        }
      }

      &.top {
        height: 40%;

        p {
          font-size: 40px;
          font-weight: 600;
          color: #000;
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
          font-size: 40px;
          font-weight: 600;
          color: var(--themeColor);
          flex: 3;
          font-family: "dindin";
          pointer-events: none;
          user-select: none;
        }

        :deep(.ant-form-item-control-input) {
          width: 150%;
          input {
            font-family: "dindin";
          }
        }

        :deep(.ant-input-prefix) {
          color: #000 !important;
          gap: 10px;
          font-family: "dindin";
        }
      }
    }
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
</style>
