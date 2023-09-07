<template>
    <div class="tip-pay u-border-radius-5 u-m-b-15" v-if="agentInfo.isFreeOfCommission == 0 && agentInfo.isPayCashPledge == 0">
        <div class="left">
            <div class="point u-m-r-10">!</div>
            <div class="text">尚未支付押金，账号暂无法进行其他操作！！！</div>
        </div>

        <div class="pay-btn u-cursor u-border-radius-5" @click="handleRecharge">立刻充值</div>

        <PayMoneyDialog
            v-model="dialogVisible"
            title="押金缴纳"
            mainText="押金缴纳提交成功，请尽快付款！"
            dialogType="1"
            :formItemsConfig="dialogFormItemsConfig"
            :formData="dialogFormData"
            :payCallback="payCallback"
            @success="handleUpdateAgentInfo"
        />
    </div>
</template>

<script setup>
  import { ref, useAttrs, defineExpose, computed } from 'vue';
  import { useStore } from 'vuex';
  import PayMoneyDialog from '@/components/payMoneyDialog';
  import API from '@/pages/account/api';

  const attrs = useAttrs()
  const store = useStore()

  const dialogVisible = ref(false)
  const dialogFormItemsConfig = ref([
    {label: '代理商', prop: 'agencyName'},
    {label: '押金单号', prop: 'orderCode'},
    {label: '应付金额', prop: 'paymentAmount'},
  ])
  const dialogFormData = ref({})
  const payCallback = ref(API.getDepositPaymentRecord)

  function handleRecharge() {
    API.CashPledgePayment({payType:'1'}).then(res=>{
      if (res.code == 0) {
        dialogFormData.value = res.data
        dialogVisible.value = true
      }
    })
  }

  function handleUpdateAgentInfo() {
    store.dispatch("user/getAgentUserInfo")
  }

  const agentInfo = computed(() => {
    return store.getters["user/agentInfo"]
  })

  defineExpose({
    handleRecharge
  })

</script>

<style scoped lang="scss">
    .tip-pay{
        display: flex;
        align-items: center;
        justify-content: space-between;
        background-color: #f9d7d9;
        padding: 8px 10px;

        .left{
            display: flex;
            align-items: center;
            .point{
                color: #ffffff;
                background-color: #e34d59;
                border-radius: 50%;
                width: 20px;
                height: 20px;
                line-height: 20px;
                text-align: center;
            }

            .text{
                color: #373535;
            }
        }

        .pay-btn{
            color: #ffffff;
            background-color: #e34d59;
            padding: 5px 10px;
        }
    }
</style>