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
    }

    const debounce = (fn, delay) => {
      let timer = null;
      return function () {
        let context = this;
        let args = arguments;
        clearTimeout(timer);
        timer = setTimeout(function () {
          fn.apply(context, args);
        }, delay);
      }
    }
    const RESIZEOBSERVER = window.ResizeObserver;
    window.ResizeObserver = class ResizeObserver extends RESIZEOBSERVER{
      constructor(callback) {
        callback = debounce(callback, 16);
        super(callback);
      }
    }
    return { age, Fn, debounce, RESIZEOBSERVER };
  },
  created() {}
};
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}
html,
body {
  margin: 0;
  padding: 0;
}
</style>
