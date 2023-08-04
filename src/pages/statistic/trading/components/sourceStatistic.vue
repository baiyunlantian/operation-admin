<template>
    <div class="source-container u-m-t-20 u-p-b-20">
        <TitleBox title="收益来源构成" @getData="handleGetSourceStatistic" @export="handleExport"/>

        <div class="chart-container bg-fff u-p-b-20">

            <div  class="echarts-container">
                <div v-show="echartsData.length > 0" class="echarts-ref" ref="echartsRef"></div>
                <div v-show="echartsData.length === 0" class="empty-text">暂无数据</div>
            </div>

            <el-table class="table-container" :data="tableData" border>
                <el-table-column v-for="(item, index) in tableColumnConfig" :key="index"
                                 :prop="item.prop"
                                 :label="item.label"
                                 :width="item.width"
                >
                    <template #default="{ row, column, $index }">
                        <div class="custom-cell">{{ formatTableCell(row, item.prop) }}</div>
                    </template>
                </el-table-column>
            </el-table>

        </div>
    </div>

</template>

<script setup>
  import {reactive, ref, onMounted, computed, watch, getCurrentInstance, onBeforeUnmount} from 'vue';
  import API from '../api';
  import * as echarts from 'echarts';
  import TitleBox from './titleBox';
  import ExportExcel from "@/utils/exportExcel";
  import { setTimeEscalation } from "@/assets/js/utils";

  const setTimeEscalationClone = setTimeEscalation();
  const { proxy } = getCurrentInstance()

  const startDate = ref('')
  const echartsRef = ref(null)
  const echartsData = ref([])
  const colors = ref(['#91cc75', '#5470c6'])
  const tableData = ref([])
  const tableColumnConfig = ref([
    {label:'', prop:'name'},
    {label:'付款人数', prop:'number'},
    {label:'较前一月', prop:'lastMonthNumberRatio'},
    {label:'付款金额', prop:'incomeAmount'},
    {label:'较前一月', prop:'lastMonthIncomeRatio'},
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
        trigger: 'item'
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
          }
        },
        {
          type: 'pie',
          radius: '50%',
          data: echartsData.value,
          label:{
            position: 'inside',
            fontSize: 14,
            formatter:(obj)=>{
              return obj.data.ratio
            }
          }
        }
      ]
    })

    window.addEventListener('resize', call)
  }
  function call() {
    myChars.resize()
  }

  onBeforeUnmount(() => {
    window.removeEventListener('resize', call)
  })

</script>

<style scoped lang="scss">
    .source-container{
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
            height: 100%;
            display: flex;
            flex-direction: column;
            justify-content: space-evenly;

            .echarts-container{
                height: 60%;

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