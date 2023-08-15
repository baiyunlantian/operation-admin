<template>
  <div class="login-container">
    <div class="content">
      <div class="title">吗哩呀咔-运营后台</div>

      <el-form class="account-form" ref="formRef" :rules="rules" :model="formData" label-width="90px" @keydown.enter="handleClickBtn">

        <el-form-item v-for="(item, index) in formConfig[formType]['form']" :prop="item.key" :key="item.key">
          <template v-if="item.key === 'code'">
            <div class="inputFormCode">
              <el-input v-model="formData[item.key]" :placeholder="`请输入${item.label}`" :validate-event="false"/>

              <div class="code-content">
                <div v-if="isPending" class="countdown">倒计时{{countdown}}s</div>
                <el-button v-else type="default" @click="handleGetCode">获取验证码</el-button>
              </div>
            </div>
          </template>

          <el-input
                  v-else
                  v-model="formData[item.key]"
                  :type="item.compoentType === 'password' ? 'password' : 'text'"
                  :placeholder="`请输入${item.label}`"
                  :show-password="item.compoentType === 'password'"
                  :validate-event="false"
          />
        </el-form-item>

        <el-form-item>
          <el-button type="primary"
                     @click="handleClickBtn"
                     :loading="btnLoading"
                     :disabled="btnLoading"
          >
            {{formType === 'forget' ? '重置密码' : '登录'}}
          </el-button>
        </el-form-item>

        <el-form-item v-if="formType !== 'forget'">
          <div class="bottom-text u-flex u-row-between">
            <div class="u-flex">
              <el-checkbox v-model="autoLogin">自动登录</el-checkbox>
            </div>
            <el-link @click="handleSwitchForm('forgetPassword')" type="primary" :underline="false">
              <span class="f-999">忘记密码？</span>
            </el-link>
          </div>
        </el-form-item>
      </el-form>

    </div>

    <div class="once-login" @click="handleSwitchForm(formType)">{{formConfig[formType]['tip']}}</div>
  </div>

</template>

