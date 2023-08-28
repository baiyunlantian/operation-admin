<template>
    <Echarts ref="echartsRef" :option-config="echartsOptions" :is-empty="lineData.length === 0"/>
</template>

<script setup>
  import { ref, watch, defineProps } from 'vue';
  import Echarts from '@/components/Echarts';

  const props = defineProps({
    height: {
      type: String,
      default: '100%'
    },
    width: {
      type: String,
      default: '100%'
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
        return [{type:'line'}]
      }
    },
    xAxisData: {
      required: true,
      type: Array,
      default() {
        return []
      }
    },
    optionConfig: {
      type: Object,
      default() {
        return {}
      }
    },
  })
  const echartsRef = ref()
  const echartsOptions = ref({})

  // 初始化
  function echartsInit() {
    let option = {
      legend: {
        show: true
      },
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
        data: props.xAxisData,
      },
      yAxis: {
        type: 'value',
        splitLine : {
          show:false
        },
        name: props.yAxisEndText || '',
        minInterval: 1,
      },
      series: props.lineData || []
    };

    echartsOptions.value = Object.assign(option, props.optionConfig)
    setTimeout(() => {
      echartsRef.value.init()
    }, 100)
  }


  watch(() => props.lineData, (newVal, oldVal) => {
        echartsInit()
    },
  )

</script>

<style scoped>

</style>