<template>
    <div class="operate-container bg-fff">
        <div class="title">筛选</div>

        <div class="search-container u-m-t-15 u-m-b-10">
            <el-form class="search-form" ref="formRef" :inline="true" :model="searchTableParams" :rules="rules">

                <el-form-item v-for="(item, index) in searchFormConfig" :prop="item.prop" :label="item.label" :key="item.prop" label-position="left">

                    <el-input v-if="item.type === 'input'" v-model="searchTableParams[item.prop]" :placeholder="item.placeholder || item.label" clearable/>

                    <el-select v-else-if="item.type === 'select' " v-model="searchTableParams[item.prop]" class="m-2" placeholder="账号来源" clearable>
                        <el-option
                                v-for="item in sourceTypeOptions"
                                :key="item.key"
                                :label="item.label"
                                :value="item.key"
                        />
                    </el-select>

                    <el-date-picker
                            v-else
                            v-model="searchTableParams[item.prop]"
                            type="datetimerange"
                            range-separator="-"
                            format="YYYY-MM-DD HH:mm"
                            start-placeholder="开始时间"
                            end-placeholder="结束时间"
                            :disabled-date="handleDisabledDate"
                            @calendar-change="datePickerChange"
                    />

                </el-form-item>

                <el-form-item class="">
                    <el-button type="primary" @click="handleGetTableList">搜索</el-button>
                    <el-button type="primary" @click="handleResetSearch">重置</el-button>
                </el-form-item>
            </el-form>

            <!--暂时屏蔽      -->
            <!--      <div class="btns">-->
            <!--          <el-button type="primary" class="btn" @click="handleClickBtn">批量删除</el-button>-->
            <!--      </div>-->

        </div>

        <div class="table-main u-m-t-10 bg-fff">
            <div class="header-operate theme-bg title-box">
                <div class="left-text">用户列表</div>
                <div class="right-sort">
                    <el-select v-model="searchTableParams.pageSize" class="m-2" placeholder="显示条数">
                        <el-option
                                v-for="item in pageSizeOptions"
                                :key="item"
                                :label="`每页显示${item}条`"
                                :value="item"
                        />
                    </el-select>

                    <el-select v-model="searchTableParams.sort" class="m-2" placeholder="排序方式">
                        <el-option
                                v-for="item in timeSortOptions"
                                :key="item.value"
                                :label="item.label"
                                :value="item.value"
                        />
                    </el-select>
                </div>
            </div>

            <el-table
                    class="table-container"
                    :data="tableData"
                    border
                    style="width: 100%"
                    @selection-change="handleSelectionChange"
            >
                <el-table-column type="selection" width="55" />
                <el-table-column v-for="(item, index) in tableColumnConfig" :key="index"
                                 :prop="item.prop"
                                 :label="item.label"
                                 :width="item.width"
                                 align="center"
                >
                    <template #default="{ row, column, $index }">
                        <div v-if="item.insertSlot && item.prop === 'status'" class="insert-cell-container">
                            <el-switch
                                    v-model="row[item.prop]"
                                    :before-change="()=>beforeChange(row[item.prop], row.userId)"
                                    :inactive-value="1"
                                    :active-value="0"
                            />
                        </div>

                        <div v-else-if="item.insertSlot && item.prop === 'operate'" class="insert-cell-container">
                            <span class="u-cursor blue u-m-r-20" @click="handleClickCellBtn('detail', row)">查看</span>
                        </div>

                        <div v-else class="custom-cell">{{ handleFormatTableCell(row, item.prop) }}</div>
                    </template>
                </el-table-column>
            </el-table>

            <div class="pagination-container">
                <el-pagination
                        v-model:current-page="searchTableParams.pageIndex"
                        v-model:page-size="searchTableParams.pageSize"
                        layout="total, prev, pager, next, jumper"
                        :total="tableListTotal"
                        background
                        @current-change="handleGetTableList"
                />
            </div>
        </div>

