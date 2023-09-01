<template>
  <div class="variety-date-picker">
    <el-radio-group
      v-model="beforeDays"
      size="small"
      class="radio-button"
      @change="getDate(beforeDays)"
    >
      <el-radio-button
        :label="day.value"
        v-for="day in selectDay"
        :key="day.label"
        >{{ day.label }}</el-radio-button
      >
    </el-radio-group>
    <div class="demo-date-picker">
      <div class="block">
        <el-date-picker
          v-model="datePick"
          type="daterange"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          :default-time="defaultTime"
          :teleported="false"
          size="small"
        />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import utils from "@/assets/js/utils";

const props = defineProps(["selectDay"]);
const datePick = ref("");
const defaultTime = [new Date(2000, 1, 1), new Date(2000, 2, 1)];
const beforeDays = ref();
const emits = defineEmits(["getBeforeDate"]);

// 获取准确的日期
const getDate = (beforeDays) => {
  // 选择日期输入框清空
  datePick.value = "";
  // 获取结束的日期,beforeDays为0 则结束时间为0 ，否则为前一天的日期
  let endDate = !beforeDays ? utils.getBeforeDate(0) : utils.getBeforeDate(1);
  const startDate = utils.getBeforeDate(beforeDays);
  // console.log(beforeDate);
  // 传到父组件
  emits("getBeforeDate", { startDate, endDate });
};
</script>

<style lang="scss" scoped>
:deep(.el-radio-button) {
  margin-left: 8px;
}
:deep(.el-radio-button__inner) {
  border-left: var(--el-border);
  border-radius: 3px;
}
:deep(.el-radio-button:last-child .el-radio-button__inner) {
  border-radius: 3px;
}
:deep(.el-radio-button:first-child .el-radio-button__inner) {
  border-radius: 3px;
}
.variety-date-picker {
  display: flex;
  .radio-button {
    flex-wrap: nowrap;
    flex: 1;
  }
}
.demo-date-picker {
  margin-left: 8px;
  display: flex;
  width: 100%;
  padding: 0;
  flex-wrap: wrap;
}
.demo-date-picker .block {
  padding: 0;
  margin: auto 0;
  text-align: center;
  border-right: solid 1px var(--el-border-color);
  flex: 1;
}
.demo-date-picker .block:last-child {
  border-right: none;
}
</style>