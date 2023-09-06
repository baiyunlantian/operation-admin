<template>
  <div class="brokenLine bg-fff">
    <el-row class="brokenLine-title">
      <el-col :xl="4" :lg="4" :md="24" :sm="24" :xs="24">
        <div class="top-title">
          <div class="total-title fw">统计数据</div>
          <div class="data">
            <div class="">(元)</div>
          </div>
        </div>
      </el-col>

      <el-col :xl="20" :lg="20" :md="24" :sm="24" :xs="24">
        <RightSearch @updateParams="handleUpdateParams" />
      </el-col>
    </el-row>

    <MutiLine
      :x-axis-data="xAxisData"
      :line-data="lineData"
      :option-config="echartsOptions"
    />
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, getCurrentInstance, computed } from "vue";
import RightSearch from "../../components/rightSearch.vue";
import MutiLine from "@/components/muti-line";
import { getTotalIncomeToDay } from "../api";
import dayjs from "dayjs";
import utils from "@/assets/js/utils.js";

const { proxy } = getCurrentInstance();

const searchParams = ref({
  startTime: utils.getNextDate(-7) + " " + "00:00:00",
  endTime: dayjs().subtract(1, "day").format("YYYY-MM-DD") + " " + "23:59:59",
});

const lineData = ref([]);
const xAxisData = ref([]);
const echartsOptions = reactive({
  color: ["#0052d9", "#bbd3fb"],
  tooltip: {
    backgroundColor: "#ffffff",
    borderColor: "#dcdcdc",
    borderWidth: 1,
    padding: 15,
    textStyle: {
      color: "#000000",
    },
  },
  legend: {
    data: ["成交额", "订单量"],
  },
});

// 获取统计图表数据
function handleGetUserStatistic() {
  getTotalIncomeToDay(searchParams.value).then((res) => {
    const { code, data, msg } = res || {};
    if (code == 0) {
      formatLineData(data);
    } else {
      proxy.$message({
        type: "error",
        message: msg,
      });
    }
  });
}

// 格式化数据
function formatLineData(list) {
  const dataO = computed(() => {
    const dO = ref([]);
    list.filter((item) => {
      dO.value.push(item.totalIncome);
    });
    return dO.value;
  });
  const dataT = computed(() => {
    const dT = ref([]);
    list.filter((item) => {
      dT.value.push(item.orderCount);
    });
    return dT.value;
  });
  let _xAxisData = [],
    _seriesData = ref([
      {
        type: "line",
        name: echartsOptions.legend.data[0],
        data: dataO.value,
        smooth: true,
      },
      {
        type: "line",
        name: echartsOptions.legend.data[1],
        data: dataT.value,
        smooth: true,
      },
    ]);
  let tooltip = {
    trigger: "axis",
    formatter: "{b}<br />",
  };
  _seriesData.value.forEach((item, index) => {
    tooltip.formatter += `{a${index}}：{c${index}}<br />`;
  });
  list.forEach((items, index) => {
    _xAxisData.push(items.time);
  });

  echartsOptions.tooltip = { ...echartsOptions.tooltip, ...tooltip };
  xAxisData.value = _xAxisData;
  lineData.value = _seriesData.value;
}

function handleUpdateParams(params) {
  searchParams.value = params;
  handleGetUserStatistic();
}

onMounted(() => {
  handleGetUserStatistic();
});
</script>

<style lang="scss" scoped>
.brokenLine {
  height: 451px;
  box-sizing: border-box;
  padding: 16px 24px 32px 24px;
  // margin-right: 16px;
  box-shadow: 0px 1px 2px 0px rgba(0, 0, 0, 0.1);

  .brokenLine-title {
    margin-bottom: 16px;
  }

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
