<template>
    <div class="trading-container">

        <div class="title title-box">收益总览</div>
        <div class="statistic-container bg-fff">
            <el-row class="w-100" :gutter="0">
                <el-col v-for="(item, index) in totalStatisticConfig"  :span="5" :offset="1"  :key="index" class="item">
                    <div class="value">{{`￥${totalStatisticData[item.prop]}`}}</div>
                    <div class="desc">{{item.label}}</div>
                </el-col>
            </el-row>
        </div>

        <Trading
                statistic-type="trading"
                :statistic-data="statisticData"
                :left-data="leftData"
                :total-statistic="leftData.total"
                @update="handleGetTradingStatisticData"
        />
        <Client />
        <Earnings />
        <Source />

<!--        <BottomBox />-->

    </div>
</template>

<script setup>
  import {onMounted, reactive, ref} from 'vue';
  import API from './api';
  import Trading from '../components/lineStatistic';
  import Client from './components/clientStatistic';
  import Earnings from './components/earningsStatistic';
  import Source from './components/sourceStatistic';
  import BottomBox from '@/components/bottom-box';

  const totalStatisticConfig = reactive([
    {label: '今日收益', prop: 'todayIncomeAmount'},
    {label: '本周收益', prop: 'yesterdayIncomeAmount'},
    {label: '本月收益', prop: 'currentMonthIncomeAmount'},
    {label: '总收益', prop: 'totalIncomeAmount'},
  ])
  const totalStatisticData = reactive({
    todayIncomeAmount:240,
    yesterdayIncomeAmount:324,
    currentMonthIncomeAmount:400,
    totalIncomeAmount:600,
  })
  const statisticData = ref([])
  const leftData = reactive({
    currentMonth: 1000,
    monthRatio: '-10%',
    currentWeek: 251,
    weekRatio: '+10%',
    total: 1251,
  })

  // 获取交易收益金额统计数据
  function handleGetTradingStatisticData(params) {
    // console.log('handleGetTradingStatisticData', params)
    let responseData = [
      {
        name: '智文',
        series: [
          {xAxia: '7-21', yAxia: 34},
          {xAxia: '7-23', yAxia: 64},
          {xAxia: '7-25', yAxia: 55},
          {xAxia: '7-27', yAxia: 44},
        ],
      },
      {
        name: '智绘',
        series: [
          {xAxia: '7-21', yAxia: 75},
          {xAxia: '7-23', yAxia: 34},
          {xAxia: '7-25', yAxia: 45},
          {xAxia: '7-27', yAxia: 12},
        ],
      },
      {
        name: '智像',
        series: [
          {xAxia: '7-21', yAxia: 12},
          {xAxia: '7-23', yAxia: 76},
          {xAxia: '7-25', yAxia: 34},
          {xAxia: '7-27', yAxia: 55},
        ],
      },
      {
        name: 'AI ERP',
        series: [
          {xAxia: '7-21', yAxia: 76},
          {xAxia: '7-23', yAxia: 34},
          {xAxia: '7-25', yAxia: 32},
          {xAxia: '7-27', yAxia: 51},
        ],
      },
    ];

    // API.getUserIncomeStatistic(params).then(res=>{
    //   if (res.code === '0') {
    //     const { statisticData, ...other } = res.data
    //     statisticData.value = statisticData
    //     leftData = {
    //       ...other,
    //       currentMonth: other.currentMonthIncomeAmount,
    //       currentWeek: other.currentWeekIncomeAmount,
    //     }
    //   }
    // })

    statisticData.value = responseData;
  }

  // 获取收益总览信息
  function handleGetTotalUserIncome() {
    API.getTotalUserIncome().then(res=>{
      if (res.code === '0') {
        totalStatisticData = res.data
      }
    })
  }


  onMounted(() => {
    // handleGetTotalUserIncome();
    handleGetTradingStatisticData({productType:0});
  })
</script>

<style scoped lang="scss">
    .trading-container{
        position: relative;

        .statistic-container{
            position: relative;
            height: 125px;

            .w-100{
                width: 100%;
            }

            .item{
                display: flex;
                flex-direction: column;
                align-items: center;
                justify-content: center;
                height: 120px;

                .desc{
                    color: gray;
                    font-size: 16px;
                }

                .value{
                    font-size: 28px;
                    color: red;
                }
            }
        }

    }
</style>