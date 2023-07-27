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
                        height="500px"
                        width="100%"
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
    // console.log('获取用户统计图表数据', params)
    let responseData = [
      {
        name: '智文',
        series: [
          {xAxia: '7-11', yAxia: 34},
          {xAxia: '7-12', yAxia: 64},
          {xAxia: '7-13', yAxia: 55},
          {xAxia: '7-14', yAxia: 44},
          {xAxia: '7-15', yAxia: 34},
          {xAxia: '7-16', yAxia: 64},
          {xAxia: '7-17', yAxia: 55},
          {xAxia: '7-18', yAxia: 44},
          {xAxia: '7-19', yAxia: 34},
          {xAxia: '7-20', yAxia: 64},
          {xAxia: '7-21', yAxia: 55},
          {xAxia: '7-22', yAxia: 44},
          {xAxia: '7-23', yAxia: 34},
          {xAxia: '7-24', yAxia: 64},
          {xAxia: '7-25', yAxia: 55},
          {xAxia: '7-26', yAxia: 44},
        ],
      },
      {
        name: '智绘',
        series: [
          {xAxia: '7-11', yAxia: 75},
          {xAxia: '7-12', yAxia: 34},
          {xAxia: '7-13', yAxia: 45},
          {xAxia: '7-14', yAxia: 12},
          {xAxia: '7-15', yAxia: 75},
          {xAxia: '7-16', yAxia: 34},
          {xAxia: '7-17', yAxia: 45},
          {xAxia: '7-18', yAxia: 12},
          {xAxia: '7-19', yAxia: 75},
          {xAxia: '7-20', yAxia: 34},
          {xAxia: '7-21', yAxia: 45},
          {xAxia: '7-22', yAxia: 12},
          {xAxia: '7-23', yAxia: 75},
          {xAxia: '7-24', yAxia: 34},
          {xAxia: '7-25', yAxia: 45},
          {xAxia: '7-26', yAxia: 12},
        ],
      },
      {
        name: '智像',
        series: [
          {xAxia: '7-11', yAxia: 12},
          {xAxia: '7-12', yAxia: 76},
          {xAxia: '7-13', yAxia: 34},
          {xAxia: '7-14', yAxia: 55},
          {xAxia: '7-15', yAxia: 12},
          {xAxia: '7-16', yAxia: 76},
          {xAxia: '7-17', yAxia: 34},
          {xAxia: '7-18', yAxia: 55},
          {xAxia: '7-19', yAxia: 12},
          {xAxia: '7-20', yAxia: 76},
          {xAxia: '7-21', yAxia: 34},
          {xAxia: '7-22', yAxia: 55},
          {xAxia: '7-23', yAxia: 12},
          {xAxia: '7-24', yAxia: 76},
          {xAxia: '7-25', yAxia: 34},
          {xAxia: '7-26', yAxia: 55},
        ],
      },
      {
        name: 'AI ERP',
        series: [
          {xAxia: '7-11', yAxia: 76},
          {xAxia: '7-12', yAxia: 34},
          {xAxia: '7-13', yAxia: 32},
          {xAxia: '7-14', yAxia: 51},
          {xAxia: '7-15', yAxia: 76},
          {xAxia: '7-16', yAxia: 34},
          {xAxia: '7-17', yAxia: 32},
          {xAxia: '7-18', yAxia: 51},
          {xAxia: '7-19', yAxia: 76},
          {xAxia: '7-20', yAxia: 34},
          {xAxia: '7-21', yAxia: 32},
          {xAxia: '7-22', yAxia: 51},
          {xAxia: '7-23', yAxia: 76},
          {xAxia: '7-24', yAxia: 34},
          {xAxia: '7-25', yAxia: 32},
          {xAxia: '7-26', yAxia: 51},
        ],
      },
    ];
    // API.getUserStatistic(params).then(res=>{
    //   if (res.code == '0') {
    //     const { statisticData, ...other } = res.data
    //     userEchartsDataList.value = statisticData
    //     Object.assign(leftData, other)
    //   }
    // })

    // formatLineData(responseData)
  }

  // 格式化数据
  function formatLineData(list) {
    let _xAxisData = [], _seriesData = [];
    list.forEach((items, index)=>{
      let seriesItem = {type:'line', name:items.name, data:[], smooth: true};

      (items.series || []).forEach((item, itemIndex)=>{
        if (index === 0) {
          _xAxisData.push(item.xAxia)
        }
        seriesItem['data'].push(item.yAxia)
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