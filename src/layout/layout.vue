<template>
  <sidebar />
  <tegView />
  <div class="body">
    <router-view />
  </div>
</template>

    
<script>
import sidebar from "./componets/sidebar";
import tegView from "./componets/tegView";
export default {
  name: "layout",
  components: {
    sidebar,
    tegView
  }
};
</script>

<style scoped lang="scss">
  .el-header{
    padding: 0;
  }

  .body{
    padding: 10px 20px 5px 20px;
    flex: 1;
    background-color: #eaedf7;

    >div{
      height: 100%;
    }
  }
</style>