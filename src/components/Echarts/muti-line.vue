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
  })
  const echartsRef = ref(null)

  // 初始化
  function echartsInit() {
    const myChars = echarts.init(echartsRef.value)
    myChars.clear(); // 清除画布内容
    myChars.setOption({
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
        name: props.yAxisEndText || ''
      },
      series: props.lineData || []
    })
  }

  // onMounted(() => {
  //   echartsInit()
  // });

  watch(() => props.lineData, (newVal, oldVal) => {
      setTimeout(() => {
        echartsInit()
      }, 100)
    },
  )

</script>

<style scoped>

</style>