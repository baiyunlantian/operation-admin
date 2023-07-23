<template>
    <div class="client-container u-m-t-20">
        <div class="title">
            <div class="text">新老客户交易构成</div>

            <div class="btns">
                <el-button type="default">导出数据</el-button>
                <el-button :type="selectValue === '2' ? 'default' : 'warning'" @click="handleClickMonth('1')">本月</el-button>
                <el-button :type="selectValue === '1' ? 'default' : 'warning'" @click="handleClickMonth('2')">上月</el-button>
                <div class="select-month u-m-l-10">
                    <el-date-picker
                            class="picker-month"
                            v-model="month"
                            type="month"
                            format="YYYY-MM"
                            value-format="YYYY-MM"
                            @change="dateChange"
                    />
                </div>
            </div>
        </div>

        <div class="chart-container bg-fff">

            <el-row :gutter="0" class="echarts-container">
                <el-col :span="8" :offset="1">
                    <div class="echarts-ref" ref="echartsRef"></div>
                </el-col>

                <el-col :span="12" :offset="1">
                    <div class="right">
                        <el-row :gutter="0" class="header-box u-m-b-50" justify="center">
                            <el-col :span="3" :offset="1" class="item">
                                <span class="point" :style="{backgroundColor: colors[0]}"></span>
                                <span class="text">新客户</span>
                            </el-col>
                            <el-col :span="3" :offset="1" class="item">
                                <span class="point" :style="{backgroundColor: colors[1]}"></span>
                                <span class="text">老客户</span>
                            </el-col>
                        </el-row>

                        <el-row  :gutter="0" class="table-container" justify="center">
                            <el-col :span="20" :offset="1">
                                <el-table class="table" :data="tableData" border style="width: 100%">
                                    <el-table-column v-for="(item, index) in tableColumnConfig" :key="index"
                                            :prop="item.prop"
                                            :label="item.label"
                                            :width="item.width"
                                    >
                                        <template #default="{ row, column, $index }">
                                            <div class="custom-cell">{{ formatTableCell(row, item.prop) }}</div>
                                        </template>
                                    </el-table-column>
                                </el-table>
                            </el-col>
                        </el-row>

                    </div>
                </el-col>
            </el-row>

        </div>
    </div>

</template>

<script setup>
  import {reactive, ref, onMounted, computed, watch, defineEmits} from 'vue';
  import dayjs from 'dayjs';
  import * as echarts from 'echarts';

  const emit = defineEmits(['update'])

  const month = ref('')
  const echartsRef = ref(null)
  const echartsData = ref([])
  const selectValue = ref('1')
  const colors = ref(['#91cc75', '#5470c6'])
  const tableData = ref([])
  const tableColumnConfig = ref([
    {label:'', prop:'name'},
    {label:'消费金额', prop:'incomeAmount'},
    {label:'较前一月', prop:'lastMonthIncome'},
    {label:'付款人数', prop:'number'},
    {label:'较前一月', prop:'lastMonthNumber'},
  ])

  function handleClickMonth(value) {
    // console.log('value', value)
    selectValue.value = value
    handleGetClientStatistic()
  }
  function dateChange(value) {
    console.log('dateChange', value)
    month.value = value;

    handleGetClientStatistic()
  }
  function formatTableCell(row, prop) {
    // console.log('row', row)
    // console.log('prop', prop)
    let text = '', val = row[prop]
    switch (prop) {
      case 'incomeAmount':
        text = `￥${val}`;
        break;
       default:
         text = val;
    }

    return text;
  }

  // 获取新老客户交易构成数据
  function handleGetClientStatistic() {
    // console.log('userEchartsCategory', userEchartsCategory.value)
    // console.log('timeRangeTagActive', timeRangeTagActive.value)
    // console.log('timeRangeTagActive', timeRange.data)

    tableData.value = [{
      incomeAmount: '1238779',
      name: '新客户',
      lastMonthIncome: '-10%',
      number: '12',
      lastMonthNumber: '+27%',
    },];
  }

  function echartsInit() {
    const myChars = echarts.init(echartsRef.value)
    myChars.clear(); // 清除画布内容
    myChars.setOption({
      color:colors.value,
      // 鼠标移动到数据项时显示
      tooltip: {
        trigger: 'item'
      },
      series: [
        {
          type: 'pie',
          radius: '50%',
          data: echartsData.value,
          labelLine:{
            length:50,
            length2:70
          }
        },
        {
          type: 'pie',
          radius: '50%',
          data: echartsData.value,
          label:{
            position: 'inside',
            fontSize: 14,
            formatter:'{d}%'
          }
        }
      ]
    })
  }

  watch(tableData, (newVal, oldVal) => {
    echartsData.value = newVal.map(item=>{
      return {value:item.number, name:item.name}
    })

    setTimeout(() => {
      echartsInit()
    }, 100)
  },
    {deep: true}
  )

  onMounted(() => {
    month.value = dayjs(new Date()).format('YYYY-MM')
    handleGetClientStatistic();
  })

</script>

<style scoped lang="scss">
    .client-container{
        .title{
            position: relative;
            background-color: blue;
            border-radius: 5px;
            color: #fff;
            padding: 10px 15px;
            display: flex;
            align-items: center;

        }

        .btns{
            flex: 1;
            display: flex;
            justify-content: flex-end;
        }

        .select-month{
            position: relative;

            ::v-deep .picker-month{
                width: 130px !important;
            }
        }

        .chart-container{
            position: relative;

            .echarts-container{
                height: 600px;
                width: 100%;
                margin: 0 auto;
                display: flex;
                align-items: center;

                .el-col{
                    height: 100%;

                    .echarts-ref{
                        height: 100%;
                    }
                }

                .right{
                    height: 100%;
                    display: flex;
                    flex-direction: column;
                    justify-content: center;

                    .header-box{
                        position: relative;

                        .item{
                            display: flex;
                            align-items: center;

                            .point{
                                display: inline-block;
                                height: 20px;
                                width: 20px;
                                border-radius: 50%;
                                border: 1px solid #b3afaf;
                                margin-right: 15px;
                            }

                            .text{
                                position: relative;
                            }
                        }
                    }

                    .table-container{
                        position: relative;

                        ::v-deep .el-table{
                            position: relative;

                            .el-table__header-wrapper{
                                .el-table__cell{
                                    background-color: #f7f7f7;
                                    text-align: center;
                                }
                            }

                            .custom-cell{
                                text-align: center;
                            }
                        }
                    }
                }
            }
        }
    }

</style>