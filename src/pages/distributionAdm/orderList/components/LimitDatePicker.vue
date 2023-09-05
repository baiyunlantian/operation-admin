<template>
  <el-date-picker
    v-model="datePickerValue"
    range-separator="-"
    :type="datePickerType"
    :format="formatText"
    start-placeholder="开始时间"
    end-placeholder="结束时间"
    :disabled-date="handleDisabledDate"
    @calendar-change="datePickerChange"
    @change="handleChangeDate"
  />
</template>

<script setup>
import { ref, defineProps, defineEmits, watchEffect } from "vue";

const emits = defineEmits(["update:modelValue", "calendar-change", "change"]);
const props = defineProps({
  modelValue: {
    required: true,
    default: null,
  },
  customDisabledDateFn: {
    type: Function,
    default: null,
  },
  formatText: {
    type: String,
    default: "YYYY-MM-DD HH:mm",
  },
  datePickerType: {
    type: String,
    default: "datetimerange",
  },
});

const selectedStartDate = ref(null);
const datePickerValue = ref([]);

function datePickerChange(dates) {
  // 记录选择的起始日期
  let hasSelectDate = dates !== null && dates.length > 0;
  selectedStartDate.value = hasSelectDate ? dates[0] : null;

  emits("calendar-change", dates);
}

// 默认不能超过当前系统时间且不能往前大于一年
function defaultDisabledDateFn(time) {
  const day = 24 * 60 * 60 * 1000;
  const timestamp = time.getTime();
  const nowTimestamp = new Date().getTime();
  if (selectedStartDate.value !== null) {
    return (
      timestamp < selectedStartDate.value.getTime() - 29 * day ||
      timestamp > selectedStartDate.value.getTime() + 29 * day ||
      timestamp > nowTimestamp
    );
  } else {
    return timestamp > nowTimestamp;
  }
}

// 限定时间选择范围
function handleDisabledDate(time) {
  if (typeof props.customDisabledDateFn === "function") {
    return props.customDisabledDateFn(time, selectedStartDate.value);
  } else {
    return defaultDisabledDateFn(time);
  }
}

function handleChangeDate(dates) {
  selectedStartDate.value = null;
  if (dates === null || dates.length === 0) {
    datePickerValue.value = null;
  } else {
    datePickerValue.value = dates;
  }

  emits("update:modelValue", datePickerValue.value);
  emits("change", datePickerValue.value);
}

watchEffect(() => {
  datePickerValue.value = props.modelValue;
});
</script>

<style scoped></style>
