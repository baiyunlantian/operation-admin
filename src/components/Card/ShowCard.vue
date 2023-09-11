<template>
  <div class="show-card-container">
    <div class="show-card-msg">
      <el-row justify="space-between" style="width: 100%">
        <el-col :md="14" :lg="14" :xl="12">
          <div class="show-card-msg-content">
            <div class="show-card-msg-title">{{ cardData.title }}</div>
            <div class="show-card-msg-data">{{ cardData.amount || 0 }}</div>
          </div>
        </el-col>
        <el-col :md="10" :lg="10" :xl="12">
          <div class="show-card-img">
            <el-image :src="cardData.url"></el-image>
          </div>
        </el-col>
      </el-row>
    </div>

    <div class="show-card-total">
      <div class="show-card-total-content">
        {{ cardData.total?.totalTitle || " "
        }}<span>{{
          cardData.total?.totalAmount ||
          (cardData.total?.totalAmount == 0 ? "0" : " ")
        }}</span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { watch } from "vue";
const props = defineProps(["cardData"]);
</script>

<style lang="scss" scoped>
.show-card-container {
  padding: 1rem 1.25rem;
  box-shadow: 0px 2px 3px 0px rgba(0, 0, 0, 0.1);
  border-radius: 4px;
  // margin-bottom: 16px;
  // &:nth-child(n + 2) {
  //   margin-left: 16px;
  // }
  .show-card-msg {
    display: flex;
    justify-content: space-between;
    align-items: center;

    .show-card-msg-content {
      // min-width: 200px;
      .show-card-msg-title {
        font-size: 1rem;
        font-weight: 600;
        color: rgba(0, 0, 0, 0.6);
      }
      .show-card-msg-data {
        font-size: 1.6rem;
        font-weight: 600;
        color: #333;
        margin-top: 8px;
        overflow: hidden;
      }
    }
    .show-card-img {
      height: 56px;
      display: flex;
      justify-content: flex-end;
      align-items: center;
      :deep(.el-image__inner) {
        height: 100%;
      }
    }
  }
  .show-card-total {
    margin-top: 24px;
    .show-card-total-content {
      font-size: 0.875rem;
      color: rgba(0, 0, 0, 0.4);
      font-weight: 700;
      span {
        margin-left: 8px;
      }
    }
  }
}
</style>