<script setup>
  import { reactive, ref, getCurrentInstance, onUnmounted, watch } from 'vue';
  import { useRouter } from 'vue-router';
  import cryptojs from "@/assets/js/cryptojs.js";
  import API from './api';

  const { proxy } = getCurrentInstance()
  const router = useRouter()

  let formData = reactive({})
  const rules = reactive({
    password: [
      {
        required: true,
        message: '密码不能为空!',
      },
      {
        pattern: /^[0-9A-Za-z]{8,16}$/,
        message: '请输入8-16位的数字和字母!',
      },
    ],
    resetPassword: [
      {
        required: true,
        message: '密码不能为空!',
      },
      {
        pattern: /^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{8,16}$/,
        message: '请输入8-16位的数字和字母!',
      }
    ],
    confirmPassword: [
      {
        required: true,
        message: '确认密码不能为空!',
      },
      {
        validator: validConfirmPassword,
        message: '新密码输入不一致!',
      },
    ],
    account: [
      {
        required: true,
        message: '手机号码不能为空!',
      },
      {
        pattern: /^1(3|4|5|6|7|8|9)\d{9}$/,
        message: '请输入正确的手机号!',
      }
    ],
    code: [{
      required: true,
      message: '验证码不能为空!',
    }]
  })
  const formRef = ref(null)
  const autoLogin = ref(false)
  const isPending = ref(false)
  const countdown = ref(59)
  const timer = ref(null)
  const btnLoading = ref(false)
  const formType = ref('code')
  // 表单类型  code:验证码登录    password:密码登录    forget:忘记密码
  const formConfig = reactive({
    'code':{
      tip:'密码登录',
      form:[
        {label: '手机号码', key: 'account', placeholder: '手机号码', compoentType:'text'},
        {label: '验证码', key: 'code', placeholder: '验证码', compoentType:'text'},
      ]
    },
    'password':{
      tip:'验证码登录',
      form:[
        {label: '手机号码', key: 'account', placeholder: '手机号码', compoentType:'text'},
        {label: '密码', key: 'password', placeholder: '密码', compoentType:'password'},
      ]
    },
    'forget':{
      tip:'立即登录',
      form:[
        {label: '手机号码', key: 'account', placeholder: '手机号码', compoentType:'text'},
        {label: '验证码', key: 'code', placeholder: '验证码', compoentType:'text'},
        {label: '密码', key: 'resetPassword', placeholder: '密码（8-16位的数字和字母）', compoentType:'password'},
        {label: '确认密码', key: 'confirmPassword', placeholder: '密码（8-16位的数字和字母）', compoentType:'password'}
      ]
    }
  })

  function handleSwitchForm(type) {
    if (type === 'code' || type === 'forget') {
      formType.value = 'password'
    }else if (type === 'password') {
      formType.value = 'code'
    }else if (type === 'forgetPassword'){
      formType.value = 'forget'
    }

    Object.keys(formData).forEach(key=>{
      formData[key] = ''
    })
    formRef.value.resetFields()
    resetCode()
  }

  function handleClickBtn() {
    formRef.value.validate(valid=>{
      if (valid) {
        let params = {
          ...formData,
          type: formType.value === 'code' ? '1' : '2',
          password: formData.password ? cryptojs.encrypt(formData.password) : null,
          confirmPassword: formData.confirmPassword ? cryptojs.encrypt(formData.confirmPassword) : null,
        }

        if (formType.value === 'forget') {
          params.password = cryptojs.encrypt(formData.resetPassword)
          delete params.resetPassword
          // 重置密码
          btnLoading.value = true
          API.forgetPassword(params).then(res=>{
            if (res.code == '0') {
              proxy.$message({
                type:'success',
                message:'重置密码成功'
              })
              handleSwitchForm('password')
            }
          }).finally(() => {
            btnLoading.value = false
          })
        }else {
          // 登录
          btnLoading.value = true
          API.login(params).then(res=>{
            if (res.code == '0') {
              localStorage.setItem('token', 'Bearer ' + res.data.token)
              localStorage.setItem('account', res.data.account)
              router.push({path:'/home'})
            }
          }).finally(() => {
            btnLoading.value = false
          })
        }
      }
    })
  }
  // 校验两次密码是否一致
  function validConfirmPassword(rule, value, callback) {
    if (value !== formData.resetPassword) {
      callback(false);
    }
    callback();
  }

  // 获取验证码
  function handleGetCode() {
    // 获取验证码中
    if (isPending.value === true) {
      return
    }

    formRef.value.validateField('account', (valid) => {
      if (valid) {
        let params = {
          Mobile: formData.account,
          codeType: formType.value === 'code' ? 1 : 2
        }

        isPending.value = true
        timer.value = setInterval(() => {
          if (countdown.value > 0) {
            countdown.value--;
          }else {
            resetCode()
          }
        }, 1000)


        API.SendCode(params).then(res=>{
          if (res.code != '0') {
            resetCode()
          }
        })
      }
    })
  }

  // 重置验证码状态
  function resetCode() {
    countdown.value = 59
    isPending.value = false
    clearInterval(timer.value)
  }

  watch(formData, (newVal) => {
            formRef.value.clearValidate()
            if (isPending.value === true) {
              resetCode()
            }
          }
  )

  onUnmounted(() => {
    clearInterval(timer.value)
  })

</script>

<style scoped lang="scss">
  .login-container{
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
    width: 100vw;
    height: 100vh;
    background-image: url("@/assets/images/loginbg01.png");

    .content{
      border: 1px solid #d8d4d4;
      width: 500px;
      padding: 20px;
      border-radius: 5px;

      .title{
        font-size: 32px;
        font-weight: bold;
        color: #000000;
        margin-bottom: 25px;
        text-align: center;
        letter-spacing: 1px;
      }

      .account-form{
        position: relative;
        display: flex;
        flex-direction: column;
        align-items: center;
        min-height: 240px;

        ::v-deep .el-form-item{
          width: 350px;

          .bottom-text{
            width: 100% ;
          }

          .inputFormCode{
            position: relative;
            display: flex;
            justify-content: space-between;
            width: 100%;

            .code-content{
              position: relative;

              .countdown{
                position: relative;
                color: #3f99f7;
                border: 1px solid #dcdcdc;
                border-radius: 5px;
                text-align: center;
                width: 100px;
                height: 35px;
              }
            }

            .el-input{
              width: 220px;
              height: 37px;
            }

          }

          .el-form-item__content{
            margin-left: 0 !important;

            button{
              height: 37px;
              width: 100%;
            }
          }

          .el-form-item__label{
          }

          .el-input__wrapper{
            width: 100%;
            height: 35px;
          }
        }
      }

    }

    .once-login{
      position: relative;
      color: #3f99f7;
      cursor: pointer;
      top: 10vh;
      letter-spacing: 1px;
      font-size: 16px;
    }

  }
</style>