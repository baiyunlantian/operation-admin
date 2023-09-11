<template>
  <div class="header_container theme-bg">
    <div class="logo-container">
      <!--            <div class="logo-text">MLYK</div>-->
      <img class="logo" src="@/assets/images/logo.png" />
    </div>

    <div class="menu-container">
      <template v-for="(menuItems, index) in ['left', 'right']" :key="index">
        <el-menu
          :default-active="activeIndex"
          :class="`el-menu-${menuItems}`"
          mode="horizontal"
          background-color="transparent"
          text-color="#ffffff"
          :active-color="menuItems === 'left' ? '#FD681C' : '#ffffff'"
          :ellipsis="false"
          :router="false"
          @select="handleSelect"
        >
          <template v-if="menuItems === 'left'">
            <template v-for="(menu, index) in leftMenuList" :key="menu.menuId">
              <el-menu-item
                v-if="menu.children.length === 0 && handleShowMenu(menu.permission)"
                class="menu-item"
                :index="menu.path"
              >
                {{ menu.name }}
              </el-menu-item>

              <el-sub-menu
                v-else-if="menu.children.length > 0 && handleShowMenu(menu.permission)"
                class="sub-menu-item"
                :index="index + 'b'"
              >
                <template #title>{{ menu.name }}</template>
                <template
                  v-for="(secondMenu, sIndex) in menu.children"
                  :key="secondMenu.menuId"
                >
                  <!--   没有三级路由  -->
                  <template v-if="secondMenu.children.length === 0">
                    <el-menu-item v-if="handleShowMenu(secondMenu.permission)" :index="secondMenu.path">
                      {{ secondMenu.name }}
                    </el-menu-item>
                  </template>

                  <!--   三级路由  -->
                  <template v-else>
                    <template v-if="handleShowMenu(secondMenu.permission)">
                      <div class="third-menu-item">
                        <div class="sub-menu-item-desc u-font-weight">{{ secondMenu.name }}</div>
                        <template v-for="(thirdMenu) in secondMenu.children" :key="thirdMenu.menuId">
                          <el-menu-item v-if="handleShowMenu(thirdMenu.permission)" :index="thirdMenu.path">
                            {{ thirdMenu.name }}
                          </el-menu-item>
                        </template>
                      </div>
                    </template>

                  </template>
                </template>
              </el-sub-menu>
            </template>
          </template>

          <template v-else>
            <template v-for="(menu, index) in rightMenuList" :key="menu.menuId">
              <el-sub-menu class="sub-menu-item" :index="index + 'b'">
                <template #title>
                  <div class="user-box u-flex u-col-center">
                    <div class="user-child">
                      <img
                        :src="userInfo.userImage || AutoAvatar"
                        style="height: 100%; width: 100%"
                      />
                    </div>
                  </div>
                </template>
                <template
                  v-for="(secondMenu, sIndex) in menu.children"
                  :key="secondMenu.menuId"
                >
                  <el-menu-item
                    v-if="
                      secondMenu.permission.length === 0 ||
                      secondMenu.permission.includes(userInfo.roleId)
                    "
                    :index="secondMenu.path"
                    >{{ secondMenu.name }}</el-menu-item
                  >
                </template>
              </el-sub-menu>
            </template>
          </template>
        </el-menu>
      </template>
    </div>
  </div>
</template>

<script setup>
import { reactive, ref, computed, watch } from "vue";
import { useRouter } from "vue-router";
import { useStore } from "vuex";
import AutoAvatar from "@/assets/images/account.png";
import MENULIST from "./menuList";

const router = useRouter();
const store = useStore();

const menuList = reactive(MENULIST);
const activeIndex = ref("/home");

const leftMenuList = computed(() => {
  return menuList.filter((item) => item.type === "system");
});
const rightMenuList = computed(() => {
  return menuList.filter((item) => item.type === "user");
});

function handleSelect(index, indexPath, item) {
  if (!index) {
    // 退出登录
    localStorage.clear();
    store.commit("tagsView/DEL_ALL_VISITED_VIEWS");
    store.commit("user/SET_ROLE_ID", "");
    router.push({ path: "/login" });
  } else {
    router.push({ path: index });
  }
}

function handleShowMenu(permission = []) {
  return permission.length === 0 || permission.includes(userInfo.value.roleId)
}

const userInfo = computed(() => {
  const userInfo = store.getters["user/info"];
  const agentInfo = store.getters["user/agentInfo"];
  let obj = { ...userInfo };

  if (userInfo.isAdmin == 1) {
    obj.roleId = 1;
  } else {
    obj.roleId = agentInfo.roleId;
  }

  // store.commit('user/SET_ROLE_ID', obj.roleId);
  // localStorage.setItem("roleId", obj.roleId);
  return obj;
});

watch(
  () => router.currentRoute.value.fullPath,
  (value) => {
    // 添加信息
    activeIndex.value = value;
  },
  { immediate: true }
);
</script>


<style scoped lang='scss'>
.el-menu--popup-container {
  .el-menu-item.is-active {
    color: #3164f5 !important;
  }

  .el-menu-item {
    color: #000;
  }

  .third-menu-item{
    display: flex;
    align-items: center;
    padding-right: 10px;

    .sub-menu-item-desc{
      padding: 0 10px;
      font-size: 14px;
    }
  }
}

.header_container {
  position: relative;
  display: flex;
  align-content: center;

  .logo-container {
    position: relative;
    margin: 0 2%;
    display: flex;
    align-items: center;

    .logo {
      width: 140px;
    }

    .logo-text {
      position: relative;
      font-size: 22px;
      font-weight: bold;
      letter-spacing: 1px;
      font-family: system-ui;
      color: #fdfd0e;
    }
  }

  .menu-container {
    position: relative;
    display: flex;
    align-items: center;
    justify-content: space-between;
    flex: 1;

    ::v-deep .el-menu {
      position: relative;

      .el-sub-menu.is-active {
        .el-sub-menu__title {
          border-bottom: 2px solid #3164f5;
          color: #3164f5;
        }
      }

      .el-menu-item.is-active {
        border-bottom: 2px solid #3164f5;
        color: #3164f5 !important;
        background-color: transparent;
      }
    }

    .el-menu-right {
      position: relative;
      border-bottom: unset;
      margin-right: 20px;

      .sub-menu-item {
        ::v-deep .el-sub-menu__icon-arrow {
          display: none;
        }
      }
      .el-sub-menu.is-active {
        ::v-deep .el-sub-menu__title {
          border-bottom: unset;
          color: #ffffff;
        }
      }

      .user-box {
        height: 100%;

        .user-child {
          width: 40px;
          height: 40px;
          background: #6481f2;
          border-radius: 50%;
          opacity: 1;
          display: flex;
          justify-content: center;
          align-items: center;
          text-align: center;

          span {
            font-size: 22px;
            color: #fff;
          }
        }
      }
    }
  }
}

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