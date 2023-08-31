<template>
    <el-dialog
            v-model="visible"
            :title="title"
            class="pay-money-modal"
            width="700"
            :close-on-click-modal="false"
            @close="handleClose"
    >
        <div class="dialog-body">
            <div class="header-container u-m-b-10">
                <div class="main">
                    <el-icon color="#00a870" size="24"><CircleCheckFilled /></el-icon>
                    <div class="main-text u-font-weight u-font-18 u-m-l-15">{{ mainText }}</div>
                </div>
                <div class="sub-text">{{ subText || '请在2023-06-05 23:48:59内完成支付，否则订单会被自动取消！' }}</div>
            </div>

<!--            <el-form ref="form" :model="formData" :rules="rules" label-width="90">-->
<!--                <el-form-item v-for="(item, index) in formItemsConfig" :prop="item.prop" :label="item.label" :key="item.prop"-->
<!--                              label-position="right">-->

<!--                    <el-input v-model="formData[item.prop]" :placeholder="item.placeholder"/>-->

<!--                </el-form-item>-->

<!--                <el-form-item label="支付方式">-->
<!--                    <div class="pay-way-option">微信支付</div>-->
<!--                </el-form-item>-->
<!--            </el-form>-->
            <div class="form">
                <div class="form-item" v-for="(item, index) in formItemsConfig" :key="item.prop">
                    <div class="form-item-label">{{ item.label }}</div>
                    <div class="form-item-content">{{ formData[item.prop] }}</div>
                </div>

                <div class="form-item">
                    <div class="form-item-label">支付方式</div>
                    <div class="pay-way-option">微信支付</div>
                </div>
            </div>

            <div class="bottom-container">
                <div class="left">
                    <img :src="FakeQRCode"/>
                </div>
                <div class="right u-m-l-20">
                    <div class="scan-tip-text">请使用微信扫码，支付成功后自动开通服务</div>
                    <div class="footer-btn" @click="handleClose">我已完成支付</div>
                </div>
            </div>
        </div>

    </el-dialog>
</template>

<script setup>
  import {reactive, ref, defineEmits, defineProps, watch, getCurrentInstance, onUnmounted} from 'vue';
  import FakeQRCode from '@/assets/images/fake-qrcode.png';

  const { proxy } = getCurrentInstance()
  const emit = defineEmits(['update:modelValue'])
  const props = defineProps({
    modelValue: {
      required: true,
      type: Boolean,
    },
    title:{
      required: true,
      type: String,
    },
    mainText:{
      required: true,
      type: String,
    },
    subText:{
      required: false,
      type: String,
    },
    formItemsConfig: {
      required: true,
      type: Array,
      default: () => []
    },
    formData:{
      required: true,
      type: Object,
      default: () => {}
    },
  })

  const visible = ref(false)
  const rules = {
    account: [
      {
        required: true,
        message: '手机号不能为空!',
        trigger: 'blur',
      },
      {
        message: '手机号不合法!',
        trigger: 'blur',
        pattern: /^1(3|4|5|6|7|8|9)\d{9}$/
      }
    ],
    email: [{
      pattern: /^[a-zA-Z0-9_.-]+@[a-zA-Z0-9-]+(\.[a-zA-Z0-9-]+)*\.[a-zA-Z0-9]{2,6}$/,
      message: '邮箱不合法!',
      trigger: 'blur'
    }],
    userName: [
      {
        required: true,
        message: '用户名不能为空!',
        trigger: 'blur'
      },
      {
        message: '请输入1-7位数用户名!',
        trigger: 'blur',
        max:7,
        min:1
      }
    ]
  }
  const form = ref(null)
  const timer = ref(null)

  function handleClose() {
    clearInterval(timer.value)
    emit('update:modelValue', false)
  }

  function queryPayStatus() {
    timer.value = setInterval(() => {
      const random = Math.random()
      console.log('random', random)
      if (random > 0.7) {
        proxy.$message({
          type:'success',
          message:'付款成功！'
        })
        handleClose()
      }
    }, 2000)
  }

  watch(
    () => props.modelValue,
    (newVal) => {
      // if (newVal) queryPayStatus()
      visible.value = newVal
    }
  )

  onUnmounted(() => {
    clearInterval(timer.value)
  })

</script>

<style scoped lang="scss">
    .pay-money-modal{
        position: relative;

        .dialog-body{
            position: relative;

            .header-container{
                position: relative;
                background-color: #f6f6f6;
                padding: 30px 15px;

                .main{
                    display: flex;
                    align-items: center;

                    .main-text{color: #353535;}
                }

                .sub-text{
                    margin-left: 39px;
                    margin-top: 10px;
                    font-size: 16px;
                    font-weight: bold;
                    color: gray;
                }
            }

            .form{
                position: relative;

                .form-item{
                    display: flex;
                    align-items: center;
                    margin-bottom: 15px;

                    .form-item-label{
                        color: #272727;
                        font-weight: bold;
                        width: 80px;
                        margin-right: 10px;
                        text-align: end;
                    }

                    .form-item-content{
                        position: relative;
                        border: 1px solid #e5e5e5;
                        border-radius: 4px;
                        padding: 8px 5px;
                        flex: 1;
                    }

                    .pay-way-option{
                        background: #1aad19;
                        color: #fff;
                        padding: 5px 30px;
                    }
                }
            }

            :deep(.el-form) {
                .el-form-item__label{
                    color: #272727;
                    font-weight: bold;
                }

                .pay-way-option{
                    background: #1aad19;
                    color: #fff;
                    padding: 0 30px;
                }
            }

            .bottom-container {
                position: relative;
                margin-left: 90px;
                display: flex;
                align-items: center;

                .left{
                    position: relative;
                    width: 200px;

                    img{
                        width: 100%;
                        height: 100%;
                    }
                }

                .right{
                    position: relative;
                    font-size: 16px;

                    .scan-tip-text{
                        position: relative;
                    }

                    .footer-btn{
                        background: #149cdf;
                        color: #fff;
                        width: 130px;
                        text-align: center;
                        padding: 5px 0;
                        margin-top: 10px;
                        cursor: pointer;
                    }
                }
            }
        }
    }
</style>