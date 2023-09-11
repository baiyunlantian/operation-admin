<template>
  <div class="login-container">
    <div class="content">
      <div class="title">
        <el-image :src="logoUrl" fit="cover"></el-image>
      </div>
      <div class="head-msg">
        <p v-if="formType === 'update'">修改密码</p>
        <p v-else-if="formType === 'password'">登录</p>
<!--        <p v-else>验证码登录</p>-->
      </div>

      <el-form
        class="account-form"
        ref="formRef"
        :rules="rules"
        :model="formData"
        label-width="90px"
        @keydown.enter="handleClickBtn"
      >
        <el-form-item
          v-for="(item, index) in formConfig[formType]['form']"
          :prop="item.key"
          :key="item.key"
        >
          <!--    暂时屏蔽验证码功能      -->
          <!--          <template v-if="item.key === 'code'">-->
          <!--            <div class="inputFormCode">-->
          <!--              <el-input-->
          <!--                v-model="formData[item.key]"-->
          <!--                :placeholder="`请输入${item.label}`"-->
          <!--                :validate-event="false"-->
          <!--                :prefix-icon="item.icon"-->
          <!--              />-->

          <!--              <div class="code-content">-->
          <!--                <div v-if="isPending" class="countdown">-->
          <!--                  倒计时{{ countdown }}s-->
          <!--                </div>-->
          <!--                <el-button-->
          <!--                  v-else-->
          <!--                  type="default"-->
          <!--                  size="small"-->
          <!--                  @click="handleGetCode"-->
          <!--                  >获取验证码</el-button-->
          <!--                >-->
          <!--              </div>-->
          <!--            </div>-->
          <!--          </template>-->

          <el-input
            v-model="formData[item.key]"
            :type="item.compoentType === 'password' ? 'password' : 'text'"
            :placeholder="`请输入${item.label}`"
            :show-password="item.compoentType === 'password'"
            :validate-event="false"
            :prefix-icon="item.icon"
          />
        </el-form-item>
        <el-form-item>
          <div
            class="bottom-text u-flex"
            :class="formType === 'password' ? 'u-row-between' : 'u-row-right'"
          >
            <div class="u-flex" v-show="formType === 'password'">
              <el-checkbox v-model="rememberPassword">记住密码</el-checkbox>
            </div>
            <el-link
              @click="handleSwitchForm(formType)"
              type="primary"
              :underline="false"
            >
              <span class="forget-pwd f-999">{{formType === 'password' ? '修改密码' : '登录'}}</span>
            </el-link>
          </div>
        </el-form-item>
        <el-form-item>
          <el-button
            type="primary"
            @click="handleClickBtn"
            :loading="btnLoading"
            :disabled="btnLoading"
          >
            {{ formType === "update" ? "修改密码" : "登录" }}
          </el-button>
        </el-form-item>
      </el-form>

      <!--   暂时屏蔽 -->
      <!--      <div class="once-login" @click="handleSwitchForm(formType)">-->
      <!--        {{ formConfig[formType]["tip"] }}-->
      <!--      </div>-->
    </div>

    <div class="bg-trangle">
      <div class="bg-msg">
        <div class="main-title">吗哩呀咔 工作站</div>
        <div class="com-desc">多元能力，快速接入，创建专属AI应用</div>
        <div class="com-service">
          <el-button>联系客服</el-button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { Iphone, Key } from "@element-plus/icons-vue";
import {
  reactive,
  ref,
  getCurrentInstance,
  onUnmounted,
  watch,
  onMounted,
} from "vue";
import { useRouter } from "vue-router";
import { useStore } from "vuex";
import cryptojs from "@/assets/js/cryptojs.js";
import Cookie from "js-cookie";
import API from "./api";

const { proxy } = getCurrentInstance();
const router = useRouter();
const store = useStore();
const logoUrl = require("@/assets/images/logo_maliyaka.png");

