<template>
    <div class="user-statistic-container">

        <div class="title title-box">用户总览</div>
        <div class="statistic-container bg-fff">
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
  import {onMounted, reactive, ref} from 'vue';
  import API from './api';
  import User from '../components/lineStatistic';
  import Source from './components/sourceStatistic'
  import BottomBox from '@/components/bottom-box';

  const totalStatisticConfig = reactive([
    {label:'今日新增', prop:'todayNewUserCount'},
    {label:'昨日新增', prop:'yesterdayNewUserCount'},
    {label:'本月新增', prop:'currentMonthNewUserCount'},
    {label:'用户总数', prop:'totalUserCount'},
  ])
  let totalStatisticData = reactive({
    todayNewUserCount:200,
    yesterdayNewUserCount:200,
    currentMonthNewUserCount:400,
    totalUserCount:600,
  })
  const statisticData = ref([])
  let leftData = reactive({
    currentMonth: 1000,
    monthRatio: '-10%',
    currentWeek: 251,
    weekRatio: '+10%',
    total: 256,
  })

  // 获取用户增长情况统计数据
  function handleGetUserStatisticData(params) {
    // console.log('handleGetUserStatisticData', params)
    let responseData = [
      {
        name:'智文',
        series:[
          {xAxia:'7-21', yAxia:50},
          {xAxia:'7-23', yAxia:88},
          {xAxia:'7-25', yAxia:45},
          {xAxia:'7-27', yAxia:15},
        ],
      },
      {
        name:'智绘',
        series:[
          {xAxia:'7-21', yAxia:14},
          {xAxia:'7-23', yAxia:64},
          {xAxia:'7-25', yAxia:54},
          {xAxia:'7-27', yAxia:33},
        ],
      },
      {
        name:'智像',
        series:[
          {xAxia:'7-21', yAxia:54},
          {xAxia:'7-23', yAxia:87},
          {xAxia:'7-25', yAxia:43},
          {xAxia:'7-27', yAxia:21},
        ],
      },
      {
        name:'AI ERP',
        series:[
          {xAxia:'7-21', yAxia:12},
          {xAxia:'7-23', yAxia:34},
          {xAxia:'7-25', yAxia:77},
          {xAxia:'7-27', yAxia:54},
        ],
      },
    ];

    // console.log('handleGetUserStatistic', params)
    // API.getUserIncreaseStatistic(params).then(res=>{
    //   if (res.code === '0') {
    //     const { statisticData, ...other } = res.data
    //     statisticData.value = statisticData
    //     leftData = {
    //       ...other,
    //       currentMonth: other.currentMonthUserCount,
    //       currentWeek: other.currentWeekUserCount,
    //     }
    //   }
    // })

    statisticData.value = responseData;
  }

  // 获取用户总览信息
  function handleGetTotalUserNumber() {
    API.getTotalUserNumber().then(res=>{
      if (res.code === '0') {
        totalStatisticData = res.data
      }
    })
  }

  onMounted(() => {
    // handleGetTotalUserNumber()
    handleGetUserStatisticData({productType:0});
  })
</script>

<style scoped lang="scss">
    .user-statistic-container{
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
                    font-size: 32px;
                    color: red;
                }
            }
        }

    }
</style>