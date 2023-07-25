<template>
    <div class="operate-container bg-fff">
        <div class="title">筛选</div>

        <div class="search-container u-m-t-15 u-m-b-10">
            <el-form class="search-form" ref="formRef" :inline="true" :model="searchTableParams">

                <el-form-item v-for="(item, index) in searchFormConfig" :prop="item.prop" :label="item.label" :key="item.prop" label-position="left">

                    <el-input v-if="item.type === 'input'" v-model="searchTableParams[item.prop]" :placeholder="item.placeholder || item.label"/>

                    <el-select v-else-if="item.type === 'select' " v-model="searchTableParams[item.prop]" class="m-2" placeholder="账号来源">
                        <el-option
                                v-for="item in sourceTypeOptions"
                                :key="item.value"
                                :label="item.label"
                                :value="item.value"
                        />
                    </el-select>

                    <el-date-picker
                            v-else
                            v-model="searchTableParams[item.prop]"
                            type="daterange"
                            range-separator="-"
                            format="YYYY-MM-DD"
                            start-placeholder="开始时间"
                            end-placeholder="结束时间"
                    />

                </el-form-item>
            </el-form>

        </div>

        <div class="table-main u-m-t-10">
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

                    <el-select v-model="searchTableParams.sortField" class="m-2" placeholder="排序方式">
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
                            <el-switch v-model="row[item.prop]" :before-change="beforeChange" @change="val=>handleSwitchChange(val, row.userId)"/>
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
                        :total="16"
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
  import { ref, reactive, watch, getCurrentInstance, onMounted } from 'vue';
  import dayjs from 'dayjs';
  import { useRouter } from 'vue-router';
  import API from './api';
  import BottomBox from '@/components/bottom-box';
  import Detail from './detail'

  const { proxy } = getCurrentInstance()

  const searchFormConfig = ref([
    {label:'用户账户：', prop:'account', type:'input', placeholder:'用户ID/账号'},
    {label:'用户昵称：', prop:'userName', type:'input'},
    {label:'注册时间：', prop:'registerTime', type:'datetimerange'},
    {label:'', prop:'sourceType', type:'select'},
  ])
  const searchTableParams = reactive({
    pageSize:10,
    pageIndex:1
  })
  const tableData = ref([])
  const tableColumnConfig = ref([
    {label:'用户ID', prop:'userId'},
    {label:'用户账号', prop:'account'},
    {label:'用户昵称', prop:'userName'},
    {label:'邮箱', prop:'email'},
    {label:'是否付费', prop:'isPay', insertSlot:'isPay'},
    {label:'总消费金额', prop:'consumedAmount'},
    {label:'账号来源', prop:'source'},
    {label:'账号余额', prop:'balance'},
    {label:'账户启用状态', prop:'status', insertSlot:'status'},
    {label:'操作', prop:'operate', insertSlot:'operate'},
  ])
  const timer = ref(null)
  const pageSizeOptions = ref([10, 20, 30, 50])
  const timeSortOptions = ref([
    {label:'创建时间从晚到早', value:'desc'},
    {label:'创建时间从早到晚', value:'asc'},
  ])
  const sourceTypeOptions = ref([
    {label:'运营后台', value:0},
    {label:'智文', value:1},
    {label:'智绘', value:2},
    {label:'智像', value:3},
    {label:'AI ERP', value:4},
  ])
  const selectedRows = ref([])
  const detailVisible = ref(false)
  const detailUserId = ref('')

  function handleFormatTableCell(row, prop) {
    let text = row[prop]
    if (prop === 'isPay') {
      text = row[prop] ? '否' : '是'
    }

    return text
  }

  function handleSelectionChange(value) {
    selectedRows.value = value
  }

  function handleGetTableList() {
    let params = {
      ...searchTableParams,
    }

    if (params.registerTime) {
      params.startTime = dayjs(params.registerTime[0]).format('YYYY-MM-DD')
      params.endTime = dayjs(params.registerTime[1]).format('YYYY-MM-DD')

      delete params.registerTime
    }

    console.log('params', params)
    // API.getMemberTableList(params).then(res=>{
    //   if (res.code === '0') {
    //     tableData.value = res.data
    //   }
    // })

    tableData.value = [
      {
        "userId": 921354756,
        "account": "只集东方战",
        "userName": "和进部也当",
        "email": "会战四",
        "createdTime": "常行教代划及把",
        "status": false,
        "isPay": 0,
      },
      {
        "userId": 13543747756,
        "account": "只集东方战",
        "userName": "和进部也当",
        "email": "会战四",
        "createdTime": "常行把",
        "status": true,
        "isPay": 1,
      },
    ]
    // console.log('params', params)
  }

  function beforeChange() {
    return new Promise((resolve, reject) => {
      proxy.$confirm('确认修改账号状态吗',  {
        confirmButtonText: '确认',
        cancelButtonText: '取消',
        type: 'warning',
      }).then(res=>{
        if (res === 'confirm') {
          return resolve(true)
        }
      }).catch(()=>{
        console.log('取消')
        return reject(false)
      })
    })

  }

  function handleSwitchChange(val, userId) {
    let params = {
      status: Number(val),
      userId
    }

    console.log('params', params)

    // API.updateStatus(params).then(res=>{
    //   if (res.code === '0') {
    //     proxy.$message({
    //       type: 'success',
    //       message: '修改状态成功'
    //     })
    //
    //     handleGetTableList()
    //   }
    // })
  }

  function handleGoBack() {
    detailVisible.value = false
    detailUserId.value = ''
  }

  function handleClickCellBtn(eventType, row) {
    // console.log('row', row)
    detailVisible.value = true
    detailUserId.value = row.userId
    // router.push({path:`/member/detail/${row.userId}`})
  }

  watch(searchTableParams, (newVal, oldVal) => {
      if (timer.value !== null) {
        clearTimeout(timer.value);
      }
      timer.value = setTimeout(() => {
        handleGetTableList()
        timer.value = null;
      }, 1500)
    },
    {deep:true}
  )

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