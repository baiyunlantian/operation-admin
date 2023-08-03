<template>
    <div class="left u-m-l-20 u-m-r-20">
        <div v-for="(item, index) in statisticConfig" :key="index" class="desc-item">
            <div class="desc-text">{{item.title}}</div>
            <div class="value">{{ leftData[item.countProp] }}</div>
            <div :class="[handleJudgeIsIncrease(leftData[item.ratioProp]), 'bottom']">
                <div class="icon"></div>
                <div class="ratio">{{ format(leftData[item.ratioProp]) }}</div>
                <div class="ratio-text">{{item.subText}}</div>
            </div>
        </div>
    </div>
</template>

<script setup>
  import { defineProps } from 'vue';

  const props = defineProps(['statisticConfig', 'leftData'])

  // 去除-号
  function format(value) {
    let text = value

    if (value && value.indexOf('-') === 0) {
      text = value.substr(1)
    }

    return text
  }

  // 判断增长还是下降
  function handleJudgeIsIncrease(value) {
    let className = 'increase'
    if (value && value.indexOf('-') === 0) {
      className = 'descend'
    }

    return className
  }
</script>

<style scoped lang="scss">
    .left{
        position: relative;

        .desc-item{
            position: relative;

            &:last-child{
                margin-top: 30px;
            }

            .desc-text{
                position: relative;
                color: #848484;
            }

            .value{
                position: relative;
                font-size: 32px;
                color: #5a5a5a;
            }

            .bottom{
                position: relative;
                display: flex;
                align-items: center;

                .icon{
                    position: relative;
                    width: 0;
                    height: 0;
                    border-right: 5px solid transparent;
                    border-left: 5px solid transparent;
                }

                .ratio{
                    margin: 0 5px;
                }

                .ratio-text{
                    position: relative;
                    color: #a5a5a5;
                }
            }

            .increase{
                .icon{
                    border-bottom: 5px solid #27d827;
                }

                .ratio{
                    color: #27d827;
                }
            }

            .descend{
                .icon{
                    border-top: 5px solid red;
                }

                .ratio{
                    color: red;
                }
            }
        }
    }
</style>