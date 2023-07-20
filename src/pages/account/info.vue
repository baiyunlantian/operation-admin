<template>
    <div class="account-info-container">
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
                    <el-input v-model="formData[item.key]" />
                </el-form-item>
            </el-form>
            <div class="btn-container">
                <el-button type="default" @click="handleClickBtn('update')">修改密码</el-button>
                <el-button type="primary" @click="handleClickBtn('edit')">编辑</el-button>
            </div>
        </div>
        <div class="bottom bg-box"></div>
    </div>

</template>

<script setup>
  import { reactive, ref, getCurrentInstance } from 'vue';
  import { useRouter } from 'vue-router';

  const { proxy } = getCurrentInstance()
  const router = useRouter()
  const _formConfig = [
    {label:'账号:', key:'account'},
    {label:'邮箱:', key:'email'},
    {label:'用户名:', key:'name'},
  ]
  const formConfig = reactive(_formConfig)
  const formData = reactive({
    account:'109803321',
    email:'1820388',
    name:'iwoj',
  })
  const formRef = ref(null)
  const rules = reactive({
    account: [{
      required: true,
      message: '账号不能为空!',
      trigger: 'blur'
    }],
    email: [
      {
        required: true,
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
      required: true,
      message: '用户名不能为空!',
      trigger: 'blur'
    }]
  })

  function handleClickBtn(type) {
    console.log('handleClickBtn', type)
    if (type === 'update') {
      // 跳转路由
      router.push({path:'/updatePassword'})
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
  function goBack() {
    router.back()
  }

</script>

<style scoped lang="scss">
    .account-info-container{
        display: flex;
        flex-direction: column;

        .header{
            height: 40px;
            line-height: 40px;
            color: #ffffff;
            font-size: 18px;
            font-weight: bold;
            padding-left: 15px;

        }

        .content{
            flex: 1;
            margin: 0 auto;

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

        .bottom{
            height: 24px;
        }

        .bg-box{
            background-color: blue;
            display: inline-block;
        }
    }
</style>