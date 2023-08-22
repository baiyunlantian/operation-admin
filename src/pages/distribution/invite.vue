<template>
    <div class="operate-container bg-fff">
        <div class="title header-btns">
            <el-button type="primary" @click="handleClickHeaderBtn('invite')">邀请奖励规则</el-button>
            <el-button type="primary" @click="handleClickHeaderBtn('link')">复制邀请链接</el-button>
        </div>

        <div class="my-invite">
            <div class="desc">我的邀请列表</div>
            <div class="content">
                <div class="item" style="margin-right: 5%;">推广付费人员：<div class="value">{{ Payer || 0 }}</div>人</div>
                <div class="item">推广佣金额度：<div class="value">￥{{ CommissionAmount || 0 }}</div>元</div>
            </div>
        </div>

        <div class="search-container u-m-t-15 u-m-b-10">
            <el-form class="search-form" ref="formRef" :inline="true" :model="searchTableParams" :rules="rules">

                <el-form-item v-for="(item, index) in searchFormConfig" :prop="item.prop" :label="item.label" :key="item.prop" label-position="left">

                    <el-input v-if="item.type === 'input'" v-model="searchTableParams[item.prop]" :placeholder="item.placeholder || item.label" clearable/>

                    <el-select v-else-if="item.type === 'select' " v-model="searchTableParams[item.prop]" class="m-2" :placeholder="item.placeholder" clearable>
                        <el-option
                                v-for="item in handleDynamicOptions(item.prop)"
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
                    <el-button type="primary" @click="handleSearchTable('search')">搜索</el-button>
                    <el-button type="primary" @click="handleSearchTable('reset')">重置</el-button>
                </el-form-item>
            </el-form>

        </div>

        <div class="table-main u-m-t-10 bg-fff">
            <div class="header-operate theme-bg title-box">
                <div class="left-text">邀新列表</div>
                <div class="right-sort">

                    <el-select v-model="searchTableParams.pageSize" class="m-2" placeholder="显示条数" @change="handleGetTableList">
                        <el-option
                                v-for="item in pageSizeOptions"
                                :key="item"
                                :label="`每页显示${item}条`"
                                :value="item"
                        />
                    </el-select>

                    <el-select v-model="searchTableParams.sortType" class="m-2" placeholder="排序方式" @change="handleGetTableList">
                        <el-option
                                v-for="item in sortOptions"
                                :key="item.value"
                                :label="item.label"
                                :value="item.value"
                        />
                    </el-select>
                </div>
            </div>

            <el-table
                    ref="tableRef"
                    class="table-container"
                    :data="tableData"
                    border
                    style="width: 100%"
            >
                <el-table-column v-for="(item, index) in tableColumnConfig" :key="index"
                                 :prop="item.prop"
                                 :label="item.label"
                                 :width="item.width"
                                 align="center"
                >
                    <template #default="{ row, column, $index }">
                        <div class="custom-cell">{{ handleFormatTableCell(row, item.prop) }}</div>
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
                        @size-change="handleGetTableList"
                />
            </div>
        </div>

        <LINKDIALOG v-model="linkDialogVisible" :link-list="linkList">
            <template v-slot:title>
                <div class="dialog-title">您的邀请链接已生成！</div>
            </template>
        </LINKDIALOG>

        <InviteContentDialog v-model="inviteContentDialogVisible" placeholder="暂无内容，敬请期待！" :can-edit="false"/>
    </div>
</template>

