<template>
    <div class="chart-container bg-fff">
        <div class="search-container">
            <LeftStatistic :statistic-config="leftStatisticConfig" :left-data="leftData"/>

            <RightSearch @getData="handleGetUserStatistic"/>
        </div>

        <div class="total-statistic">共计{{ leftData.total }}人</div>

        <el-row :gutter="0"  justify="center" class="echarts-container">
            <el-col :span="20">
                <MutiLine
                        x-axis-end-text="日期/天"
                        y-axis-end-text="用户/人"
                        :x-axis-data="xAxisData"
                        :line-data="lineData"
                />
            </el-col>
        </el-row>

    </div>
</template>

<script setup>
  import { reactive, ref } from 'vue';
  import API from '../api';
  import MutiLine from '@/components/Echarts/muti-line';
  import RightSearch from './rightSearch';
  import LeftStatistic from './leftStatistic';

  const leftStatisticConfig = reactive([
    {title:'本月用户总数', subText:'同比上月', countProp:'currentMonthUserCount', ratioProp:'monthRatio'},
    {title:'本周用户数量', subText:'同比上周', countProp:'currentWeekUserCount', ratioProp:'weekRatio'}
  ])
  const leftData = reactive({})
  const userEchartsDataList = ref([])
  const lineData = ref([])
  const xAxisData = ref([])

  // 获取用户统计图表数据
  function handleGetUserStatistic(params) {
    API.getUserStatistic(params).then(res=>{
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
            height: 100%;
            width: 100%;
            display: flex;
            align-items: center;

            .el-col {
                height: 83%;
            }
        }
    }
</style>