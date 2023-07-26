<template>
    <div class="update-password-container bg-fff">
        <div class="content">
            <div class="title">修改密码</div>

            <el-form class="account-form" ref="formRef" :rules="rules" :model="formData" label-width="90px">

                <el-form-item v-for="(item, index) in formConfig" :label="item.label" :prop="item.key" :key="item.key">
                    <template v-if="item.key === 'code'">
                        <div class="inputFormCode">
                            <el-input v-model="formData[item.key]" :placeholder="`请输入${item.placeholder}`"/>

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
                            :placeholder="`请输入${item.placeholder}`"
                            :show-password="item.compoentType === 'password'"
                    />
                </el-form-item>
            </el-form>

            <div class="bottom">
                <div class="valid-text u-cursor" @click="handleClickBtn('validaType')">{{validPhone ? '手机号码校验' : '原密码校验'}}</div>

                <div class="btn-container">
                    <el-button v-for="(btn, index) in btnsConfig" :key="index"
                               :type="btn.btnType"
                               @click="handleClickBtn(btn.value)"
                               :loading="btnLoading"
                               :disabled="btnLoading"
                    >
                        {{btn.label}}
                    </el-button>
                </div>
            </div>

        </div>
    </div>

</template>

<script setup>
  import {reactive, ref, computed, getCurrentInstance, onMounted, onUnmounted} from 'vue';
  import { useRouter } from 'vue-router';
  import API from "@/pages/login/api";
  import cryptojs from "@/assets/js/cryptojs";

  const { proxy } = getCurrentInstance()
  const router = useRouter()

  const formData = reactive({})
  const rules = reactive({
    oldPassword: [{
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
            pattern: /^[a-zA-Z0-9]{6,16}$/,
        message: '请输入不低于6位数的数字和字符!',
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
    account: [
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
  const validPhone = ref(false)
  const isPending = ref(false)
  const countdown = ref(59)
  const timer = ref(null)
  const btnLoading = ref(false)
  const btnsConfig = ref([
    {label:'取消', value:'cancel', btnType:'default'},
    {label:'确认修改', value:'confirm', btnType:'primary'},
  ])

  const formConfig = computed(() => {
    let arr = []
    if (!validPhone.value) {
      arr = [
        {label: '原密码:', key: 'oldPassword', placeholder: '原密码', compoentType:'password'},
        {label: '新密码:', key: 'newPassword', placeholder: '新密码（不低于6位数的字符组合）', compoentType:'password'},
        {label: '确认密码:', key: 'confirmPassword', placeholder: '新密码（不低于6位数的字符组合）', compoentType:'password'}
      ]
    }else {
      arr = [
        {label: '手机号码:', key: 'account', placeholder: '手机号码', compoentType:'text'},
        {label: '验证码:', key: 'code', placeholder: '验证码', compoentType:'text'},
        {label: '新密码:', key: 'newPassword', placeholder: '新密码（不低于6位数的字符组合）', compoentType:'password'},
        {label: '确认密码:', key: 'confirmPassword', placeholder: '新密码（不低于6位数的字符组合）', compoentType:'password'}
      ]
    }

    return arr
  })


  function handleClickBtn(type) {
    if (type === 'validaType') {
      validPhone.value = !validPhone.value
      formRef.value.resetFields()
    }
    else if (type === 'cancel') {
      router.back()
    }else {
      formRef.value.validate(valid=>{
        if (valid) {
          proxy.$confirm('确认修改密码吗',  {
            confirmButtonText: '确认',
            cancelButtonText: '取消',
            type: 'warning',
          }).then(res=>{
            if (res === 'confirm') {
              handleUpdatePassword()
            }
          }).catch(()=>{
            console.log('取消')
          })
        }
      })
    }
  }

  // 修改密码接口
  function handleUpdatePassword() {
    let params = {
      ...formData,
      type: validPhone.value ? '1' : '2',
      oldPassword: formData.oldPassword ? cryptojs.encrypt(formData.oldPassword) : null,
      newPassword: formData.newPassword ? cryptojs.encrypt(formData.newPassword) : null,
      confirmPassword: formData.confirmPassword ? cryptojs.encrypt(formData.confirmPassword) : null,
    }

    console.log('params', params)

    btnLoading.value = true
    setTimeout(() => {
      proxy.$message({
        type: 'success',
        message: '修改密码成功'
      })
      router.back();
    }, 3000)

    // API.updatePassword(params).then(res=>{
    //   if (res.code == '0') {
    //     proxy.$message({
    //       type: 'success',
    //       msg: '修改密码成功'
    //     })
    //
    //     router.back();
    //   }
    // })
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
      return
    }

    formRef.value.validateField('account', (valid) => {
      if (valid) {
        let params = {
          Mobile: formData.account,
          codeType:'1'
        }

        isPending.value = true
        API.SendCode(params).then(res=>{
          if (res.code == '0') {
            timer.value = setInterval(() => {
              if (countdown.value > 0) {
                countdown.value--;
              }else {
                countdown.value = 59
                isPending.value = false
                clearInterval(timer.value)
              }
            }, 1000)
          }else {
            isPending.value = false
          }
        })
      }
    })
  }

  onUnmounted(() => {
    clearInterval(timer.value)
  })


</script>

<style scoped lang="scss">
    .update-password-container{
        display: flex;
        align-items: center;
        justify-content: center;

        .content{
            border: 1px solid #d8d4d4;
            width: 450px;
            height: 400px;
            padding: 20px;
            border-radius: 5px;

            .title{
                font-size: 20px;
                font-weight: bold;
                color: #000000;
                margin-bottom: 25px;
            }

            .account-form{
                position: relative;
                display: flex;
                flex-direction: column;
                align-items: center;
                height: 240px;

                ::v-deep .el-form-item{

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
                                padding: 1px 0;
                                width: 100px;
                            }
                        }

                        .el-input{
                            width: 130px;
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
                        flex: unset;
                        width: 270px;
                    }

                    .el-form-item__label{
                    }

                    .el-input__wrapper{
                        width: 100%;
                        height: 35px;
                    }
                }
            }

            .bottom{
                display: flex;
                justify-content: space-between;
                margin-top: 70px;
                padding: 0 10px;

                .valid-text{
                    color: gray;
                }

                .btn-container{
                    text-align: center;

                    button{
                        width: 90px;
                    }
                }
            }
        }

    }
</style>