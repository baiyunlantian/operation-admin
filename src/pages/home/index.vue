<template>
  <div class="home_container">
    <div class="header_container">
      <div class="header_list">
        <el-row :gutter="20">
          <el-col :span="6">
            
          </el-col>
          <el-col :span="6">
            
          </el-col>
          <el-col :span="6">
            
          </el-col>
        </el-row>
      </div>
    </div>
  </div>
</template>
  
<script>
export default {
  name: "home",
  data() {
    return {
      msg: "首页"
    };
  }
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
  