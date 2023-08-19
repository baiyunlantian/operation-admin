<template>
    <div class="operate-container bg-fff">
        <div class="title"></div>

        <div class="search-container u-m-t-15 u-m-b-10">
            <el-form class="search-form" ref="formRef" :inline="true" :model="searchTableParams" :rules="rules">
                <el-form-item class="first-form-item">
                    <el-button type="primary" @click="handleToggleDialog('commission')">设置佣金计算</el-button>
                    <el-button type="primary" @click="handleToggleDialog('invite')">邀请奖励活动内容</el-button>
                </el-form-item>

                <el-form-item v-for="(item, index) in searchFormConfig" :prop="item.prop" :label="item.label" :key="item.prop" label-position="left">

                    <el-input v-model="searchTableParams[item.prop]" :placeholder="item.placeholder || item.label" clearable/>

                </el-form-item>

                <el-form-item class="">
                    <el-button type="primary" @click="handleSearchTable('search')">搜索</el-button>
                    <el-button type="primary" @click="handleSearchTable('reset')">重置</el-button>
                </el-form-item>
            </el-form>

        </div>

        <div class="table-main u-m-t-10 bg-fff">
            <div class="header-operate theme-bg title-box">
                <div class="left-text">用户列表</div>
                <div class="right-sort">
                    <div class="sort-container">
                        <Popover v-model="searchTableParams.sortType" :options="sortOptions">
                            <template v-slot:popover-icon>
                                <el-icon class="u-cursor" style="font-size: 16px; color: #fff"><Sort /></el-icon>
                            </template>
                        </Popover>
                    </div>

                    <el-select v-model="searchTableParams.sortField" class="m-2" placeholder="排序方式" @change="handleSearchTable('select')">
                        <el-option
                                v-for="item in promotionOptions"
                                :key="item.value"
                                :label="item.label"
                                :value="item.value"
                        />
                    </el-select>

                    <el-select v-model="searchTableParams.pageSize" class="m-2" placeholder="显示条数" @change="handleSearchTable('select')">
                        <el-option
                                v-for="item in pageSizeOptions"
                                :key="item"
                                :label="`每页显示${item}条`"
                                :value="item"
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

                        <div v-if="item.prop === 'operate'" class="insert-cell-container">
                            <span class="u-cursor blue u-m-r-20" @click="handleClickCellBtn('detail', row)">查看</span>
                            <span class="u-cursor blue u-m-r-20" @click="handleToggleDialog('commission', row)">设置佣金计算</span>
                        </div>

                        <div v-else-if="item.prop === 'peopleNumber'" class="insert-cell-container">
                            {{ row['promotionPayers'] || 0 }} / {{ row['promotionNumbers'] || 0 }}
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


        <Transition name="fade" mode="out-in">
            <Detail v-if="detailVisible" :user-id="detailUserId" @goBack="handleGoBack"/>
        </Transition>

        <CommissionComputeDialog v-model="commissionDialogVisible" :user-ids="userIds" :user-commission="userCommission" @refreshTable="handleSearchTable"/>

        <InviteContentDialog v-model="inviteContentDialogVisible" @refreshTable="handleSearchTable" />
    </div>
</template>

