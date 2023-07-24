<template>
    <div class="account-info-container bg-fff">
        <div class="header bg-box">
            <span class="u-cursor" @click="goBack">&lt;</span>
            个人资料
        </div>
        <div class="content">
            <div class="avatar">
                <img src="@/assets/images/account.png"/>
                <div class="bg-pray"></div>
            </div>

            <el-form class="account-form" ref="formRef" :rules="rules" :model="formData" label-width="70px">

                <el-form-item v-for="(item, index) in formConfig" :label="item.label" :prop="item.key" :key="item.key">
                    <div v-if="item.readOnly" class="content">{{ formData[item.key] }}</div>
                    <el-input v-else v-model="formData[item.key]" />
                </el-form-item>
            </el-form>
            <div class="btn-container">
                <el-button type="default" @click="handleClickBtn('leftBtn')">{{isReadOnly ? '修改密码' : '取消'}}</el-button>
                <el-button type="primary" @click="handleClickBtn('rightBtn')">{{isReadOnly ? '编辑' : '确认修改'}}</el-button>
            </div>
        </div>
        <BottomBox />
    </div>

</template>

<script setup>
  import { reactive, ref, getCurrentInstance, computed } from 'vue';
  import { useRouter } from 'vue-router';
  import BottomBox from '@/components/bottom-box';

  const { proxy } = getCurrentInstance()
  const router = useRouter()

  const isReadOnly = ref(true)
  const formData = reactive({
    account:'109803321',
    email:'1820388',
    name:'iwoj',
  })
  const formRef = ref(null)
  const rules = reactive({
    account: [{
      message: '账号不能为空!',
      trigger: 'blur'
    }],
    email: [
      {
        message: '邮箱不能为空!',
        trigger: 'blur'
      },
      {
        pattern: /^[a-zA-Z0-9_.-]+@[a-zA-Z0-9-]+(\.[a-zA-Z0-9-]+)*\.[a-zA-Z0-9]{2,6}$/,
        message: '邮箱不合法!',
        trigger: 'blur'
      }
    ],
    name: [{
      message: '用户名不能为空!',
      trigger: 'blur'
    }]
  })

  function handleClickBtn(btnType) {
    // console.log('handleClickBtn', btnType)
    const isReadOnlyVal = isReadOnly.value
    // 修改密码按钮
    if (btnType === 'leftBtn' && isReadOnlyVal) {
      router.push({path:'/updatePassword'})
    }
    // 取消按钮
    else if (btnType === 'leftBtn' && !isReadOnlyVal){
      isReadOnly.value = true
      formRef.value.resetFields()
    }
    // 编辑按钮
    else if (btnType === 'rightBtn' && isReadOnlyVal){
      isReadOnly.value = false
    }
    // 确认修改按钮
    else if (btnType === 'rightBtn' && !isReadOnlyVal) {
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


  const formConfig = computed(() => {
    return [
      {label:'账号:', key:'account', readOnly:true},
      {label:'邮箱:', key:'email', readOnly:isReadOnly.value},
      {label:'用户名:', key:'name', readOnly:isReadOnly.value}
    ]
  })

  function goBack() {
    router.back()
  }

</script>

<style scoped lang="scss">
    .account-info-container{
        display: flex;
        flex-direction: column;

        .header{
            color: #ffffff;
            font-size: 24px;
            font-weight: bold;
            padding: 10px 15px;
            background: blue;
        }

        .content{
            flex: 1;
            margin: 0 auto;
            width: 272px;

            .avatar{
                position: relative;
                text-align: center;
                margin: 30px 0;

                img{
                    width: 65px;
                    height: 65px;
                }

                .bg-pray{
                    position: relative;
                }
            }

            .account-form{
                position: relative;

                :deep .el-form-item{
                    margin-bottom: 40px;

                    .el-form-item__label{
                        margin-right: 20px;
                    }

                    .el-input__wrapper{
                        width: 250px;
                    }
                }
            }

            .btn-container{
                margin-bottom: 40px;
                text-align: center;

                button{
                    width: 90px;
                }
            }
        }

    }
</style>