<template>
    <div class="line-container u-m-t-20">
        <div class="title title-box">
            <div class="text">{{ statisticType === 'user' ? '用户增长情况' : '交易收益金额'}}</div>

            <div class="btns">
                <div class="btn-item">
                    <el-button type="default" @click="handleExport">导出数据</el-button>
                </div>

                <div class="btn-item u-m-l-10">
                    <el-select v-model="productType" class="m-2">
                        <el-option
                                v-for="item in platformTypeList"
                                :key="item.key"
                                :label="item.label"
                                :value="item.key"
                        />
                    </el-select>
                </div>

                <div class="btn-item u-m-l-10">
                    <el-select v-model="dateScopeType" @change="handleSelectChange" class="m-2">
                        <el-option
                                v-for="item in selectOptions"
                                :key="item.value"
                                :label="item.label"
                                :value="item.value"
                        />
                    </el-select>
                </div>

                <div class="btn-item u-m-l-10">
                    <div class="time-range">
                        <el-date-picker
                                v-if="dateScopeType === 1"
                                v-model="timeRange"
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

                        <el-date-picker
                                v-else
                                v-model="timeRange"
                                type="monthrange"
                                range-separator="至"
                                format="YYYY-MM"
                                value-format="YYYY-MM"
                                start-placeholder="请选择起始时间"
                                end-placeholder="请选择结束时间"
                                @change="monthChange"
                        />
                    </div>
                </div>

            </div>
        </div>

        <div class="chart-container bg-fff">
            <div class="search-container">
                <div class="left">
                    <div v-for="(item, index) in leftStatisticConfig" :key="index" class="desc-item">
                        <div class="desc-text">{{item.title}}</div>
                        <div class="value">{{ leftData[item.countProp] }}</div>
                        <div :class="[handleJudgeIsIncrease(leftData[item.ratioProp]), 'bottom']">
                            <div class="icon"></div>
                            <div class="ratio">{{ format(leftData[item.ratioProp]) }}</div>
                            <div class="ratio-text">{{item.subText}}</div>
                        </div>
                    </div>
                </div>
            </div>

            <div class="content">
                <div class="right">
<!--                    <Popover v-model="productType" />-->

                    <div class="switch-card-text blue u-cursor" @click="handleSwitch">{{tableShow ? '统计图显示' : '表格显示'}}</div>
                </div>

                <div class="content-item">
                    <div class="table-container" :style="{opacity: tableShow === true ? 1 : 0, zIndex: tableShow === true ? 3 : 2}">
                        <el-table :data="tableData" border>
                            <el-table-column v-for="(item, index) in tableColumnConfig" :key="index"
                                             :prop="item.prop"
                                             :label="item.label"
                                             :width="item.width"
                                             align="center"
                            />
                        </el-table>
                    </div>

                    <div class="echarts-container" :style="{opacity: tableShow === true ? 0 : 1, zIndex: tableShow === true ? 2 : 3}">
                        <MutiLine
                                v-show="lineData.length > 0"
                                :x-axis-end-text="dateScopeType === 1 ? '日期/天' : '日期/月份'"
                                :y-axis-end-text="yAxixEndText"
                                :x-axis-data="xAxisData"
                                :line-data="lineData"
                                :option-config="echartsOptions"
                        />
                        <div v-show="!tableShow && lineData.length === 0" class="empty-text">暂无数据</div>

                        <div v-show="!tableShow" class="total-statistic">
                            <template v-if="props.statisticType === 'user'">
                                <span class="u-m-r-10">新增用户数</span>
                                <span>共计{{ totalStatistic }}人</span>
                            </template>

                            <template v-else>共收益￥{{ totalStatistic }}</template>

                        </div>
                    </div>
                </div>

            </div>
        </div>

    </div>

</template>

