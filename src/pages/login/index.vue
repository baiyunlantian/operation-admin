<template>
  <div class="login-container">
    <div class="content">
      <div class="title">吗哩呀咔AI ERP运营后台</div>

      <el-form class="account-form" ref="formRef" :rules="rules" :model="formData" label-width="90px">

        <el-form-item v-for="(item, index) in formConfig[formType]['form']" :prop="item.key" :key="item.key">
          <template v-if="item.key === 'code'">
            <div class="inputFormCode">
              <el-input v-model="formData[item.key]" :placeholder="`请输入${item.label}`"/>

              <div class="code-content">
                <div v-if="IMG" class="img-container">
                  <img class="code-img" :src="IMG">
                </div>

                <el-button v-else type="default" @click="handleGetCode" :loading="loadingCode">获取验证码</el-button>
              </div>
            </div>
          </template>

          <el-input
                  v-else
                  v-model="formData[item.key]"
                  :type="item.compoentType === 'password' ? 'password' : 'text'"
                  :placeholder="`请输入${item.label}`"
                  :show-password="item.compoentType === 'password'"
          />
        </el-form-item>

        <el-form-item>
          <el-button type="primary" @click="handleClickBtn('submit')">{{formType === 'forget' ? '重置密码' : '登录'}}</el-button>
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
  import { reactive, ref, computed, getCurrentInstance, onMounted } from 'vue';
  import IMGURL from '@/assets/images/logo.png';

  const { proxy } = getCurrentInstance()
  let formData = reactive({})
  const rules = reactive({
    password: [{
      required: true,
      message: '原密码不能为空!',
      trigger: 'blur'
    }],
    newPassword: [
      {
        required: true,
        message: '新密码不能为空!',
        trigger: 'blur'
      },
      {
        required: true,
        message: '新密码不能为空!',
        trigger: 'blur'
      },
      {
        pattern: /^[a-zA-Z0-9]{6,16}$/,
        message: '请输入不低于8位数的数字和字符!',
        trigger: 'blur'
      }
    ],
    confirmPassword: [
      {
        required: true,
        message: '确认密码不能为空!',
        trigger: 'blur'
      },
      {
        validator: validConfirmPassword,
        message: '新密码输入不一致!',
        trigger: 'blur'
      },
    ],
    phone: [
      {
        required: true,
        message: '手机号码不能为空!',
        trigger: 'blur',
      },
      {
        pattern: /^1(3|4|5|6|7|8|9)\d{9}$/,
        message: '请输入正确的手机号!',
        trigger: 'blur'
      }
    ],
    code: [{
      required: true,
      message: '验证码不能为空!',
      trigger: 'blur'
    }]
  })
  const formRef = ref(null)
  const loadingCode = ref(false)
  const IMG = ref(null)
  const autoLogin = ref(false)
  const formType = ref('code')
  // 表单类型  code:验证码登录    password:密码登录    forget:忘记密码
  const formConfig = reactive({
    'code':{
      tip:'密码登录',
      form:[
        {label: '手机号码', key: 'phone', placeholder: '手机号码', compoentType:'text'},
        {label: '验证码', key: 'code', placeholder: '验证码', compoentType:'text'},
      ]
    },
    'password':{
      tip:'验证码登录',
      form:[
        {label: '手机号码', key: 'phone', placeholder: '手机号码', compoentType:'text'},
        {label: '密码', key: 'password', placeholder: '密码', compoentType:'password'},
      ]
    },
    'forget':{
      tip:'立即登录',
      form:[
        {label: '手机号码', key: 'phone', placeholder: '手机号码', compoentType:'text'},
        {label: '验证码', key: 'code', placeholder: '验证码', compoentType:'text'},
        {label: '密码', key: 'password', placeholder: '密码', compoentType:'password'},
        {label: '确认密码', key: 'confirmPassword', placeholder: '密码（不低于8位数的字符组合）', compoentType:'password'}
      ]
    }
  })

  function handleSwitchForm(type) {
    if (type === 'code') {
      formType.value = 'password'
    }else if (type === 'password' || type === 'forget') {
      formType.value = 'code'
    }else if (type === 'forgetPassword'){
      formType.value = 'forget'
    }

    formRef.value.resetFields()
  }

  function handleClickBtn(type) {

    formRef.value.validate(valid=>{
      if (valid) {
        if (type === 'forget') {
          // 重置密码
        }else {
          // 登录
        }
        console.log('ok', formData)
      }
    })
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
    loadingCode.value = true
    setTimeout(() => {
      IMG.value = IMGURL
      loadingCode.value = false
    }, 2000)
  }

</script>

<style scoped lang="scss">
  .login-container{
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
    width: 100vw;
    height: 100vh;

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

            .el-input{
              width: 220px;
            }

            .img-container{
              height: 35px;
              border: 1px solid #dadada;
              border-radius: 2px;

              .code-img{
                height: 100%;
              }
            }

          }

          .el-form-item__content{
            margin-left: 0 !important;

            button{
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