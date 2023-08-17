<template>
    <div class="detail-container bg-fff">
        <div class="header bg-box">
            <span class="u-cursor" @click="goBack">&lt;</span>
            用户详情
        </div>

        <div class="base-info">
            <div class="left-avatar">
                <img class="avatar" :src="userInfo.avatarUrl || userAvatar" />
            </div>

            <div class="right-form">
                <div v-for="(info, index) in userInfoFormConfig" :key="index" class="info-item">
                    <div class="label border-top border-right">{{info.label}}</div>
                    <div class="content border-top border-right">{{userInfo[info.prop]}}</div>
                </div>
            </div>
        </div>

        <div class="title u-m-l-r-20 u-m-t-20 u-m-b-10">统计信息</div>
        <el-row :gutter="0" justify="center">
            <el-col :span="23">
                <el-table
                        class="table-container"
                        :data="statisticInfo"
                        border
                        style="width: 100%"
                >
                    <el-table-column v-for="(item, index) in statisticTableColumnConfig" :key="index"
                                     :prop="item.prop"
                                     :label="item.label"
                                     :width="item.width"
                                     align="center"
                    >
                        <template  #default="{ row, column, $index }">
                            <div class="custom-cell" v-if="item.insertSlot">{{ row[item.prop] }}（会员&lt;无线次数&gt;）</div>
                            <div class="custom-cell" v-else>{{ row[item.prop] }}</div>
                        </template>
                    </el-table-column>
                </el-table>
            </el-col>
        </el-row>

        <div class="title u-m-l-r-20 u-m-t-20 u-m-b-10">充值记录</div>
        <el-row :gutter="0" justify="center">
            <el-col :span="23">
                <el-table
                        class="table-container"
                        :data="recordTableList"
                        border
                        style="width: 100%"
                >
                    <el-table-column v-for="(item, index) in recordTableColumnConfig" :key="index"
                                     :prop="item.prop"
                                     :label="item.label"
                                     :width="item.width"
                                     align="center"
                    />
                </el-table>
            </el-col>
        </el-row>


        <el-row v-if="checkAllBtnVisible" :gutter="0" justify="center">
            <el-col :span="23">
                <div class="check-more">
                    <span class="u-cursor" @click="handleCheckAll(true)">查看全部</span>
                </div>
            </el-col>
        </el-row>


        <Dialog
                :visible="dialogVisible"
                :column-config="recordTableColumnConfig"
                :user-id="userInfo.userId"
                @close="handleCheckAll"
        />
    </div>
</template>