let formData = reactive({});
const rules = reactive({
  password: [
    {
      required: true,
      message: "密码不能为空!",
    },
    // {
    //   pattern: /^[0-9A-Za-z]{8,16}$/,
    //   message: '请输入8-16位的数字和字母!',
    // },
  ],
  oldPassword: [
    {
      required: true,
      message: "密码不能为空!",
    },
    // {
    //   pattern: /^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{8,20}$/,
    //   message: "请输入8-20位的数字和字母!",
    // },
  ],
  newPassword: [
    {
      required: true,
      message: "密码不能为空!",
    },
    {
      // /(?=.*[a-z_])(?=.*\d)(?=.*[^a-z0-9_])[\S]{8,20}/;
      pattern: /^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{8,20}$/,
      message: "请输入8-20位的数字和字母!",
    },
  ],
  confirmPassword: [
    {
      required: true,
      message: "确认密码不能为空!",
    },
    {
      validator: validConfirmPassword,
      message: "新密码输入不一致!",
    },
  ],
  account: [{
      required: true,
      message: "账号不能为空!",
    },
  ],
  code: [{
      required: true,
      message: "验证码不能为空!",
    },
  ],
});
const formRef = ref(null);
const rememberPassword = ref(false);
const isPending = ref(false);
const countdown = ref(59);
const timer = ref(null);
const btnLoading = ref(false);
const formType = ref("password");
// 表单类型  code:验证码登录    password:密码登录    update:修改密码
const formConfig = reactive({
  code: {
    tip: "密码登录",
    form: [
      {
        label: "账号",
        key: "account",
        placeholder: "账号",
        compoentType: "text",
        icon: Iphone,
      },
      {
        label: "验证码",
        key: "code",
        placeholder: "验证码",
        compoentType: "text",
        icon: Key,
      },
    ],
  },
  password: {
    tip: "验证码登录",
    form: [
      {
        label: "账号",
        key: "account",
        placeholder: "账号",
        compoentType: "text",
        icon: Iphone,
      },
      {
        label: "密码",
        key: "password",
        placeholder: "密码",
        compoentType: "password",
        icon: Key,
      },
    ],
  },
  update: {
    tip: "立即登录",
    form: [
      {
        label: "账号",
        key: "account",
        placeholder: "账号",
        compoentType: "text",
        icon: Iphone,
      },
      {
        label: "原密码",
        key: "oldPassword",
        placeholder: "请输入原密码",
        compoentType: "password",
      },
      // {
      //   label: "验证码",
      //   key: "code",
      //   placeholder: "验证码",
      //   compoentType: "text",
      // },
      {
        label: "密码",
        key: "newPassword",
        placeholder: "密码（8-20位的数字和字母）",
        compoentType: "password",
      },
      {
        label: "确认密码",
        key: "confirmPassword",
        placeholder: "密码（8-20位的数字和字母）",
        compoentType: "password",
      },
    ],
  },
});

function handleSwitchForm(type) {
  console.log('handleSwitchForm', type)
  Object.keys(formData).forEach((key) => {
    if (type !== "forgetPassword" && key === "account") {
      formData["account"] = Cookie.get("account") || "";
    } else {
      formData[key] = "";
    }
  });

  if (type === "code" || type === "update") {
    const cachePw = Cookie.get("password");
    formType.value = "password";
    formData["password"] = cachePw ? cryptojs.decrypt(cachePw) : "";
  } else if (type === "password") {
    formType.value = "update";
  } else if (type === "forgetPassword") {
    formType.value = "update";
  }

  formRef.value.clearValidate();
  resetCode();
}

function handleClickBtn() {
  formRef.value.validate((valid) => {
    if (valid) {
      let params = {
        ...formData,
        type: formType.value === "code" ? "1" : "2",
        password: formData.password
          ? cryptojs.encrypt(formData.password)
          : null,
        confirmPassword: formData.confirmPassword
          ? cryptojs.encrypt(formData.confirmPassword)
          : null,
      };

      if (formType.value === "update") {
        if (formData.newPassword === formData.oldPassword) {
          proxy.$message({
            type: "warning",
            message: "新旧密码须不同",
          });
          return
        }
        params.newPassword = cryptojs.encrypt(formData.newPassword);
        params.oldPassword = cryptojs.encrypt(formData.oldPassword);
        // 修改密码
        btnLoading.value = true;
        API.editPassword(params)
          .then((res) => {
            if (res.code == "0") {
              rememberPassword.value = false;
              proxy.$message({
                type: "success",
                message: "修改密码成功",
              });
              handleSwitchForm("update");
            }
          })
          .finally(() => {
            btnLoading.value = false;
          });
      } else {
        // 登录
        btnLoading.value = true;
        API.login(params)
          .then((res) => {
            if (res.code == "0") {
              if (rememberPassword.value && formType.value === "password") {
                Cookie.set("password", params.password, { expires: 7 });
              } else {
                Cookie.remove("password");
              }

              Cookie.set("account", params.account, { expires: 7 });
              localStorage.setItem("token", "Bearer " + res.data.token);
              localStorage.setItem("account", res.data.account);
              router.push({ path: "/home" });
            }
          })
          .finally(() => {
            btnLoading.value = false;
          });
      }
    }
  });
}
// 校验两次密码是否一致
function validConfirmPassword(rule, value, callback) {
  if (value !== formData.newPassword) {
    callback(false);
  }
  callback();
}

