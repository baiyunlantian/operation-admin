<template>
    <div class="source-container u-m-t-20 u-p-b-20">
        <TitleBox title="收益来源构成" @getData="handleGetSourceStatistic" @export="handleExport"/>

        <div class="chart-container bg-fff u-p-b-20">

            <div  class="echarts-container">
                <Echarts ref="echartsRef" :option-config="echartsOptions" :is-empty="echartsData.length === 0"/>
            </div>

            <el-table class="table-container" :data="tableData" border>
                <el-table-column v-for="(item, index) in tableColumnConfig" :key="index"
                                 :prop="item.prop"
                                 :label="item.label"
                                 :width="item.width"
                >
                    <template #default="{ row, column, $index }">
                        <div class="custom-cell" v-if="item.insertSlot">
                            {{ row[item.prop] ? handleJudgeIsIncrease(row[item.prop]) === true ? '&#8593;' : '&#8595;' : '' }}
                            {{ formatTableCell(row, item.prop) }}
                        </div>
                        <div class="custom-cell" v-else>{{ formatTableCell(row, item.prop) }}</div>
                    </template>
                </el-table-column>
            </el-table>

        </div>
    </div>

</template>

<script setup>
  import { ref, getCurrentInstance } from 'vue';
  import API from '../api';
  import TitleBox from './titleBox';
  import Echarts from '@/components/Echarts';
  import ExportExcel from "@/utils/exportExcel";
  import { setTimeEscalation } from "@/assets/js/utils";

  const setTimeEscalationClone = setTimeEscalation();
  const { proxy } = getCurrentInstance()

  const startDate = ref('')
  const echartsRef = ref(null)
  const echartsData = ref([])
  const echartsOptions = ref({})
  const colors = ref(['#91cc75', '#5470c6'])
  const tableData = ref([])
  const tableColumnConfig = ref([
    {label:'', prop:'name'},
    {label:'付款人数', prop:'number'},
    {label:'较前一月', prop:'lastMonthNumberRatio', insertSlot:true},
    {label:'付款金额', prop:'incomeAmount'},
    {label:'较前一月', prop:'lastMonthIncomeRatio', insertSlot:true},
  ])

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

  function handleExport() {
    let _tableColumnConfig = [...tableColumnConfig.value], _tableData = [...tableData.value], totalNumber = 0, totalIncomeAmount = 0;
    _tableColumnConfig[0] = {label: startDate.value, prop: 'name'}
    _tableColumnConfig.splice(1, 0, {label: '占比', prop: 'ratio'})

    _tableData.forEach(item=>{
      totalNumber += item.number
      totalIncomeAmount += item.incomeAmount
    })

    _tableData.push({
      name: '汇总',
      ratio: '100%',
      number: totalNumber,
      incomeAmount: totalIncomeAmount,
      lastMonthNumber: '/',
      lastMonthIncome: '/',
    })

    setTimeEscalationClone(() => {ExportExcel(_tableData, _tableColumnConfig, '收益来源构成')},
      () => {proxy.$message.warning('操作过于频繁！')})
  }


  // 获取收益来源构成统计数据
  function handleGetSourceStatistic(params) {
    startDate.value = params.startDate
    API.getDataSourcesStatistic(params).then(res=>{
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
        echartsInit()
      }
    })
  }

  function echartsInit() {
    echartsOptions.value = {
      color:colors.value,
      // 鼠标移动到数据项时显示
      tooltip: {
        trigger: 'item',
        formatter: (obj) => {
          const {value, name, ratio} = obj.data
          return `${name}<br />付款金额：${value}元<br />占比：${ratio}`
        }
      },
      legend: {
        orient: 'vertical',
        right: '10%',
        bottom:'40%',
        itemGap:20
      },
      series: [
        {
          type: 'pie',
          radius: '50%',
          data: echartsData.value,
          labelLine:{
            length:50,
            length2:70
          },
        }
      ]
    }

    setTimeout(() => {
      echartsRef.value.init()
    }, 100)
  }

  // 判断增长还是下降
  function handleJudgeIsIncrease(value) {
    let flag = true
    if (value && value.indexOf('-') === 0) {
      flag = false
    }

    return flag
  }

</script>

<style scoped lang="scss">
    .source-container{
        height: 60%;
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
            height: 100%;
            display: flex;
            flex-direction: column;

            .echarts-container{
                flex: 1;

            }

            .table-container{
                margin: 0 auto;
                width: 80%;

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

</style>