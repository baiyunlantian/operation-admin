<template>
    <div class="operate-container bg-fff u-flex-col">
        <div class="title">筛选</div>

        <div class="search-container u-m-t-15 u-m-b-10">
            <el-form class="search-form" ref="formRef" :inline="true" :model="searchTableParams" :rules="rules">

                <el-form-item v-for="(item, index) in searchFormConfig" :prop="item.prop" :label="item.label" :key="item.prop" label-position="left">

                    <el-input v-if="item.type === 'input'" v-model="searchTableParams[item.prop]" :placeholder="item.placeholder || item.label" clearable/>

                    <LimitDatePicker v-else ref="datePickerRef" v-model="searchTableParams[item.prop]" :custom-disabled-date-fn="handleDisabledDate"/>
                </el-form-item>

                <el-form-item class="">
                    <el-button type="primary" @click="handleSearchTable('search')">搜索</el-button>
                    <el-button type="primary" @click="handleSearchTable('reset')">重置</el-button>
                </el-form-item>
            </el-form>

            <div class="btns">
                <el-button class="popup-dialog-btn btn" type="primary" @click="handleClickBtn('del')">批量删除</el-button>
                <el-button class="popup-dialog-btn btn" type="primary" @click="handleClickBtn('add')">添加用户</el-button>
            </div>

        </div>

        <div class="u-table-main u-m-t-10 u-flex-col">
            <div class="u-table-header-operate theme-bg title-box">
                <div class="left-text">用户列表</div>
                <div class="right-sort">
                    <el-select v-model="searchTableParams.pageSize" class="m-2 u-m-l-10" placeholder="显示条数" @change="handleGetTableList">
                        <el-option
                                v-for="item in pageSizeOptions"
                                :key="item"
                                :label="`每页显示${item}条`"
                                :value="item"
                        />
                    </el-select>

                    <el-select v-model="searchTableParams.sortType" class="m-2 u-m-l-10" placeholder="排序方式" @change="handleGetTableList">
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
                    ref="tableRef"
                    class="u-table-container"
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
                        <div v-if="item.insertSlot && item.prop === 'status'">
                            <el-switch
                                    v-model="row[item.prop]"
                                    :before-change="()=>beforeChange(row[item.prop], row.userId)"
                                    :inactive-value="0"
                                    :active-value="1"
                            />
                        </div>

                        <div v-else-if="item.insertSlot && item.prop === 'operate'">
                            <span class="u-cursor blue u-m-r-20" @click="handleOperateTable('reset', row)">重置密码</span>
                            <span class="u-cursor blue" @click="handleOperateTable('del', row)">删除</span>
                        </div>

                        <div v-else>{{ row[item.prop] }}</div>
                    </template>
                </el-table-column>
            </el-table>

            <div class="u-pagination-container bg-fff">
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


        <Modal v-if="modalVisible" @close="handleToggleModal"/>
        <PwdModal v-model="pwdModalVisible" :pwd="pwd" @close="handleTogglePwdModal"/>
    </div>
</template>

<script setup>
  import {ref, reactive, watch, getCurrentInstance, onMounted} from 'vue';
  import API from './api';
  import dayjs from 'dayjs';
  import Modal from './components/modal';
  import LimitDatePicker from '@/components/LimitDatePicker';
  import PwdModal from './components/copyPassword';

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
  const tableRef = ref()
  const pageSizeOptions = ref([50, 100, 200])
  const timeSortOptions = ref([
    {label:'创建时间从晚到早', value:'DESC'},
    {label:'创建时间从早到晚', value:'ASC'},
  ])
  const selectedRows = ref([])
  const modalVisible = ref(false)
  const pwdModalVisible = ref(false)
  const tableTotal = ref(0)
  const formRef = ref(null)
  const pwd = ref()

  // 限定时间选择范围
  function handleDisabledDate(time, startDate) {
    const day = 24 * 60 * 60 * 1000;
    const timestamp = time.getTime()
    if (startDate !== null) {
      return (
        timestamp < startDate.getTime() - 29 * day ||
        timestamp > startDate.getTime() + 29 * day
      )
    }
  }

  function handleSelectionChange(value) {
    selectedRows.value = value
  }

  function handleGetTableList(setScrollTop = true) {
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
            setScrollTop && tableRef.value.setScrollTop(0)
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
              handleGetTableList(false)
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

  // 删除，重置密码，批量删除
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

            if (eventType === 'reset') {
              pwd.value = res.data
              handleTogglePwdModal(true)
            }
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
      formRef.value.validate(valid => {
        if (valid) {
          searchTableParams.value.pageIndex = 1
          handleGetTableList()
        }
      })
    }else if (type === 'reset') {
      searchFormConfig.value.forEach(item=>{
        searchTableParams.value[item.prop] = ''
      })
      formRef.value.clearValidate()
    }
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

  function handleToggleModal(visible, param) {
    modalVisible.value = visible
    if (param && param.passWord) {
      pwd.value = param.passWord
      handleGetTableList()
      handleTogglePwdModal(true)
    }
  }

  function handleTogglePwdModal(visible = false) {
    pwdModalVisible.value = visible
  }

  onMounted(() => {
    handleGetTableList()
  })
</script>

<style scoped lang="scss">
    .operate-container{
        position: relative;

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
    }
</style>