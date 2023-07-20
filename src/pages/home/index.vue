<template>
  <div class="hello">
    <h1 @click="click">首页</h1>
    <div class="chart-container">
      <div class="header">
        <div class="title">标题</div>

        <div class="search-container">
          <el-date-picker
                  v-model="time.data"
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
<!--    <div ref="echartsRef" style="width: 300px; height: 300px"></div>-->
  </div>
</template>
  
<script setup>
  import { reactive, ref, onMounted } from 'vue';
  import dayjs from 'dayjs';
  import * as echarts from 'echarts';

  const time = reactive({data:[]})
  const startDate = ref(null)
  const echartsRef = ref(null)

  function echartsInit() {
    const myChars = echarts.init(echartsRef.value)
    myChars.setOption({  xAxis: {
        type: 'category',
        data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
      },
      yAxis: {
        type: 'value'
      },
      series: [
        {
          data: [150, 230, 224, 218, 135, 147, 260],
          type: 'line'
        }
      ]})
  }
  function datePickerChange(dates) {

    // 记录选择的起始日期
    let hasSelectDate = dates !== null && dates.length > 0
    startDate.value = hasSelectDate ? dates[0] : null

    const [start, end] = dates;
    if (start && end) {
      const _start = dayjs(start).format('YYYY-MM-DD')
      const _end = dayjs(end).format('YYYY-MM-DD')
      time.data = [_start, _end]
    }
  }
  function dateChange(dates) {
    time.data = dates;
    if (dates === null || dates.length === 0) {
      startDate.value = null
    }
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


  onMounted(() => {
    // echartsInit()
  })

</script>
  
<style scoped lang="scss">
h3 {
  margin: 40px 0 0;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}
</style>
  