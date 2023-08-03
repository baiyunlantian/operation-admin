<template>
    <el-row class="chart-container bg-fff" :gutter="0">
        <el-col :span="3"  class="search-container">
            <LeftStatistic :statistic-config="leftStatisticConfig" :left-data="leftData"/>
        </el-col>

        <el-col :span="20" class="echarts-container">
            <RightSearch @getData="handleGetEarningsStatistic"/>

            <MutiLine
                    v-show="lineData.length > 0"
                    x-axis-end-text="日期/天"
                    :x-axis-data="xAxisData"
                    :line-data="lineData"
            />
            <div v-show="lineData.length === 0" class="empty-text">暂无数据</div>

            <div class="total-statistic">共收益￥{{ leftData.total }}</div>
        </el-col>

    </el-row>
</template>

<script setup>
  import {reactive, ref } from 'vue';
  import API from '../api';
  import MutiLine from '@/components/Echarts/muti-line';
  import RightSearch from './rightSearch';
  import LeftStatistic from './leftStatistic';

  const leftStatisticConfig = reactive([
    {title:'本月收益总额', subText:'同比上月', countProp:'currentMonthIncomeAmount', ratioProp:'monthRatio'},
    {title:'本周收益总额', subText:'同比上周', countProp:'currentWeekIncomeAmount', ratioProp:'weekRatio'}
  ])
  const leftData = reactive({})
  const userEchartsDataList = ref([])
  const lineData = ref([])
  const xAxisData = ref([])

  // 获取收益统计图表数据
  function handleGetEarningsStatistic(params) {
    API.getIncomeStatistics(params).then(res=>{
      if (res.code == '0') {
        const { statisticsData, ...other } = res.data
        userEchartsDataList.value = statisticsData
        Object.assign(leftData, other)
        formatLineData(statisticsData)
      }
    })
  }

  // 格式化数据
  function formatLineData(list) {
    let _xAxisData = [], _seriesData = [];
    list.forEach((items, index)=>{
      let seriesItem = {type:'line', name:items.name, data:[], smooth: true};

      (items.series || []).forEach((item, itemIndex)=>{
        if (index === 0) {
          _xAxisData.push(item.xAxis)
        }
        seriesItem['data'].push(item.yAxis)
      })

      _seriesData.push(seriesItem)
    })


    xAxisData.value = _xAxisData
    lineData.value = _seriesData
  }

</script>

<style scoped lang="scss">
    .chart-container{
        position: relative;
        height: 51%;

        .search-container{
            display: flex;
            width: 100%;
            padding: 1% 0 1% 1%;
        }

        .total-statistic{
            font-size: 16px;
            text-align: center;
        }

        .echarts-container{
            display: flex;
            flex-direction: column;
            margin: 1% 0;

            .el-col {
                height: 83%;
            }

            .empty-text{
                height: 100%;
                display: grid;
                place-items: center;
                font-size: 16px;
            }
        }
    }
</style>