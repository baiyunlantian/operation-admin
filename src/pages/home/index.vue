<template>
  <div class="hello">
    <h1 @click="click">{{ msg }}</h1>
    <div ref="echartsRef" style="width: 300px; height: 300px"></div>
  </div>
</template>
  
<script setup>
  import { ref, onMounted } from 'vue';
  import { useStore } from 'vuex';
  import * as echarts from 'echarts';

  const store = useStore()
  const msg = ref('首页')
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


  onMounted(() => {
    echartsInit()
  })
  function click() {
    console.log('click')
    store.commit('navCtrl/setNavPath', 'home')
  }

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
  