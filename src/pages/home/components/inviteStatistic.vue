<template>
    <div class="inviteStatistic-container">
        <div class="title-box theme-bg u-m-t-20 header-operate">
            <div class="text">邀新排名</div>

            <div class="btns">
                <div class="u-m-l-10 sort-container u-cursor" @click="handleChangeSort(params.sortType)">
                    <el-icon class="u-m-r-5" style="font-size: 16px; color: #fff"><Sort /></el-icon>
                    <span class="sort-text" style="font-size: 16px; color: #fff">{{sortObject[params.sortType]}}</span>
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
                <div :class="[seriesData.length === 0 ? 'u-row-right' : 'u-row-between', 'top']">
                    <div v-show="seriesData.length > 0" class="legend-container">
                        <div class="legend-item u-cursor" v-for="(legend, index) in platformTypeMap" :key="index" @click="handleClickLegend(legend[1])">
                            <div class="block" :style="{backgroundColor: legend[1].selected ? legend[1].color : '#cccccc'}"></div>
                            <div class="name" :style="{color: legend[1].selected ? '' : '#cccccc'}">{{ legend[1]['label'] }}</div>
                        </div>
                    </div>

                    <div class="time-range">
                        <div v-for="(item, index) in timeRangeTags" :key="index"
                             :class="[params.dateScopeType === item.key ? 'active' : '', 'u-cursor u-m-r-10']"
                             @click="handleClickTimeTag(item.key)"
                        >
                            {{ item.label }}
                        </div>
                    </div>
                </div>

                <div class="echarts-ref">
                    <Echarts ref="echartsRef" :option-config="echartsOptions" :is-empty="seriesData.length === 0"/>
                </div>


                <div v-if="userInfo.isAdmin === 1" class="check-detail" @click="handleJumpRoute">查看详情</div>
            </el-col>

        </el-row>
    </div>
</template>

<script setup>
  import {watch, reactive, ref, computed} from 'vue';
  import API from '../api';
  import Echarts from '@/components/Echarts';
  import { useStore } from 'vuex';
  import { useRouter } from "vue-router";

  const store = useStore();
  const router = useRouter();

  const seriesData = ref([])
  const yAxisData = ref([])
  const echartsRef = ref()
  const echartsOptions = ref({})
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
  const sortObject = reactive({
    desc: '降序',
    asc: '升序',
  })
  const params = reactive({
    sortType:'desc',
    sortField: 'PaymentAmount',
    dateScopeType: '1',
    platformTypes: [],
  })
  const platformTypeMap = ref(new Map())

  function handleChangeSort(val) {
    params.sortType = val === 'desc' ? 'asc' : 'desc'
  }

  // 初始化
  function echartsInit() {
    let colors = [];
    platformTypeMap.value.forEach((legend, key) => {
      if (legend.selected) colors.push(legend.color)
    })

    echartsOptions.value = {
      color: colors,
      // 鼠标移动到数据项时显示
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'shadow'
        },
        formatter: (arr) => {
          let unit = params.sortField === 'PaymentAmount' ? '元' : '人', formatterText = '';
          (arr || []).forEach((obj, index)=>{
            if (index === 0) formatterText += obj.name + '<br />'
            formatterText += `${obj.seriesName}：${obj.value}${unit}<br />`
          })
          return formatterText
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
    }

    setTimeout(()=>{
      echartsRef.value && echartsRef.value.init()
      echartsRef.value && echartsRef.value.resize()
    },100)
  }

  // 点击图表上的日期tag
  function handleClickTimeTag(tagValue) {
    params.dateScopeType = tagValue
  }

  function handleClickLegend(legend) {
    const { key, selected } = legend
    const selectedList = [];
    platformTypeMap.value.set(key, {...platformTypeMap.value.get(key), selected:!selected})
    platformTypeMap.value.forEach((legend, key) => {
      selectedList.push(legend.selected)
    })

    // 至少要选中一个图例
    if (selectedList.includes(true)) {
      handleGetData()
    }else {
      platformTypeMap.value.set(key, {...platformTypeMap.value.get(key), selected:true})
    }
  }

  // 获取收益统计图表数据
  function handleGetData() {
    let _params = {
      ...params,
      pageIndex: 1,
      pageSize: 7,
    }

    let platformTypes = [];
    platformTypeMap.value.forEach((legend, key) => {
      if (legend.selected) platformTypes.push(key)
    })
    _params.platformTypes = platformTypes.sort((a,b)=>a-b).join(',')

    API.getInviteStatistics(_params).then(res=>{
      if (res.code == '0') {
        formatLineData(res.data)
      }
    })
  }

  // 格式化数据
  function formatLineData(list) {
    let _seriesDataMap = new Map(), _yAxisData = new Set();
    list.forEach((user, index)=>{
      const {childs, yAxis} = user;
      _yAxisData.add(yAxis);

      (childs || []).forEach(item=>{
        const {platformName, content, platformType} = item;

        // 后端返回全部平台类型，前端筛选出选中的平台类型
        if (platformTypeMap.value.get(platformType)['selected'] === true) {
          if (_seriesDataMap.has(platformName)) {
            _seriesDataMap.set(platformName, _seriesDataMap.get(platformName).concat([content]))
          }else {
            _seriesDataMap.set(platformName, [content])
          }
        }
      })
    })

    let _seriesData = [];
    _seriesDataMap.forEach((value, key)=>{
      _seriesData.push({name: key, data: value.reverse(), type: 'bar'})
    })

    seriesData.value = _seriesData
    yAxisData.value = Array.from(_yAxisData).reverse()
    echartsInit()
  }

  function handleJumpRoute() {
    router.push({path: '/distribution'})
  }

  const userInfo = computed(() => {
    return store.getters["user/info"];
  });

  watch(params, (newVal) => {
    handleGetData()
  }, {deep:true})

  watch(
    ()=>store.getters['platformType/list'],
    (newVal) => {
      if (newVal && newVal.length > 0) {
        let colors = ['#5470c6', '#91cc75', '#fac858'];

        params.platformTypes = newVal.map((item, index)=>{
          platformTypeMap.value.set(item.key, {key: item.key, label:item.label, color:colors[index], selected: true})
          return item.key
        })
      }
  }, {deep:true, immediate: true})

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
                    display: flex;
                    align-items: center;
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

                .legend-container{
                    position: relative;
                    display: flex;
                    align-items: center;

                    .legend-item{
                        margin-right: 2vw;
                        display: flex;
                        align-items: center;

                        .block{
                            width: 1.2vw;
                            height: 0.6vw;
                            border-radius: 2px;
                            margin-right: 5px;
                        }
                    }
                }
            }

            .el-col {
                height: 83%;
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