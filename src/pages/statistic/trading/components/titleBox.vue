<template>
    <div class="title title-box">
        <div class="text">{{ title }}</div>

        <div class="btns">
            <el-button type="default" @click="handleExport">导出数据</el-button>
            <el-button :type="dateScopeType === 1 ? 'warning' : 'default'" @click="handleSwitch(1)">本月</el-button>
            <el-button :type="dateScopeType === 2 ? 'warning' : 'default'" @click="handleSwitch(2)">上月</el-button>
            <div class="select-month u-m-l-10">
                <el-date-picker
                        class="picker-month"
                        v-model="startDate"
                        type="month"
                        format="YYYY-MM"
                        value-format="YYYY-MM"
                        placeholder="选择月份"
                        @change="handleChangeMonth"
                />
            </div>
        </div>
    </div>
</template>

<script setup>
  import {ref, defineProps, defineEmits, onMounted, watch } from 'vue';
  import dayjs from "dayjs";

  const emit = defineEmits(['getData', 'export'])
  const props = defineProps(['title'])

  const startDate = ref('')
  const dateScopeType = ref(1)

  function handleExport() {
    emit('export')
  }

  function handleSwitch(month) {
    dateScopeType.value = month
    startDate.value = null

    getData()
  }

  function handleChangeMonth(value) {
    startDate.value = value
    dateScopeType.value = value ? null : 1

    getData()
  }

  function getData() {
    let params = {
      dateScopeType: dateScopeType.value,
      startDate: startDate.value,
    }

    emit('getData', params)
  }


  onMounted(() => {
    getData()
  })
</script>

<style scoped lang="scss">
    .title{
        display: flex;
        align-items: center;

    }

    .btns{
        flex: 1;
        display: flex;
        align-items: center;
        justify-content: flex-end;

        ::v-deep .el-select{
            width: 110px;
        }

        .btn-item{
            position: relative;
        }
    }

    .select-month{
        position: relative;

        ::v-deep .picker-month{
            width: 130px !important;
        }
    }
</style>