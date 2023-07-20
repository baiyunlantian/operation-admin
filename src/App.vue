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
    const _ResizeObserver = window.ResizeObserver;
    window.ResizeObserver = class ResizeObserver extends _ResizeObserver{
      constructor(callback) {
        callback = debounce(callback, 16);
        super(callback);
      }
    }
    return { age, Fn, debounce, _ResizeObserver };
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
<<<<<<< HEAD
  width: 100%;
  height: 100%;
=======
}
html,
body {
  margin: 0;
  padding: 0;
>>>>>>> 979a1740bafefa9ec3cb4818b8efacfde94e23d1
}
</style>
