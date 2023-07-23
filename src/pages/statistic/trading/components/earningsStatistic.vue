<template>
    <div class="earnings-container u-m-t-20">
        <div class="title">
            <div class="text">用户收益分布</div>

            <div class="btns">
                <el-button type="default">导出数据</el-button>
                <el-button :type="selectValue === '2' ? 'default' : 'warning'" @click="handleClickMonth('1')">本月</el-button>
                <el-button :type="selectValue === '1' ? 'default' : 'warning'" @click="handleClickMonth('2')">上月</el-button>
                <div class="select-month u-m-l-10">
                    <el-date-picker
                            class="picker-month"
                            v-model="month"
                            type="month"
                            format="YYYY-MM"
                            value-format="YYYY-MM"
                            @change="dateChange"
                    />
                </div>
            </div>
        </div>

        <div class="chart-container bg-fff">
            <div class="search-container">
            </div>

            <el-row :gutter="0" class="echarts-container">
                <el-col :span="18" :offset="2">
                    <div class="echarts-ref" ref="echartsRef"></div>
                </el-col>
            </el-row>

        </div>
    </div>

</template>

<script setup>
  import { reactive, ref, onMounted, computed, watch } from 'vue';
  import dayjs from 'dayjs';
  import * as echarts from 'echarts';

  const month = ref('')
  const echartsRef = ref(null)
  const echartsData = ref([])
  const xAxisData = ref([])
  const selectValue = ref('1')

  function handleClickMonth(value) {
    // console.log('value', value)
    selectValue.value = value
    handleGetEarningStatistic()
  }
  function dateChange(value) {
    console.log('dateChange', value)
    month.value = value;
    handleGetEarningStatistic()
  }

  // 获取用户收益分布数据
  function handleGetEarningStatistic() {
    // console.log('userEchartsCategory', userEchartsCategory.value)
    // console.log('timeRangeTagActive', timeRangeTagActive.value)
    // console.log('timeRangeTagActive', timeRange.data)

    const responseData = [
      {xAxis:'0-100', yAxis: 160},
      {xAxis:'100-200', yAxis: 243},
      {xAxis:'200-300', yAxis: 655},
      {xAxis:'300-400', yAxis: 355},
      {xAxis:'400-500', yAxis: 555},
      {xAxis:'500-600', yAxis: 344},
    ];

    let _xAxisData = [], _echartsData = [];

    responseData.forEach(({xAxis, yAxis})=>{
      _xAxisData.push(xAxis)
      _echartsData.push(yAxis)
    })

    xAxisData.value = _xAxisData
    echartsData.value = _echartsData

    setTimeout(()=>{
      echartsInit()
    },100)
  }

  function echartsInit() {
    const myChars = echarts.init(echartsRef.value)
    myChars.clear(); // 清除画布内容
    myChars.setOption({
      color:['#165dff'],
      xAxis: {
        type: 'category',
        axisTick:{
          alignWithLabel:true
        },
        name: '金额/元',
        data: xAxisData.value,
      },
      yAxis: {
        type: 'value',
        splitLine : {
          show:false
        },
        name: '用户/人'
      },
      series: [{
        data: echartsData.value,
        type: 'bar',
        showBackground: true,
        backgroundStyle: {
          color: 'rgba(180, 180, 180, 0.2)'
        },
        emphasis:{
          label:{
            show:true,
            formatter:'{b}/{c}人',
            position:'top'
          }
        }
      }]
    })
  }

  onMounted(() => {
    month.value = dayjs(new Date()).format('YYYY-MM')
    handleGetEarningStatistic();
  })

</script>

<style scoped lang="scss">
    .earnings-container{
        .title{
            position: relative;
            background-color: blue;
            border-radius: 5px;
            color: #fff;
            padding: 10px 15px;
            display: flex;
            align-items: center;

        }

        .btns{
            flex: 1;
            display: flex;
            justify-content: flex-end;
        }

        .select-month{
            position: relative;

            ::v-deep .picker-month{
                width: 130px !important;
            }
        }

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

            .echarts-container{
                height: 600px;
                width: 100%;
                margin: 0 auto;
                display: flex;
                align-items: center;

                .el-col{
                    height: 100%;

                    .echarts-ref{
                        height: 100%;
                    }
                }

            }
        }
    }

</style>