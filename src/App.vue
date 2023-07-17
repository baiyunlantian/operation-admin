<template>
  <img alt="Vue logo" src="./assets/logo.png" />
  <HelloWorld msg="Welcome to Your Vue.js App" />
  <el-button  @click="Fn" type="primary">{{age}}</el-button>
  <el-icon><Male /></el-icon>
  
 
</template>

<script >
import HelloWorld from "./components/HelloWorld.vue";
import { reactive } from "vue";
export default {
  name: "App",
  components: {
    HelloWorld
  },
  setup() {
    let age = reactive({ value: 18 });
    function Fn() {
      age.value = 666;
      console.log(age);
    }
    return { age, Fn };
  },
  created(){

  },
};
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
