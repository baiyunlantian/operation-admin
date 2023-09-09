<template>
    <div class="center-container">
        <payMoneyTipsBox ref="payMoneyRef" />

        <div class="main-content">
            <div class="header-container u-m-t-15">
                <div class="left u-border-radius-4 padding-2-pre">
                    <div class="img-box">
                        <img :src="agentInfo.userImage || AutoAvatar" style="height: 100%; width: 100%"/>
                    </div>
                    <div class="name u-font-weight u-font-18">{{ agentInfo.userName }}</div>
                    <div class="company u-font-16"><span class="u-m-r-5">{{ agentInfo.company }}</span><span>{{ agentInfo.roleName }}</span></div>
                </div>

                <div class="right">
                    <div class="box-shadow bg-fff padding-2-pre">
                        <span class="u-font-22 u-font-weight u-m-r-30">Hi，{{ agentInfo.userName }}</span>
                        <span style="letter-spacing: 1px" class="u-font-16 u-font-weight">{{ time }}好，今天是你加入{{ agentInfo.company }}的第{{ agentInfo.joinDays }}天~</span>
                    </div>

                    <div class="box-shadow bg-fff u-m-t-15 padding-2-pre" style="flex: 1">
                        <div class="u-font-23 u-font-weight u-m-b-10">个人信息</div>

                        <div class="info-container">
                            <div class="content-box" v-for="(item, index) in infoConfig" :key="index">
                                <div class="label-color u-font-18">{{ item.label }}</div>
                                <div class="prop-color u-font-weight u-font-18">{{ agentInfo[item.prop] }}</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div class="box-shadow bg-fff u-m-t-15 padding-2-pre" v-if="agentInfo.roleId == 10 || agentInfo.roleId == 20">
                <div class="u-font-23 u-font-weight u-m-b-10">提现相关</div>

                <div class="content-container">
                    <div class="withdraw-container">
                        <div class="content-box" :class="item.className" v-for="(item, index) in withdrawConfig" :key="index">
                            <div class="label-color u-font-18">{{ item.label }}</div>
                            <div :class="[handleFormatWithDrawText(item) === '立即缴纳' ? 'u-cursor blue-color' : '']" class="prop-color u-font-weight u-font-18" @click="handlePayMoney">
                                {{ handleFormatWithDrawText(item) }}
                            </div>
                        </div>
                    </div>

                    <div class="bank-container" v-if="agentInfo.roleId == 20">
                        <div class="left">
                            <div class="header">
                                <div class="title">银行卡信息</div>
                                <div class="btns">
                                    <div class="btn u-cursor u-m-r-10" @click="handleClickFormBtn(formReadonly)">{{ formReadonly ? '编辑' : '保存' }}</div>
                                    <div v-show="!formReadonly" class="btn u-cursor" @click="handleClickFormBtn('cancel')">取消</div>
                                </div>
                            </div>

                            <div class="content">
                                <el-form class="account-form" ref="formRef" :rules="rules" :model="bankInfoData" :hide-required-asterisk="true">
                                    <el-form-item v-for="(item, index) in formConfig" :label="item.label" :prop="item.key" :key="item.key">
                                        <div v-if="formReadonly" class="form-content">{{ bankInfoData[item.key] }}</div>
                                        <el-input v-else v-model="bankInfoData[item.key]" :validate-event="false"/>
                                    </el-form-item>
                                </el-form>
                            </div>
                        </div>
                        <div class="right" v-if="agentInfo.roleId == 20">
                            <div v-if="drawBtnStatus" class="btn u-m-b-15 u-cursor" @click="handleClickDraw">提现</div>
                            <el-button v-else type="info" plain disabled>提现</el-button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
    import { ref, reactive, watch, computed, onMounted, getCurrentInstance } from 'vue';
    import { useStore } from 'vuex';
    import API from './api';
    import AutoAvatar from '@/assets/images/account.png';
    import { setTimeEscalation } from "@/assets/js/utils";
    import { useDeposit } from '@/utils/useDeposit';

    const { getDepositStatus } = useDeposit();
    const setTimeEscalationClone = setTimeEscalation();
    const store = useStore()
    const { proxy } = getCurrentInstance()

    const agentInfo = ref({
      agencyCashPledge:0
    })
    const infoConfig = ref([])
    const withdrawConfig = ref([])
    const withdrawInfo = ref({
      notPaymentOrderQty: 0,
      carryOutOrdersQty: 0,
      completedOrdersQty: 0,
      notPaymentCommission: 0,
      carryOutCommission: 0,
      notWithdrawalCommission: 0,
      withdrawalCommission: 0,
      totalCommission: 0,
    })

    const formConfig = ref([
      {label:'户主名称:', key:'cardName'},
      {label:'银行卡号:', key:'cardNo'},
      {label:'开户行:', key:'openingBank'}
    ])
    const bankInfo = ref({})
    const bankInfoData = ref({})
    const formReadonly = ref(true)
    const rules = reactive({
      cardName:[{required: true, message: '户主名称不能为空！', trigger:'blur'}],
      openingBank:[{required: true, message: '开户行不能为空！', trigger:'blur'}],
      cardNo:[
        {
          required: true,
          message: '银行卡号不能为空！',
          trigger:'blur'
        },
        {
          pattern: /^([1-9]{1})(\d{15}|\d{18})$/,
          message: '请输入正确的银行卡号！',
          trigger:'blur'
        }
      ]
    })
    const formRef = ref()
    const payMoneyRef = ref()
    const time = ref('')

    function handlePayMoney() {
      if (getDepositStatus(()=>{}) === false) {
        payMoneyRef.value.handleRecharge()
      }
      // const {isFreeOfCommission, isPayCashPledge} = agentInfo.value;
      // if (isFreeOfCommission === false && isPayCashPledge === false) {
      //   payMoneyRef.value.handleRecharge()
      // }
    }

    function handleClickFormBtn(eventType) {
      /**
       * eventType:
       *    true:点击编辑
       *    false:点击保存
       *    cancel:点击取消
       * */

      if (eventType === true) {
        formReadonly.value = false
      }else if (eventType === false) {
        formRef.value.validate(valid=>{
          setTimeEscalationClone(() => {
              if (!valid) return

              API.editBankCardInfo(bankInfoData.value).then(res => {
                if (res.code == 0) {
                  proxy.$message({
                    type: 'success',
                    message: res.msg || '修改成功'
                  })
                  handleGetBankCardInfo()
                  formReadonly.value = true
                }
              })
            },
            () => {proxy.$message.warning('操作过于频繁！')})
        })
      }else if (eventType === 'cancel') {
        bankInfoData.value = {...bankInfo.value}
        formReadonly.value = true
        formRef.value.clearValidate()
      }
    }

    function handleClickDraw() {
      if (drawBtnStatus.value === false) return

      proxy.$confirm('确认提现吗',  {
        confirmButtonText: '确认',
        cancelButtonText: '取消',
        type: 'warning',
      }).then(res=>{
        if (res === 'confirm') {
          API.WithdrawalDeposit().then(res=>{
            if (res.code == 0) {
              proxy.$message({
                type: 'success',
                message: '提现成功!'
              })

              // 更新用户信息
              store.dispatch("user/getAgentUserInfo")
            }
          })
        }
      }).catch(()=>{
        console.log('取消')
      })
    }

    function handleGetOrderCommissionInfo() {
      API.getOrderCommissionInfo().then(res=>{
        if (res.code == 0) {
          withdrawInfo.value = res.data
        }
      })
    }

    function handleGetBankCardInfo() {
      API.getBankCardInfo().then(res=>{
        if (res.code == 0) {
          bankInfo.value = {...res.data}
          bankInfoData.value = {...res.data}
        }
      })
    }

    function handleFormatConfig() {
      if (agentInfo.value.roleId == '20') {
        infoConfig.value = [
          {label:'联系方式', prop:'account'},
          {label:'办公邮箱', prop:'email'},
          {label:'加入时间', prop:'joinDate'},
          {label:'所属企业', prop:'company'},
          {label:'专属销售', prop:'appertainSalesName'},
          {label:'销售电话', prop:'appertainSalesPhone'},
          {label:'销售邮箱', prop:'appertainSalesEmail'},
        ]

        withdrawConfig.value = [
          {label:'待付款订单', prop:'notPaymentOrderQty'},
          {label:'部署中订单', prop:'carryOutOrdersQty'},
          {label:'已完成订单', prop:'completedOrdersQty'},
          {label:'冻结押金', prop:'agencyCashPledge', className:'col-2', type:'money'},
          {label:'待付款佣金', prop:'notPaymentCommission', type:'money'},
          {label:'部署中佣金', prop:'carryOutCommission', type:'money'},
          {label:'待提现佣金', prop:'notWithdrawalCommission', type:'money'},
          {label:'已提现佣金', prop:'withdrawalCommission', type:'money'},
          {label:'共赚取佣金', prop:'totalCommission', type:'money'},
        ]
      }else {
        infoConfig.value = [
          {label:'联系方式', prop:'account'},
          {label:'办公邮箱', prop:'email'},
          {label:'加入时间', prop:'joinDate'},
          {label:'所属企业', prop:'company'},
        ]

        withdrawConfig.value = [
          {label:'待付款订单', prop:'notPaymentOrderQty'},
          {label:'部署中订单', prop:'carryOutOrdersQty'},
          {label:'已完成订单', prop:'completedOrdersQty', className:'col-3'},
          {label:'待付款佣金', prop:'notPaymentCommission', type:'money'},
          {label:'部署中佣金', prop:'carryOutCommission', type:'money'},
          {label:'待提现佣金', prop:'notWithdrawalCommission', type:'money'},
          {label:'已提现佣金', prop:'withdrawalCommission', type:'money'},
          {label:'共赚取佣金', prop:'totalCommission', type:'money'},
        ]
      }
    }

    function handleFormatWithDrawText(obj) {
      let {prop, type} = obj, text = '';
      if (prop === 'agencyCashPledge') {
        if (agentInfo.value.isFreeOfCommission === true) {
          text = '免佣用户'
        }else {
          text = agentInfo.value.agencyCashPledge === 0 ? '立即缴纳' : `￥ ${agentInfo.value.agencyCashPledge.toFixed(2)}`
        }

      }else {
        text = type === 'money' ? `￥ ${withdrawInfo.value[prop].toFixed(2)}` : withdrawInfo.value[prop]
      }

      return text
    }

    const drawBtnStatus = computed(() => {
      let date = new Date(), btnStatus = false;
      /**
       * 提现按钮满足条件
       *    时间：1和15号
       *    身份：代理
       *    提现状态：未提现
       *    提现佣金：大于0
       * */
      // if ((date.getDate() === 1 || date.getDate() === 15) && agentInfo.value.roleId == 20 && agentInfo.value.agencyWithdrawstatus == 0 && withdrawInfo.value.drawBtnStatus > 0) {
      //   btnStatus = true
      // }
      if (agentInfo.value.roleId == 20) {
        btnStatus = true
      }

      return btnStatus
    })

    watch(
      () => store.getters["user/agentInfo"],
      (newVal) => {
        if (newVal.roleId == 20) handleGetBankCardInfo()
        if (newVal.roleId == 10 || newVal.roleId == 20) handleGetOrderCommissionInfo()
        agentInfo.value = newVal
        handleFormatConfig()
      },
      {deep: true, immediate:true}
    )

    onMounted(() => {
      const date = new Date()
      /**
       * 3-6 凌晨
       * 6-8 早上
       * 8-11 上午
       * 11-13 中午
       * 13-17 下午
       * 17-19 傍晚
       * 19-23 晚上
       * 23-3 深夜
       * */
      const hours = date.getHours()
      if (hours >= 3 && hours <= 6) {
        time.value = '凌晨'
      }else if (hours >= 6 && hours <= 8) {
        time.value = '早上'
      }else if (hours >= 8 && hours <= 11) {
        time.value = '上午'
      }else if (hours >= 11 && hours <= 13) {
        time.value = '中午'
      }else if (hours >= 13 && hours <= 17) {
        time.value = '下午'
      }else if (hours >= 17 && hours <= 19) {
        time.value = '傍晚'
      }else if (hours >= 19 && hours <= 23) {
        time.value = '晚上'
      }else {
        time.value = '深夜'
      }
    })

