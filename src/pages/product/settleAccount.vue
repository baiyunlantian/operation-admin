<template>
    <div class="settle-account-container" id="settle-account">
        <PayMoneyTipsBox />

        <div class="main-container bg-fff box-shadow padding-2-pre u-m-t-10 ">
            <div class="u-font-22 u-font-weight">客户信息</div>

            <el-form class="account-form border" ref="formRef" :rules="rules" :model="formData" label-width="90px">
                <el-form-item v-for="(item, index) in formConfig" :label="item.label" :prop="item.prop" :key="item.prop">
                    <el-input
                            v-model="formData[item.prop]"
                            :placeholder="`请输入${item.label}`"
                            :validate-event="false"
                    />
                </el-form-item>
            </el-form>

            <div class="u-font-22 u-font-weight">实施相关</div>
            <div class="deploy-container border">
                <div class="left">
                    <div class="label">销售跟单：</div>
                    <el-checkbox-group v-model="checkboxValue" @change="handleCheckboxChange">
                        <div class="checkbox-item" v-for="(checkbox, index) in checkboxs" :key="index">
                            <el-checkbox :label="checkbox.value">{{ checkbox.label }}</el-checkbox>
                            <div class="icon border">?</div>

                            <!--   暂时屏蔽    -->
                            <!--   <el-tooltip class="box-item" effect="dark" placement="right" trigger="click">-->
                            <!--       <template v-slot:content>-->
                            <!--           <div class="tooltip-content">{{checkbox.tooltip}}</div>-->
                            <!--       </template>-->
                            <!--       <template v-slot:default>-->
                            <!--           <div class="icon border">?</div>-->
                            <!--       </template>-->
                            <!--   </el-tooltip>-->
                        </div>
                    </el-checkbox-group>
                </div>
                <div class="right" v-show="(sellerInfo.roleId == 10 || sellerInfo.roleId == 20) && currentCheckboxValue === true">
                    <span>销售名称：{{ sellerInfo.roleId == 10 ? sellerInfo.userName : sellerInfo.appertainSalesName }}</span>
                    <span>联系方式：{{ sellerInfo.roleId == 10 ? sellerInfo.phone : sellerInfo.appertainSalesPhone }}</span>
                    <span>企业邮箱：{{ sellerInfo.roleId == 10 ? sellerInfo.email : sellerInfo.appertainSalesEmail }}</span>
                </div>
            </div>

            <div class="u-font-22 u-font-weight">结算详情</div>
            <el-table class="u-table-container" :data="tableData" border>
                <el-table-column v-for="(item, index) in tableColumnConfig" :key="index"
                                 :prop="item.prop"
                                 :label="item.label"
                                 :width="item.width"
                >
                    <template #default="{ row, column, $index }">
                        <div v-if="item.insertSlot">
                            <div v-if="$index === tableData.length - 1" class="">
                                <div class="total-money">共计：<span class="color" style="margin: 0 5px">{{ row[item.prop] }}</span>元</div>
                            </div>
                            <div v-else class="color">{{ row[item.prop] }}</div>
                        </div>
                        <div v-else>{{ row[item.prop] }}</div>
                    </template>
                </el-table-column>
            </el-table>

            <div class="u-font-22 u-font-weight">客户备注</div>
            <el-input v-model="formData.remark"  type="textarea" />
        </div>

        <div class="footer-container bg-fff padding-2-pre">
            <div class="left">
                <div class="product-option">
                    <div class="text">时长</div>
                    <div class="version">一年</div>
                </div>
                <div class="product-option">
                    <div class="text">数量：</div>
                    <div class="border">1</div>
                </div>
            </div>
            <div class="right">
                <div class="total-money">费用总计<span>{{totalMoney}}元</span></div>
                <div class="btn" @click="handleClickBtn">立即购买</div>
            </div>
        </div>

        <PayMoneyDialog
                v-model="dialogVisible"
                title="支付订单"
                mainText="订单提交成功，请尽快付款！"
                dialogType="2"
                :formItemsConfig="orderFormConfig"
                :formData="orderFormData"
                :payCallback="payCallback"
                @success="handleSuccessPay"
        />
    </div>
</template>