<script setup>
  import {reactive, ref, onMounted, computed, watch, defineProps, defineEmits, getCurrentInstance, nextTick} from 'vue';
  import dayjs from 'dayjs';
  import { useStore } from 'vuex';
  import ExportExcel from '@/utils/exportExcel';
  import { setTimeEscalation } from '@/assets/js/utils';
  import MutiLine from '@/components/muti-line';

  const store = useStore()
  const emit = defineEmits(['update'])
  const props = defineProps({
    statisticType: {
      // user--用户  trading--收益
      type: String,
      default: 'user'
    },
    statisticData: {
      required: true,
      type: Array
    },
    leftData: {
      required: true,
      type: Object,
      default: () => {
        return {
          currentMonth:'',
          currentWeek:'',
          monthRatio:'',
          weekRatio:'',
        }
      }
    },
    totalStatistic: {
      type: Number,
      default: 0,
    }
  })
  const { proxy } = getCurrentInstance()
  const setTimeEscalationClone = setTimeEscalation();

  const timeRange = ref([])
  const startDate = ref(null)
  const productType = ref(0)
  const lineData = ref([])
  const tableData = ref([])
  const tableColumnConfig = ref([])
  const xAxisData = ref([])
  const selectOptions = ref([
    {label:'按天统计', value:1},
    {label:'按月统计', value:2},
  ])
  const dateScopeType = ref(1)
  const tableShow = ref(false)
  const echartsOptions = reactive({
    tooltip:{}
  })

  function handleExport() {
    const fileName = props.statisticType === 'user' ? '用户增长情况' : '交易收益金额'

    setTimeEscalationClone(() => {ExportExcel(tableData.value, tableColumnConfig.value, fileName)},
      () => {proxy.$message.warning('操作过于频繁！')})
  }

  function monthChange(dates) {
    /**
     * 按月筛选，则时间区间选择为（6~24）月
     * */
    if (dates === null || dates.length === 0) {
      dateScopeType.value = 1
      timeRange.value = [proxy.$utils.getDateBeforeDays(14), dayjs(new Date()).format('YYYY-MM-DD')]
      handleGetStatistic()
      return
    }
    // 2023-06   2027-03
    let startDate = dates[0], endDate = dates[1];
    let startYear = Number(startDate.split('-')[0]), startMonth = Number(startDate.split('-')[1]);
    let endYear = Number(endDate.split('-')[0]), endMonth = Number(endDate.split('-')[1]);
    const monthGap = (endYear - startYear) * 12 + endMonth - startMonth;

    if (monthGap >= 5 && monthGap <= 23) {
      handleGetStatistic()
    }else {
      proxy.$message({
        type: 'error',
        message: '请选择6~24个月的区间范围'
      })
    }
  }

  // 选择时间范围
  function datePickerChange(dates) {
    // 记录选择的起始日期
    let hasSelectDate = dates !== null && dates.length > 0
    startDate.value = hasSelectDate ? dates[0] : null

    const [start, end] = dates;
    if (start && end) {
      const _start = dayjs(start).format('YYYY-MM-DD')
      const _end = dayjs(end).format('YYYY-MM-DD')
      timeRange.value = [_start, _end]

      handleGetStatistic()
    }
  }

  function dateChange(dates) {
    startDate.value = null
    if (dates === null || dates.length === 0) {
      nextTick(()=>{
        timeRange.value = [proxy.$utils.getDateBeforeDays(14), dayjs(new Date()).format('YYYY-MM-DD')]
        handleGetStatistic()
      })
    }else {
      timeRange.value = dates;
    }
  }
  function handleSwitch() {
    tableShow.value = !tableShow.value
  }

  // 限定时间选择范围
  function handleDisabledDate(time) {
    // console.log('handleDisabledDate', time)
    /**
     * 按日筛选，时间区间选择为（7~30）天
     * */
    const day = 24 * 60 * 60 * 1000;
    // 当前选中的时间
    const timestamp = time.getTime()
    if (startDate.value !== null) {
      const startDateTime = startDate.value.getTime();
      // 小于7-30天
      const lessThan = timestamp < startDateTime - 5 * day && timestamp > startDateTime - 30 * day
      // 大于7-30天
      const moreThan = timestamp > startDateTime + 5 * day && timestamp < startDateTime + 30 * day
      return (
          !(lessThan || moreThan)
      )
    }
  }

  // 格式化数据
  function formatLineData(list) {
    /**
     *
     * tableColumnConfig说明
     *  首列 prop:name    label:''
     *  末尾列 prop:total      label:汇总
     *  其余列 prop:xAxia字段的值  label:xAxia字段的值
     * */
    let _xAxisData = [], _seriesData = [], _tableData = [], _tableColumnConfig = [{label:'', prop:'name'}], statisticTotal = 0;
    // 存放 table 汇总行数据
    let tableLastRowData = new Map();
    let tooltip = {trigger: 'axis', formatter:'{b}<br />'}, unit = props.statisticType === 'user' ? '人' : '元';

    list.forEach((items, index)=>{
      // 图表接受的数据格式
      let seriesItem = {type:'line', name:items.name, data:[], smooth: true};
      // 每个类型的总数量
      let categoryTotal = 0;
      // 构造table 每列数据
      let columnDataObj = {name:items.name};
      tooltip.formatter += `{a${index}}：{c${index}}${unit}<br />`;

      (items.series || []).forEach((item, itemIndex)=>{
        if (index === 0) {
          _xAxisData.push(item.xAxis)
          _tableColumnConfig.push({label:item.xAxis, prop:item.xAxis})
        }

        statisticTotal += item.yAxis
        categoryTotal += item.yAxis
        seriesItem['data'].push(item.yAxis)
        // 取 xAxia 字段作为column的prop
        columnDataObj[item.xAxis] = item.yAxis

        /**
         * 同时间的所有类型总量
         * 用日期做为key
         * 同一天的所有类型的总数量作为value
         * */
        tableLastRowData.set(item.xAxis, (tableLastRowData.get(item.xAxis) || 0) + item.yAxis)
      })

      // table列表 汇总列 字段
      columnDataObj['total'] = Number(categoryTotal.toFixed(2));
      if (categoryTotal > 0) {
        _tableData.push(columnDataObj)
        _seriesData.push(seriesItem)
      }
    })

    // 构造table 最后一行数据
    let tableLastRowObj = {name:'汇总', total: Number(statisticTotal.toFixed(2))};
    tableLastRowData.forEach((value, prop) => {
      tableLastRowObj[prop] = Number(value.toFixed(2))
    })
    if (statisticTotal > 0) {
      _tableData.push(tableLastRowObj)
    }


    echartsOptions.tooltip = tooltip
    xAxisData.value = _xAxisData
    lineData.value = _seriesData
    tableData.value = _tableData
    tableColumnConfig.value = _tableColumnConfig.concat([{label:'汇总', prop:'total'}])
  }

  // 去除-号
  function format(value) {
    let text = value

    if (value && value.indexOf('-') === 0) {
      text = value.substr(1)
    }

    return text
  }

  // 判断增长还是下降
  function handleJudgeIsIncrease(value) {
    let className = 'increase'
    if (value && value.indexOf('-') === 0) {
      className = 'descend'
    }

    return className
  }

  // 选择按日/月统计
  function handleSelectChange() {
    timeRange.value = []
    proxy.$message({
      type:'info',
      message:'请选择时间范围'
    })
  }

  // 获取统计数据
  function handleGetStatistic() {
    emit('update',
      {
        productType:productType.value,
        dateScopeType:dateScopeType.value,
        startDate:timeRange.value[0],
        endDate:timeRange.value[1],
      })
  }

  const leftStatisticConfig = computed(() => {
    if (props.statisticType === 'user') {
      return [
        {title:'本月用户总数', subText:'同比上月', countProp:'currentMonth', ratioProp:'monthRatio'},
        {title:'本周用户数量', subText:'同比上周', countProp:'currentWeek', ratioProp:'weekRatio'}
      ]
    }else {
      return [
        {title:'本月收益总额', subText:'同比上月', countProp:'currentMonth', ratioProp:'monthRatio'},
        {title:'本周收益总额', subText:'同比上周', countProp:'currentWeek', ratioProp:'weekRatio'}
      ]
    }
  })
  const yAxixEndText = computed(() => {
      return props.statisticType === 'user' ? '用户/人' : '金额/元'
  })

  const platformTypeList = computed(() => {
    let arr = [{label:'全部', key:0}], list = store.getters['platformType/list'];
    if (Array.isArray(list)) {
      arr = arr.concat(list)
    }

    return  arr
  })

  // 统计图表切换类型
  watch(
    () => productType.value,
    Category => {
      handleGetStatistic()
    }
  )

  watch(
      () => props.statisticData,
      value => {
        formatLineData(value)
      },
      {deep: true}
  )

  onMounted(() => {
    timeRange.value = [proxy.$utils.getDateBeforeDays(14), dayjs(new Date()).format('YYYY-MM-DD')]
    handleGetStatistic()
  })
