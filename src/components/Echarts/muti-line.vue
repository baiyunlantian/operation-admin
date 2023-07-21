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
    lineData: {
      required: true,
      type: Array,
      default() {
        /**
         * name:    x轴刻度下显示的文本
         * value:   刻度对应的数据
         * */
        return [{name:'', value:''}]
      }
    },
  })
  const echartsRef = ref(null)

  // 初始化
  function echartsInit() {
    const myChars = echarts.init(echartsRef.value)
    myChars.setOption({
      xAxis: {
        type: 'category',
        axisTick:{
          alignWithLabel:true
        },
        name: props.xAxisEndText || ''
      },
      yAxis: {
        type: 'value',
        splitLine : {
          show:false
        },
        name: props.yAxisEndText || ''
      },
      series: [{data: props.lineData, type: 'line'}]
    })
  }

  onMounted(() => {
    echartsInit()
  });

  watch(() => props.lineData, (newVal, oldVal) => {
      console.log('watch-------', newVal)
      setTimeout(() => {
        echartsInit();
      }, 100)
    },
    {deep:true}
  )

</script>

<style scoped>

</style>