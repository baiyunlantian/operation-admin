<template>
  <el-container>
    <el-header>
      <sidebar />
      <tegView />
    </el-header>
    <el-main>
      <div class="body">
        <router-view />
      </div>
    </el-main>
  </el-container>
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