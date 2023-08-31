<template>
  <div class="agent-container">
    <module-card>
      <header class="agent-data-head">
        <h1>财务数据</h1>
        <variety-date-picker></variety-date-picker>
      </header>
      <main class="agent-data-show">
        <el-row :gutter="16" style="width: 100%" justify="flex-start">
          <template v-for="card in cardData" :key="card.title">
            <el-col :span="5"> <show-card :cardData="card"></show-card></el-col>
          </template>
        </el-row>
      </main>
    </module-card>
    <module-card>
      <h1>表格</h1>
    </module-card>
  </div>
</template>

<script setup>
import ModuleCard from "@/components/Card/ModuleCard.vue";
import ShowCard from "@/components/Card/ShowCard.vue";
import VarietyDatePicker from "@/components/DatePicker/VarietyDatePicker";

// 卡片数据
const cardData = [
  {
    title: "代理总量",
    amount: 1126,
    url: require("@/assets/images/user_count.png"),
    total: {
      totalTitle: "提现总额",
      totalAmount: "￥76800.00",
    },
  },
  {
    title: "订单总量",
    amount: 1126,
    url: require("@/assets/images/file.png"),
    total: {
      totalTitle: "提现总额",
      totalAmount: "￥76800.00",
    },
  },
  {
    title: "成交金额",
    amount: 1126,
    url: require("@/assets/images/bar_chart.png"),
    total: {
      totalTitle: "提现总额",
      totalAmount: "￥76800.00",
    },
  },
  {
    title: "平均单价",
    amount: 1126,
    url: require("@/assets/images/normal_chart.png"),
    total: {
      totalTitle: "提现总额",
      totalAmount: "￥76800.00",
    },
  },
  {
    title: "返佣金额",
    amount: 1126,
    url: require("@/assets/images/bar_chart.png"),
    total: {
      totalTitle: "提现总额",
      totalAmount: "￥76800.00",
    },
  },
];
</script>

<style lang="scss" scoped>
.agent-container {
  .agent-data-head {
    display: flex;
    justify-content: space-between;
    h1 {
      margin: 0;
      padding: 0;
      font-size: 1.25rem;
      font-weight: 700;
      margin-bottom: 16px;
    }
  }

  .agent-data-show {
    display: flex;
    // flex-wrap: wrap;
    justify-content: center;
    .el-col-5 {
      max-width: 20%;
      flex: 0 0 20%;
    }
  }
}
</style>
