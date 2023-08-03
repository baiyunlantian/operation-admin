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
    {label: '本周收益', prop: 'currentWeekIncomeAmount'},
    {label: '本月收益', prop: 'currentMonthIncomeAmount'},
    {label: '总收益', prop: 'totalIncomeAmount'},
  ])
  const totalStatisticData = reactive({
    todayIncomeAmount: 0,
    yesterdayIncomeAmount: 0,
    currentMonthIncomeAmount: 0,
    totalIncomeAmount: 0,
  })
  const statisticData = ref([])
  const leftData = reactive({
    currentMonth: 0,
    monthRatio: '0',
    currentWeek: 0,
    weekRatio: '0',
    total: 0,
  })

  // 获取交易收益金额统计数据
  function handleGetTradingStatisticData(params) {
    API.getUserIncomeStatistic(params).then(res=>{
      if (res.code == '0' && Object.keys(res.data).length != 0) {
        const { statisticsData, ...other } = res.data
        statisticData.value = statisticsData
        Object.assign(leftData, {...other, currentMonth: other.currentMonthIncomeAmount, currentWeek: other.currentWeekIncomeAmount})
      }
    })
  }

  // 获取收益总览信息
  function handleGetTotalUserIncome() {
    API.getTotalUserIncome().then(res=>{
      if (res.code == '0') {
        Object.assign(totalStatisticData, res.data)
      }
    })
  }


  onMounted(() => {
    handleGetTotalUserIncome();
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