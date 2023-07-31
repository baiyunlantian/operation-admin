<template>
    <div class="chart-container bg-fff">
        <div class="search-container">
            <LeftStatistic :statistic-config="leftStatisticConfig" :left-data="leftData"/>

            <RightSearch @getData="handleGetEarningsStatistic"/>
        </div>

        <div class="total-statistic">共收益￥{{ leftData.total }}</div>

        <el-row :gutter="0"  justify="center" class="echarts-container">
            <el-col :span="20">
                <MutiLine
                        height="500px"
                        width="100%"
                        x-axis-end-text="日期/天"
                        :x-axis-data="xAxisData"
                        :line-data="lineData"
                />
            </el-col>
        </el-row>

    </div>
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

        .search-container{
            position: absolute;
            display: flex;
            align-items: flex-start;
            width: 100%;
            padding: 20px 0 20px 20px;
            box-sizing: border-box;

        }

        .total-statistic{
            position: absolute;
            bottom: 30px;
            right: 20%;
            font-size: 16px;
        }

        .echarts-container{
            height: 600px;

            .el-col{
                display: flex;
                align-items: center;
            }

            .echarts-ref{
                height: 500px;
                width: 100%;
            }
        }
    }
</style>