<!--        <BottomBox />-->

        <Transition name="fade" mode="out-in">
            <Detail v-if="detailVisible" :user-id="detailUserId" @goBack="handleGoBack"/>
        </Transition>

    </div>
</template>

<script setup>
  import {ref, reactive, watch, getCurrentInstance, onMounted, computed} from 'vue';
  import dayjs from 'dayjs';
  import { useStore } from 'vuex';
  import API from './api';
  import BottomBox from '@/components/bottom-box';
  import Detail from './detail'

  const { proxy } = getCurrentInstance()
  const store = useStore()

  const searchFormConfig = ref([
    {label:'ID/账号：', prop:'account', type:'input', placeholder:'用户ID/账号'},
    {label:'用户昵称：', prop:'userName', type:'input', placeholder:'用户昵称'},
    {label:'注册时间：', prop:'registerTime', type:'datetimerange'},
    {label:'', prop:'sourceType', type:'select'},
  ])
  const rules = reactive({
    account:[
      {
        pattern: /^[0-9_]{1,16}$/,
        trigger: 'blur',
        message: '请输入1~16位的数字'
      }
    ],
    userName:[
      {
        max: 15,
        trigger: 'blur',
        message: '请输入不超过15位数的昵称'
      }
    ]
  })
  const searchTableParams = ref({
    pageSize:10,
    pageIndex:1,
    sortField: 'register_time',
    sort: 'asc',
  })
  const tableData = ref([])
  const tableColumnConfig = ref([
    {label:'用户ID', prop:'userId'},
    {label:'用户账号', prop:'account'},
    {label:'用户昵称', prop:'userName'},
    // {label:'邮箱', prop:'email'},
    {label:'是否付费', prop:'isPay', insertSlot:'isPay'},
    {label:'总消费金额', prop:'consumedAmount'},
    {label:'账号来源', prop:'source'},
    {label:'账号余额', prop:'balance'},
    {label:'注册时间', prop:'registerTime'},
    {label:'账户启用状态', prop:'status', insertSlot:'status'},
    {label:'操作', prop:'operate', insertSlot:'operate'},
  ])
  const timer = ref(null)
  const pageSizeOptions = ref([10, 20, 30, 50])
  const timeSortOptions = ref([
    {label:'注册时间从早到晚', value:'asc'},
    {label:'注册时间从晚到早', value:'desc'},
  ])
  const selectedRows = ref([])
  const detailVisible = ref(false)
  const detailUserId = ref('')
  const tableListTotal = ref(0)
  const startDate = ref(null)
  const formRef = ref(null)

  function datePickerChange(dates) {
    // 记录选择的起始日期
    let hasSelectDate = dates !== null && dates.length > 0
    startDate.value = hasSelectDate ? dates[0] : null
  }

  // 限定时间选择范围
  function handleDisabledDate(time) {
    // 不能超过当前系统时间且不能往前大于30天
    const day = 24 * 60 * 60 * 1000;
    const timestamp = time.getTime()
    const nowTimestamp = new Date().getTime()
    if (startDate.value !== null) {
      return (
        timestamp < startDate.value.getTime() - 29 * day ||
        timestamp > startDate.value.getTime() + 29 * day ||
        timestamp > nowTimestamp
      )
    }else {
      return timestamp > nowTimestamp
    }
  }

  function handleFormatTableCell(row, prop) {
    let text = row[prop]
    if (prop === 'isPay') {
      text = row[prop] ? '是' : '否'
    }

    return text
  }

  // 暂时屏蔽
  // function // 暂时屏蔽() {
  //   if (selectedRows.value.length === 0) {
  //     proxy.$message({
  //       type:'error',
  //       message:'请选择需要删除的数据！'
  //     })
  //   }
  // }

  function handleSelectionChange(value) {
    selectedRows.value = value
  }

  function handleGetTableList() {
    let params = {
      ...searchTableParams.value,
    }

    if (params.registerTime) {
      params.startTime = dayjs(params.registerTime[0]).format('YYYY-MM-DD HH:mm')
      params.endTime = dayjs(params.registerTime[1]).format('YYYY-MM-DD HH:mm')

      delete params.registerTime
    }

    if (params.sourceType === 'null') {
      params.sourceType = ''
    }

    formRef.value.validate(valid => {
      if (valid) {
        API.getMemberTableList(params).then(res=>{
          if (res.code == '0') {
            tableData.value = res.data.list
            tableListTotal.value = res.data.total
          }
        })
      }
    })
  }

  function beforeChange(status, userId) {
    let params = {
      status: 1^status,
      userId
    }
    console.log('params', params)
    return new Promise((resolve, reject) => {
      proxy.$confirm('确认修改账号状态吗',  {
        confirmButtonText: '确认',
        cancelButtonText: '取消',
        type: 'warning',
      }).then(res=>{
        if (res === 'confirm') {
          API.updateStatus(params).then(res=>{
            if (res.code == '0') {
              proxy.$message({
                type: 'success',
                message: '修改状态成功'
              })
              handleGetTableList()
              return resolve(true)
            }else {
              return reject(false)
            }
          })
        }
      }).catch(()=>{
        console.log('取消')
        return reject(false)
      })
    })

  }

  function handleGoBack() {
    detailVisible.value = false
    detailUserId.value = ''
  }

  function handleClickCellBtn(eventType, row) {
    detailVisible.value = true
    detailUserId.value = row.userId
  }

  function handleResetSearch() {
    formRef.value.resetFields()
    searchTableParams.value = {pageSize:10, pageIndex:1, sortField: 'register_time', sort: 'asc'}
    handleGetTableList()
  }

  const sourceTypeOptions = computed(() => {
    let res = [{label:'运营后台', key:'null'}], list = store.getters['platformType/list']

    // if (Array.isArray(list)) {
    //   res = res.concat(list)
    // }

    return list
  })

  // watch(searchTableParams, (newVal, oldVal) => {
  //     if (timer.value !== null) {
  //       clearTimeout(timer.value);
  //     }
  //     timer.value = setTimeout(() => {
  //       formRef.value.validate(valid => {
  //         if (valid) {
  //           handleGetTableList()
  //           timer.value = null;
  //         }
  //       })
  //     }, 1000)
  //   },
  //   {deep:true}
  // )

  onMounted(() => {
    handleGetTableList()
  })
