<template>
    <div class="inviteStatistic-container">
        <div class="title-box u-m-t-20 header-operate">
            <div class="text">邀新排名</div>

            <div class="btns">
                <div class="u-m-l-10 sort-container">
                    <Popover v-model="params.sortType" :options="sortOptions">
                        <template v-slot:popover-icon>
                            <el-icon class="u-cursor" style="font-size: 16px; color: #fff"><Sort /></el-icon>
                        </template>
                    </Popover>
                </div>

                <div class="select-month u-m-l-10">
                    <el-select v-model="params.sortField" class="m-2">
                        <el-option
                                v-for="item in promotionTypeList"
                                :key="item.key"
                                :label="item.label"
                                :value="item.key"
                        />
                    </el-select>
                </div>
            </div>
        </div>

        <el-row class="chart-container bg-fff" :gutter="0" justify="center">
            <el-col :span="22" class="echarts-container">
                <div class="top">
                    <div class="time-range">
                        <div v-for="(item, index) in timeRangeTags" :key="index"
                             :class="[params.dateScopeType === item.key ? 'active' : '', 'u-cursor u-m-r-10']"
                             @click="handleClickTimeTag(item.key)"
                        >
                            {{ item.label }}
                        </div>
                    </div>
                </div>

                <div v-show="seriesData.length > 0" class="echarts-ref" ref="echartsRef"></div>
                <div v-show="seriesData.length === 0" class="empty-text">暂无数据</div>

                <div class="check-detail" @click="handleJumpRoute">查看详情</div>
            </el-col>

        </el-row>
    </div>
</template>

<script setup>
  import {watch, onBeforeUnmount, onMounted, reactive, ref, computed} from 'vue';
  import API from '../api';
  import * as echarts from "echarts";
  import Popover from '@/components/productTypePopover';
  import { useStore } from 'vuex';
  import { useRouter } from "vue-router";

  const store = useStore();
  const router = useRouter();

  const seriesData = ref([])
  const yAxisData = ref([])
  const echartsRef = ref(null)
  const promotionTypeList = ref([
    {label:'按推广付费金额', key:'PaymentAmount'},
    {label:'按推广付费人数', key:'PromotionPayers'},
    {label:'按推广人数', key:'PromotionNumbers'},
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
    sortType:'desc',
    sortField: 'PaymentAmount',
    dateScopeType: '1',
    platformType: '',
  })
  const platformTypeObject = ref({})

  let myChars = null
  // 初始化
  function echartsInit() {
    if (myChars === null) {
      myChars = echarts.init(echartsRef.value)
      myChars.on('legendselectchanged', function (param) {
        let { selected } = param, list = [];
        Object.keys(selected).forEach(key=>{
          if (selected[key] === true) {
            list.push(platformTypeObject.value[key])
          }
        })

        params.platformType = list.join(',');
      });
    }
    myChars.clear(); // 清除画布内容
    myChars.setOption({
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
        boundaryGap: [0, 0.01],
        minInterval: 1,
      },
      yAxis: {
        type: 'category',
        data: yAxisData.value,
      },
      series: seriesData.value,
    })
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
      ...params,
      pageIndex: 1,
      pageSize: 7,
    }

    API.getInviteStatistics(_params).then(res=>{
      if (res.code == '0') {
        formatLineData(res.data)
      }
    })
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
      call()
    },100)
  }

  function handleJumpRoute() {
    router.push({path: '/distribution'})
  }

  watch(params, (newVal) => {
    handleGetData()
  }, {deep:true})

  watch(
    ()=>store.getters['platformType/list'],
    (newVal) => {
      if (newVal && newVal.length > 0) {
        let list =  []
        newVal.forEach(item=>{
          list.push(item.key)
          platformTypeObject.value[item.label] = item.key
        })

        params.platformType = list.join(',')
      }
  }, {deep:true, immediate: true})

  onMounted(() => {
    console.log('onMounted', myChars)
  })


  onBeforeUnmount(() => {
    window.removeEventListener('resize', call)
  })

</script>

<style scoped lang="scss">
    .inviteStatistic-container{
        position: relative;
        height: 61%;

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