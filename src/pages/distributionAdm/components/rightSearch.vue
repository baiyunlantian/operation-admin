<template>
  <div class="right">
    <div class="time-range">
      <div
        v-for="(item, index) in timeRangeTags"
        :key="index"
        class="item"
        :class="[
          dateScopeType === item.key ? 'active' : '',
          'u-cursor u-m-r-10',
        ]"
        @click="handleClickTimeTag(item.key)"
      >
        {{ item.label }}
      </div>

      <LimitDatePicker
        v-model="timeRange"
        datePickerType="daterange"
        formatText="YYYY-MM-DD"
        :custom-disabled-date-fn="handleDisabledDate"
        @calendar-change="datePickerChange"
        @change="dateChange"
      />
    </div>
  </div>
</template>

<script setup>
import { reactive, ref, onMounted, computed, watch, defineEmits } from "vue";
import dayjs from "dayjs";
import LimitDatePicker from "@/components/LimitDatePicker";
import utils from "@/assets/js/utils.js";

const emit = defineEmits(["updateParams"]);
const dateScopeType = ref(-7);
const timeRangeTags = reactive([
  { label: "今天", key: 0 },
  { label: "昨天", key: -1 },
  { label: "最近7天", key: -7 },
  { label: "30天", key: -30 },
  { label: "90天", key: -90 },
  { label: "一年", key: -365 },
]);

const endTimeStr = "23:59:59";
const startTimeStr = "00:00:00";
const timeRange = ref([
  dayjs().subtract(1, "day").format("YYYY-MM-DD") + " " + endTimeStr,
  "",
]);

const searchParam = reactive({
  startTime: utils.getNextDate(-7) + " " + startTimeStr,
  endTime: dayjs().subtract(1, "day").format("YYYY-MM-DD") + " " + endTimeStr,
});

function getData(tagValue) {
  emit("updateParams", searchParam, tagValue);
}

function datePickerChange(dates) {
  const [start, end] = dates;
  if (start && end) {
    const _start = dayjs(start).format("YYYY-MM-DD") + " " + startTimeStr;
    const _end = dayjs(end).format("YYYY-MM-DD") + " " + endTimeStr;
    timeRange.value = [_start, _end];
    searchParam.endTime = timeRange.value[1];

    // 选择时间范围时，清空左侧tag样式
    dateScopeType.value = null;
  }
}

function dateChange(dates) {
  searchParam.startTime = dates[0];
  searchParam.endTime = dates[1];
  getData();
}

// 点击图表上的日期tag
function handleClickTimeTag(tagValue) {
  dateScopeType.value = tagValue;
  if (tagValue == 0) {
    searchParam.startTime = utils.getNextDate(tagValue) + " " + startTimeStr;
    searchParam.endTime = utils.getNextDate(tagValue) + " " + endTimeStr;
    getData(tagValue);
  } else {
    searchParam.startTime = utils.getNextDate(tagValue) + " " + startTimeStr;
    searchParam.endTime =
      dayjs().subtract(1, "day").format("YYYY-MM-DD") + " " + endTimeStr;
    getData(tagValue);
  }

  timeRange.value = [];
}

// 限定时间选择范围
function handleDisabledDate(time, startDate) {
  const day = 24 * 60 * 60 * 1000;
  const timestamp = time.getTime();
  if (startDate !== null) {
    return (
      timestamp < startDate.getTime() - 365 * day ||
      timestamp > startDate.getTime() + 365 * day
    );
  }
}

// onMounted(() => {
//   getData();
// });
</script>

<style scoped lang="scss">
.right {
  display: flex;
  justify-content: flex-end;

  .time-range {
    display: flex;
    align-items: center;

    .item {
      padding: 5px 10px;
      border-radius: 3px;
      border: 1px solid #dcdcdc;
      color: rgba(0, 0, 0, 0.9);
    }

    .active {
      border: none;
      color: #fff;
      background-color: #0052d9;
    }
  }
}
</style>
