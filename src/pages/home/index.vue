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
            <div class="value">{{index === 0 ? totalStatisticData[item.prop] : `￥${totalStatisticData[item.prop]}`}}</div>
          </div>
        </el-col>
      </el-row>
    </div>

    <UserStatistic />
    <EarningsStatistic />
    <InviteStatistic />

    <div class="title-box theme-bg u-m-t-20">运营快捷入口</div>
    <div class="fast-container bg-fff">
      <el-row class="w-100" :gutter="0">
        <el-col v-for="(item,index) in fastRouteConfig"  :span="1" :offset="1" :key="index" class="item u-cursor" @click="handleClickFast(item)">
          <img :src="item.img"/>
          <div class="text">{{item.label}}</div>
        </el-col>
      </el-row>
    </div>

  </div>
</template>
  
<script setup>
  import { reactive, ref, onMounted, watch, computed } from 'vue';
  import { useRouter } from 'vue-router';
  import { useStore } from 'vuex';

  import API from './api';
  import UserImg from '@/assets/images/home-user.png';
  import MoneyImg from '@/assets/images/home-money.png';
  import IncreaseImg from '@/assets/images/home-increase.png';
  import FastUser from '@/assets/images/fast-user.png';
  import FastIncrease from '@/assets/images/fast-increase.png';
  import UserStatistic from './components/userStatistic';
  import EarningsStatistic from './components/earningsStatistic';
  import InviteStatistic from './components/inviteStatistic';

  const router = useRouter();
  const store = useStore();

  const totalStatisticConfig = ref([
    {text:'今日新增用户', prop:'todayNewUserCount', imgUrl:UserImg},
    {text:'今日收益总额', prop:'todayIncomeAmount', imgUrl:MoneyImg},
    {text:'近7天收益总额', prop:'weekIncomeAmount', imgUrl:IncreaseImg},
  ])
  const fastRouteConfig = ref([
    {label:'用户管理', path:'/member', img:FastUser},
    {label:'交易统计', path:'/tradingStatistic', img:FastIncrease},
  ])
  const totalStatisticData = reactive({
    todayNewUserCount: 0,
    todayIncomeAmount: 0,
    weekIncomeAmount: 0
  })

  function handleClickFast(item) {
    router.push({path:item.path})
  }

  function handleGetBoardInfo() {
    API.getBoardInfo().then(res=>{
      if (res.code == '0') {
        Object.assign(totalStatisticData, res.data)
      }
    })
  }

  onMounted(() => {
    handleGetBoardInfo()

  })

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
  