<script setup>
  import { reactive, ref, defineProps, onMounted, computed, defineEmits } from 'vue';
  import { useStore } from 'vuex';
  import API from './api';
  import ImgUrl from '@/assets/images/account.png';
  import Dialog from './components/dialog'

  const props = defineProps(['userId'])
  const emits = defineEmits(['goBack'])
  const store = useStore()

  const dialogVisible = ref(false)
  const checkAllBtnVisible = ref(false)
  const userAvatar = ref(ImgUrl)
  let userInfo = reactive({})
  const userInfoFormConfig = ref([
    {label:'用户ID', prop:'userId'},
    {label:'昵称', prop:'userName'},
    {label:'手机号', prop:'account'},
    {label:'个性签名', prop:'sign'},
    {label:'注册时间', prop:'registerTime'},
    {label:'最近活跃时间', prop:'registerTime'},
    {label:'账号类别', prop:'sourceName'},
  ])
  const statisticInfo = ref([])
  const statisticTableColumnConfig = computed(()=>{
    console.log('userInfo', userInfo)
    let list = [
      {label:'是否付费', prop:'isPay'},
      {label:'总付费金额', prop:'consumedAmount'},
    ]

    if (userInfo.sourceName !== 'AI 绘画') {
      list = list.concat([
        {label:'已使用免费token（个）', prop:'expend'},
        {label:'已使用付费token（个）', prop:'useNumber'},
        {label:'剩余付费token（个）', prop:'balance', insertSlot: true},
      ])
    }else {
      list = list.concat([
        {label:'已使用免费次数（次）', prop:'expend'},
        {label:'已使用付费次数（次）', prop:'useNumber'},
        {label:'剩余付费次数（次）', prop:'balance', insertSlot: true},
      ])
    }

    return list
  })
  const recordTableList = ref([])
  const recordTableColumnConfig = ref([
    {label:'充值金额', prop:'rechargeAmount'},
    {label:'付款方式', prop:'payWay'},
    {label:'充值时间', prop:'rechargeTime'}
  ])

  function handleCheckAll(visible) {
    dialogVisible.value = visible
  }

  function goBack() {
    emits('goBack')
  }

  function handleGetRechargeRecord() {
    let params = {
      userId: userInfo.userId,
      sourceType: userInfo.sourceType,
      pageIndex: 1,
      pageSize: 5,
    }

    API.getRechargeRecordTableList(params).then(res=>{
      if (res.code == '0') {
        recordTableList.value = res.data.list

        checkAllBtnVisible.value = res.data.total > 5
      }
    })
  }

  function handleGetUserInfo() {
    if (props.userId) {
      API.getUserInfoById(props.userId).then(res=>{
        if (res.code == '0') {
          const { userInfo: USERINFO, statistics } = res.data
          statistics.expend = (statistics.consumedAmount || 0) - (statistics.balance || 0)
          Object.assign(userInfo, USERINFO)
          statisticInfo.value = [{...statistics}]
          handleGetRechargeRecord()
        }
      })
    }

  }

  onMounted(() => {
    handleGetUserInfo()
  })
</script>

<style scoped lang="scss">
    .detail-container{
        position: absolute;
        min-height: 100%;
        width: 100%;
        z-index: 999;
        height: auto;
        padding-bottom: 5vh;
        top: 0;
        left: 0;

        .u-m-l-r-20 {
            margin: 0 20px;
        }

        .header{
            color: #ffffff;
            font-size: 22px;
            font-weight: bold;
            padding: 10px 15px;
            background: #6ea3ff;
        }

        .base-info{
            position: relative;
            height: auto;
            display: flex;
            margin: 10px;

            .left-avatar{
                position: relative;
                height: 250px;
                width: 250px;
                border: 1px solid #dadada;
                display: flex;
                align-items: center;
                justify-content: center;

                .avatar{
                    width: 200px;
                    height: auto;
                }
            }

            .right-form{
                display: grid;
                flex: 1;
                grid-template-columns: 50% 1fr;
                grid-template-rows: repeat(4, 1fr);

                .info-item{
                    height: 100%;
                    width: 100%;
                    display: flex;

                    &:nth-last-child(-n + 2) {
                        border-bottom: 1px solid #dadada;
                    }

                    .label{
                        background-color: #f9fafc;
                        color: #000;
                        width: 30%;
                        height: inherit;
                        padding-right: 20px;
                        box-sizing: border-box;
                        display: flex;
                        align-items: center;
                        justify-content: flex-end;
                    }

                    .content{
                        flex: 1;
                        color: #505050;
                        height: inherit;
                        padding-left: 20px;
                        box-sizing: border-box;
                        display: flex;
                        align-items: center;
                        justify-content: flex-start;
                    }

                    .border-top{
                        border-top: 1px solid #dadada;
                    }

                    .border-right{
                        border-right: 1px solid #dadada;
                    }
                }
            }
        }

        .title{
            color: #000000;
            font-weight: bold;
            font-size: 22px;
        }

        .table-container{
            position: relative;

            ::v-deep .el-table__header-wrapper{
                .el-table__cell{
                    background-color: #f7f7f7;
                    color: #000;
                }
            }

            ::v-deep .el-table__cell{
                text-align: center;
            }
        }

        .check-more{
            color: #3f99f7;
            padding: 10px 0;
            border: 1px solid #dadada;
            text-align: center;
        }
    }
</style>