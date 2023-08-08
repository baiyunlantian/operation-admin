<template>
    <div class="client-container u-m-t-20">
        <TitleBox title="新老客户交易构成" @getData="handleGetClientStatistic" @export="handleExport"/>

        <div class="chart-container bg-fff">

            <el-row :gutter="0" class="echarts-container">
                <el-col :span="12" :offset="1">
                    <div v-show="echartsData.length > 0" class="echarts-ref" ref="echartsRef"></div>
                    <div v-show="echartsData.length === 0" class="empty-text">暂无数据</div>
                </el-col>

                <el-col :span="8" :offset="1">
                    <div class="right">
                        <el-row :gutter="0" class="header-box" justify="center">
                            <el-col :span="10" :offset="1" class="item">
                                <span class="point" :style="{backgroundColor: colors[0]}"></span>
                                <span class="text">新客户</span>
                            </el-col>
                            <el-col :span="10" :offset="1" class="item">
                                <span class="point" :style="{backgroundColor: colors[1]}"></span>
                                <span class="text">老客户</span>
                            </el-col>
                        </el-row>

                        <el-table class="table" :data="tableData" border style="width: 100%">
                            <el-table-column v-for="(item, index) in tableColumnConfig" :key="index"
                                             :prop="item.prop"
                                             :label="item.label"
                                             :width="item.width"
                            >
                                <template #default="{ row, column, $index }">
                                    <div class="custom-cell" v-if="item.insertSlot">{{ handleJudgeIsIncrease(row[item.prop]) === true ? '&#8593;' : '&#8595;' }}{{ formatTableCell(row, item.prop) }}</div>
                                    <div class="custom-cell" v-else>{{ formatTableCell(row, item.prop) }}</div>
                                </template>
                            </el-table-column>
                        </el-table>

                    </div>
                </el-col>
            </el-row>

        </div>
    </div>

</template>

<script setup>
  import {ref, watch, getCurrentInstance, onBeforeUnmount} from 'vue';
  import API from '../api';
  import * as echarts from 'echarts';
  import TitleBox from './titleBox';
  import ExportExcel from "@/utils/exportExcel";
  import { setTimeEscalation } from "@/assets/js/utils";

  const setTimeEscalationClone = setTimeEscalation();
  const { proxy } = getCurrentInstance()

  const echartsRef = ref(null)
  const echartsData = ref([])
  const colors = ref(['#91cc75', '#5470c6'])
  const tableData = ref([])
  const tableColumnConfig = ref([
    {label:'', prop:'name'},
    {label:'消费金额', prop:'incomeAmount'},
    {label:'较前一月', prop:'lastMonthIncomeRatio', insertSlot:true},
    {label:'付款人数', prop:'number'},
    {label:'较前一月', prop:'lastMonthNumberRatio', insertSlot:true},
  ])
  const startDate = ref(null)

  function handleExport() {
    let _tableColumnConfig = [...tableColumnConfig.value]
    _tableColumnConfig[0] = {label: startDate.value, prop: 'name'}
    setTimeEscalationClone(() => {ExportExcel(tableData.value, _tableColumnConfig, '新老客户交易构成')},
      () => {proxy.$message.warning('操作过于频繁！')})
  }

  function formatTableCell(row, prop) {
    let text = '';
    switch (prop) {
      case 'incomeAmount':
        text = row[prop] > 0 ? `￥${row[prop]}` : 0;
        break;
      case 'number':
        text = row[prop] || 0;
        break;
       default:
         text = row[prop] ? row[prop] : '/';
    }

    return text;
  }

  // 获取新老客户交易构成数据
  function handleGetClientStatistic(params) {
    startDate.value = params.startDate

    API.getNewAndOldStatistic(params).then(res=>{
      if (res.code == '0') {
        let list = [], echarts = []

        res.data.forEach(item=>{
          const {number, name, incomeAmount, lastMonthIncomeRatio, lastMonthNumberRatio, ratio} = item
          if (incomeAmount > 0 || number > 0 || lastMonthIncomeRatio || lastMonthNumberRatio) {
            list.push(item)
          }

          if (number > 0) {
            echarts.push({value: incomeAmount, name, ratio})
          }
        })

        tableData.value = list
        echartsData.value = echarts

        setTimeout(() => {
          echartsInit()
        }, 100)
      }
    })
  }

  let myChars = null
  function echartsInit() {
    if (myChars === null) {
      myChars = echarts.init(echartsRef.value)
    }
    myChars.clear(); // 清除画布内容
    myChars.setOption({
      color:colors.value,
      // 鼠标移动到数据项时显示
      tooltip: {
        trigger: 'item',
        formatter: (obj) => {
          const {value, name, ratio} = obj.data
          return `${name}<br />消费金额：${value}元<br />占比：${ratio}`
        }
      },
      series: [
        {
          type: 'pie',
          radius: '50%',
          data: echartsData.value,
          labelLine:{
            length:50,
            length2:70
          }
        }
      ]
    })

    window.addEventListener('resize', call)
  }
  function call() {
    myChars.resize()
  }

  // 判断增长还是下降
  function handleJudgeIsIncrease(value) {
    let flag = true
    if (value && value.indexOf('-') === 0) {
      flag = false
    }

    return flag
  }

  onBeforeUnmount(() => {
    window.removeEventListener('resize', call)
  })

</script>

<style scoped lang="scss">
    .client-container{
        height: 55%;
        min-height: 300px;

        .title{
            display: flex;
            align-items: center;

        }

        .btns{
            flex: 1;
            display: flex;
            justify-content: flex-end;
        }

        .select-month{
            position: relative;

            ::v-deep .picker-month{
                width: 130px !important;
            }
        }

        .chart-container{
            position: relative;
            height: 92%;

            .echarts-container{
                height: 100%;
                width: 100%;
                display: flex;
                align-items: center;

                .el-col{
                    height: 84%;

                    .echarts-ref{
                        height: 100%;
                    }

                    .empty-text{
                        height: 100%;
                        display: grid;
                        place-items: center;
                        font-size: 16px;
                    }
                }

                .right{
                    overflow: auto;
                    max-height: 100%;
                    height: 100%;
                    display: flex;
                    flex-direction: column;
                    justify-content: space-evenly;

                    .header-box{
                        position: relative;

                        .item{
                            display: flex;
                            align-items: center;
                            justify-content: center;
                            margin-bottom: 10%;

                            .point{
                                display: inline-block;
                                height: 20px;
                                width: 20px;
                                border-radius: 50%;
                                border: 1px solid #b3afaf;
                                margin-right: 15px;
                            }

                            .text{
                                position: relative;
                            }
                        }
                    }

                    .table-container{
                        position: relative;

                        ::v-deep .el-table{
                            position: relative;

                            .el-table__header-wrapper{
                                .el-table__cell{
                                    background-color: #f7f7f7;
                                    text-align: center;
                                }
                            }

                            .custom-cell{
                                text-align: center;
                            }
                        }
                    }
                }
            }
        }
    }

</style>