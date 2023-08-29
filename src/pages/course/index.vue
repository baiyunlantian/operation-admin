<template>
    <div class="operate-container bg-fff u-flex-col">
        <div class="title">筛选</div>

        <div class="search-container u-m-t-15 u-m-b-10">
            <el-form class="search-form" ref="formRef" :inline="true" :model="searchTableParams" :rules="rules">

                <el-form-item v-for="(item, index) in searchFormConfig" :prop="item.prop" :label="item.label" :key="item.prop" label-position="left">
                    <el-input v-model="searchTableParams[item.prop]" clearable/>
                </el-form-item>

                <el-form-item class="">
                    <el-button type="primary" @click="handleGetTableList">搜索</el-button>
                </el-form-item>

                <el-form-item class="">
                    <el-button type="primary" class="btn popup-dialog-btn" @click="handleClickDelete('batchDel')">批量删除</el-button>
                </el-form-item>

                <el-form-item class="enter-btn">
                    <el-button type="primary" class="btn popup-dialog-btn" @click="handleToggleDialog(true)">录入</el-button>
                </el-form-item>
            </el-form>
        </div>

        <div class="u-table-main u-m-t-10 bg-fff u-flex-col">
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
                    @select="handleSelectRow"
                    @select-all="handleSelectAll"
            >
                <el-table-column type="selection" width="55" />
                <el-table-column v-for="(item, index) in tableColumnConfig" :key="index"
                                 :prop="item.prop"
                                 :label="item.label"
                                 :width="item.width"
                                 align="center"
                >
                    <template #default="{ row, column, $index }">
                        <div v-if="item.insertSlot && item.prop === 'operate'">
                            <span class="u-cursor blue u-m-r-20" @click="handleClickDelete('delete', row)">删除</span>
                        </div>

                        <div v-else>{{ handleFormatTableCell(row, item.prop) }}</div>
                    </template>
                </el-table-column>
            </el-table>

            <div class="u-pagination-container">
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
        <!-- 手机录入 -->
        <el-dialog
                v-model="dialogVisible"
                class="dialog-container"
                width="700"
                :close-on-click-modal="false"
                :show-close="false"
        >
            <template #header>
                <div class="dialog-header">
                    <div class="">录入手机号</div>
                    <div class="close-btn icon u-cursor" @click="handleToggleDialog(false)">关闭</div>
                </div>
            </template>


            <div class="dialog-body">
                <el-input v-model="phoneList" class="textarea" type="textarea" placeholder="请输入手机号" />
            </div>

            <template #footer>
                <el-button type="primary" class="btn" @click="handleClickDialogBtn('ok')" :loading="btnLoading" :disabled="btnLoading">确定录入</el-button>
                <el-button type="" class="btn" @click="handleClickDialogBtn('cancel')" :loading="btnLoading" :disabled="btnLoading">取消</el-button>
            </template>
        </el-dialog>
    </div>
</template>

