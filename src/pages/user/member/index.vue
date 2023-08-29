<template>
    <div class="operate-container bg-fff u-flex-col">
        <div class="title">筛选</div>

        <div class="search-container u-m-t-15 u-m-b-10">
            <el-form class="search-form" ref="formRef" :inline="true" :model="searchTableParams" :rules="rules">

                <el-form-item v-for="(item, index) in searchFormConfig" :prop="item.prop" :label="item.label" :key="item.prop" label-position="left">

                    <el-input v-if="item.type === 'input'" v-model="searchTableParams[item.prop]" :placeholder="item.placeholder || item.label" clearable/>

                    <el-select v-else-if="item.type === 'select' " v-model="searchTableParams[item.prop]" class="m-2" :placeholder="item.placeholder" clearable>
                        <el-option
                                v-for="item in handleReturnOptions(item.prop)"
                                :key="item.key"
                                :label="item.label"
                                :value="item.key"
                        />
                    </el-select>

                    <LimitDatePicker v-else v-model="searchTableParams[item.prop]"/>

                </el-form-item>

                <el-form-item class="">
                    <el-button type="primary" @click="handleSearchTable('search')">搜索</el-button>
                    <el-button type="primary" @click="handleSearchTable('reset')">重置</el-button>
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

                    <el-select v-model="searchTableParams.sort" class="m-2 u-m-l-10" placeholder="排序方式" @change="handleGetTableList">
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
                                    :inactive-value="1"
                                    :active-value="0"
                            />
                        </div>

                        <div v-else-if="item.insertSlot && item.prop === 'operate'">
                            <span class="u-cursor blue u-m-r-20" @click="handleClickCellBtn('detail', row)">查看</span>
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
  import Detail from './detail';
  import LimitDatePicker from '@/components/LimitDatePicker';

  const { proxy } = getCurrentInstance()
  const store = useStore()

  const searchFormConfig = ref([
    {label:'ID/手机号：', prop:'account', type:'input', placeholder:'用户ID/手机号'},
    {label:'用户昵称：', prop:'userName', type:'input', placeholder:'用户昵称'},
    {label:'注册时间：', prop:'registerTime', type:'datetimerange'},
    {label:'账号来源：', prop:'sourceType', type:'select', placeholder:'账号来源'},
    // {label:'', prop:'dynamicScope', type:'select', placeholder:'最近登录'},
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
        message: '请输入不超过10位数的昵称'
      }
    ]
  })
  const searchTableParams = ref({
    pageSize:50,
    pageIndex:1,
    sortField: 'register_time',
    sort: 'desc',
    sourceType: 'null'
  })
  const tableData = ref([])
  const tableColumnConfig = ref([
    {label:'用户ID', prop:'userId'},
    {label:'手机号', prop:'account'},
    {label:'用户昵称', prop:'userName'},
    {label:'是否付费', prop:'isPay', insertSlot:'isPay'},
    {label:'总消费金额', prop:'consumedAmount'},
    {label:'账号来源', prop:'source'},
    {label:'注册时间', prop:'registerTime'},
    {label:'今日是否使用', prop:'isUse'},
    {label:'最后登录时间', prop:'lastLoginTime'},
    {label:'账户启用状态', prop:'status', insertSlot:'status'},
    {label:'操作', prop:'operate', insertSlot:'operate'},
  ])
  const pageSizeOptions = ref([50, 100, 200])
  const timeSortOptions = ref([
    {label:'注册时间从晚到早', value:'desc'},
    {label:'注册时间从早到晚', value:'asc'},
  ])
  const selectedRows = ref([])
  const detailVisible = ref(false)
  const detailUserId = ref('')
  const tableListTotal = ref(0)
  const formRef = ref(null)
  const tableRef = ref()
  const dynamicScopeOptions = ref([
    {label:'全部', key:'null'},
    {label:'1天内', key:'1'},
    {label:'3天内', key:'2'},
    {label:'7天内', key:'3'},
    {label:'30天内', key:'4'},
    {label:'30天前', key:'5'},
  ])

  function handleReturnOptions(prop) {
    let options = []
    switch (prop) {
      case 'sourceType':
        options = sourceTypeOptions.value;
        break;
      case 'dynamicScope':
        options = dynamicScopeOptions.value;
        break;
      default:
        options = [];
    }

    return options
  }

  function handleFormatTableCell(row, prop) {
    let text = row[prop]
    if (prop === 'isPay') {
      text = row[prop] ? '是' : '否'
    }

    return text
  }

  function handleSelectionChange(value) {
    selectedRows.value = value
  }

  function handleGetTableList(setScrollTop = true) {
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

    if (params.dynamicScope === 'null') {
      params.dynamicScope = ''
    }

    formRef.value.validate(valid => {
      if (valid) {
        API.getMemberTableList(params).then(res=>{
          if (res.code == '0') {
            setScrollTop && tableRef.value.setScrollTop(0)
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

  function handleGoBack() {
    detailVisible.value = false
    detailUserId.value = ''
  }

  function handleClickCellBtn(eventType, row) {
    detailVisible.value = true
    detailUserId.value = row.userId
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
        searchTableParams.value[item.prop] = item.prop === 'sourceType' ? 'null' : ''
      })
      formRef.value.clearValidate()
    }
  }

  const sourceTypeOptions = computed(() => {
    let res = [{label:'全部', key:'null'}], list = store.getters['platformType/list']

    if (Array.isArray(list)) {
      res = res.concat(list)
    }

    return res
  })

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
        }
    }
</style>