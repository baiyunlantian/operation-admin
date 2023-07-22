<template>
    <div class="trading-container">

        <div class="title">收益总览</div>
        <div class="statistic-container bg-fff">
            <el-row class="w-100" :gutter="0">
                <el-col v-for="(item, index) in totalStatisticConfig"  :span="5" :offset="1"  :key="index" class="item">
                    <div class="value">{{`￥${item.value}`}}</div>
                    <div class="desc">{{item.text}}</div>
                </el-col>
            </el-row>
        </div>

        <Trading />
        <Client />
        <Earnings />
        <Source />

        <div class="bottom bg-box"></div>

    </div>
</template>

<script setup>
  import { reactive, ref } from 'vue';
  import Trading from './components/tradingStatistic';
  import Client from './components/clientStatistic';
  import Earnings from './components/earningsStatistic';
  import Source from './components/sourceStatistic';

  const totalStatisticConfig = reactive([
    {text:'今日收益', value:'200'},
    {text:'本周收益', value:'200'},
    {text:'本月收益', value:'209'},
    {text:'总收益', value:'2079'},
  ])
</script>

<style scoped lang="scss">
    .trading-container{
        position: relative;

        .statistic-container{
            position: relative;
            height: 125px;

            .w-100{
                width: 100%;
            }

            .item{
                display: flex;
                flex-direction: column;
                align-items: center;
                justify-content: center;
                height: 120px;

                .desc{
                    color: gray;
                    font-size: 16px;
                }

                .value{
                    font-size: 28px;
                    color: red;
                }
            }
        }

        .title{
            position: relative;
            background-color: blue;
            padding: 15px;
            border-radius: 5px;
            color: #fff;

            .text{

            }
        }

        .bottom{
            height: 24px;
            width: 100%;
        }

        .bg-box{
            background-color: blue;
            display: inline-block;
        }

    }
</style>