<script setup>
  import {ref, reactive, watch, getCurrentInstance, onMounted, computed, nextTick} from 'vue';
  import dayjs from 'dayjs';
  import API from './api';

  const { proxy } = getCurrentInstance()

  const searchFormConfig = ref([
    {label:'手机号：', prop:'number', type:'input'},
  ])
  const rules = reactive({
    number:[
      {
        pattern: /^1(3|4|5|6|7|8|9)\d{9}$/,
        trigger: 'blur',
        message: '请输入正确的手机号'
      }
    ],
  })
  const searchTableParams = ref({
    pageSize:50,
    pageIndex:1,
    sortField: 'created_time',
    sortType: 'DESC',
  })
  const tableData = ref([])
  const tableColumnConfig = ref([
    {label:'手机号', prop:'phoneNumber'},
    {label:'录入时间', prop:'createdTime'},
    {label:'注册状态', prop:'registrationStatus'},
    {label:'赠送状态', prop:'giveStatus'},
    {label:'操作', prop:'operate', insertSlot:'operate'},
  ])
  const pageSizeOptions = ref([50, 100, 200])
  const timeSortOptions = ref([
    {label:'注册时间从晚到早', value:'DESC'},
    {label:'注册时间从早到晚', value:'ASC'},
  ])
  const cacheSelectedRow = reactive(new Set())
  const tableListTotal = ref(0)
  const formRef = ref(null)
  const dialogVisible = ref(false)
  const phoneList = ref('')
  const tableRef = ref()
  const btnLoading = ref(false)
  const giveStatusOptions = ref(['未赠送','部分赠送','已赠送'])
  const registrationStatusOptions = ref(['未注册','部分注册','已注册'])


  function handleFormatTableCell(row, prop) {
    let text = row[prop]
    if (prop === 'giveStatus') {
      text = giveStatusOptions.value[row[prop]]
    }else if (prop === 'registrationStatus') {
      text = registrationStatusOptions.value[row[prop]]
    }

    return text
  }

  function handleClickDelete(type, row) {
    if (type === 'batchDel') {
      if (cacheSelectedRow.size === 0) {
        proxy.$message({
          type:'warning',
          message:'请勾选需要删除的数据！'
        })
      }else {
        let ids = Array.from(cacheSelectedRow);
        handleDelete(ids)
      }
    }else {
      handleDelete([row.redemptionCodeId])
    }
  }

  function handleDelete(ids) {
    proxy.$confirm('请谨慎操作，确认删除之前所选记录吗',  {
      confirmButtonText: '确认',
      cancelButtonText: '取消',
      type: 'warning',
    }).then(res=>{
      if (res === 'confirm') {
        API.batchDeletePhone({redemptionCodeIds:ids}).then(res=>{
          if (res.code == 0) {
            proxy.$message({
              type:'success',
              message:'删除成功'
            })

            // 清空之前所勾选的数据
            cacheSelectedRow.clear()
            // ids.forEach(id=>cacheSelectedRow.delete(id))
            handleReset()
          }
        })
      }
    }).catch(()=>{})
  }

  // 手机录入弹出框
  function handleToggleDialog(visible) {
    if (visible === false) phoneList.value = ''
    dialogVisible.value = visible
  }

  function handleClickDialogBtn(type) {
    if (type === 'ok') {
      let phoneArray = [], reg = /^1(3|4|5|6|7|8|9)\d{9}$/, errIndexArray = [];
      phoneList.value.split('\n').forEach((phone,index) => {
        if (reg.test(phone)) {
          phoneArray.push(phone)
        }else {
          errIndexArray.push(index + 1)
        }
      })
      console.log('phoneArray', phoneArray)
      if (phoneArray.length === 0) {
        proxy.$message({
          type:'warning',
          message:'请输入正确的手机号！'
        })
        return
      }

      btnLoading.value = true
      API.batchAddPhone({numbers: phoneArray}).then(res=>{
        if (res.code == 0) {
          proxy.$message({
            type:'success',
            message:'录入成功'
          })

          handleReset()
          handleToggleDialog(false)
        }
      }).finally(() => {
        btnLoading.value = false
      })
    }else {
      handleToggleDialog(false)
    }
  }

  function handleReset() {
    searchTableParams.value = {
      pageSize:50,
      pageIndex:1,
      sortField: 'created_time',
      sortType: 'DESC',
    }

    handleGetTableList()
  }

  function handleSelectRow(selection, row) {
    // 判断之前是否勾选过
    if (cacheSelectedRow.has(row.redemptionCodeId)) {
      cacheSelectedRow.delete(row.redemptionCodeId)
    }else {
      cacheSelectedRow.add(row.redemptionCodeId)
    }
  }

  function handleSelectAll(selection) {
    // 判断是否勾选全选
    if (selection.length > 0) {
      selection.forEach(item=>{
        cacheSelectedRow.add(item.redemptionCodeId)
      })
    }else {
      tableData.value.forEach(item=>{
        cacheSelectedRow.delete(item.redemptionCodeId)
      })
    }
  }

  function handleGetTableList() {
    let params = {
      ...searchTableParams.value,
    }

    formRef.value.validate(valid => {
      if (valid) {
        API.getCourseUserList(params).then(res=>{
          if (res.code == '0') {
            tableRef.value.setScrollTop(0)
            tableData.value = res.data.list
            tableListTotal.value = res.data.total

            nextTick(() => {
              if (cacheSelectedRow.size > 0) {
                res.data.list.forEach((row, index)=>{
                  // 判断当前列表之前是否有勾选过的行
                  if (cacheSelectedRow.has(row.redemptionCodeId)) {
                    cacheSelectedRow.add(row.redemptionCodeId)
                    tableRef.value.toggleRowSelection(row, true)
                  }
                })
              }
            })
          }
        })
      }
    })
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

            .search-form{
                display: flex;
                align-items: center;

                .enter-btn{
                    flex: 1;

                    :deep(.el-form-item__content){
                        display: flex;
                        justify-content: flex-end;
                    }
                }
            }
        }


        .dialog-container{
            .dialog-body{
                position: relative;

                .textarea{
                    height: 45vh;

                    :deep(.el-textarea__inner){
                        height: 100%;
                        overflow: auto;
                    }
                }
            }

            .dialog-header{
                display: flex;
                align-items: center;
                justify-content: space-between;

                div{
                    font-weight: bold;
                    font-size: 18px;
                }

                .close-btn{
                    position: relative;
                }
            }
        }
    }
</style>