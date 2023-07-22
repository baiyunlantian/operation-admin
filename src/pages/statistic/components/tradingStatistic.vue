<template>
    <div class="trading-container u-m-t-20">
        <div class="title">
            <div class="text">交易收益金额</div>

            <el-row :gutter="0" class="btns">
                <el-col :span="1" :offset="1">
                    <el-button type="default">导出数据</el-button>
                </el-col>
                <el-col :span="2" :offset="1">
                    <el-select v-model="selectValue" class="m-2">
                        <el-option
                                v-for="item in selectOptions"
                                :key="item.value"
                                :label="item.label"
                                :value="item.value"
                        />
                    </el-select>
                </el-col>

                <el-col :span="5" :offset="1">
                    <div class="time-range">
                        <el-date-picker
                                v-model="timeRange.data"
                                type="daterange"
                                range-separator="至"
                                format="YYYY-MM-DD"
                                value-format="YYYY-MM-DD"
                                start-placeholder="请选择起始时间"
                                end-placeholder="请选择结束时间"
                                :disabled-date="handleDisabledDate"
                                @calendar-change="datePickerChange"
                                @change="dateChange"
                        />
                    </div>
                </el-col>

            </el-row>
        </div>

        <div class="chart-container bg-fff">
            <div class="search-container">
                <div class="left u-m-l-20 u-m-r-20">
                    <div v-for="(item, index) in userStatisticConfig" :key="index" class="desc-item">
                        <div class="desc-text">{{item.title}}</div>
                        <div class="value">{{item.value}}</div>
                        <div :class="[item.ratioType, 'bottom']">
                            <div class="icon"></div>
                            <div class="ratio">{{item.ratio}}</div>
                            <div class="ratio-text">{{item.ratioText}}</div>
                        </div>
                    </div>
                </div>

                <div class="right">
                    <el-popover placement="right" :width="150" trigger="click" :disabled="tableShow">
                        <template #reference>
                            <div class="popover-text">
                                <span class="point" :style="{backgroundColor:tableShow ? '#fff' : 'blue'}"></span>
                                <span class="blue u-m-l-10">{{userEchartsCategoryText}}</span>
                            </div>
                        </template>
                        <el-radio-group v-model="userEchartsCategory">
                            <el-radio v-for="(item) in userEchartsCategoryList" :key="item.key" :label="item.key">{{item.label}}
                            </el-radio>
                        </el-radio-group>
                    </el-popover>

                    <div class="switch-card-text blue u-cursor" @click="handleSwitch">{{tableShow ? '统计图显示' : '表格显示'}}</div>
                </div>
            </div>

            <div v-show="!tableShow" class="total-statistic">共收益￥{{ totalStatistic }}</div>

            <el-row :gutter="0" justify="center" class="echarts-container">
                <el-col :span="20">

                    <el-table v-show="tableShow" class="table-container" :data="tableData" border style="width: 100%">
                        <el-table-column v-for="(item, index) in tableColumnConfig" :key="index"
                                         :prop="item.prop"
                                         :label="item.label"
                                         :width="item.width"
                                         align="center"
                         />
                    </el-table>

                    <MutiLine
                            v-show="!tableShow"
                            height="500px"
                            width="100%"
                            x-axis-end-text="日期/月份"
                            y-axis-end-text="金额/元"
                            :x-axis-data="xAxisData"
                            :line-data="lineData"
                    />

                </el-col>
            </el-row>

        </div>
    </div>

</template>

