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
const dateScopeType = ref(7);
const timeRangeTags = reactive([
  { label: "今天", key: 0 },
  { label: "昨天", key: 1 },
  { label: "最近7天", key: 7 },
  { label: "30天", key: 30 },
  { label: "90天", key: 90 },
  { label: "一年", key: 356 },
]);
const timeRange = ref([
  dayjs().subtract(1, "day").format("YYYY-MM-DD") + " " + "23:59:59",
  "",
]);

const searchParam = reactive({
  startDate: utils.getBeforeDate(7) + " " + "00:00:00",
  endDate: dayjs().subtract(1, "day").format("YYYY-MM-DD") + " " + "23:59:59",
});

function getData() {
  emit("updateParams", searchParam);
}

function datePickerChange(dates) {
  const [start, end] = dates;
  if (start && end) {
    const _start = dayjs(start).format("YYYY-MM-DD") + " " + "00:00:00";
    const _end = dayjs(end).format("YYYY-MM-DD") + " " + "23:59:59";
    timeRange.value = [_start, _end];
    searchParam.endDate = timeRange.value[1];

    // 选择时间范围时，清空左侧tag样式
    dateScopeType.value = null;
    getData();
  }
}

function dateChange(dates) {
  timeRange.value = dates;
  if (dates === null || dates.length === 0) {
    handleClickTimeTag(7);
  }
}

// 点击图表上的日期tag
function handleClickTimeTag(tagValue) {
  dateScopeType.value = tagValue;
  if (tagValue == 0) {
    searchParam.startDate = utils.getBeforeDate(tagValue) + " " + "00:00:00";
    searchParam.endDate = utils.getBeforeDate(tagValue) + " " + "23:59:59";
  } else {
    searchParam.startDate = utils.getBeforeDate(tagValue) + " " + "00:00:00";
    searchParam.endDate =
      dayjs().subtract(1, "day").format("YYYY-MM-DD") + " " + "23:59:59";
  }

  timeRange.value = [];
  getData();
}

// 限定时间选择范围
function handleDisabledDate(time, startDate) {
  const day = 24 * 60 * 60 * 1000;
  const timestamp = time.getTime();
  if (startDate !== null) {
    return (
      timestamp < startDate.getTime() - 13 * day ||
      timestamp > startDate.getTime() + 13 * day
    );
  }
}

onMounted(() => {
  getData();
});
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
