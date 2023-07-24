<template>
    <div class="source-container u-m-t-20 u-p-b-20">
        <div class="title">
            <div class="text">用户来源</div>

            <div class="btns">
                <el-button type="default">导出数据</el-button>

                <div class="btn-item u-m-l-10">
                    <el-select v-model="dateScopeType" @change="handleSelectChange" class="m-2">
                        <el-option
                                v-for="item in selectOptions"
                                :key="item.value"
                                :label="item.label"
                                :value="item.value"
                        />
                    </el-select>
                </div>

                <div class="select-month u-m-l-10">
                    <el-date-picker
                            class="picker-month"
                            v-model="month"
                            :type="dateScopeType === '1' ? 'date' : 'month'"
                            :format="dateScopeType === '1' ? 'YYYY-MM-DD' : 'YYYY-MM'"
                            :value-format="dateScopeType === '1' ? 'YYYY-MM-DD' : 'YYYY-MM'"
                            @change="dateChange"
                    />
                </div>
            </div>
        </div>

        <div class="chart-container bg-fff u-p-b-20">

            <el-row :gutter="0" justify="center" class="echarts-container">
                <el-col :span="20">
                    <div class="echarts-ref" ref="echartsRef"></div>
                </el-col>
            </el-row>

        </div>
    </div>

</template>

<script setup>
  import { reactive, ref, onMounted, computed, watch, getCurrentInstance } from 'vue';
  import dayjs from 'dayjs';
  import * as echarts from 'echarts';

  const { proxy } = getCurrentInstance()

  const month = ref('')
  const echartsRef = ref(null)
  const echartsData = ref([])
  const dateScopeType = ref('1')
  const selectOptions = ref([
    {label:'按天统计', value:'1'},
    {label:'按月统计', value:'2'},
  ])
  const tableData = ref([])

  // 选择按日/月统计
  function handleSelectChange(value) {
    console.log('value', value)
    dateScopeType.value = value
    month.value = ''
    proxy.$message({
      type:'info',
      message:'请选择具体时间！'
    })
  }

  function dateChange(value) {
    console.log('dateChange', value)
    month.value = value;
    handleGetUserStatistic()
  }

  // 获取用户来源统计数据
  function handleGetUserStatistic() {
    // console.log('userEchartsCategory', userEchartsCategory.value)
    // console.log('timeRangeTagActive', timeRangeTagActive.value)
    // console.log('timeRangeTagActive', timeRange.data)
    let params = {
      dateScopeType: dateScopeType.value,
      startDate: month.value
    };
    console.log('handleGetUserStatistic', params)
    const response = [
      {
        name: '智文',
        ratio: '38%',
      },
      {
        name: '智像',
        ratio: '20%',
      },
      {
        name: 'AI ERP',
        ratio: '18%',
      },
      {
        name: '智绘',
        ratio: '24%',
      }
    ]

    tableData.value = response;
    echartsData.value = response.map(item=>{
      return {name:item.name, value: item.ratio.slice(0, item.ratio.length - 1)}
    })

    setTimeout(() => {echartsInit()}, 100)
  }

  function echartsInit() {
    const myChars = echarts.init(echartsRef.value)
    myChars.clear(); // 清除画布内容
    myChars.setOption({
      // 鼠标移动到数据项时显示
      tooltip: {
        trigger: 'item'
      },
      legend: {
        orient: 'vertical',
        right: '10%',
        bottom:'40%',
        itemGap:20
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


  onMounted(() => {
    month.value = dayjs(new Date()).format('YYYY-MM-DD')
    handleGetUserStatistic();
  })

</script>

<style scoped lang="scss">
    .source-container{
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

        .chart-container{
            position: relative;

            .echarts-container{
                height: 600px;

                .el-col{
                    height: 100%;

                    .echarts-ref{
                        height: 100%;
                    }
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

</style>