<script setup>
  import { reactive, ref, onMounted, computed, watch } from 'vue';
  import dayjs from 'dayjs';
  import MutiLine from '@/components/Echarts/muti-line';

  const timeRange = reactive({data:[]})
  const startDate = ref(null)
  const userEchartsCategory = ref('ALL')
  const timeRangeTagActive = ref('today')
  const userStatisticConfig = reactive([
    {title:'本月用户总数', ratioText:'同比上月', value:'10000', ratio:"7%", ratioType:'increase'},
    {title:'本周用户数量', ratioText:'同比上周', value:'1000', ratio:"7%", ratioType:'descend'},
  ])
  const userEchartsCategoryList = reactive([
    {label:'全部', key:'ALL'},
    {label:'智文', key:'ZHIWEN'},
    {label:'智绘', key:'ZHIHUI'},
    {label:'智像', key:'ZHIXIANG'},
    {label:'AI ERP', key:'AIERP'},
  ])
  const userEchartsDataList = ref([])
  const lineData = ref([])
  const tableData = ref([])
  const tableColumnConfig = ref([])
  const xAxisData = ref([])
  const totalStatistic = ref(0)
  const selectOptions = ref([
    {label:'按天统计', value:'1'},
    {label:'按月统计', value:'2'},
  ])
  const selectValue = ref('1')
  const tableShow = ref(false)

  function datePickerChange(dates) {
    // 记录选择的起始日期
    let hasSelectDate = dates !== null && dates.length > 0
    startDate.value = hasSelectDate ? dates[0] : null

    const [start, end] = dates;
    if (start && end) {
      const _start = dayjs(start).format('YYYY-MM-DD')
      const _end = dayjs(end).format('YYYY-MM-DD')
      timeRange.data = [_start, _end]

      // 选择时间范围时，清空左侧tag样式
      timeRangeTagActive.value = ''
    }
  }
  function dateChange(dates) {
    timeRange.data = dates;
    if (dates === null || dates.length === 0) {
      startDate.value = null
    }
  }
  function handleSwitch() {
    tableShow.value = !tableShow.value
  }

  // 限定时间选择范围
  function handleDisabledDate(time) {
    const day = 24 * 60 * 60 * 1000;
    const timestamp = time.getTime()
    if (startDate.value !== null) {
      return (
        timestamp < startDate.value.getTime() - 7 * day ||
        timestamp > startDate.value.getTime() + 7 * day
      )
    }
  }
  // 获取用户统计图表数据
  function handleGetUserStatistic() {
    // console.log('userEchartsCategory', userEchartsCategory.value)
    // console.log('timeRangeTagActive', timeRangeTagActive.value)
    // console.log('timeRangeTagActive', timeRange.data)
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

    formatLineData(responseData)
    userEchartsDataList.value = responseData
  }

  // 格式化数据
  function formatLineData(list) {
    /**
     * 类型-- 智文，智绘，智像，AI ERP
     *
     * tableColumnConfig说明
     *  首列 prop:name    label:''
     *  末尾列 prop:total      label:汇总
     *  其余列 prop:xAxia字段的值  label:xAxia字段的值
     * */
    let _xAxisData = [], _seriesData = [], _tableData = [], _tableColumnConfig = [{label:'', prop:'name'}];
    // 所有类型的总数量
    let total = 0;
    // 存放 table 汇总行数据
    let tableLastRowData = new Map();

    list.forEach((items, index)=>{
      // 图表接受的数据格式
      let seriesItem = {type:'line', name:items.name, data:[]};
      // 每个类型的总数量
      let categoryTotal = 0;
      // 构造table 每列数据
      let columnDataObj = {name:items.name};

      (items.series || []).forEach((item, itemIndex)=>{
        if (index === 0) {
          _xAxisData.push(item.xAxia)
          _tableColumnConfig.push({label:item.xAxia, prop:item.xAxia})
        }

        total += item.yAxia
        categoryTotal += item.yAxia
        seriesItem['data'].push(item.yAxia)
        // 取 xAxia 字段作为column的prop
        columnDataObj[item.xAxia] = item.yAxia

        /**
         * 同时间的所有类型总量
         * 用日期做为key
         * 同一天的所有类型的总数量作为value
         * */
        tableLastRowData.set(item.xAxia, (tableLastRowData.get(item.xAxia) || 0) + item.yAxia)
      })

      // table列表 汇总列 字段
      columnDataObj['total'] = categoryTotal;
      _tableData.push(columnDataObj)
      _seriesData.push(seriesItem)
    })

    // 构造table 最后一行数据
    let tableLastRowObj = {name:'汇总', total };
    tableLastRowData.forEach((value, prop) => {
      tableLastRowObj[prop] = value
    })
    _tableData.push(tableLastRowObj)

    totalStatistic.value = total
    xAxisData.value = _xAxisData
    lineData.value = _seriesData
    tableData.value = _tableData
    tableColumnConfig.value = _tableColumnConfig.concat([{label:'汇总', prop:'total'}])
  }

  const userEchartsCategoryText = computed(()=>{
    const obj = userEchartsCategoryList.find(item=>item.key === userEchartsCategory.value)
    return obj ? obj['label'] : '';
  })

  // 用户统计图表切换
  watch(
    () => userEchartsCategory.value,
    Category => {
      let data = [];
      // 过滤数据
      if (userEchartsCategoryText.value !== '全部') {
        data = userEchartsDataList.value.filter(item=>item.name ===  userEchartsCategoryText.value)
      }else {
        data = userEchartsDataList.value
      }

      formatLineData(data)
    }
  )

  onMounted(() => {
    handleGetUserStatistic();
  })

