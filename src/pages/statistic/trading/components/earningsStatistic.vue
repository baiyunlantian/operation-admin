<template>
    <div class="earnings-container u-m-t-20">
        <TitleBox title="用户收益分布" @getData="handleGetEarningStatistic" @export="handleExport"/>

        <div class="chart-container bg-fff">
            <div class="search-container">
            </div>

            <el-row :gutter="0" class="echarts-container">
                <el-col :span="20" :offset="2">
                    <div class="echarts-ref" ref="echartsRef"></div>
                </el-col>
            </el-row>

        </div>
    </div>

</template>

<script setup>
  import {getCurrentInstance, ref,} from 'vue';
  import API from '../api';
  import TitleBox from './titleBox';
  import ExportExcel from "@/utils/exportExcel";
  import { setTimeEscalation } from "@/assets/js/utils";
  const setTimeEscalationClone = setTimeEscalation();
  import * as echarts from 'echarts';

  const { proxy } = getCurrentInstance()

  const echartsRef = ref(null)
  const echartsData = ref([])
  const xAxisData = ref([])
  const tableTitle = ref([])
  const tableData = ref([])

  function handleExport() {
    setTimeEscalationClone(() => {ExportExcel(tableData.value, tableTitle.value, '用户收益分布')},
      () => {proxy.$message.warning('操作过于频繁！')})
  }

  // 获取用户收益分布数据
  function handleGetEarningStatistic(params) {
    console.log('获取用户收益分布数据', params)

    let _xAxisData = [], _echartsData = [], _tableTitle = [{label:params.startDate, prop:'account'}];
    let response = [
      {"xAxis":"0-100", "yAxis":100},
      {"xAxis":"100-200", "yAxis":160},
      {"xAxis":"200-300", "yAxis":244},
      {"xAxis":"300-400", "yAxis":322},
      {"xAxis":"400-500", "yAxis":654},
      {"xAxis":"500-600", "yAxis":254},
      {"xAxis":"600-700", "yAxis":455},
      {"xAxis":"700-800", "yAxis":130},
      {"xAxis":"800-900", "yAxis":555},
      {"xAxis":"900-1000", "yAxis":233},
      {"xAxis":"1000-1100", "yAxis":277},
      {"xAxis":"1100-1200", "yAxis":744},
      {"xAxis":"1200-1300", "yAxis":433},
      {"xAxis":"1300-1400", "yAxis":555},
      {"xAxis":"1400-1500", "yAxis":233},
      {"xAxis":"1500-1600", "yAxis":277},
      {"xAxis":"1600-1700", "yAxis":744},
      {"xAxis":"1700-1800", "yAxis":433},
    ]

    API.getDistributionStatistic(params).then(res=>{
      if (res.code == '0') {
        let row = {};
        (response || []).forEach(({xAxis, yAxis})=>{
          _xAxisData.push(xAxis)
          _echartsData.push(yAxis)
          row[xAxis] = yAxis
          _tableTitle.push({label: xAxis, prop: xAxis})
        })

        tableTitle.value = _tableTitle
        tableData.value = [Object.assign({account: '用户人数'}, row)]
        xAxisData.value = _xAxisData
        echartsData.value = _echartsData

        setTimeout(()=>{
          echartsInit()
        },100)
      }
    })
  }

  function echartsInit() {
    const myChars = echarts.init(echartsRef.value)
    myChars.clear(); // 清除画布内容
    myChars.setOption({
      dataZoom: [
        {
          type: 'inside',
          start: 0,
          end: 10,
          minValueSpan: 10,
          maxValueSpan: 20,
        }
      ],
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
        itemStyle: {
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            { offset: 0, color: '#83bff6' },
            { offset: 0.5, color: '#188df0' },
            { offset: 1, color: '#188df0' }
          ])
        },
        emphasis:{
          label:{
            show:true,
            formatter:'{b}/{c}人',
            position:'top'
          },
          itemStyle: {
            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
              { offset: 0, color: '#2378f7' },
              { offset: 0.7, color: '#2378f7' },
              { offset: 1, color: '#83bff6' }
            ])
          }
        }
      }]
    })
  }

</script>

<style scoped lang="scss">
    .earnings-container{
        .title{
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