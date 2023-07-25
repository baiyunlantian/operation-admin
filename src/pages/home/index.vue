<template>
  <div class="home_container">
    <div class="header_container">
      <div>
        <div>字段参考element-ui 不同点：action不需要传</div>
        <upload v-model:fileList="fileList">
          <!-- <template #file="{ file }">{{file}}</template> -->
        </upload>
      </div>
    </div>
  </div>
</template>
  
<script setup>
import { ref, reactive, onBeforeMount } from "vue";
import upload from "@/components/upload.vue";
const fileList = ref([]);
</script>

<style lang="scss" scoped>
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
.header_container {
  width: 100%;
  overflow: hidden;
  .header_list {
    padding: 20px;
  }
}
</style>
  