<template>
  <div class="pie bg-fff">
    <div class="top-title">
      <div class="total-title fw">销售占比</div>
      <div class="data">
        <div class="">(元)</div>
      </div>
    </div>

    <Echarts
      ref="echartsRef"
      :option-config="echartsOptions"
      :is-empty="echartsData.length === 0"
    />
  </div>
</template>

<script setup>
import { ref, reactive, getCurrentInstance, onMounted } from "vue";
import Echarts from "@/components/Echarts";
import { getUserStatistic } from "../api";
import dayjs from "dayjs";
import utils from "@/assets/js/utils.js";

const searchParams = ref({
  startDate: utils.getDateBeforeDays(-7) + " " + "00:00:00",
  endDate: dayjs().subtract(1, "day").format("YYYY-MM-DD") + " " + "23:59:59",
});
const echartsRef = ref();
const echartsData = ref([]);
const echartsOptions = reactive({
  color: ["#0052d9", "#bbd3fb", "#D3D3D3"],
  tooltip: {},
  series: [
    {
      name: "Access From",
      type: "pie",
      radius: ["40%", "70%"],
      avoidLabelOverlap: false,
      label: {
        show: false,
        position: "center",
      },
      emphasis: {
        label: {
          show: true,
          fontSize: 40,
          fontWeight: "bold",
        },
      },
      labelLine: {
        show: false,
      },
      data: echartsData.value,
    },
  ],
});

// 获取饼图表数据
function handleGetUserStatistic() {
  getUserStatistic(searchParams).then((res) => {
    if (res.code == "0") {
      res.data.forEach(({ name, ratio }) => {
        let value = ratio.slice(0, ratio.length - 1);
        if (value != "0") {
          echartsData.value.push({ name, value });
        }
      });
      setTimeout(() => {
        echartsRef.value.init();
      }, 100);
    }
  });
}

onMounted(() => {
  handleGetUserStatistic();
});
</script>

<style lang="scss" scoped>
.pie {
  padding: 16px 24px;
  box-shadow: 0px 1px 2px 0px rgba(0, 0, 0, 0.1);

  .top-title {
    display: flex;
    align-items: center;

    .total-title {
      margin-right: 16px;
      font-size: 20px;
      color: rgba(0, 0, 0, 0.9);
    }

    .data {
      font-size: 14px;
      color: rgba(0, 0, 0, 0.4);
    }
  }
}
</style>
