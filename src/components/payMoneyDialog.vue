<template>
    <el-dialog
            v-model="visible"
            :title="title"
            class="pay-money-modal"
            width="700"
            :close-on-click-modal="false"
            destroy-on-close
            @close="handleClose"
    >
        <div class="dialog-body">
            <div class="header-container u-m-b-10">
                <div class="main">
                    <el-icon color="#00a870" size="24"><CircleCheckFilled /></el-icon>
                    <div class="main-text u-font-weight u-font-18 u-m-l-15">{{ mainText }}</div>
                </div>
                <div class="sub-text">{{ dialogType === '2' ? `请在${formData.expirationTime}内完成支付，否则订单会被自动取消！` : '' }}</div>
            </div>

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
                    <QRCodeVue3
                            v-if="formData.qrCodeUrl"
                            :value="formData.qrCodeUrl"
                            :width="200"
                            :height="200"
                            :dotsOptions="{type: 'classy'}"
                            :cornersSquareOptions="{ type: 'square', color: '#000000' }"
                    />
                </div>
                <div class="right u-m-l-20">
                    <div class="scan-tip-text">请使用微信扫码，支付成功后自动开通服务</div>
                    <div class="footer-btn" @click="handleFooterBtn">我已完成支付</div>
                </div>
            </div>
        </div>

    </el-dialog>
</template>

<script setup>
  import {reactive, ref, defineEmits, defineProps, watch, watchEffect, getCurrentInstance, onUnmounted} from 'vue';
  import QRCodeVue3 from "qrcode-vue3";
  import ACCOUNTAPI from '@/pages/account/api';
  import PRODUCTAPI from '@/pages/product/api';

  const { proxy } = getCurrentInstance()
  const emits = defineEmits(['update:modelValue', 'success'])
  const props = defineProps({
    modelValue:{
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
    formItemsConfig:{
      required: true,
      type: Array,
      default: () => []
    },
    formData:{
      required: true,
      type: Object,
      default: () => {}
    },
    payCallback:{
      required: false,
      type: Function,
      default: () => {
        return new Function()
      }
    },
    // 1:押金  2:结算商品呢
    dialogType:{
      required: false,
      type: String,
      default: '1'
    }
  })

  const visible = ref(false)
  const timer = ref(null)

  function handleClose() {
    clearInterval(timer.value)
    emits('update:modelValue', false)
  }

  function handleFooterBtn() {
    clearInterval(timer.value)
    queryPayStatus(customQueryPayStatus)
  }

  function customQueryPayStatus(payResultStatus) {
    if (payResultStatus == '10') {
      proxy.$message({
        type: 'success',
        message: '支付成功！',
        duration: 5000
      })
      emits('success')
    }else if (payResultStatus == '0') {
      proxy.$message({
        type: 'warning',
        message: '支付未成功！',
        duration: 5000
      })
    }else if (payResultStatus == '-1') {
      proxy.$message({
        type: 'warning',
        message: '已取消付款！',
        duration: 5000
      })
    }

    handleClose()
  }

  function queryPayStatus(callback) {
    if (props.formData.orderId) {

      props.payCallback({orderId: props.formData.orderId}).then(res=>{
        if (res.code == '0') {
          if (typeof callback === 'function') {
            callback(res.data.payResultStatus)
          }else {
            if (res.data.payResultStatus == '10') {
              proxy.$message({
                type: 'success',
                message: '支付成功！',
                duration: 5000
              })
              emits('success')
              handleClose()
            }
          }
        }else {
          clearInterval(timer.value)
        }
      }).catch(() => {
        clearInterval(timer.value)
      })
    }
  }

  watch(
    () => props.modelValue,
    (newVal) => {
      if (newVal) {
        timer.value = setInterval(() => {
          queryPayStatus()
        }, 2000)
      }
      visible.value = newVal
    }
  )

  // watch(
  //   () => props.formData,
  //   (newVal) => {
  //     FormData.value = newVal
  //   }
  // )

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

            .bottom-container {
                position: relative;
                margin-left: 90px;
                display: flex;
                align-items: center;

                .left{
                    position: relative;
                    width: 200px;
                    height: 200px;
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