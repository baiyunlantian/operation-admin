<template>
    <div class="header_container theme-bg">

        <div class="logo-container">
<!--            <div class="logo-text">MLYK</div>-->
            <img class="logo" src="@/assets/images/logo.png">
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
                            <el-menu-item v-if="menu.children.length === 0 && permissionList.includes(menu.path) === false || (permissionList.includes(menu.path) && userInfo.isAdmin === 1)" class="menu-item"  :index="menu.path">
                                {{menu.name}}
                            </el-menu-item>

                            <el-sub-menu v-else-if="menu.children.length > 0 && permissionList.includes(menu.path) === false || (permissionList.includes(menu.path) && userInfo.isAdmin === 1)" class="sub-menu-item" :index="index+'b'">
                                <template #title>{{menu.name}}</template>
                                <template v-for="(secondMenu, sIndex) in menu.children" :key="secondMenu.menuId">
                                    <el-menu-item v-if="permissionList.includes(secondMenu.path) === false || (permissionList.includes(secondMenu.path) && userInfo.isAdmin === 1)" :index="secondMenu.path">{{secondMenu.name}}</el-menu-item>
                                </template>
                            </el-sub-menu>
                        </template>
                    </template>

                    <template v-else>
                        <template v-for="(menu, index) in rightMenuList" :key="menu.menuId">
                            <el-sub-menu class="sub-menu-item" :index="index+'b'">
                                <template #title>
                                    <div class="user-box u-flex u-col-center">
                                        <div class="user-child">
                                            <img :src="userInfo.userImage || AutoAvatar" style="height: 100%; width: 100%"/>
                                        </div>
                                    </div>
                                </template>
                                <template v-for="(secondMenu, sIndex) in menu.children" :key="secondMenu.menuId">
                                    <el-menu-item v-if="permissionList.includes(secondMenu.path) === false || (permissionList.includes(secondMenu.path) && userInfo.isAdmin === 1)" :index="secondMenu.path">{{secondMenu.name}}</el-menu-item>
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
  import {reactive, ref, computed, watch} from 'vue';
  import { useRouter } from "vue-router";
  import { useStore } from 'vuex';
  import AutoAvatar from '@/assets/images/account.png';
  import MENULIST from './menuList';

  const router = useRouter();
  const store = useStore();

  const menuList = reactive(MENULIST)
  // 权限路由（临时）
  const permissionList = ref(['/operate', '/distribution']);
  const activeIndex = ref('/home')

  const leftMenuList = computed(() => {
    return menuList.filter(item=>item.type === 'system')
  })
  const rightMenuList = computed(() => {
    return menuList.filter(item=>item.type === 'user')
  })

  function handleSelect(index, indexPath, item) {
    if (!index) {
      // 退出登录
      localStorage.removeItem('token')
      store.commit('tagsView/DEL_ALL_VISITED_VIEWS')
      router.push({path:'/login'})
    }else {
      router.push({path:index})
    }
  }

  const userInfo = computed(() => {
    return store.getters["user/info"];
  });

  watch(
    () => router.currentRoute.value.fullPath,
    value => {
      // 添加信息
      activeIndex.value = value;
    },
    { immediate: true }
  );
</script>


<style scoped lang='scss'>
    .el-menu--popup-container{
        .el-menu-item.is-active {
            color: #3164f5 !important;
        }

        .el-menu-item{
            color: #000 ;
        }
    }

    .header_container{
        position: relative;
        display: flex;
        align-content: center;

        .logo-container{
            position: relative;
            margin: 0 50px;
            display: flex;
            align-items: center;

            .logo{
                width: 140px;
            }

            .logo-text{
                position: relative;
                font-size: 22px;
                font-weight: bold;
                letter-spacing: 1px;
                font-family: system-ui;
                color: #fdfd0e;
            }
        }

        .menu-container{
            position: relative;
            display: flex;
            align-items: center;
            justify-content: space-between;
            flex: 1;

            ::v-deep .el-menu{
                position: relative;

                .el-sub-menu.is-active {
                    .el-sub-menu__title{
                        border-bottom: 2px solid #3164f5;
                        color: #3164f5;
                    }
                }

                .el-menu-item.is-active{
                    border-bottom: 2px solid #3164f5;
                    color: #3164f5 !important;
                    background-color: transparent;
                }
            }

            .el-menu-right{
                position: relative;
                border-bottom: unset;
                margin-right: 20px;

                .sub-menu-item{
                    ::v-deep .el-sub-menu__icon-arrow{
                        display: none;
                    }
                }
                .el-sub-menu.is-active {
                    ::v-deep .el-sub-menu__title{
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