<template>
    <div class="trading-container u-m-t-20">
        <div class="title">
            <div class="text">{{ statisticType === 'user' ? '用户增长情况' : '交易收益金额'}}</div>

            <div class="btns">
                <div class="btn-item">
                    <el-button type="default">导出数据</el-button>
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

<!--                        <el-date-picker-->
<!--                                v-model="timeRange"-->
<!--                                type="monthrange"-->
<!--                                range-separator="至"-->
<!--                                format="YYYY-MM"-->
<!--                                value-format="YYYY-MM"-->
<!--                                start-placeholder="请选择起始时间"-->
<!--                                end-placeholder="请选择结束时间"-->
<!--                                :disabled-date="disabledMonth"-->
<!--                                @onPick="monthPickerChange"-->
<!--                                @change="dateChange"-->
<!--                        />-->
                    </div>
                </div>

            </div>
        </div>

        <div class="chart-container bg-fff">
            <div class="search-container">
                <div class="left u-m-l-20 u-m-r-20">
                    <div v-for="(item, index) in leftStatisticConfig" :key="index" class="desc-item">
                        <div class="desc-text">{{item.title}}</div>
                        <div class="value">{{ leftData[item.countProp] }}</div>
                        <div :class="[handleJudgeIsIncrease(leftData[item.ratioProp]), 'bottom']">
                            <div class="icon"></div>
                            <div class="ratio">{{ leftData[item.ratioProp] }}</div>
                            <div class="ratio-text">{{item.subText}}</div>
                        </div>
                    </div>
                </div>

                <div class="right">
                    <el-popover placement="right" :width="150" trigger="click" :disabled="tableShow">
                        <template #reference>
                            <div class="popover-text">
                                <span class="point" :style="{backgroundColor:tableShow ? '#fff' : 'blue'}"></span>
                                <span class="blue u-m-l-10">{{productTypeText}}</span>
                            </div>
                        </template>
                        <el-radio-group v-model="productType">
                            <el-radio v-for="(item) in productTypeList" :key="item.key" :label="item.key">{{item.label}}
                            </el-radio>
                        </el-radio-group>
                    </el-popover>

                    <div class="switch-card-text blue u-cursor" @click="handleSwitch">{{tableShow ? '统计图显示' : '表格显示'}}</div>
                </div>
            </div>

            <div v-show="!tableShow" class="total-statistic">
                <template v-if="props.statisticType === 'user'">
                    <span class="u-m-r-10">新增用户数</span>
                    <span>共计{{ totalStatistic }}人</span>
                </template>

                <template v-else>共收益￥{{ totalStatistic }}</template>

            </div>

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
                            :y-axis-end-text="yAxixEndText"
                            :x-axis-data="xAxisData"
                            :line-data="lineData"
                    />

                </el-col>
            </el-row>

        </div>
    </div>

</template>

<script setup>
  import {reactive, ref, onMounted, computed, watch, defineProps, defineEmits, getCurrentInstance} from 'vue';
  import dayjs from 'dayjs';
  import MutiLine from '@/components/Echarts/muti-line';

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

  const timeRange = ref([])
  const startDate = ref(null)
  const productType = ref('0')
  const productTypeList = reactive([
    {label:'全部', key:'0'},
    {label:'智文', key:'1'},
    {label:'智绘', key:'2'},
    {label:'智像', key:'3'},
    {label:'AI ERP', key:'4'},
  ])
  const lineData = ref([])
  const tableData = ref([])
  const tableColumnConfig = ref([])
  const xAxisData = ref([])
  const selectOptions = ref([
    {label:'按天统计', value:'1'},
    {label:'按月统计', value:'2'},
  ])
  const dateScopeType = ref('1')
  const tableShow = ref(false)
  const monthPickerOptions = reactive({
    onPick: monthPickerChange,
    disabledDate: disabledMonth
  })

  function disabledMonth (e) {
    console.log('disabledMonth', e)
    console.log('startDate', startDate.value)
    let minMonth = '202302'
    let maxMonth = '202308'
    // 时间选择器月份信息
    const timeyear = e.getFullYear()
    let timemonth = e.getMonth() + 1
    if (timemonth >= 1 && timemonth <= 9) {
      timemonth = '0' + timemonth
    }
    const elTimeData = timeyear.toString() + timemonth.toString()
    if (elTimeData > maxMonth) {
      return true
    }
    if (elTimeData < minMonth) {
      return true
    }
  }
  function monthPickerChange ({ maxDate, minDate }) {
    console.log('maxDate', maxDate)
    console.log('minDate', minDate)
    // if (!maxDate) {
    //   this.time = minDate
    // } else {
    //   this.time = ''
    // }
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


      emit('update',
          {
            productType:productType.value,
            dateScopeType:dateScopeType.value,
            startDate:_start,
            endDate:_end,
          })
    }
  }
  function dateChange(dates) {
    timeRange.value = dates;
    if (dates === null || dates.length === 0) {
      startDate.value = null
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
     * 按月筛选，则时间区间选择为（6~24）月
     * */
    const day = 24 * 60 * 60 * 1000;
    // 当前选中的时间
    const timestamp = time.getTime()
    if (startDate.value !== null) {
      const startDateTime = startDate.value.getTime();
      // 小于7-30天
      const lessThan = timestamp < startDateTime - 7 * day && timestamp > startDateTime - 30 * day
      // 大于7-30天
      const moreThan = timestamp > startDateTime + 7 * day && timestamp < startDateTime + 30 * day
      return (
          !(lessThan || moreThan)
      )
    }
  }

  function handleDisabledMonth(time) {
    // console.log('handleDisabledDate', time)
    /**
     * 按月筛选，则时间区间选择为（6~24）月
     * */
    const month = 30 * 24 * 60 * 60 * 1000;
    // 当前选中的时间
    const timestamp = time.getTime()
    if (startDate.value !== null) {
      const startDateTime = startDate.value.getTime();
      // 小于6~24月
      const lessThan = timestamp < startDateTime - 6 * month && timestamp > startDateTime - 24 * month
      // 大于6~24月
      const moreThan = timestamp > startDateTime + 6 * month && timestamp < startDateTime + 24 * month
      return (
          !(lessThan || moreThan)
      )
    }
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
    let tableLastRowObj = {name:'汇总', total: props.totalStatistic };
    tableLastRowData.forEach((value, prop) => {
      tableLastRowObj[prop] = value
    })
    _tableData.push(tableLastRowObj)

    xAxisData.value = _xAxisData
    lineData.value = _seriesData
    tableData.value = _tableData
    tableColumnConfig.value = _tableColumnConfig.concat([{label:'汇总', prop:'total'}])
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
  const productTypeText = computed(()=>{
    const obj = productTypeList.find(item=>item.key === productType.value)
    return obj ? obj['label'] : '';
  })

  // 统计图表切换类型
  watch(
    () => productType.value,
    Category => {
      let data = [];
      // 过滤数据
      if (productTypeText.value !== '全部') {
        data = props.statisticData.filter(item=>item.name ===  productTypeText.value)
      }else {
        data = props.statisticData
      }

      formatLineData(data)

      emit('update',
          {
            productType:productType.value,
            dateScopeType:dateScopeType.value,
            startDate:timeRange.value[0],
            endDate:timeRange.value[1],
          })
    }
  )

  watch(
      () => props.statisticData,
      value => {
        formatLineData(value)
      },
      {deep: true}
  )

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
            align-items: center;
            justify-content: end;

            ::v-deep .el-select{
                width: 110px;
            }

            .btn-item{
                position: relative;
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