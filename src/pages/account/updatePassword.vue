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
                            :placeholder="`请输入${item.placeholder}`"
                            :show-password="item.compoentType === 'password'"
                    />
                </el-form-item>
            </el-form>

            <div class="bottom">
                <div class="valid-text u-cursor" @click="handleClickBtn('validaType')">{{validPhone ? '手机号码校验' : '原密码校验'}}</div>

                <div class="btn-container">
                    <el-button type="default" @click="handleClickBtn('cancel')">取消</el-button>
                    <el-button type="primary" @click="handleClickBtn('confirm')">确认修改</el-button>
                </div>
            </div>

        </div>
    </div>

</template>

<script setup>
  import { reactive, ref, computed, getCurrentInstance, onMounted } from 'vue';
  import IMGURL from '@/assets/images/logo.png';
  import { useRouter } from 'vue-router';

  const { proxy } = getCurrentInstance()
  const router = useRouter()
  let formData = reactive({
    account:'109803321',
    email:'1820388',
    name:'iwoj',
  })
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
  const validPhone = ref(false)
  const loadingCode = ref(false)
  const IMG = ref(null)

  const formConfig = computed(() => {
    let arr = []
    if (validPhone.value) {
      arr = [
        {label: '原密码:', key: 'password', placeholder: '原密码', compoentType:'password'},
        {label: '新密码:', key: 'newPassword', placeholder: '新密码（不低于8位数的字符组合）', compoentType:'password'},
        {label: '确认密码:', key: 'confirmPassword', placeholder: '新密码（不低于8位数的字符组合）', compoentType:'password'}
      ]
    }else {
      arr = [
        {label: '手机号码:', key: 'phone', placeholder: '手机号码', compoentType:'text'},
        {label: '验证码:', key: 'code', placeholder: '验证码', compoentType:'text'},
        {label: '新密码:', key: 'newPassword', placeholder: '新密码（不低于8位数的字符组合）', compoentType:'password'},
        {label: '确认密码:', key: 'confirmPassword', placeholder: '新密码（不低于8位数的字符组合）', compoentType:'password'}
      ]
    }

    return arr
  })


  function handleClickBtn(type) {
    console.log('handleClickBtn', type)
    if (type === 'validaType') {
      validPhone.value = !validPhone.value
      if (validPhone.value) {
        formData = reactive({
          password:'',
          newPassword:'',
          confirmPassword:'',
        })
      }else {
        formData = reactive({
          phone:'',
          code:'',
          newPassword:'',
          confirmPassword:'',
        })
      }
    }
    else if (type === 'cancel') {
      router.back()
    }else {
      formRef.value.validate(valid=>{
        if (valid) {
          proxy.$confirm('确认修改信息吗',  {
            confirmButtonText: '确认',
            cancelButtonText: '取消',
            type: 'warning',
          }).then(res=>{
            if (res === 'confirm') {
              console.log(res)
            }
          }).catch(()=>{
            console.log('取消')
          })
        }
      })
    }
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