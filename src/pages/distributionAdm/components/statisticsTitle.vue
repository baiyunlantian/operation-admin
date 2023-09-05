<template>
  <div>
    <div class="statistics-title bg-fff">
      <el-row v-if="isSearch">
        <el-col :xl="4" :lg="4" :md="24" :sm="24" :xs="24">
          <div class="total-title fw">{{ title }}</div>
        </el-col>

        <el-col :xl="20" :lg="20" :md="24" :sm="24" :xs="24">
          <RightSearch @updateParams="handleUpdateParams" />
        </el-col>
      </el-row>
      <el-row :span="24" :gutter="severalRow ? 70 : 20">
        <template v-for="(item, index) in statisticsInformation" :key="index">
          <el-col
            :xl="6"
            :lg="8"
            :md="12"
            :sm="12"
            :xs="24"
            v-if="item.isShow & severalRow"
          >
            <el-card class="box-card">
              <div class="item common-item">
                <div class="top-item">
                  <div class="left-box">
                    <div class="title fw">{{ item.title }}</div>
                    <div class="money fw">
                      <span v-if="item.isMoney">¥ </span>
                      <span>{{ item.money }}</span>
                    </div>
                  </div>
                  <el-image :style="item.imageStyle" :src="item.image" alt="" />
                </div>
                <div class="describe fw">
                  <div class="describe-item u-m-r-10">
                    <div class="text">{{ item.desc }}</div>
                    <div class="num">
                      <span v-if="item.isDescMoney">¥ </span>
                      <span>{{ item.descNum }}</span>
                    </div>
                  </div>
                  <div class="describe-item" v-if="item.descO">
                    <div class="text">{{ item.descO }}</div>
                    <div class="num">
                      <span v-if="item.isDescOMoney">¥ </span>
                      <span>{{ item.descNumO }}</span>
                    </div>
                  </div>
                </div>
              </div>
            </el-card>
          </el-col>
          <el-col class="xl-5" v-if="!severalRow">
            <el-card class="box-card">
              <div class="item common-item">
                <div class="top-item">
                  <div class="left-box">
                    <div class="title fw">{{ item.title }}</div>
                    <div class="money fw">
                      <span v-if="item.isMoney">¥ </span>
                      <span>{{ item.money }}</span>
                    </div>
                  </div>
                  <el-image :style="item.imageStyle" :src="item.image" alt="" />
                </div>
                <div class="describe fw">
                  <div class="describe-item u-m-r-10">
                    <div class="text">{{ item.desc }}</div>
                    <div class="num">
                      <span v-if="item.isDescMoney">¥ </span>
                      <span>{{ item.descNum }}</span>
                    </div>
                  </div>
                  <div class="describe-item" v-if="item.descO">
                    <div class="text">{{ item.descO }}</div>
                    <div class="num">
                      <span v-if="item.isDescOMoney">¥ </span>
                      <span>{{ item.descNumO }}</span>
                    </div>
                  </div>
                </div>
              </div>
            </el-card>
          </el-col>
        </template>
      </el-row>
    </div>
  </div>
</template>

<script setup>
import { ref, defineProps, defineEmits } from "vue";
import RightSearch from "./rightSearch";

const emit = defineEmits(["updateParams"]);
defineProps({
  isSearch: {
    type: Boolean,
    default: true,
  },
  severalRow: {
    type: Boolean,
    default: true,
  },
  title: {
    type: String,
    default: "",
  },
  statisticsInformation: {
    type: Array,
    default: () => [],
  },
});

const handleUpdateParams = (searchParam) => {
  emit("updateParams", searchParam);
};
</script>

<style lang="scss" scoped>
.el-card {
  --el-card-padding: 0 !important;
}

.el-card {
  border: none;
}

.box-card {
  box-shadow: 0px 2px 3px 0px rgba(0, 0, 0, 0.1);
}
.statistics-title {
  padding: 24px 24px 0 24px;
  margin-bottom: 16px;
  box-shadow: 0px 1px 2px 0px rgba(0, 0, 0, 0.1);
  color: #1a1a1a;

  .common-item {
    height: 168px;
    padding: 24px 32px 0 32px;
    box-sizing: border-box;

    .top-item {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .left-box {
      display: flex;
      flex-direction: column;
      .title {
        margin-bottom: 9px;
        font-size: 14px;
      }
      .money {
        font-size: 32px;
      }
    }
  }

  .box-card {
    margin-bottom: 24px;
  }

  .total-title {
    font-size: 20px;
    color: rgba(0, 0, 0, 0.9);
    margin-bottom: 16px;
  }

  .describe {
    display: flex;
    align-items: center;
    margin-top: 23px;
    color: rgba(0, 0, 0, 0.4);
    font-size: 14px;

    .describe-item {
      display: flex;
      align-items: center;
    }

    .text {
      margin-right: 16px;
    }
  }
}

.xl-5 {
  width: 20%;
}

.xl-5.el-col-24 {
  max-width: none;
  flex: auto;
}
</style>
