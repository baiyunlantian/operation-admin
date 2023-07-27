<template>
    <div class="source-container u-m-t-20 u-p-b-20">
        <TitleBox title="收益来源构成" @getData="handleGetSourceStatistic" @export="handleExport"/>

        <div class="chart-container bg-fff u-p-b-20">

            <el-row :gutter="0" justify="center" class="echarts-container">
                <el-col :span="20">
                    <div class="echarts-ref" ref="echartsRef"></div>
                </el-col>
            </el-row>

            <el-row :gutter="0" justify="center">
                <el-col :span="20">
                    <div class="right">

                        <el-row  :gutter="0" class="table-container" justify="center">
                            <el-col :span="20" :offset="1">
                                <el-table class="table" :data="tableData" border style="width: 100%">
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
                            </el-col>
                        </el-row>

                    </div>
                </el-col>
            </el-row>

        </div>
    </div>

</template>

<script setup>
  import {reactive, ref, onMounted, computed, watch, getCurrentInstance} from 'vue';
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
  const dateScopeType = ref(1)
  const colors = ref(['#91cc75', '#5470c6'])
  const tableData = ref([])
  const tableColumnConfig = ref([
    {label:'', prop:'name'},
    {label:'付款人数', prop:'number'},
    {label:'较前一月', prop:'lastMonthIncome'},
    {label:'付款金额', prop:'incomeAmount'},
    {label:'较前一月', prop:'lastMonthNumber'},
  ])

  function formatTableCell(row, prop) {
    let text = '', val = row[prop]
    switch (prop) {
      case 'incomeAmount':
        text = `￥${val}`;
        break;
      default:
        text = val;
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
    console.log('收益来源构成统计', params)
    API.getDataSourcesStatistic(params).then(res=>{
      if (res.code == '0') {
        tableData.value = res.data;
      }
    })
  }

  function echartsInit() {
    const myChars = echarts.init(echartsRef.value)
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
            formatter:'{d}%'
          }
        }
      ]
    })
  }

  watch(tableData, (newVal, oldVal) => {
      echartsData.value = newVal.map(item=>{
        return {value:item.number, name:item.name}
      })

      setTimeout(() => {
        echartsInit()
      }, 100)
    },
    {deep: true}
  )

</script>

<style scoped lang="scss">
    .source-container{
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

            .echarts-container{
                height: 600px;

                .el-col{
                    height: 100%;

                    .echarts-ref{
                        height: 100%;
                    }
                }

            }

            .right{
                height: 100%;
                display: flex;
                flex-direction: column;
                justify-content: center;

                .header-box{
                    position: relative;

                    .item{
                        display: flex;
                        align-items: center;

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

</style>