<script setup>
  import {ref, reactive, watch, getCurrentInstance, onMounted, computed} from 'vue';
  import dayjs from 'dayjs';
  import { useStore } from 'vuex';
  import API from './api';
  import LINKDIALOG from './components/link-dialog';
  import InviteContentDialog from './components/invite-content-dialog';

  const { proxy } = getCurrentInstance()
  const store = useStore()

  const searchFormConfig = ref([
    {label:'ID/账号：', prop:'account', type:'input', placeholder:'用户ID/账号'},
    {label:'用户昵称：', prop:'userName', type:'input', placeholder:'用户昵称'},
    {label:'注册时间：', prop:'registerTime', type:'datetimerange'},
    {label:'', prop:'isPay', type:'select', placeholder:'是否付费'},
    {label:'', prop:'sourceType', type:'select', placeholder:'账号来源'},
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
    sourceType: 'null',
    sortType: 'desc',
  })
  const tableData = ref([])
  const tableColumnConfig = ref([
    {label:'用户ID', prop:'userId'},
    {label:'用户账号', prop:'account'},
    {label:'用户昵称', prop:'userName'},
    {label:'是否付费', prop:'isPay', insertSlot:true},
    {label:'付费总金额', prop:'paymentAmount'},
    {label:'注册时间', prop:'registrationDate'},
    {label:'账号来源', prop:'platformName'},
  ])
  const pageSizeOptions = ref([50, 100, 200])
  const sortOptions = ref([
    {label:'注册时间从晚到早', value:'desc'},
    {label:'注册时间从早到晚', value:'asc'},
  ])
  const tableListTotal = ref(0)
  const CommissionAmount = ref(0)
  const Payer = ref(0)
  const startDate = ref(null)
  const formRef = ref(null)
  const tableRef = ref()
  const isPayOptions = ref([
    {label:'付费用户', key:'1'},
    {label:'未付费用户', key:'0'},
  ])
  const linkList = ref([])
  const linkDialogVisible = ref(false)
  const inviteContentDialogVisible = ref(false)

  function datePickerChange(dates) {
    // 记录选择的起始日期
    let hasSelectDate = dates !== null && dates.length > 0
    startDate.value = hasSelectDate ? dates[0] : null
  }

  function handleClickHeaderBtn(type) {
    if (type === 'link') {
      linkDialogVisible.value = true
    }else {
      inviteContentDialogVisible.value = true
    }
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

  function handleDynamicOptions(prop) {
    let list = []
    switch (prop) {
      case 'isPay':
        list = isPayOptions.value;
        break;
      case 'sourceType':
        list = sourceTypeOptions.value;
        break;
      default:
        list = [];
        break;
    }

    return list
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
        API.getInviteUserList(params).then(res=>{
          if (res.code == '0') {
            tableRef.value.setScrollTop(0)
            const { CommissionAmount:c, Payer:p, list, total } = res.data
            tableData.value = list
            tableListTotal.value = total
            CommissionAmount.value = c
            Payer.value = p
          }
        })
      }
    })
  }

  function handleFormatTableCell(row, prop) {
    let text = row[prop]
    if (prop === 'isPay') {
      text = row[prop] ? '是' : '否'
    }

    return text
  }

  function handleGetLinkList() {
    API.getInvitationLink().then(res=>{
      if (res.code == 0) {
        linkList.value = res.data
      }
    })
  }

  function handleSearchTable(type) {
    if (type === 'search') {
      searchTableParams.value.pageIndex = 1
      handleGetTableList()
    }else if (type === 'reset') {
      searchFormConfig.value.forEach(item=>{
        searchTableParams.value[item.prop] = item.prop === 'sourceType' ? 'null' : ''
      })
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
    handleGetLinkList()
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

        .dialog-title{
            text-align: center;
            font-size: 18px;
            color: #404040;
            margin-bottom: 1vh;
        }

        .my-invite{
            padding: 10px;
            position: relative;

            .desc{
                position: relative;
                font-size: 16px;
                font-weight: bold;
                color: #212121;
            }

            .content{
                display: flex;
                margin-top: 10px;
                font-size: 15px;

                .item{
                    width: auto;
                    display: flex;
                    align-items: center;

                    .value {
                        position: relative;
                        margin: 0 10px;
                    }
                }
            }
        }

        .search-container{
            position: relative;
            padding: 0 10px;
        }

        .table-main{
            height: calc(100% - 200px);
            position: relative;
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
                height: calc(100% - 60px);

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