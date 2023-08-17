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


                <Popover v-model="params.promotionType" :options="promotionTypeList">
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
            <div v-show="seriesData.length === 0" class="empty-text">暂无数据</div>

            <div class="check-detail">查看详情</div>
        </el-col>

    </el-row>
</template>

<script setup>
  import {watch, onBeforeUnmount, onMounted, reactive, ref} from 'vue';
  import API from '../api';
  import * as echarts from "echarts";
  import Popover from '@/components/productTypePopover';

  const seriesData = ref([])
  const yAxisData = ref([])
  const echartsRef = ref(null)
  const promotionTypeList = ref([
    {label:'按推广付费金额', key:'1'},
    {label:'按推广付费人数', key:'2'},
    {label:'按推广人数', key:'3'},
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
    promotionType: '1',
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
        axisPointer: {
          type: 'shadow'
        }
      },
      xAxis: {
        type: 'value',
        boundaryGap: [0, 0.01]
      },
      yAxis: {
        type: 'category',
        data: yAxisData.value
      },
      series: seriesData.value,
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
  function handleGetData() {
    let _params = {
      ...params
    }

    // API.getInviteStatistics(_params).then(res=>{
    //   if (res.code == '0') {
    //     formatLineData(res.data)
    //   }
    // })

    // let list = [
    //   {"platformName":"AI 个人助理", "xAxis":1000, "yAxis":"用户1",},
    //   {"platformName":"AI 个人助理", "xAxis":1342, "yAxis":"用户2",},
    //   {"platformName":"AI 个人助理", "xAxis":987, "yAxis":"用户3",},
    //   {"platformName":"AI 个人助理", "xAxis":777, "yAxis":"用户4",},
    //   {"platformName":"AI 个人助理", "xAxis":1512, "yAxis":"用户5",},
    //   {"platformName":"AI 个人助理", "xAxis":1111, "yAxis":"用户6",},
    //   {"platformName":"AI 个人助理", "xAxis":912, "yAxis":"用户7",},
    //
    //   {"platformName":"AI 绘画", "xAxis":615, "yAxis":"用户1",},
    //   {"platformName":"AI 绘画", "xAxis":1364, "yAxis":"用户2",},
    //   {"platformName":"AI 绘画", "xAxis":888, "yAxis":"用户3",},
    //   {"platformName":"AI 绘画", "xAxis":1500, "yAxis":"用户4",},
    //   {"platformName":"AI 绘画", "xAxis":542, "yAxis":"用户5",},
    //   {"platformName":"AI 绘画", "xAxis":765, "yAxis":"用户6",},
    //   {"platformName":"AI 绘画", "xAxis":844, "yAxis":"用户7",},
    //
    //   {"platformName":"AI 营销写作", "xAxis":1644, "yAxis":"用户1",},
    //   {"platformName":"AI 营销写作", "xAxis":800, "yAxis":"用户2",},
    //   {"platformName":"AI 营销写作", "xAxis":631, "yAxis":"用户3",},
    //   {"platformName":"AI 营销写作", "xAxis":666, "yAxis":"用户4",},
    //   {"platformName":"AI 营销写作", "xAxis":1005, "yAxis":"用户5",},
    //   {"platformName":"AI 营销写作", "xAxis":1320, "yAxis":"用户6",},
    //   {"platformName":"AI 营销写作", "xAxis":999, "yAxis":"用户7",},
    // ]
    // formatLineData(list)
  }

  // 格式化数据
  function formatLineData(list) {
    let _seriesDataMap = new Map(), _yAxisData = new Set();
    list.forEach((items, index)=>{
      const {platformName, xAxis, yAxis} = items;
      _yAxisData.add(yAxis);

      if (_seriesDataMap.has(platformName)) {
        _seriesDataMap.set(platformName, _seriesDataMap.get(platformName).concat([xAxis]))
      }else {
        _seriesDataMap.set(platformName, [xAxis])
      }
    })

    let _seriesData = [];
    _seriesDataMap.forEach((value, key)=>{
      _seriesData.push({name: key, data: value, type: 'bar'})
    })

    seriesData.value = _seriesData
    yAxisData.value = Array.from(_yAxisData)

    setTimeout(()=>{
      echartsInit()
    },100)
  }

  watch(params, (newVal) => {
    handleGetData()
  }, {deep:true})

  onMounted(() => {
    handleGetData()
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