<template>
    <el-row class="chart-container bg-fff" :gutter="0" justify="center">

        <el-col :span="22" class="echarts-container">
            <div class="top">
                <div style="margin-right: 2%">
                    <Popover v-model="params.sort" :options="sortOptions">
                        <template v-slot:popover-icon>
                            <el-icon class="u-cursor" style="font-size: 16px; color: #6ea3ff"><Sort /></el-icon>
                        </template>
                    </Popover>
                </div>


                <Popover v-model="params.promotion" :options="selectionList">
                    <template v-slot:popover-icon>
                        <span></span>
                    </template>
                </Popover>

                <div class="time-range">
                    <div v-for="(item, index) in timeRangeTags" :key="index"
                         :class="[params.dateScopeType === item.key ? 'active' : '', 'u-cursor u-m-r-10']"
                         @click="handleClickTimeTag(item.key)"
                    >
                        {{ item.label }}
                    </div>
                </div>
            </div>

            <div class="echarts-ref" ref="echartsRef"></div>
<!--            <div v-show="echartsData.length === 0" class="empty-text">暂无数据</div>-->

            <div class="check-detail">查看详情</div>
        </el-col>

    </el-row>
</template>

<script setup>
  import {watch, onBeforeUnmount, onMounted, reactive, ref} from 'vue';
  import API from '../api';
  import * as echarts from "echarts";
  import Popover from '@/components/productTypePopover';

  const echartsData = ref([])
  const echartsRef = ref(null)
  const searchType = ref('0')
  const selectionList = ref([
    {label:'按推广付费金额', key:'0'},
    {label:'按推广付费人数', key:'1'},
    {label:'按推广人数', key:'2'},
  ])
  const timeRangeTags = reactive([
    {label:'今日', key:'1'},
    {label:'本周', key:'2'},
    {label:'本月', key:'3'},
  ])
  const sortOptions = ref([
    {label: '降序', key: 'desc'},
    {label: '升序', key: 'asc'},
  ])
  const params = reactive({
    sort:'desc',
    promotion: '0',
    dateScopeType: '1'
  })


  let myChars = null
  // 初始化
  function echartsInit() {
    if (myChars === null) {
      myChars = echarts.init(echartsRef.value)
    }
    myChars.clear(); // 清除画布内容
    let option = {
      color:['#5470c6', '#91cc75', '#fac858'],
      legend: {
        show: true,
        left: 20
      },
      // 鼠标移动到数据项时显示
      tooltip: {
        trigger: 'axis',
      },
      xAxis: {
        type: 'value',
        boundaryGap: [0, 0.01]
      },
      yAxis: {
        type: 'category',
        data: ['Brazil', 'Indonesia', 'USA', 'India', 'China', 'Russia', 'World']
      },
      series: [
        {
          name: '2011',
          type: 'bar',
          data: [18203, 23489, 29034, 104970, 131744, 630230, 354113]
        },
        {
          name: '2012',
          type: 'bar',
          data: [19325, 23438, 31000, 121594, 134141, 681807, 432121]
        },
        {
          name: '2013',
          type: 'bar',
          data: [20200, 27235, 107789, 456210, 213125, 421807, 321421]
        }
      ]
    };
    myChars.setOption(option)
    window.addEventListener('resize', call)
  }

  function call() {
    myChars.resize()
  }

  // 点击图表上的日期tag
  function handleClickTimeTag(tagValue) {
    params.dateScopeType = tagValue
  }


  // 获取收益统计图表数据
  function handleGetEarningsStatistic(params) {
    API.getIncomeStatistics(params).then(res=>{
      if (res.code == '0') {
        echartsData.value = res.data
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

  watch(params, (newVal) => {
    console.log('watch params', newVal)
  }, {deep:true})

  onMounted(() => {
    echartsInit()
  })

  onBeforeUnmount(() => {
    window.removeEventListener('resize', call)
  })

</script>

<style scoped lang="scss">
    .chart-container{
        position: relative;
        height: 61%;

        .echarts-container{
            display: flex;
            flex-direction: column;
            margin: 1% 0;

            .top{
                height: 30px;
                display: flex;
                justify-content: flex-end;
                align-items: center;

                .time-range{
                    display: flex;
                    align-items: center;
                    margin-left: 5%;

                    .active{
                        color: #fff;
                        background-color: #409EFF;
                        padding: 5px 10px;
                        border-radius: 5px;
                    }
                }
            }

            .el-col {
                height: 83%;
            }

            .empty-text{
                height: 100%;
                display: grid;
                place-items: center;
                font-size: 16px;
            }

            .echarts-ref{
                position: relative;
                height: calc(100% - 30px);
            }

            .check-detail{
                text-align: end;
                color: #409EFF;
                cursor: pointer;
                font-size: 16px;
            }
        }
    }
</style>