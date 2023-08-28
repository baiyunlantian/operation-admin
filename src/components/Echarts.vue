<template>
    <div class="echarts-container-private">
        <div v-show="!isEmpty" class="echarts-content-private" ref="echartsRef" :style="{height: height,width:width }"></div>
        <div v-show="isEmpty" class="echarts-empty-text-private">暂无数据</div>
    </div>
</template>

<script setup>
  import { ref, defineProps, defineExpose, onBeforeUnmount } from 'vue';
  import * as echarts from 'echarts';

  const props = defineProps({
    height: {
      type: String,
      default: '100%'
    },
    width: {
      type: String,
      default: '100%'
    },
    optionConfig: {
      required: true,
      type: Object,
      default() {
        return {}
      }
    },
    isEmpty: {
      type: Boolean,
      required: true,
      default: false
    }
  })

  const echartsRef = ref(null)
  defineExpose({
    init,
    resize,
  })

  let myChars = null
  // 初始化
  function init() {
    if (myChars === null) {
      myChars = echarts.init(echartsRef.value)
    }
    myChars.clear(); // 清除画布内容
    myChars.setOption(props.optionConfig)
    window.addEventListener('resize', resize)
  }

  function resize() {
    myChars.resize()
  }

  onBeforeUnmount(() => {
    window.removeEventListener('resize', resize)
  })
</script>

<style scoped lang="scss">
    .echarts-container-private {
        height: 100%;

        .echarts-content-private {
            height: inherit;
        }

        .echarts-empty-text-private {
            height: inherit;
            display: grid;
            place-items: center;
            font-size: 16px;
        }
    }
</style>