</script>

<style scoped lang="scss">
    .operate-container{
        position: relative;
        display: flex;
        flex-direction: column;

        .title{
            padding: 10px;
            font-size: 26px;
            font-weight: bold;
            border-bottom: 1px dashed #3f99f7;
        }

        .search-container{
            position: relative;
            padding: 0 10px;
        }

        .table-main{
            position: relative;
            flex: 1;
            display: flex;
            flex-direction: column;

            .header-operate{
                position: relative;
                display: flex;
                align-items: center;
                justify-content: space-between;

                .left-text{
                    position: relative;
                }

                .right-sort{
                    position: relative;

                    ::v-deep .el-select{
                        width: 170px;
                        margin-left: 10px;
                    }
                }
            }

            .table-container {
                position: relative;
                flex: 1;

                ::v-deep .el-scrollbar{
                    overflow: auto;
                }

                ::v-deep .el-table__header-wrapper{
                    .el-table__cell{
                        background-color: #f7f7f7;
                        color: #000;
                    }
                }

                ::v-deep .el-table__cell{
                    text-align: center;
                }

                .custom-cell{
                    text-align: center;
                }

                .insert-cell-container{
                    position: relative;

                }
            }

            .pagination-container{
                position: relative;
                padding: 10px;

                ::v-deep .el-pagination{
                    justify-content: flex-end;
                }
            }
        }
    }
</style>