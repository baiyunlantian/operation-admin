<template>
    <div class="operate-container bg-fff">
        <div class="title">筛选</div>

        <div class="search-container u-m-t-15 u-m-b-10">
            <el-form class="search-form" ref="formRef" :inline="true" :model="searchTableParams" :rules="rules">

                <el-form-item v-for="(item, index) in searchFormConfig" :prop="item.prop" :label="item.label" :key="item.prop" label-position="left">

                    <el-input v-if="item.type === 'input'" v-model="searchTableParams[item.prop]" :placeholder="item.placeholder || item.label" clearable/>

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
                    <el-button type="primary" @click="handleSearchTable('search')">搜索</el-button>
                    <el-button type="primary" @click="handleSearchTable('reset')">重置</el-button>
                </el-form-item>
            </el-form>

            <div class="btns">
                <el-button type="primary" class="btn" @click="handleClickBtn('del')">批量删除</el-button>
                <el-button type="primary" class="btn" @click="handleClickBtn('add')">添加用户</el-button>
            </div>

        </div>

        <div class="table-main u-m-t-10">
            <div class="header-operate theme-bg title-box">
                <div class="left-text">用户列表</div>
                <div class="right-sort">
                    <el-select v-model="searchTableParams.pageSize" class="m-2" placeholder="显示条数" @change="handleSearchTable('select')">
                        <el-option
                                v-for="item in pageSizeOptions"
                                :key="item"
                                :label="`每页显示${item}条`"
                                :value="item"
                        />
                    </el-select>

                    <el-select v-model="searchTableParams.sortType" class="m-2" placeholder="排序方式" @change="handleSearchTable('select')">
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
                            <span class="u-cursor blue u-m-r-20" @click="handleOperateTable('reset', row)">重置密码</span>
                            <span class="u-cursor blue" @click="handleOperateTable('del', row)">删除</span>
                        </div>

                        <div v-else class="custom-cell">{{ row[item.prop] }}</div>
                    </template>
                </el-table-column>
            </el-table>

            <div class="pagination-container bg-fff">
                <el-pagination
                        v-model:current-page="searchTableParams.pageIndex"
                        v-model:page-size="searchTableParams.pageSize"
                        layout="total, prev, pager, next, jumper"
                        :total="tableTotal"
                        background
                        @current-change="handleGetTableList"
                />
            </div>
        </div>

<!--        <BottomBox />-->

        <Modal v-if="modalVisible" @close="handleToggleModal"/>
    </div>
</template>

<script setup>
  import {ref, reactive, watch, getCurrentInstance, onMounted} from 'vue';
  import API from './api';
  import dayjs from 'dayjs';
  import BottomBox from '@/components/bottom-box';
  import Modal from './components/modal';

  const { proxy } = getCurrentInstance()

  const searchFormConfig = ref([
    {label:'ID/账号：', prop:'account', type:'input', placeholder:'用户ID/账号'},
    {label:'用户名：', prop:'userName', type:'input', placeholder:'用户名'},
    {label:'创建时间：', prop:'createTime', type:'datetimerange'},
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
        max: 10,
        trigger: 'blur',
        message: '请输入不超过10位数的用户名'
      }
    ]
  })
  const searchTableParams = ref({
    pageSize:50,
    pageIndex:1,
    sortField: 'created_time',
    sortType: 'DESC',
  })
  const tableData = ref([])
  const tableColumnConfig = ref([
    {label:'用户ID', prop:'userId'},
    {label:'用户账号', prop:'account'},
    {label:'用户名', prop:'userName'},
    {label:'邮箱', prop:'email'},
    {label:'创建时间', prop:'createdTime'},
    {label:'账户启用状态', prop:'status', insertSlot:'status'},
    {label:'操作', prop:'operate', insertSlot:'operate'},
  ])
  const timer = ref(null)
  const pageSizeOptions = ref([50, 100, 200])
  const timeSortOptions = ref([
    {label:'创建时间从晚到早', value:'DESC'},
    {label:'创建时间从早到晚', value:'ASC'},
  ])
  const selectedRows = ref([])
  const modalVisible = ref(false)
  const startDate = ref(null)
  const tableTotal = ref(0)
  const formRef = ref(null)

  function datePickerChange(dates) {
    // 记录选择的起始日期
    let hasSelectDate = dates !== null && dates.length > 0
    startDate.value = hasSelectDate ? dates[0] : null
  }

  // 限定时间选择范围
  function handleDisabledDate(time) {
    const day = 24 * 60 * 60 * 1000;
    const timestamp = time.getTime()
    if (startDate.value !== null) {
      return (
        timestamp < startDate.value.getTime() - 29 * day ||
        timestamp > startDate.value.getTime() + 29 * day
      )
    }
  }

  function handleSelectionChange(value) {
    selectedRows.value = value
  }

  function handleGetTableList() {
    let params = {
      ...searchTableParams.value,
    }

    if (params.createTime) {
      params.startTime = dayjs(params.createTime[0]).format('YYYY-MM-DD HH:mm')
      params.endTime = dayjs(params.createTime[1]).format('YYYY-MM-DD HH:mm')

      delete params.createTime
    }

    formRef.value.validate(valid => {
      if (valid) {
        API.getOperateTableList(params).then(res=>{
          if (res.code == '0') {
            tableData.value = res.data.list
            tableTotal.value = res.data.total
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

  // 删除，重置密码，批量删除，改变状态
  function handleOperateTable(eventType, row) {
    let confirmText = '', params = {}, fn = new Function();
    if (eventType === 'del') {
      confirmText = '确认删除该账号吗'
      params.userId = [row.userId]
      params.status = 2
      fn = API.batchDelete
    }
    else if (eventType === 'batchDel') {
      confirmText = '确认删除所选账号吗'
      params.userId = row.map(item=>item.userId)
      params.status = 2
      fn = API.batchDelete
    }
    else {
      confirmText = '确认重置该账号密码吗'
      params.userId = row.userId
      fn = API.resetPassword
    }

    proxy.$confirm(confirmText,  {
      confirmButtonText: '确认',
      cancelButtonText: '取消',
      type: 'warning',
    }).then(res=>{
      if (res === 'confirm') {
        fn(params).then(res=>{
          if (res.code == '0') {
            proxy.$message({
              type: 'success',
              message: '操作成功'
            })

            handleGetTableList()
          }
        })
      }
    }).catch(()=>{
      console.log('取消')
    })
  }

  function handleSearchTable(type) {
    if (type === 'search') {
      searchTableParams.value.pageIndex = 1
    }else if (type === 'reset') {
      searchTableParams.value = {
        pageSize:50,
        pageIndex:1,
        sortField: 'created_time',
        sortType: 'DESC',
      }
    }

    handleGetTableList()
  }
  function handleClickBtn(eventType) {
    if (eventType === 'del') {
      if (selectedRows.value.length === 0) {
        proxy.$message({
          type:'error',
          message:'请选择需要删除的数据！'
        })
      }else {
        handleOperateTable('batchDel', selectedRows.value)
      }
    }else {
      handleToggleModal(true)
    }
  }

  function handleToggleModal(visible, refreshTable) {
    modalVisible.value = visible
    refreshTable && handleGetTableList()
  }

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

            .btns{
                position: relative;
                display: flex;
                align-items: center;

                .btn{
                    position: relative;
                }
            }
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

                ::v-deep .el-table__header-wrapper{
                    .el-table__cell{
                        background-color: #f7f7f7;
                        color: #000;
                    }
                }

                ::v-deep .el-table__body-wrapper{
                    height: 65vh;
                    flex: unset !important;
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