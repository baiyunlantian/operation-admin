<template>
  <div class="home-container">

    <div class="statistic-container u-m-t-10">
      <el-row class="w-100" :gutter="0">
        <el-col v-for="(item, index) in totalStatisticConfig"  :span="6" :offset="index === 0 ? 0 : 3"  :key="index" class="item bg-fff">
          <div class="img-container">
            <img :src="item.imgUrl"/>
          </div>

          <div class="text-container">
            <div class="desc">{{item.text}}</div>
            <div class="value">{{index === 0 ? item.value : `￥${item.value}`}}</div>
          </div>
        </el-col>
      </el-row>
    </div>

    <div class="title u-m-t-20">用户统计</div>
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
          <el-popover placement="right" :width="150" trigger="click">
            <template #reference>
              <div class="popover-text">
                <span class="point"></span>
                <span class="text u-m-l-10">{{userEchartsCategoryText}}</span>
              </div>
            </template>
            <el-radio-group v-model="userEchartsCategory">
              <el-radio v-for="(item) in userEchartsCategoryList" :key="item.key" :label="item.key">{{item.label}}
              </el-radio>
            </el-radio-group>
          </el-popover>

          <div class="time-range">
            <div v-for="(item, index) in timeRangeTags" :key="index"
                 :class="[timeRangeTagActive === item.key ? 'active' : '', 'u-cursor u-m-r-10']"
                 @click="handleClickTimeTag('user', item.key)"
            >
              {{ item.label }}
            </div>
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
        </div>
      </div>

      <div class="echarts-container">
        <MutiLine
                height="500px"
                width="100%"
                x-axis-end-text="日期/天"
                y-axis-end-text="用户/人"
                :line-data="userEchartsDataList"
        />
      </div>

    </div>
  </div>
</template>
  
<script setup>
  import { reactive, ref, onMounted, computed, watch } from 'vue';
  import dayjs from 'dayjs';
  import * as echarts from 'echarts';
  import UserImg from '@/assets/images/home-user.png';
  import MoneyImg from '@/assets/images/home-money.png';
  import IncreaseImg from '@/assets/images/home-increase.png';
  import MutiLine from '@/components/Echarts/muti-line';

  const timeRange = reactive({data:[]})
  const startDate = ref(null)
  const echartsRef = ref(null)
  const userEchartsCategory = ref('ALL')
  const timeRangeTagActive = ref('today')
  const totalStatisticConfig = reactive([
    {text:'今日新增用户', value:'200', imgUrl:UserImg},
    {text:'今日收益总额', value:'200.00', imgUrl:MoneyImg},
    {text:'近7天收益总额', value:'200279873.00', imgUrl:IncreaseImg},
  ])
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
  const timeRangeTags = reactive([
    {label:'今日', key:'today'},
    {label:'最近7天', key:'week'},
    {label:'最近一个月', key:'month'},
  ])

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
  // 点击图表上的日期tag
  function handleClickTimeTag(type, tagValue) {
    timeRangeTagActive.value = tagValue
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
  // 获取用户统计图表
  function handleGetUserStatistic() {
    // console.log('userEchartsCategory', userEchartsCategory.value)
    // console.log('timeRangeTagActive', timeRangeTagActive.value)
    // console.log('timeRangeTagActive', timeRange.data)

    let list = [], i = 0;

    while (i < 10) {
      const random = Math.floor(Math.random() * 500)
      list.push({name:i, value:random})
      i++;
    }

    setTimeout(() => {
      userEchartsDataList.value = list
    }, 1500)
  }

  const userEchartsCategoryText = computed(()=>{
    const obj = userEchartsCategoryList.find(item=>item.key === userEchartsCategory.value)
    return obj ? obj['label'] : '';
  })

  // 用户统计图表切换
  watch(
          () => userEchartsCategory.value,
          value => {
            handleGetUserStatistic()
          }
  )


  onMounted(() => {
    handleGetUserStatistic();
  })

</script>
  
<style scoped lang="scss">
  .home-container{
    position: relative;

    .statistic-container{
      position: relative;

      .w-100{
        width: 100%;
      }

      .item{
        position: relative;
        height: 125px;
        border: 1px solid #cacaca;
        border-radius: 5px;
        display: flex;
        align-items: center;
        justify-content: space-evenly;

        .img-container{
          position: relative;
          width: 60px;
          height: 60px;

          img{
            width: 100%;
            height: 100%;
          }
        }

        .text-container{
          text-align: center;
          .desc{
            color: gray;
            font-size: 16px;
          }

          .value{
            font-size: 20px;
            width: 160px;
            text-overflow: ellipsis;
            white-space: nowrap;
            overflow: hidden;
          }
        }
      }
    }

    .title{
      position: relative;
      background-color: blue;
      color: #fff;
      padding: 15px;
      border-radius: 5px;
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
            }

            .text{
              color: blue;
            }
          }
        }
      }

      .echarts-container{
        height: 600px;
        width: 80%;
        margin: 0 auto;
        display: flex;
        align-items: center;

        .echarts-ref{
          height: 500px;
          width: 100%;
        }
      }
    }
  }
</style>
  