<script setup>
  import {reactive, ref, getCurrentInstance, onMounted, onUnmounted, computed, watch} from 'vue';
  import { useRouter } from "vue-router";
  import { useStore } from 'vuex';
  import API from './api';
  import PayMoneyDialog from '@/components/payMoneyDialog';
  import { useDeposit } from '@/utils/useDeposit';

  const { getDepositStatus } = useDeposit();
  const router = useRouter();
  const store = useStore();
  const { proxy } = getCurrentInstance();

  const formConfig = ref([
    { label:'客户名称', prop:'name'},
    { label:'公司名称', prop:'companyName'},
    { label:'手机号码', prop:'phone'},
    { label:'公司地址', prop:'companyAddress'},
    { label:'电子邮箱', prop:'email'},
    { label:'公司电话', prop:'companyPhone'},
    { label:'微信号', prop:'wechat'},
    { label:'QQ号', prop:'qq'},
  ])
  const rules = reactive({
    name: [
      {
        required: true,
        message: '客户名称不能为空!',
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
  })
  const formData = reactive({})
  const checkboxValue = ref([true])
  const currentCheckboxValue = ref(true)
  const checkboxs = ref([
    { label:'需要', value: true, tooltip:'需要销售' },
    { label:'不需要', value: false, tooltip:'不需要销售' },
  ])
  const tableColumnConfig = ref([
    { label:'项目名称', prop:'title'},
    { label:'项目数量', prop:'count'},
    { label:'单价（元）', prop:'price', insertSlot: true},
  ])
  const tableData = ref([])
  const dialogVisible = ref(false)
  const totalMoney = ref(0)
  const orderFormConfig = ref([
    { label:'客户名称', prop:'customerName'},
    { label:'代理商', prop:'agencyName'},
    { label:'订单号', prop:'orderCode'},
    { label:'应付金额', prop:'paymentAmount'},
  ])
  const orderFormData = ref({})
  const sellerInfo = ref({})
  const payCallback = ref(API.getPaymentRecord)

  // 实现单选框逻辑
  function handleCheckboxChange(checkedValue) {
    if (checkedValue.length === 0) {
      checkboxValue.value = [currentCheckboxValue.value]
    }else if (checkedValue.length === 1) {
      checkboxValue.value = checkedValue[0]
    }else if (checkedValue.length === 2) {
      checkboxValue.value = checkedValue.filter((checkbox) => checkbox !== currentCheckboxValue.value)
      currentCheckboxValue.value = checkboxValue.value[0]
    }
  }

  function handleClickBtn() {
    if (getDepositStatus() === false) return;

    let params = {
      ...formData,
      isCarry: currentCheckboxValue.value,
      orderDurationId: '1',
      settlements: tableData.value.map(item=>{
        const {productId, count, productMarking} = item
        return {productId, count, productMarking}
      })
    }

    // 移出最后一条假数据
    params.settlements.pop()
    if (params.settlements.length === 0) {
      proxy.$message({
        type: 'warning',
        message: '暂无结算商品，请前往商品目录页面选择商品！'
      })
      return
    }

    if (!params.name) {
      proxy.$message({
        type: 'error',
        message: '客户名称不能为空！'
      })
      return
    }

    if (/^1(3|4|5|6|7|8|9)\d{9}$/.test(params.phone) === false) {
      proxy.$message({
        type: 'error',
        message: '请输入正确的手机号！'
      })
      return
    }

    if (/^[a-zA-Z0-9_.-]+@[a-zA-Z0-9-]+(\.[a-zA-Z0-9-]+)*\.[a-zA-Z0-9]{2,6}$/.test(params.email) === false) {
      proxy.$message({
        type: 'error',
        message: '请输入正确的邮箱！'
      })
      return
    }

    API.SettlementOrder(params).then(res=>{
      if (res.code == 0) {
        orderFormData.value = res.data
        dialogVisible.value = true
      }
    })
  }

  function handleFormatTableData(list) {
    let _price = 0, _count = 0;
    list.forEach(({price, count})=>{
      _price += Number(price)
      _count += Number(count)
    })

    _price = _price.toFixed(2)
    let lastRowData = {price:_price, count:_count}
    tableData.value = list.concat([lastRowData])
    totalMoney.value = _price
  }

  function handleSuccessPay() {
    router.replace({ path: '/product' })
  }

  watch(
    () => store.getters["user/agentInfo"],
    (newVal, oldVal) => {
      sellerInfo.value = newVal
    },
    {deep: true, immediate:true}
  )

  onMounted(() => {
    //  解决初始加载时滚动条可能没有置顶问题
    document.getElementsByClassName('body')[0].scrollTop = 0
    const products = JSON.parse(sessionStorage.getItem('product'))

    if (products && Array.isArray(products)) {
      handleFormatTableData(products)
    }
  })

  onUnmounted(() => {
    // 离开当前页面时清除缓存
    sessionStorage.removeItem('product')
  })
</script>

<style scoped lang="scss">
    .settle-account-container{
        position: relative;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        height: auto !important;
        min-height: 100%;
        box-sizing: border-box;

        .border{border: 1px solid #dedede;}
        .box-shadow{box-shadow: 0px 1px 4px 0px #d6d6d6;}

        .main-container{
            padding: 1% 1.5%;
            margin: 0 1%;
            flex: 1;

            >div{margin-bottom: 2vh;}

            .account-form{
                position: relative;
                display: flex;
                flex-wrap: wrap;
                border-radius: 2px;
                padding: 1% 1% 0 1%;
                margin-bottom: 2vh;

                :deep(.el-form-item) {
                    position: relative;
                    width: 35%;
                    margin-right: 5%;

                    .el-form-item__label{
                        position: relative;
                    }

                    .el-form-item__content{
                        position: relative;

                        .el-input__wrapper{
                            position: 1px 10px;
                        }
                    }
                }
            }

            .deploy-container{
                position: relative;
                padding: 1%;
                font-size: 16px;
                display: flex;
                align-items: center;
                justify-content: space-between;

                .left{
                    position: relative;
                    display: flex;
                    align-items: center;

                    .label{
                        position: relative;
                        font-weight: bold;
                        margin-right: 2vw;
                    }

                    :deep(.el-checkbox-group){
                        line-height: unset;
                        display: flex;
                        align-items: center;

                        .checkbox-item{
                            position: relative;
                            margin-right: 2vw;
                            display: flex;
                            align-items: center;

                            .el-checkbox__label{
                                position: relative;
                                margin: 0 5px;
                                font-size: 16px;
                            }

                            .icon{
                                border-radius: 50%;
                                width: 14px;
                                height: 14px;
                                font-size: 14px;
                                font-weight: bold;
                                display: flex;
                                align-items: center;
                                justify-content: center;
                                color: #d6d6d6;
                            }
                        }
                    }
                }

                .right{
                    position: relative;

                    span{
                        position: relative;
                        font-weight: bold;
                        margin-left: 2vw;
                    }
                }
            }

            .u-table-container{
                position: relative;
                font-size: 16px;

                .color{
                    color: #3164f5;
                }

                :deep(.el-table__header-wrapper) {
                    .cell {
                        font-weight: 400;
                    }
                }

                :deep(.el-table__body-wrapper) {
                    font-weight: bold;

                    .cell {
                        font-weight: bold;
                    }
                }

                .table-last-row{
                    position: relative;
                    top: -1px;
                    width: 100%;
                    display: flex;

                    >div{
                        flex: 1;
                        padding: 8px 12px;
                        border-right: 1px solid var(--el-border-color-lighter);

                        span{
                            margin: 0 5px;
                        }
                    }
                }
            }
        }

        .footer-container{
            position: relative;
            bottom: -5px;
            left: -20px;
            width: calc(100% + 40px);
            padding: 12px 4%;
            margin-top: 2vh;
            box-sizing: border-box;
            display: flex;
            align-items: center;
            justify-content: space-between;
            font-size: 16px;
            box-shadow: 0px -4px 4px 0px #d6d6d6;

            .left{
                position: relative;
                display: flex;
                align-items: center;

                .product-option{
                    position: relative;
                    display: flex;
                    align-items: center;
                    margin-right: 10px;

                    .version{
                        background-color: #3164f5;
                        padding: 4px 10px;
                        color: #fff;
                        border-radius: 4px;
                        margin: 0 10px;
                        font-size: 14px;
                    }

                    .border{
                        position: relative;
                        border: 1px solid #e8e8e8;
                        padding: 8px 20px;
                        border-radius: 3px;
                    }
                }
            }

            .right{
                display: flex;
                align-items: center;

                .total-money{
                    font-size: 15px;
                    font-weight: bold;

                    span{
                        color: orange;
                        margin: 0 5px;
                    }
                }

                .btn{
                    background-color: #0052d9;
                    color: #ffffff;
                    padding: 8px 20px;
                    text-align: center;
                    border-radius: 4px;
                    cursor: pointer;
                    margin-left: 1vw;
                    font-size: 14px;
                }
            }
        }
    }
</style>