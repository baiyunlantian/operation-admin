<template>
  <div class="home_container">
    <div class="header_container">
      <div class="header_list">
        <el-row :gutter="20">
          <el-col :span="6">1</el-col>
          <el-col :span="6">1</el-col>
          <el-col :span="6">1</el-col>
        </el-row>
      </div>
      <div>
        <upload v-model:fileList="fileList" :on-preview="test">
          <!-- <template #file="{ file }">{{file}}</template> -->
        </upload>
        <div class="del" @click="del">{{fileList}}</div>
      </div>
      <!-- <el-dialog v-model="dialogVisible">
        <img w-full :src="dialogImageUrl" alt="Preview Image" />
      </el-dialog>-->
    </div>
  </div>
</template>
  
<script setup>
import { ref, reactive, onBeforeMount } from "vue";
import upload from "@/components/upload.vue";
const fileList = ref([
  {
    name: "food.jpeg",
    url:
      "https://fuss10.elemecdn.com/3/63/4e7f3a15429bfda99bce42a18cdd1jpeg.jpeg?imageMogr2/thumbnail/360x360/format/webp/quality/100"
  },
  {
    name: "food2.jpeg",
    url:
      "https://fuss10.elemecdn.com/3/63/4e7f3a15429bfda99bce42a18cdd1jpeg.jpeg?imageMogr2/thumbnail/360x360/format/webp/quality/100"
  }
]);

const del = () => {
  fileList.value.splice(0, 1);
};

const test = file => {
  console.log(file);
};
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
  