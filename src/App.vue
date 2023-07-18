<template>
  <router-view />
</template>

<script >
import { reactive } from "vue";
export default {
  name: "App",
  setup() {
    let age = reactive({ value: 18 });
    function Fn() {
      age.value = 666;
      console.log(age);
    }
    return { age, Fn };
  },
  created() {}
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
