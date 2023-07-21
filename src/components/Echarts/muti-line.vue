<template>
    <div class="echarts-ref" ref="echartsRef" :style="{height: height,width:width }"></div>
</template>

<script setup>
  import { reactive, ref, onMounted, computed, watch, defineProps } from 'vue';
  import * as echarts from 'echarts';

  const props = defineProps({
    height: {
      type: String,
      required: true,
    },
    width: {
      type: String,
      required: true,
    },
    // x轴末端显示的文字
    xAxisEndText: String,
    // y轴顶端显示的文字
    yAxisEndText: String,
    // lineData 是个多维数组
    lineData: {
      required: true,
      type: Array,
      default() {
        return []
      }
    },
  })
  const echartsRef = ref(null)
  const xAxisData = ref([])
  const seriesData = ref([])
  const legendData = ref([])

  // 初始化
  function echartsInit() {
    const myChars = echarts.init(echartsRef.value)
    myChars.clear(); // 清除画布内容
    myChars.setOption({
      legend: {data: legendData.value},
      // 鼠标移动到数据项时显示
      tooltip: {
        trigger: 'axis',
      },
      xAxis: {
        type: 'category',
        axisTick:{
          alignWithLabel:true
        },
        name: props.xAxisEndText || '',
        data: xAxisData.value,
      },
      yAxis: {
        type: 'value',
        splitLine : {
          show:false
        },
        name: props.yAxisEndText || ''
      },
      series: seriesData.value
    })
  }

  // 格式化数据
  function formatLineData(lineData) {
    let _xAxisData = [], _seriesData = [], _legendData = [];
    lineData.forEach((items, index)=>{
      let seriesItem = {type:'line', name:items.name, data:[]};

      (items.series || []).forEach((item, itemIndex)=>{
        if (index === 0) {
          _xAxisData.push(item.xAxia)
        }
        seriesItem['data'].push(item.yAxia)
      })

      _seriesData.push(seriesItem)
      _legendData.push(items.name)
    })


    xAxisData.value = _xAxisData
    seriesData.value = _seriesData
    legendData.value = _legendData

    setTimeout(() => {
      echartsInit()
    }, 100)
  }

  // onMounted(() => {
  //   echartsInit()
  // });

  watch(() => props.lineData, (newVal, oldVal) => {
      formatLineData(newVal)
    },
    {deep:true}
  )

</script>

<style scoped>

</style>