</script>

<style scoped lang="scss">
    .line-container{
        height: 55%;
        min-height: 300px;

        .title{
            display: flex;
            align-items: center;
        }

        .btns{
            flex: 1;
            display: flex;
            align-items: center;
            justify-content: flex-end;

            ::v-deep .el-select{
                width: 110px;
            }

            .btn-item{
                position: relative;

                :deep(.el-date-editor--daterange) {
                    width: 370px !important;
                }

                :deep(.el-date-editor--monthrange) {
                    width: 370px !important;
                }
            }
        }

        .chart-container{
            position: relative;
            height: 92%;
            display: flex;

            .search-container{
                display: flex;
                padding: 1% 0 1% 1%;


                .left{
                    position: relative;
                    max-height: 90%;
                    overflow: auto;

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
            }

            .total-statistic{
                font-size: 16px;
                text-align: center;
            }

            .content {
                position: relative;
                display: flex;
                flex-direction: column;
                width: 80%;
                margin: 1% auto;

                .right{
                    display: flex;
                    justify-content: flex-end;
                    padding: 0 5%;

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

                .content-item{
                    position: relative;
                    flex: 1;
                }


                .echarts-container{
                    position: relative;
                    height: 90%;
                    z-index: 3;

                    .echarts-ref{
                        flex: 1;
                    }

                    .empty-text{
                        height: 100%;
                        display: grid;
                        place-items: center;
                        font-size: 16px;
                    }
                }

                .table-container {
                    position: absolute;
                    display: flex;
                    flex-direction: column;
                    left: 0;
                    top: 5%;
                    opacity: 0;
                    z-index: 2;
                    width: 100%;
                    height: 90%;
                    background-color: #fff;
                }
            }

        }
    }

</style>