<template>
    <div class="login fcjc">
        <div class="ConterView">
            <!-- 注册功能 -->
            <div class="login-bgc">
                <img class="titleImg" src="@/assets/images/log2x.png" alt=""/>
                <img class="bgcImg" src="@/assets/images/Group710.png"/>
            </div>
            <div class="login-child">
                <div class="box">
                    <h2 class="title">新用户注册</h2>
                    <div class="child-box">
                        <el-tabs>
                            <el-form :model="form" :rules="rules" ref="formRef">
                                <el-form-item class="google-input-bg" label="" prop="account" key="0">
                                    <el-input v-model="form.account" maxlength="11" placeholder="请输入手机号" />
                                    <div class="loginIcon user"></div>
                                </el-form-item>
                                <div class="el-form-item fc inputFormCode">
                                    <el-form-item label="" prop="code" key="1">
                                        <el-input v-model="form.code" maxlength="6" placeholder="请输入验证码" />
                                        <div class="loginIcon code"></div>
                                    </el-form-item>
                                    <el-button @click="handleClick('sendCode')" :disabled="codeBtn" class="u-cursor">{{ codeText }}</el-button>
                                </div>
                                <el-form-item class="google-input-bg" label="" prop="password" key="2">
                                    <el-input
                                            @keyup.enter="clickConfirm('form')"
                                            v-model="form.password"
                                            placeholder="请设置8-12位登录密码"
                                            :type="flag ? 'text' : 'password'"
                                     />
                                    <div class="loginIcon password"></div>
                                </el-form-item>
                                <!-- 确认密码 -->
                                <el-form-item label="" prop="rePassword" key="3">
                                    <el-input
                                            @keyup.enter="clickConfirm('form')"
                                            v-model="form.rePassword"
                                            placeholder="请再次确认登录密码"
                                            :type="flag ? 'text' : 'password'"
                                    />
                                </el-form-item>
                                <el-form-item>
                                    <el-button @click="clickConfirm('form')" type="primary" class="fline">立即注册</el-button>
                                </el-form-item>
                                <div class="register-btn">
                                    <el-link @click="handleClick('login')" :underline="false">
                                        已有账号？ <span class="f-999">立即登录</span>
                                    </el-link>
                                </div>
                            </el-form>
                        </el-tabs>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
  import {reactive, ref, getCurrentInstance} from 'vue';
  import { useRouter } from 'vue-router';
  import cryptojs from "@/assets/js/cryptojs.js";

  const router = useRouter()
  const { proxy } = getCurrentInstance()
  const formRef = ref(null)
  const flag = ref(false)
  const codeBtn = ref(false)
  const codeNum = ref(60)
  const timer = ref(null)
  const codeText = ref('获取验证码')
  const form = reactive({
    account: "", // 18211213371 13794144492
    code: "",
    password: "", // 123456
    rePassword: "",
  })
  const rules = reactive({
    account: [
      {
        required: true,
        message: "请输入手机号",
        trigger: "blur",
      },
    ],
    password: [
      {
        validator : (rule, value, callback) => {
          console.log(value);
          // 密码要求必须包含数字、字母，8-20位，校验的正则表达式如下：
          let regex = new RegExp("^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{8,20}$");
          if (value === "") {
            callback(new Error("请输入密码"));
          } else if (value.length < 8 || value.length > 20) {
            callback(new Error("请输入8~20位密码"));
          } else if (!regex.test(value)) {
            // console.log(value);
            callback(new Error("密码必须为数字或字母形式至少两种"));
          } else {
            callback();
          }
        },
        trigger: "blur",
      }
    ],
    code: [
      {
        required: true,
        message: "请输入验证码",
        trigger: "blur",
      },
    ],
    rePassword: [
      {
        required: true,
        message: "请输入",
        trigger: "blur",
      },
      {
        validator: (rule, value, callback) => {
          if (value === "") {
            callback(new Error("请输入"));
          } else if (value !== form.password) {
            callback(new Error("两次密码不一样"));
          } else {
            callback();
          }
        },
        trigger: "blur",
      },
    ],
  })

  // 注册
  function Register() {
    var obj = {
      userName: form.account,
      password: cryptojs.encrypt(form.password),
      mobile: form.account,
      code: form.code,
    };
    console.log(obj);
    // $api.user.Register(obj).then((res)=>{
    //   if (res.code === 0) {
    //     $message.success("注册成功");
    //     form = {
    //       account: "",
    //       password: "",
    //       check_password: true,
    //       // mobile: "",
    //       code: "",
    //     };
    //     $refs.form.clearValidate();
    //     $router.push("/loginAdmin");
    //   }
    // });
  }
  // 发送验证码
  function SendCode(row) {
    var obj = {
      mobile: form.account,
      codeType: 1
    };
    // 用户手机号不能再发起时会多调用验证码倒计时
    // $api.user.SendCode(obj).then((res) => {
    //   console.log(res, res.msg,'2222');
    //   if (res.code === 0) {
    //     console.log(1111);
    //     $message.success(res.msg);
    //     getTimeCode();
    //   }
    // });
  }
  // 功能
  // 验证码倒计时
  function getTimeCode() {
    timer.value = setInterval(() => {
      codeNum.value--;
      codeBtn.value = true;
      if (codeNum.value === 0) {
        codeNum.value = 60;
        codeText.value = "发送验证码";
        codeBtn.value = false;
        clearInterval(codeBtn.value);
        return;
      }
      if (codeNum.value < 10) {
        codeText.value = "(0" + codeNum.value + "S)";
      } else {
        codeText.value = "(" + codeNum.value + "S)";
      }
    }, 1000);
  }
  function handleClick(str) {
    if (str === "login") {
      router.push("/login");
    } else if (str === "sendCode") {
      if (proxy.$utils.validEmpty(form.account)) {
        // $message.error("请输入手机号");
        return;
      }
      if (!proxy.$utils.validPhone(form.account)) {
        // $message.error("发送验证码前请输入正确的手机号码1");
        return;
      }
      SendCode();
    }
  }
  function clickConfirm(formName) {
    formRef.value.validate((valid) => {
      if (valid) {
        Register();
      } else {
        //  $message.error("帐号或者密码错误")
        return false;
      }
    });
  }

