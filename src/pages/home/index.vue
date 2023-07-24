<template>
  <div class="home-container">

    <div class="statistic-container u-m-t-10">
      <el-row class="w-100" :gutter="0">
        <el-col v-for="(item, index) in totalStatisticConfig"  :span="6" :offset="index === 0 ? 0 : 3"  :key="index" class="item bg-fff">
          <div class="img-container">
            <img :src="item.imgUrl"/>
          </div>

          <div class="text-container">
            <div class="desc">{{item.text}}</div>
            <div class="value">{{index === 0 ? item.value : `￥${item.value}`}}</div>
          </div>
        </el-col>
      </el-row>
    </div>

    <div class="title u-m-t-20">用户统计</div>
    <UserStatistic />

    <div class="title u-m-t-20">收益统计</div>
    <EarningsStatistic />

    <div class="title u-m-t-20">运营快捷入口</div>
    <div class="fast-container bg-fff">
      <el-row class="w-100" :gutter="0">
        <el-col v-for="(item,index) in fastRouteConfig"  :span="1" :offset="1" :key="index" class="item u-cursor" @click="handleClickFast(item)">
          <img :src="item.img"/>
          <div class="text">{{item.label}}</div>
        </el-col>
      </el-row>
    </div>

    <BottomBox />
  </div>
</template>
  
<script setup>
  import { reactive, ref } from 'vue';
  import { useRouter } from 'vue-router';
  import UserImg from '@/assets/images/home-user.png';
  import MoneyImg from '@/assets/images/home-money.png';
  import IncreaseImg from '@/assets/images/home-increase.png';
  import FastUser from '@/assets/images/fast-user.png';
  import FastIncrease from '@/assets/images/fast-increase.png';
  import UserStatistic from './components/userStatistic';
  import EarningsStatistic from './components/earningsStatistic';
  import BottomBox from '@/components/bottom-box';

  const router = useRouter();
  const totalStatisticConfig = reactive([
    {text:'今日新增用户', value:'200', imgUrl:UserImg},
    {text:'今日收益总额', value:'200.00', imgUrl:MoneyImg},
    {text:'近7天收益总额', value:'200279873.00', imgUrl:IncreaseImg},
  ])
  const fastRouteConfig = ref([
    {label:'用户管理', path:'/member', img:FastUser},
    {label:'交易统计', path:'/trading', img:FastIncrease},
  ])

  function handleClickFast(item) {
    router.push({path:item.path})
  }

</script>
  
<style scoped lang="scss">
  .home-container{
    position: relative;

    .statistic-container{
      position: relative;

      .w-100{
        width: 100%;
      }

      .item{
        position: relative;
        height: 125px;
        border: 1px solid #cacaca;
        border-radius: 5px;
        display: flex;
        align-items: center;
        justify-content: space-evenly;

        .img-container{
          position: relative;
          width: 60px;
          height: 60px;

          img{
            width: 100%;
            height: 100%;
          }
        }

        .text-container{
          text-align: center;
          .desc{
            color: gray;
            font-size: 16px;
          }

          .value{
            font-size: 20px;
            width: 160px;
            text-overflow: ellipsis;
            white-space: nowrap;
            overflow: hidden;
          }
        }
      }
    }

    .title{
      position: relative;
      background-color: blue;
      color: #fff;
      padding: 15px;
      border-radius: 5px;
    }

    .fast-container{
      position: relative;
      padding: 40px 0;

      img{
        width: 50px;
        height: 50px;
      }

      .text{
        color: gray;
      }
    }

  }
</style>
  