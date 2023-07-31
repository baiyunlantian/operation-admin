<template>
    <div class="right">
        <el-popover placement="right" :width="150" trigger="click">
            <template #reference>
                <div class="popover-text">
                    <span class="point"></span>
                    <span class="text u-m-l-10">{{productTypeText}}</span>
                </div>
            </template>
            <el-radio-group v-model="productType">
                <el-radio v-for="(item) in productTypeList" :key="item.key" :label="item.key">{{item.label}}
                </el-radio>
            </el-radio-group>
        </el-popover>

        <div class="time-range">
            <div v-for="(item, index) in timeRangeTags" :key="index"
                 :class="[dateScopeType === item.key ? 'active' : '', 'u-cursor u-m-r-10']"
                 @click="handleClickTimeTag('user', item.key)"
            >
                {{ item.label }}
            </div>
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
        </div>
    </div>
</template>

<script setup>
  import {reactive, ref, onMounted, computed, watch, defineEmits} from 'vue';
  import { useStore } from 'vuex';
  import dayjs from "dayjs";

  const emit = defineEmits(['getData'])
  const store = useStore()

  const productType = ref(0)
  const dateScopeType = ref(2)
  const startDate = ref(null)
  const timeRangeTags = reactive([
    {label:'今日', key:1},
    {label:'最近7天', key:2},
    {label:'最近一个月', key:3},
  ])
  const timeRange = ref([dayjs(new Date()).format('YYYY-MM-DD'), ''])

  function getData() {
    let params = {
      productType: productType.value,
      dateScopeType: dateScopeType.value,
      startDate: timeRange.value[0],
      endDate: timeRange.value[1],
    }

    emit('getData', params)
  }

  function datePickerChange(dates) {
    // 记录选择的起始日期
    let hasSelectDate = dates !== null && dates.length > 0
    startDate.value = hasSelectDate ? dates[0] : null

    const [start, end] = dates;
    if (start && end) {
      const _start = dayjs(start).format('YYYY-MM-DD')
      const _end = dayjs(end).format('YYYY-MM-DD')
      timeRange.value = [_start, _end]

      // 选择时间范围时，清空左侧tag样式
      dateScopeType.value = null
      getData()
    }
  }

  function dateChange(dates) {
    timeRange.value = dates;
    if (dates === null || dates.length === 0) {
      startDate.value = null
    }
  }

  // 点击图表上的日期tag
  function handleClickTimeTag(type, tagValue) {
    dateScopeType.value = tagValue
    timeRange.value = []
    getData()
  }

  // 限定时间选择范围
  function handleDisabledDate(time) {
    const day = 24 * 60 * 60 * 1000;
    const timestamp = time.getTime()
    if (startDate.value !== null) {
      return (
        timestamp < startDate.value.getTime() - 14 * day ||
        timestamp > startDate.value.getTime() + 14 * day
      )
    }
  }

  const productTypeText = computed(()=>{
    const obj = productTypeList.value.find(item=>item.key === productType.value)
    return obj ? obj['label'] : '';
  })

  const productTypeList = computed(() => {
    let res = [{label:'全部', key:0}], list = store.getters['platformType/list']

    if (Array.isArray(list)) {
      res = res.concat(list)
    }

    return res
  })

  // 用户统计图表切换
  watch(
    () => productType.value,
    Category => {

      getData()
    }
  )

  onMounted(() => {
    getData();
  })
</script>

<style scoped lang="scss">
    .right{
        position: relative;
        flex: 1;
        display: flex;
        justify-content: space-between;
        padding: 0 20px;
        z-index: 999;

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
</style>