<template>
  <el-container>
    <el-header>Header</el-header>
    <el-main>
      <div class="body">
        <router-view />
      </div>
    </el-main>
  </el-container>
</template>

    
<script>
export default {
  name: "index"
};
</script>