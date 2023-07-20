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
</style>