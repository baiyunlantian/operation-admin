<template>
    <div class="header_container">

        <div class="logo-container">
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
                        :router="true"
                        @select="handleSelect"
                >

                    <template v-if="menuItems === 'left'">
                        <template v-for="(menu, index) in leftMenuList" :key="menu.menuId">
                            <el-menu-item v-if="menu.children.length === 0" class="menu-item"  :index="menu.path">
                                {{menu.name}}
                            </el-menu-item>

                            <el-sub-menu v-else class="sub-menu-item" :index="index+'b'">
                                <template #title>{{menu.name}}</template>
                                <template v-for="(secondMenu, sIndex) in menu.children" :key="secondMenu.menuId">
                                    <el-menu-item :index="secondMenu.path">{{secondMenu.name}}</el-menu-item>
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
                                            <el-icon :size="36"><Avatar /></el-icon>
                                        </div>
                                    </div>
                                </template>
                                <template v-for="(secondMenu, sIndex) in menu.children" :key="secondMenu.menuId">
                                    <el-menu-item :index="secondMenu.path">{{secondMenu.name}}</el-menu-item>
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

  const router = useRouter();
  const _menuList = [
    {
      type: 'system',
      name: '首页',
      descType: 'text',
      menuId: '1',
      path: '/home',
      menuData:'indexAdmin',
      children: []
    },
    {
      type:'user',
      name:'个人中心',
      descType:'img',
      menuId:'2',
      path:'',
      children:[
        {
          type:'user',
          name:'个人资料',
          descType:'text',
          menuId:'2-1',
          path:'/info',
          children:[],
        },
        {
          type:'user',
          name:'修改密码',
          descType:'text',
          menuId:'2-2',
          path:'/updatePassword',
          children:[],
        }
      ]
    },
    {
      type: 'system',
      name: '用户管理',
      descType: 'text',
      menuId: '3',
      path: '',
      children: [
        {
          type:'system',
          name:'会员用户列表',
          descType:'text',
          menuId:'3-1',
          path:'/member',
          children:[],
          meta:{level:'用户中心'}
        },
        {
          type:'system',
          name:'后台用户列表',
          descType:'text',
          menuId:'3-2',
          path:'/operate',
          children:[],
        },
      ]
    },
    {
      type: 'system',
      name: '统计',
      descType: 'text',
      menuId: '4',
      path: '',
      children: [
        {
          type:'system',
          name:'用户统计',
          descType:'text',
          menuId:'4-1',
          path:'/userStatistic',
          children:[],
        },
        {
          type:'system',
          name:'交易统计',
          descType:'text',
          menuId:'4-2',
          path:'/trading',
          children:[],
        },
      ]
    },
  ]
  const menuList = reactive(_menuList)
  const activeIndex = ref('/home')

  const leftMenuList = computed(() => {
    return menuList.filter(item=>item.type === 'system')
  })
  const rightMenuList = computed(() => {
    return menuList.filter(item=>item.type === 'user')
  })

  function handleSelect() {}

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
        .el-menu-item{
            color: #000000;
        }
    }

    .header_container{
        position: relative;
        display: flex;
        align-content: center;
        background: blue;

        .logo-container{
            position: relative;
            margin: 0 50px;
            .logo{
                margin-top: 10px;
            }
        }

        .menu-container{
            position: relative;
            display: flex;
            align-items: center;
            justify-content: space-between;
            flex: 1;

            .el-menu-left{
                position: relative;
            }

            .el-menu-right{
                position: relative;
                border-bottom: unset;

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