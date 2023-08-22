<template>
    <div class="earningStatistic-container">
        <div class="title-box u-m-t-20 header-operate">
            <div class="text">用户统计</div>

            <div class="btns">
                <div class="select-month u-m-l-10">
                    <el-select v-model="productType" class="m-2" @change="handleGetEarningsStatistic">
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
                        :option-config="echartsOptions"
                />
                <div v-show="lineData.length === 0" class="empty-text">暂无数据</div>

                <div class="total-statistic">共收益￥{{ leftData.total }}</div>
            </el-col>

        </el-row>
    </div>
</template>

<script setup>
  import {computed, reactive, ref} from 'vue';
  import API from '../api';
  import MutiLine from '@/components/Echarts/muti-line';
  import RightSearch from './rightSearch';
  import LeftStatistic from './leftStatistic';
  import {useStore} from "vuex";

  const store = useStore()

  const leftStatisticConfig = reactive([
    {title:'本月收益总额', subText:'同比上月', countProp:'currentMonthIncomeAmount', ratioProp:'monthRatio'},
    {title:'本周收益总额', subText:'同比上周', countProp:'currentWeekIncomeAmount', ratioProp:'weekRatio'}
  ])
  const leftData = reactive({})
  const userEchartsDataList = ref([])
  const lineData = ref([])
  const xAxisData = ref([])
  const echartsOptions = reactive({
    tooltip:{}
  })
  const productType = ref(0)

  // 获取收益统计图表数据
  function handleGetEarningsStatistic(param) {
    let params = {
      ...param,
      productType: productType.value
    }

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
    let tooltip = {trigger: 'axis', formatter:'{b}<br />'};
    list.forEach((items, index)=>{
      let seriesItem = {type:'line', name:items.name, data:[], smooth: true};
      tooltip.formatter += `{a${index}}：{c${index}}元<br />`;

      (items.series || []).forEach((item, itemIndex)=>{
        if (index === 0) {
          _xAxisData.push(item.xAxis)
        }
        seriesItem['data'].push(item.yAxis)
      })

      _seriesData.push(seriesItem)
    })

    echartsOptions.tooltip = tooltip;
    xAxisData.value = _xAxisData
    lineData.value = _seriesData
  }

  const platformTypeList = computed(() => {
    let arr = [{label:'全部', key:0}], list = store.getters['platformType/list'];
    if (Array.isArray(list)) {
      arr = arr.concat(list)
    }

    return  arr
  })

</script>

<style scoped lang="scss">
    .earningStatistic-container{
        position: relative;
        height: 51%;

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
    }

    .chart-container{
        position: relative;
        height: calc(100% - 41px);

        .search-container{
            display: flex;
            width: 100%;
            padding: 1% 0 1% 1%;
            max-height: 90%;
            overflow: auto;
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