<template>
    <div class="header_container">

        <div class="logo-container">
            <img class="logo" src="@/assets/images/logo.png">
        </div>

        <div class="menu-container">
            <el-menu
                    :default-active="activeIndex"
                    class="el-menu-left"
                    mode="horizontal"
                    background-color="transparent"
                    text-color="#ffffff"
                    :ellipsis="false"
                    @select="handleSelect"
            >
                <template v-for="(menu, index) in leftMenuList" :key="menu.menuId">
                    <el-menu-item v-if="menu.children.length === 0" class="menu-item"  :index="menu.menuId">
                        {{menu.name}}
                    </el-menu-item>

                    <el-sub-menu v-else class="sub-menu-item" :index="index+'b'">
                        <template #title>{{menu.name}}</template>
                        <template v-for="(secondMenu, sIndex) in menu.children" :key="secondMenu.menuId">
                            <el-menu-item :index="secondMenu.menuId+'c'">{{secondMenu.name}}</el-menu-item>
                        </template>
                    </el-sub-menu>
                </template>
            </el-menu>

            <el-menu
                    class="el-menu-right"
                    mode="horizontal"
                    background-color="transparent"
                    text-color="#ffffff"
                    active-color="#ffffff"
                    :ellipsis="false"
                    @select="handleSelect"
            >
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
                            <el-menu-item :index="secondMenu.menuId+'c'">{{secondMenu.name}}</el-menu-item>
                        </template>
                    </el-sub-menu>
                </template>
            </el-menu>
        </div>

    </div>
</template>

<script setup>
  import {reactive, ref, computed } from 'vue';

  const _menuList = [
    {
      type: 'system',
      name: '首页',
      descType: 'text',
      menuId: '1',
      path: '/index',
      menuData:'indexAdmin',
      children: []
    },
    {
      type:'user',
      name:'我的',
      descType:'img',
      menuId:'2',
      path:'/index',
      children:[
        {
          type:'user',
          name:'账号设置',
          descType:'text',
          menuId:'2-1',
          path:'',
          children:[],
        },
        {
          type:'user',
          name:'个人信息',
          descType:'text',
          menuId:'2-2',
          path:'',
          children:[],
        }
      ]
    },
    {
      type: 'system',
      name: '用户管理',
      descType: 'text',
      menuId: '3',
      path: '/index',
      children: [
        {
          type:'system',
          name:'用户中心',
          descType:'text',
          menuId:'3-1',
          path:'',
          children:[],
        },
      ]
    },
  ]
  const menuList = reactive(_menuList)
  const activeIndex = ref('1')
  const activeIndex1 = ref('2')

  const leftMenuList = computed(() => {
    return menuList.filter(item=>item.type === 'system')
  })
  const rightMenuList = computed(() => {
    return menuList.filter(item=>item.type === 'user')
  })

  function handleSelect() {

  }
  function handleClick() {

  }
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
</style>