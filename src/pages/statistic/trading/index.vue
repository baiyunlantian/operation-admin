<template>
    <div class="trading-container">

        <div class="title-box u-m-t-20 header-operate">
            <div class="text">收益总览</div>

            <div class="btns">
                <div class="select-month u-m-l-10">
                    <el-select v-model="productType" class="m-2" @change="handleGetTotalUserIncome">
                        <el-option
                                v-for="item in platformTypeList"
                                :key="item.key"
                                :label="item.label"
                                :value="item.key"
                        />
                    </el-select>
                </div>
            </div>
        </div>
        <div class="statistic-container bg-fff">
            <div class="popover-container">
                <!-- <Popover v-model="productType" /> -->
            </div>

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

    </div>
</template>

<script setup>
  import {computed, onMounted, reactive, ref} from 'vue';
  import API from './api';
  import Trading from '../components/lineStatistic';
  import Client from './components/clientStatistic';
  import Earnings from './components/earningsStatistic';
  import Source from './components/sourceStatistic';
  import Popover from '@/components/Popover';
  import { useStore } from 'vuex';

  const store = useStore()

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
    let params = {
      platformType: productType.value
    }

    API.getTotalUserIncome(params).then(res=>{
      if (res.code == '0') {
        Object.assign(totalStatisticData, res.data)
      }
    })
  }

  const productType = ref(0)

  const platformTypeList = computed(() => {
    let arr = [{label:'全部', key:0}], list = store.getters['platformType/list'];
    if (Array.isArray(list)) {
      arr = arr.concat(list)
    }

    return  arr
  })

  onMounted(() => {
    handleGetTotalUserIncome();
  })
</script>

<style scoped lang="scss">
    .trading-container{
        position: relative;

        .header-operate {
            position: relative;
            display: flex;
            align-items: center;
            justify-content: space-between;

            .btns{
                flex: 1;
                display: flex;
                align-items: center;
                justify-content: flex-end;

                .sort-container{
                    margin-right: 20px;

                    :deep(.text){
                        color: #ffffff;
                    }
                }

                ::v-deep .el-select{
                    width: 170px;
                    margin-left: 10px;
                }
            }
        }

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
                    font-size: 28px;
                    color: red;
                }
            }
        }

    }
</style>