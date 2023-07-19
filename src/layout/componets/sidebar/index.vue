<template>
  <div class="sidebar_container">
    <div>logo</div>
    <div class="menu_container">
        <span>菜单栏</span>
      <!-- <el-menu
        :default-active="activeIndex2"
        class="el-menu-demo"
        mode="horizontal"
        background-color="#242d3f"
        text-color="#fff"
        @select="handleSelect"
      >
        <el-menu-item index="1">Processing Center</el-menu-item>
        <el-menu-item index="4">Orders</el-menu-item>
      </el-menu> -->
    </div>
    <div>user</div>
  </div>
</template>

<style lang="scss" scoped>
.sidebar_container {
  padding: 15px;
  display: flex;
  background: #242d3f;
  width: 100%;
  align-items: center;
  justify-content: space-between;
  color: #fff;
  .menu_container {
    flex: 1;
    padding: 0 10px;
  }
}
</style>