<script setup>
  import {ref, reactive, watch, getCurrentInstance, onMounted, computed} from 'vue';
  import dayjs from 'dayjs';
  import API from './api';
  import Detail from './detail'
  import Popover from '@/components/productTypePopover';
  import CommissionComputeDialog from './components/commission-compute-dialog';
  import InviteContentDialog from './components/invite-content-dialog';

  const searchFormConfig = ref([
    {label:'ID/账号：', prop:'account', type:'input', placeholder:'用户ID/账号'},
    {label:'用户昵称：', prop:'userName', type:'input', placeholder:'用户昵称'},
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
    pageSize:50,
    pageIndex:1,
    sortType: 'desc',
    sortField: 'paymentAmount',
  })
  const tableData = ref([])
  const tableColumnConfig = ref([
    {label:'排名', prop:'sort', width:100},
    {label:'用户名', prop:'userName'},
    {label:'用户账号', prop:'account'},
    {label:'用户ID', prop:'userId'},
    {label:'推广付费人数/推广人数', prop:'peopleNumber'},
    {label:'付费总金额', prop:'paymentAmount'},
    {label:'推广佣金', prop:'promotionCommissionAmount'},
    {label:'操作', prop:'operate'},
  ])
  const pageSizeOptions = ref([50, 100, 200])
  const promotionOptions = ref([
    {label:'按推广付费金额', value:'paymentAmount'},
    {label:'按推广付费人数', value:'promotionPayers'},
    {label:'按推广人数', value:'promotionNumbers'},
  ])
  const selectedRows = ref([])
  const userIds = ref([])
  const detailVisible = ref(false)
  const commissionDialogVisible = ref(false)
  const inviteContentDialogVisible = ref(false)
  const detailUserId = ref('')
  const tableListTotal = ref(0)
  const formRef = ref(null)
  const sortOptions = ref([
    {label: '降序', key: 'desc'},
    {label: '升序', key: 'asc'},
  ])
  const userCommission = ref({})

  function handleGoBack() {
    detailVisible.value = false
    detailUserId.value = ''
  }

  function handleToggleDialog(dialogType, param) {
    if (dialogType === 'commission') {
      if (param) {
        userIds.value = [param.userId]
        API.getCommission({userId: param.userId}).then(res=>{
          if (res.code == 0) {
            userCommission.value = res.data
          }
        })
      }else {
        userIds.value = selectedRows.value
        userCommission.value = {type:0, amount: 0}
      }
      commissionDialogVisible.value = true
    }else {
      inviteContentDialogVisible.value = true
    }
  }

  function handleFormatTableCell(row, prop) {
    let text = row[prop]
    if (prop === 'isPay') {
      text = row[prop] ? '是' : '否'
    }

    return text
  }

  function handleSelectionChange(value) {
    selectedRows.value = value.map(item=>item.userId)
  }

  function handleGetTableList() {
    let params = {
      ...searchTableParams.value,
    }

    formRef.value.validate(valid => {
      if (valid) {
        API.getDistributionManageList(params).then(res=>{
          if (res.code == '0') {
            tableData.value = res.data.list
            tableListTotal.value = res.data.total
          }
        })
      }
    })
  }

  function handleClickCellBtn(eventType, row) {
    detailVisible.value = true
    detailUserId.value = row.userId
  }

  function handleSearchTable(type) {
    if (type === 'search') {
      searchTableParams.value.pageIndex = 1
      handleGetTableList()
    }else if (type === 'reset') {
      searchFormConfig.value.forEach(item=>{
        searchTableParams.value[item.prop] = ''
      })
    }
  }

  watch(
    () => searchTableParams.value.sortType,
    (newVal) => {
      handleGetTableList()
    }
  )

  onMounted(() => {
    handleGetTableList()
  })
</script>

<style scoped lang="scss">
    .operate-container{
        position: relative;

        .title{
            padding: 10px;
            border-bottom: 1px dashed #3f99f7;
        }

        .search-container{
            position: relative;
            padding: 0 10px;

            .first-form-item{
                position: relative;
                margin-right: 10%;
            }
        }

        .table-main{
            position: relative;
            /* height 减去 .title  .search-container  高度 */
            height: calc(100% - 100px);

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
                    display: flex;
                    align-items: center;

                    .sort-container{
                        margin-right: 20px;

                        :deep(.text){
                            color: #ffffff;
                        }
                    }

                    ::v-deep .el-select{
                        width: 170px;
                        margin-left: 10px;
                    }
                }
            }

            .table-container {
                position: relative;
                height: calc(100% - 105px);

                ::v-deep .el-scrollbar{
                    overflow: auto;
                }

                ::v-deep .el-table__header-wrapper{
                    .el-table__cell{
                        background-color: #f7f7f7;
                        color: #000;
                    }
                }

                ::v-deep .el-table__body-wrapper{
                    height: calc(100% - 40px);
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