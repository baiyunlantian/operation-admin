<template>
    <div class="detail-container bg-fff u-flex-col">
        <div class="header theme-bg">
            <span class="u-cursor" @click="goBack">&lt;</span>
            分销用户详情
        </div>

        <div class="search-container">
            <div class="user-info">
                <div class="content">
                    <div class="item"><span>用户名：{{ userInfo.userName }}</span></div>
                </div>
                <div class="content">
                    <div class="item"><span>用户账号：{{ userInfo.account }}</span></div>
                </div>
                <div class="content">
                    <div class="item" style="margin-right: 5%;">推广付费人员：<div class="value">{{ userInfo.promotionPayers || 0 }}</div>人</div>
                    <div class="item">推广佣金：<div class="value">{{ userInfo.promotionCommissionAmount || 0 }}</div>元</div>
                </div>
            </div>

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

                    <LimitDatePicker v-else v-model="searchTableParams[item.prop]"/>

                </el-form-item>

                <el-form-item class="">
                    <el-button type="primary" @click="handleSearchTable('search')">搜索</el-button>
                    <el-button type="primary" @click="handleSearchTable('reset')">重置</el-button>
                </el-form-item>
            </el-form>

        </div>

        <div class="u-table-main bg-fff u-flex-col">
            <div class="u-table-header-operate theme-bg title-box">
                <div class="left-text">邀新列表</div>
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
                                v-for="item in sortOptions"
                                :key="item.value"
                                :label="item.label"
                                :value="item.value"
                        />
                    </el-select>
                </div>
            </div>

            <el-table
                    class="u-table-container"
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
                        <div>{{ handleFormatTableCell(row, item.prop) }}</div>
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

        <LINKDIALOG v-model="linkDialogVisible" :link-list="linkList"/>
    </div>
</template>

<script setup>
  import { reactive, ref, defineProps, onMounted, computed, defineEmits } from 'vue';
  import { useStore } from 'vuex';
  import API from './api';
  import dayjs from "dayjs";
  import LINKDIALOG from './components/link-dialog';
  import LimitDatePicker from '@/components/LimitDatePicker';

  const props = defineProps(['userId'])
  const emits = defineEmits(['goBack'])
  const store = useStore()

  const searchFormConfig = ref([
    {label:'ID/账号：', prop:'account', type:'input', placeholder:'用户ID/账号'},
    {label:'用户昵称：', prop:'userName', type:'input', placeholder:'用户昵称'},
    {label:'注册时间：', prop:'registerTime', type:'datetimerange'},
    {label:'是否付费：', prop:'isPay', type:'select', placeholder:'是否付费'},
    {label:'账号来源：', prop:'sourceType', type:'select', placeholder:'账号来源'},
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
    sourceType: 'null',
    isPay: 'null',
    sortType: 'desc',
  })
  const tableData = ref([])
  const tableColumnConfig = ref([
    {label:'用户ID', prop:'userId'},
    {label:'手机号', prop:'account'},
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
  const formRef = ref(null)
  const isPayOptions = ref([
    {label:'全部', key:'null'},
    {label:'付费用户', key:'true'},
    {label:'未付费用户', key:'false'},
  ])
  const linkList = ref([])
  const linkDialogVisible = ref(false)
  const userInfo = ref({})

  function handleFormatTableCell(row, prop) {
    let text = row[prop]
    if (prop === 'isPay') {
      text = row[prop] ? '是' : '否'
    }

    return text
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

  function goBack() {
    emits('goBack')
  }

  function handleGetTableList() {
    let params = {
      inviterId: props.userId,
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

    if (params.isPay === 'null') {
      params.isPay = ''
    }

    formRef.value.validate(valid => {
      if (valid) {
        API.getInviteUserList(params).then(res=>{
          if (res.code == '0') {
            tableData.value = res.data.list
            tableListTotal.value = res.data.total
          }
        })
      }
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
        searchTableParams.value[item.prop] = item.prop === 'sourceType' || item.prop === 'isPay' ? 'null' : ''
      })
      formRef.value.clearValidate()
    }
  }

  function handleGetUserInfo() {
    if (props.userId) {
      API.getDetailByUserId({userId: props.userId}).then(res=>{
        if (res.code == '0') {
          userInfo.value = res.data
        }
      })
    }
  }

  function handleGetLinkList() {
    API.getInvitationLink().then(res=>{
      if (res.code == 0) {
        linkList.value = res.data
      }
    })
  }

  const sourceTypeOptions = computed(() => {
    let res = [{label:'全部', key:'null'}], list = store.getters['platformType/list']

    if (Array.isArray(list)) {
      res = res.concat(list)
    }

    return res
  })

  onMounted(() => {
    handleGetUserInfo()
    // handleGetLinkList()
    handleGetTableList()
  })
</script>

<style scoped lang="scss">
    .detail-container{
        position: absolute;
        height: 100%;
        width: 100%;
        z-index: 999;
        top: 0;
        left: 0;

        .header{
            color: #ffffff;
            font-size: 22px;
            font-weight: bold;
            padding: 10px 15px;
        }

        .search-container{
            position: relative;
            padding: 20px;

            .user-info{
                position: relative;

                .desc{
                    position: relative;
                    font-size: 16px;
                    font-weight: bold;
                    color: #212121;
                }

                .content{
                    display: flex;
                    margin-bottom: 20px;
                    font-size: 16px;

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
        }

    }
</style>