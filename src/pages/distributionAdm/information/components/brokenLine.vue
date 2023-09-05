<template>
  <div class="brokenLine bg-fff">
    <el-row>
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
import { ref, reactive, getCurrentInstance } from "vue";
import RightSearch from "../../components/rightSearch.vue";
import MutiLine from "@/components/muti-line";
import { getUserStatistic } from "../api";

const searchParams = ref({});
const userEchartsDataList = ref([
  {
    name: "本月",
    series: [
      {
        xAxis: "08-24",
        yAxis: 3,
      },
      {
        xAxis: "08-25",
        yAxis: 3,
      },
      {
        xAxis: "08-26",
        yAxis: 0,
      },
      {
        xAxis: "08-27",
        yAxis: 0,
      },
      {
        xAxis: "08-28",
        yAxis: 1,
      },
      {
        xAxis: "08-29",
        yAxis: 1,
      },
      {
        xAxis: "08-30",
        yAxis: 0,
      },
      {
        xAxis: "08-31",
        yAxis: 0,
      },
    ],
  },
  {
    name: "上月",
    series: [
      {
        xAxis: "08-24",
        yAxis: 0,
      },
      {
        xAxis: "08-25",
        yAxis: 3,
      },
      {
        xAxis: "08-26",
        yAxis: 0,
      },
      {
        xAxis: "08-27",
        yAxis: 0,
      },
      {
        xAxis: "08-28",
        yAxis: 0,
      },
      {
        xAxis: "08-29",
        yAxis: 1,
      },
      {
        xAxis: "08-30",
        yAxis: 0,
      },
      {
        xAxis: "08-31",
        yAxis: 0,
      },
    ],
  },
]);
const lineData = ref([]);
const xAxisData = ref([]);
const echartsOptions = reactive({
  color: ["#0052d9", "#bbd3fb"],
  tooltip: {},
});

// 获取统计图表数据
// function handleGetUserStatistic() {
//   getUserStatistic(searchParams).then((res) => {
//     if (res.code == "0") {
//       const { statisticsData } = res.data;
//       userEchartsDataList.value = statisticsData;
//       formatLineData(statisticsData);
//     }
//   });
// }

// 格式化数据
function formatLineData(list) {
  let _xAxisData = [],
    _seriesData = [];
  let tooltip = { trigger: "axis", formatter: "{b}<br />" };
  list.forEach((items, index) => {
    let seriesItem = { type: "line", name: items.name, data: [], smooth: true };
    tooltip.formatter += `{a${index}}：{c${index}}人<br />`;

    (items.series || []).forEach((item, itemIndex) => {
      if (index === 0) {
        _xAxisData.push(item.xAxis);
      }
      seriesItem["data"].push(item.yAxis);
    });

    _seriesData.push(seriesItem);
  });

  echartsOptions.tooltip = tooltip;
  xAxisData.value = _xAxisData;
  lineData.value = _seriesData;
}

formatLineData(userEchartsDataList.value);

function handleUpdateParams(params) {
  searchParams.value = params;
  // handleGetUserStatistic();
}
</script>

<style lang="scss" scoped>
.brokenLine {
  padding: 16px 24px;
  // margin-right: 16px;
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
