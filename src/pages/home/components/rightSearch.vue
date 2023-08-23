<template>
    <div class="right">

        <div class="time-range">
            <div v-for="(item, index) in timeRangeTags" :key="index"
                 :class="[dateScopeType === item.key ? 'active' : '', 'u-cursor u-m-r-10']"
                 @click="handleClickTimeTag(item.key)"
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
  import dayjs from "dayjs";

  const emit = defineEmits(['updateParams'])

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
      dateScopeType: dateScopeType.value,
      startDate: timeRange.value[0],
      endDate: timeRange.value[1],
    }

    emit('updateParams', params)
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
    startDate.value = null
    if (dates === null || dates.length === 0) {
      handleClickTimeTag(2)
    }
  }

  // 点击图表上的日期tag
  function handleClickTimeTag(tagValue) {
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
        timestamp < startDate.value.getTime() - 13 * day ||
        timestamp > startDate.value.getTime() + 13 * day
      )
    }
  }

  onMounted(() => {
    getData();
  })
</script>

<style scoped lang="scss">
    .right{
        display: flex;
        justify-content: flex-end;

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
    }
</style>