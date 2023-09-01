<template>
    <div class="settle-account-container">
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
                    <el-checkbox-group v-model="needSeller">
                        <div class="checkbox-item" v-for="(checkbox, index) in checkboxs" :key="index">
                            <el-checkbox v-model="checkbox.value" :label="checkbox.label" />

                            <el-tooltip class="box-item" effect="dark" placement="right" trigger="click">
                                <template v-slot:content>
                                    <div class="tooltip-content">{{checkbox.tooltip}}</div>
                                </template>
                                <template v-slot:default>
                                    <div class="icon border">?</div>
                                </template>
                            </el-tooltip>
                        </div>
                    </el-checkbox-group>
                </div>
                <div class="right">
                    <span>销售名称：网啊</span>
                    <span>联系方式：13800138000</span>
                    <span>企业邮箱：oiwai@qq.com</span>
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
                        <div v-if="item.insertSlot" class="color">{{ row[item.prop] }}</div>
                        <div v-else>{{ row[item.prop] }}</div>
                    </template>
                </el-table-column>

                <template v-slot:append>
                    <div class="table-last-row">
                        <div>&nbsp;</div>
                        <div class="total-count">5</div>
                        <div class="total-money">共计：<span class="color">9999.99</span>元</div>
                    </div>
                </template>
            </el-table>
        </div>

        <div class="footer-container bg-fff box-shadow padding-2-pre u-m-t-10">页脚</div>
    </div>
</template>

<script setup>
  import {reactive, ref} from 'vue';

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
  const needSeller = ref(['1'])
  const checkboxs = ref([
    { label:'需要', value: '1', tooltip:'需要销售' },
    { label:'不需要', value: '0', tooltip:'不需要销售' },
  ])
  const tableColumnConfig = ref([
    { label:'项目名称', prop:'name'},
    { label:'项目数量', prop:'count'},
    { label:'单价（元）', prop:'price', insertSlot: true},
  ])
  const tableData = ref([
    {name:'吗哩呀咔', count:1, price:'513'},
    {name:'sdfsdf', count:1, price:'513'},
    {name:'dfgd', count:1, price:'513'},
    {name:'dfgdf', count:1, price:'513'},
    {name:'werwer', count:1, price:'513'},
    {name:'ertergg', count:1, price:'513'},
  ])

  function f() {

  }
</script>

<style scoped lang="scss">
    .settle-account-container{
        position: relative;

        .border{border: 1px solid #dedede;}
        .box-shadow{box-shadow: 0px 1px 4px 0px #d6d6d6;}

        .main-container{
            padding: 1% 1.5%;
            margin: 0 1%;

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
            position: absolute;
            bottom: -5px;
            left: -20px;
            width: calc(100% + 40px);
            height: 60px;
            line-height: 60px;
            padding: 0 2%;
            box-sizing: border-box;
        }
    }
</style>