</script>

<style scoped lang="scss">
    .center-container{
        padding-bottom: 1vh;
        min-height: 100%;
        height: auto !important;
        box-sizing: border-box;
        overflow: auto;

        .box-shadow{box-shadow: 0px 1px 4px 0px #d6d6d6;}
        .padding-2-pre {padding: 2% 2%;}
        .label-color {color: #9c9c9c;}
        .prop-color {color: #383838;}
        .blue-color {color: #3164f5;}
        .col-2{ width: 40% !important;}
        .col-3{ width: 60% !important;}

        .content-box {
            display: flex;
            flex-direction: column;
            justify-content: space-evenly;
            height: 8vh;
            max-height: 100px;
            min-height: 50px;
        }

        .main-content{
            position: relative;
            margin: 0 5%;

            .header-container{
                position: relative;
                display: flex;
                justify-content: space-between;
                align-items: unset;

                .left{
                    width: 25%;
                    margin-right: 15px;
                    background-color: #0052d9;
                    border-radius: 4px;
                    color: #fff;
                    box-sizing: border-box;

                    .img-box {
                        width: 30%;
                        max-width: 100px;
                        background: #6481f2;
                        border-radius: 50%;
                        opacity: 1;
                        display: flex;
                        justify-content: center;
                        align-items: center;
                        text-align: center;
                    }

                    .name {
                        margin: 15% 0 5% 0;
                    }
                }

                .right{
                    flex: 1;
                    display: flex;
                    flex-direction: column;
                }
            }

            .info-container{
                position: relative;
                display: grid;
                grid-template-columns: repeat(4,1fr);
            }

            .content-container{
                position: relative;
                display: flex;

                .withdraw-container{
                    position: relative;
                    display: flex;
                    flex-wrap: wrap;
                    align-content: space-between;
                    flex: 1;

                    .content-box{
                        width: 20%;
                    }
                }

                .bank-container{
                    position: relative;
                    display: flex;

                    .left{
                        position: relative;
                        border: 1px solid #c5c5c5;
                        border-radius: 0 0 10px 10px;
                        width: 40%;
                        min-width: 400px;

                        .header{
                            display: flex;
                            align-items: center;
                            justify-content: space-between;
                            padding: 8px 10px;
                            border-bottom: 1px solid #c5c5c5;
                            border-top: 0;
                            border-radius: 0 0 10px 10px;

                            .title{
                                font-weight: bold;
                                font-size: 16px;
                                color: #2c3e50;
                            }

                            .btns{
                                display: flex;
                                .btn{
                                    color: #3164f5;
                                    font-size: 16px;
                                }
                            }
                        }

                        .content{
                            position: relative;
                            padding: 0 10px;

                            .account-form{
                                position: relative;

                                :deep(.el-form-item){
                                    display: flex;
                                    align-items: center;
                                    margin: 15px 0px;

                                    .el-form-item__content{
                                        position: relative;
                                    }

                                    .el-form-item__label{
                                        width: 80px;
                                        text-align-last: justify;
                                        display: unset;
                                    }

                                    .el-input__wrapper{
                                        position: relative;
                                        width: 250px;
                                    }
                                }
                            }
                        }
                    }

                    .right{
                        position: relative;
                        margin-left: 5vw;

                        .btn{
                            position: relative;
                            background-color: #0052d9;
                            color: #ffffff;
                            border-radius: 4px;
                            text-align: center;
                            height: 32px;
                            line-height: 32px;
                            padding: 5px 20px;
                            font-size: 14px;
                        }
                    }
                }
            }
        }
    }
</style>