</script>

<style scoped lang="scss">
    .login {
        width: 100%;
        min-width: 900px;
        height: 100%;
        background-color: #283443;
        background-image: url("@/assets/images/loginbg01.png");
        background-size: cover;
        .fline {
            width: 306px;
            height: 54px;
            background-color: #fd681c;
            border: 0;
        }
        .ConterView {
            width: 100%;
            // min-width: 900px;
            height: 100%;
            background: #ffffff;
            border-radius: 0px 0px 0px 0px;
            opacity: 1;
            display: flex;
            box-shadow: 0px 0px 15px 1px rgba(34, 57, 207, 0.1);
            background-size: cover;
            overflow: hidden;
            .login-bgc {
                position: relative;
                width: 35%;
                height: 100%;
                background: #27170e;
                opacity: 1;
                .titleImg {
                    position: absolute;
                    left: 2.6vw;
                    top: 2.6vw;
                    width: 14.21vw;
                    height: 4.58vw;
                    z-index: 1000;
                }
                .bgcImg {
                    position: absolute;
                    top: 50%;
                    left: 50%;
                    transform: translate(-50%, -50%);
                    width: 100%;
                }
            }
            .login-child {
                display: flex;
                justify-content: center;
                align-items: center;
                box-sizing: border-box;
                width: 65%;
                // min-width: 450px;
                height: 100%;
                align-items: center;
                .register-btn {
                    margin-top: 8.33vw;
                    text-align: center;
                    color: #333333;
                }
                .f-999 {
                    color: #fd681c;
                }
                img {
                    width: 127px;
                    height: 41px;
                    margin-left: 40px;
                    margin-top: 40px;
                }
                .title {
                    color: #333;
                    height: 56px;
                    text-align: center;
                    font-size: 40px;
                    font-family: PingFang SC-Medium, PingFang SC;
                    font-weight: 500;
                    line-height: 47px;
                    margin-bottom: 65px;
                }
                .leftbox {
                    width: 306px;
                    height: 100%;
                    margin-left: 157px;
                    margin-top: 75px;
                }
                .icon-flag {
                    margin-top: 11px;
                    font-size: 18px;
                    cursor: pointer;
                }
            }
        }

        .child-box{
            .google-input-bg{
                ::v-deep .el-input__wrapper {
                    background-color: rgb(232, 240, 255);
                }
            }
            ::v-deep .el-form-item {
                .el-input__wrapper{
                    height: 40px;
                }
            }
        }
    }
    ::v-deep .el-form-item {
        margin-bottom: 40px;
    }
    .inputFormCode {
        line-height: 0;
        margin-top: 10px;
        margin-bottom: 40px;
        justify-content: space-between;
        ::v-deep .el-input {
            width: 304px;
            height: 40px;
            vertical-align: middle;
        }
        ::v-deep .el-form-item {
            margin: 0 12px 0 0;
        }
        ::v-deep .el-button {
            width: 104px;
        }
    }
    ::v-deep .el-input__inner {
        padding-left: 35px;
    }
    .loginIcon {
        position: absolute;
        width: 30px;
        height: 30px;
        top: 3.5px;
        left: 0;
    }
    .user {
        background: url("@/assets/images/user.png") no-repeat 10px center;
    }
    .code {
        background: url("@/assets/images/loginkey.png") no-repeat 10px center;
    }
    .password {
        background: url("@/assets/images/password.png") no-repeat 10px center;
    }
</style>