</script>

<style scoped lang="scss">
    .trading-container{
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

        .chart-container{
            position: relative;

            .search-container{
                position: absolute;
                display: flex;
                align-items: flex-start;
                width: 100%;
                padding: 20px 0 20px 20px;
                box-sizing: border-box;
                z-index: 999;

                .left{
                    position: relative;

                    .desc-item{
                        position: relative;

                        &:last-child{
                            margin-top: 30px;
                        }

                        .desc-text{
                            position: relative;
                            color: #848484;
                        }

                        .value{
                            position: relative;
                            font-size: 32px;
                            color: #5a5a5a;
                        }

                        .bottom{
                            position: relative;
                            display: flex;
                            align-items: center;

                            .icon{
                                position: relative;
                                width: 0;
                                height: 0;
                                border-right: 5px solid transparent;
                                border-left: 5px solid transparent;
                            }

                            .ratio{
                                margin: 0 5px;
                            }

                            .ratio-text{
                                position: relative;
                                color: #a5a5a5;
                            }
                        }

                        .increase{
                            .icon{
                                border-bottom: 5px solid #27d827;
                            }

                            .ratio{
                                color: #27d827;
                            }
                        }

                        .descend{
                            .icon{
                                border-top: 5px solid red;
                            }

                            .ratio{
                                color: red;
                            }
                        }
                    }
                }

                .right{
                    position: relative;
                    flex: 1;
                    display: flex;
                    justify-content: space-between;
                    padding: 0 50px;

                    .time-range{
                        display: flex;
                        align-items: center;

                        .active{
                            color: #fff;
                            background-color: #409EFF;
                            padding: 5px 10px;
                            border-radius: 5px;
                        }
                    }

                    .popover-text{
                        position: relative;

                        .point{
                            display: inline-block;
                            width: 10px;
                            height: 10px;
                            border-radius: 50%;
                            background-color: blue;
                            border: 1px solid #c1c1c1;
                        }
                    }
                }
            }

            .total-statistic{
                position: absolute;
                bottom: 30px;
                right: 20%;
                font-size: 16px;
            }

            .echarts-container{
                height: 600px;
                margin: 0 auto;
                display: flex;
                align-items: center;

                .table-container{
                    position: relative;

                    ::v-deep .el-table__header-wrapper{
                        .el-table__cell{
                            background-color: #f7f7f7;
                            text-align: center;
                        }
                    }
                }

                .echarts-ref{
                    height: 500px;
                    width: 100%;
                }
            }


        }
    }

</style>