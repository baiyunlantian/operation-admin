<template>
  <div class="sidebar_container">
    <div class="logo_container">logo</div>
    <div class="menu_container">
      <el-menu
        :default-active="active"
        class="el-menu-demo"
        mode="horizontal"
        background-color="#242d3f"
        text-color="#fff"
      >
        <el-menu-item index="/home" @click="goToPage('/home')">
          <div>首页</div>
        </el-menu-item>
        <template v-for="(items) in menuList" :key="items.name">
          <el-sub-menu v-if="items.children" :index="items.path">
            <template #title>{{items.meta.title}}</template>
            <el-menu-item
              v-for="(item) in items.children"
              :key="item.name"
              :index="item.fullPath"
              @click="goToPage(item.fullPath)"
            >{{item.meta.title}}</el-menu-item>
          </el-sub-menu>
          <el-menu-item v-else :index="items.path" @click="goToPage(items.fullPath)">
            <div>{{items.meta.title}}</div>
          </el-menu-item>
        </template>
      </el-menu>
    </div>
    <div class="user_container">
      <el-avatar src="https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png" />
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      active: ""
    };
  },
  created() {
    console.log(this.$route);
  },
  computed: {
    menuList() {
      return this.$store.getters["user/filterRouter"];
    }
  },
  watch: {
    "$route.fullPath": {
      immediate: true,
      handler(value) {
        console.log(value);
        this.active = value;
      }
    }
  },
  methods: {
    goToPage(url) {
      this.$router.push({
        path: url
      });
    }
  }
};
</script>

<style lang="scss" scoped>
.sidebar_container {
  display: flex;
  background: #242d3f;
  width: 100%;
  align-items: center;
  justify-content: space-between;
  color: #fff;
  .logo_container {
    padding: 8px 20px;
  }
  .menu_container {
    flex: 1;
  }
  .user_container {
    padding: 0 20px;
  }
  .el-menu {
    border: none;
    .el-menu-item {
      .el-sub-menu__title {
        line-height: 50px;
      }
    }
  }
}
</style>