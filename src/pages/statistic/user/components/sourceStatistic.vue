<template>
    <div class="source-container u-m-t-20 u-m-b-20 u-p-b-20">
        <div class="title title-box">
            <div class="text">用户来源</div>

            <div class="btns">
                <el-button type="default" @click="handleExport">导出数据</el-button>

                <div class="btn-item u-m-l-10">
                    <el-select v-model="dateScopeType" @change="handleSelectChange" class="m-2">
                        <el-option
                                v-for="item in selectOptions"
                                :key="item.value"
                                :label="item.label"
                                :value="item.value"
                        />
                    </el-select>
                </div>

                <div class="select-month u-m-l-10">
                    <el-date-picker
                            class="picker-month"
                            v-model="startDate"
                            :type="dateScopeType === 1 ? 'date' : 'month'"
                            :format="dateScopeType === 1 ? 'YYYY-MM-DD' : 'YYYY-MM'"
                            :value-format="dateScopeType === 1 ? 'YYYY-MM-DD' : 'YYYY-MM'"
                            :clearable="false"
                            @change="dateChange"
                    />
                </div>
            </div>
        </div>

        <div class="chart-container bg-fff u-p-b-20">

            <el-row :gutter="0" justify="center" class="echarts-container">
                <el-col :span="20">
                    <Echarts ref="echartsRef" :option-config="echartsOptions" :is-empty="echartsData.length === 0"/>
                </el-col>
            </el-row>

        </div>
    </div>

</template>

<script setup>
  import { ref, onMounted, computed, getCurrentInstance } from 'vue';
  import API from '../api';
  import dayjs from 'dayjs';
  import ExportExcel from "@/utils/exportExcel";
  import {setTimeEscalation} from "@/assets/js/utils";
  import Echarts from '@/components/Echarts';

  const { proxy } = getCurrentInstance()
  const setTimeEscalationClone = setTimeEscalation();

  const startDate = ref('')
  const echartsRef = ref()
  const echartsOptions = ref({})
  const tableData = ref([])
  const dateScopeType = ref(3)
  const selectOptions = ref([
    {label:'按天统计', value:1},
    {label:'按月统计', value:3},
  ])

  function handleExport() {
    let tableTitle = [{label: startDate.value, prop: 'name'}, {label: '占比', prop: 'ratio'}, {label:'人数(人)', prop: 'number'}]
    let totalNumber = 0;
    tableData.value.forEach(item=>{
      totalNumber += item.number
    })
    let _tableData = tableData.value.concat([{name: '汇总', ratio: '100%', number: totalNumber}])
    setTimeEscalationClone(() => {ExportExcel(_tableData, tableTitle, '用户来源')},
      () => {proxy.$message.warning('操作过于频繁！')})
  }

  // 选择按日/月统计
  function handleSelectChange(value) {
    dateScopeType.value = value
    startDate.value = dayjs(new Date()).format(`YYYY-MM${value === 1 ? '-DD' : ''}`)
    handleGetUserStatistic()
  }

  function dateChange(value) {
    startDate.value = value;
    handleGetUserStatistic()
  }

  // 获取用户来源统计数据
  function handleGetUserStatistic() {
    let params = {
      dateScopeType: dateScopeType.value,
      startDate: startDate.value
    };

    API.getUserSourceStatistic(params).then(res=>{
      if (res.code == '0') {
        tableData.value = res.data
        echartsInit()
      }
    })
  }

  function echartsInit() {
    echartsOptions.value = {
      // 鼠标移动到数据项时显示
      tooltip: {
        trigger: 'item',
        formatter: (obj) => {
          const {value, name, ratio, number} = obj.data
          return `${name}<br />人数：${number}人<br />占比：${ratio}`
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
          }
        }
      ]
    }
    setTimeout(() => {
      echartsRef.value.init()
    }, 100)
  }

  const echartsData = computed(() => {
    let list = []
    tableData.value.forEach(({name, ratio, number})=>{
      let value = ratio.slice(0, ratio.length - 1)
      if (value != '0') {
        list.push({name, value, ratio, number})
      }
    })

    return list
  })

  onMounted(() => {
    startDate.value = dayjs(new Date()).format('YYYY-MM')
    handleGetUserStatistic();
  })

</script>

<style scoped lang="scss">
    .source-container{
        height: 55%;

        .title{
            display: flex;
            align-items: center;

        }

        .btns{
            flex: 1;
            display: flex;
            align-items: center;
            justify-content: flex-end;

            ::v-deep .el-select{
                width: 110px;
            }

            .btn-item{
                position: relative;
            }
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

                .el-col{
                    height: inherit;
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