// 获取验证码
function handleGetCode() {
  // 获取验证码中
  if (isPending.value === true) {
    return;
  }

  formRef.value.validateField("account", (valid) => {
    if (valid) {
      let params = {
        Mobile: formData.account,
        codeType: formType.value === "code" ? 1 : 2,
      };

      isPending.value = true;
      timer.value = setInterval(() => {
        if (countdown.value > 0) {
          countdown.value--;
        } else {
          resetCode();
        }
      }, 1000);

      API.SendCode(params).then((res) => {
        if (res.code != "0") {
          resetCode();
        }
      });
    }
  });
}

// 重置验证码状态
function resetCode() {
  countdown.value = 59;
  isPending.value = false;
  clearInterval(timer.value);
}

watch(formData, (newVal) => {
  formRef.value.clearValidate();
  if (isPending.value === true) {
    resetCode();
  }
});

onMounted(() => {
  formData.account = Cookie.get("account") || "";
  const password = Cookie.get("password") ? Cookie.get("password") : "";

  if (password) {
    formData.password = cryptojs.decrypt(password);
    rememberPassword.value = true;
  }

  // 重置用户信息，防止登录时有上次登录的用户信息缓存
  localStorage.clear();
  store.commit("user/SET_USER_INFO", {});
  store.commit("user/SET_ROLE_ID", '');
  store.commit("tagsView/DEL_ALL_VISITED_VIEWS");
});

onUnmounted(() => {
  clearInterval(timer.value);
});
</script>

<style scoped lang="scss">
.login-container {
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  width: 100vw;
  height: 100vh;
  background: url("@/assets/images/bg.png") center center/cover;
  position: relative;
  .content {
    border: 1px solid #d8d4d4;
    width: 290px;
    padding: 20px;
    border-radius: 5px;
    position: absolute;
    right: 294px;
    background-color: #fff;
    z-index: 9;
    .title {
      width: 200px;
      margin: 0 auto;
      font-size: 32px;
      font-weight: bold;
      color: #000000;
      // margin-bottom: 25px;
      text-align: center;
      letter-spacing: 1px;
      margin-top: -12px;
    }
    .head-msg {
      margin: -20px 0 15px 12px;
      font-weight: 700;
      color: #68749f;
    }
    .account-form {
      position: relative;
      display: flex;
      flex-direction: column;
      align-items: center;
      min-height: 240px;

      :deep(.el-form-item) {
        width: 274px;
        .bottom-text {
          width: 100%;
          margin-bottom: 15px;
          .el-checkbox__inner {
            border: none;
            background-color: #f1f2f8 !important;
            width: 12px;
            height: 12px;
            &::after {
              border-color: #3f99f7;
            }
          }
          .el-checkbox__label {
            font-size: 12px;
            color: #939ec6;
          }
          .forget-pwd {
            font-size: 12px;
            color: #939ec6;
          }
        }

        .inputFormCode {
          position: relative;
          display: flex;
          justify-content: space-between;
          width: 100%;

          .code-content {
            position: relative;

            .countdown {
              box-sizing: border-box;
              position: relative;
              color: #213589;
              border: 1px solid #dcdcdc;
              font-size: 14px;
              margin-top: 12px;
              margin-bottom: 8px;
              border-radius: 5px;
              text-align: center;
              padding: 0 12px;
              width: 100px;
              height: 26px;
              line-height: 1.8;
            }
            .el-button {
              padding: 0 12px;
              height: 26px;
              margin-top: 12px;
              margin-bottom: 8px;
              font-size: 12px;
            }
          }

          .el-input {
            width: 160px;
          }
        }

        .el-form-item__content {
          margin-left: 0 !important;

          button {
            height: 37px;
            width: 100%;
          }
        }

        .el-form-item__label {
        }

        .el-input__wrapper {
          width: 100%;
          height: 24px;
          background-color: #eff3fb;
          font-size: 12px;
          box-shadow: none;
        }
        .el-input__inner {
          &::placeholder {
            color: #939ec6;
          }
        }
        .el-input__prefix {
          color: #939ec6;
        }
      }
    }
    .once-login {
      position: absolute;
      color: #939ec6;
      cursor: pointer;
      bottom: 4vh;
      left: 50%;
      transform: translateX(-50%);
      letter-spacing: 1px;
      font-size: 12px;
    }
  }

  .bg-trangle {
    background-color: #213589;
    border-radius: 8px;
    width: 636px;
    height: 300px;
    position: absolute;
    right: 260px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    z-index: 1;
    .bg-msg {
      margin-left: 36px;
      height: 140px;
      width: 200px;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      .main-title {
        color: #fff;
        font-size: 18px;
        font-weight: 700;
      }
      .com-desc {
        color: #fff;
        font-size: 12px;
      }
      .com-service {
        :deep(.el-button) {
          width: 108px;
          background-color: #5184ff;
          border: #5184ff;
          color: #fff;
        }
      }
    }
  }
}
:deep(.el-button.el-button--primary) {
  background-color: #213589;
  border: #213589;
}
</style>
