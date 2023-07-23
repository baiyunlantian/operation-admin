<template>
    <div class="user-statistic-container">

        <div class="title">用户总览</div>
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

        <div class="bottom bg-box"></div>

    </div>
</template>

<script setup>
  import {onMounted, reactive, ref} from 'vue';
  import User from '../components/lineStatistic';
  import Source from './components/sourceStatistic'

  const totalStatisticConfig = reactive([
    {label:'今日新增', prop:'todayNewUserCount'},
    {label:'昨日新增', prop:'yesterdayNewUserCount'},
    {label:'本月新增', prop:'currentMonthNewUserCount'},
    {label:'用户总数', prop:'totalUserCount'},
  ])
  const totalStatisticData = reactive({
    todayNewUserCount:200,
    yesterdayNewUserCount:200,
    currentMonthNewUserCount:400,
    totalUserCount:600,
  })
  const statisticData = ref([])
  const leftData = reactive({
    currentMonth: 1000,
    monthRatio: '-10%',
    currentWeek: 251,
    weekRatio: '+10%',
    total: 256,
  })

  // 获取用户增长情况统计数据
  function handleGetUserStatisticData(params) {
    console.log('handleGetUserStatisticData', params)
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

    statisticData.value = responseData;
  }

  onMounted(() => {
    handleGetUserStatisticData();
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

        .title{
            position: relative;
            background-color: blue;
            padding: 15px;
            border-radius: 5px;
            color: #fff;

            .text{

            }
        }

        .bottom{
            height: 24px;
            width: 100%;
        }

        .bg-box{
            background-color: blue;
            display: inline-block;
        }

    }
</style>