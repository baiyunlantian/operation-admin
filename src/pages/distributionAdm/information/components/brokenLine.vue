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

    <div class="echarts">
      <MutiLine
        :x-axis-data="xAxisData"
        :line-data="lineData"
        :option-config="echartsOptions"
      />
    </div>
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
const currentClick = ref();

let currentTimeList = ref([]);
for (let i = 0; i <= 23; i++) {
  currentTimeList.value.push(i);
}

let currentDataList = ref([]);
const getCurrentDataList = () => {
  currentDataList.value = getDateStr(
    searchParams.value.startTime,
    searchParams.value.endTime,
    0
  );
  currentDataList.value.unshift(searchParams.value.startTime.split(" ")[0]);
};

getCurrentDataList();

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
  if (list.length == 0) {
    lineData.value = [];
    return;
  }
  console.log(dayjs(searchParams.value.startTime).format("YYYY-MM-DD"));
  if (
    dayjs(searchParams.value.startTime).format("YYYY-MM-DD") ==
    dayjs(searchParams.value.endTime).format("YYYY-MM-DD")
  ) {
    list = list.map((item) => {
      return {
        orderCount: item.orderCount,
        time: dayjs(item.time).hour(),
        totalIncome: item.totalIncome,
      };
    });

    timeFormat(list, currentTimeList.value);

    list = list.map((item) => {
      return {
        orderCount: item.orderCount,
        time: `${item.time}时`,
        totalIncome: item.totalIncome,
      };
    });
  } else {
    list = list.map((item) => {
      return {
        orderCount: item.orderCount,
        time: item.time.split(" ")[0],
        totalIncome: item.totalIncome,
      };
    });

    timeFormat(list, currentDataList.value);
  }

  const dataO = computed(() => {
    const dO = ref([]);
    list.forEach((item) => {
      dO.value.push(item.totalIncome);
    });
    return dO.value;
  });
  const dataT = computed(() => {
    const dT = ref([]);
    list.forEach((item) => {
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
    // formatter: "{b}<br />",
  };
  // _seriesData.value.forEach((item, index) => {
  //   tooltip.formatter += `{a${index}}：{c${index}}<br />`;
  // });
  list.forEach((items, index) => {
    _xAxisData.push(String(items.time));
  });

  echartsOptions.tooltip = { ...echartsOptions.tooltip, ...tooltip };
  xAxisData.value = _xAxisData;
  lineData.value = _seriesData.value;
}

const timeFormat = (list, formatData) => {
  list.forEach((item) => {
    if (formatData.includes(item.time)) {
      formatData = formatData.filter((iten) => iten !== item.time);
    }
  });

  formatData.forEach((item) => {
    list.push({
      orderCount: 0,
      time: item,
      totalIncome: 0,
    });
  });

  list.sort((a, b) => {
    return dayjs(a.time) - dayjs(b.time);
  });
};

function handleUpdateParams(params, tagValue) {
  searchParams.value = params;
  currentClick.value = tagValue;
  getCurrentDataList();
  handleGetUserStatistic();
}

// 获取间隔的每天
function getDateStr(startDate, endDate, dayLength) {
  let dataList = [];
  // var str = startDate;
  for (var i = 0; ; i++) {
    var getDate = getTargetDate(startDate, dayLength);
    startDate = getDate;
    if (getDate <= endDate) {
      dataList.push(getDate);
      // str += "," + getDate;
    } else {
      break;
    }
  }
  return dataList;
}

// startDate: 开始时间；dayLength：每隔几天，0-代表获取每天，1-代表日期间隔一天
function getTargetDate(date, dayLength) {
  dayLength = dayLength + 1;
  var tempDate = new Date(date);
  tempDate.setDate(tempDate.getDate() + dayLength);
  var year = tempDate.getFullYear();
  var month =
    tempDate.getMonth() + 1 < 10
      ? "0" + (tempDate.getMonth() + 1)
      : tempDate.getMonth() + 1;
  var day =
    tempDate.getDate() < 10 ? "0" + tempDate.getDate() : tempDate.getDate();
  return year + "-" + month + "-" + day;
}

onMounted(() => {
  handleGetUserStatistic();
});
</script>

<style lang="scss" scoped>
.brokenLine {
  height: 451px;
  box-sizing: border-box;
  padding: 1% 1% 0 1%;
  // margin-right: 16px;
  box-shadow: 0px 1px 2px 0px rgba(0, 0, 0, 0.1);

  .brokenLine-title {
    margin-bottom: 16px;
  }

  .echarts {
    height: calc(100% - 50px);
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
