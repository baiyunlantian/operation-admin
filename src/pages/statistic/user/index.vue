<template>
    <div class="user-statistic-container">

        <div class="title title-box">用户总览</div>
        <div class="statistic-container bg-fff">
            <div class="popover-container">
                <Popover v-model="productType" />
            </div>

            <el-row class="w-100" :gutter="0">
                <el-col v-for="(item, index) in totalStatisticConfig"  :span="5" :offset="1"  :key="index" class="item">
                    <div class="value">{{totalStatisticData[item.prop]}}</div>
                    <div class="desc">{{item.label}}</div>
                </el-col>
            </el-row>
        </div>

        <User
                statistic-type="user"
                :statistic-data="statisticData"
                :left-data="leftData"
                :total-statistic="leftData.total"
                @update="handleGetUserStatisticData"
        />

        <Source />

<!--        <BottomBox />-->

    </div>
</template>

<script setup>
  import {onMounted, reactive, ref, computed} from 'vue';
  import API from './api';
  import User from '../components/lineStatistic';
  import Source from './components/sourceStatistic'
  import Popover from '@/components/productTypePopover';
  import {useStore} from "vuex";

  const store = useStore()

  const totalStatisticConfig = reactive([
    {label:'今日新增', prop:'todayNewUserCount'},
    {label:'昨日新增', prop:'yesterdayNewUserCount'},
    {label:'本月新增', prop:'currentMonthNewUserCount'},
    {label:'用户总数', prop:'totalUserCount'},
  ])
  const totalStatisticData = reactive({
    todayNewUserCount: 0,
    yesterdayNewUserCount: 0,
    currentMonthNewUserCount: 0,
    totalUserCount: 0,
  })
  const statisticData = ref([])
  const leftData = reactive({
    currentMonth: 0,
    monthRatio: '0',
    currentWeek: 0,
    weekRatio: '0',
    total: 0,
  })

  // 获取用户增长情况统计数据
  function handleGetUserStatisticData(params) {
    // console.log('handleGetUserStatistic', params)
    API.getUserIncreaseStatistic(params).then(res=>{
      if (res.code == '0' && Object.keys(res.data).length != 0) {
        const { statisticsData, ...other } = res.data
        statisticData.value = statisticsData
        Object.assign(leftData, {...other, currentMonth: other.currentMonthUserCount, currentWeek: other.currentWeekUserCount})
      }
    })
  }

  // 获取用户总览信息
  function handleGetTotalUserNumber() {
    API.getTotalUserNumber().then(res=>{
      if (res.code == '0') {
        Object.assign(totalStatisticData, res.data)
      }
    })
  }

  const productType = ref(0)


  onMounted(() => {
    handleGetTotalUserNumber()
  })
</script>

<style scoped lang="scss">
    .user-statistic-container{
        position: relative;

        .statistic-container{
            position: relative;
            height: auto;

            .popover-container{
                padding-left: 2%;
                padding-top: 10px;
                width: auto;
                display: inline-block;
            }

            .w-100{
                width: 100%;
            }

            .item{
                display: flex;
                flex-direction: column;
                align-items: center;
                justify-content: center;
                padding: 20px 0;

                .desc{
                    color: gray;
                    font-size: 16px;
                }

                .value{
                    font-size: 32px;
                    color: red;
                }
            }
        }

    }
</style>