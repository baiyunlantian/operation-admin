<template>
    <el-dialog
            v-model="props.visible"
            class="record-dialog"
            width="700"
            :close-on-click-modal="false"
            :show-close="false"
    >
        <template #header>
            <div class="dialog-header">
                <div class="title">充值记录</div>
                <div class="icon u-cursor" @click="handleClose">X</div>
            </div>
        </template>

        <div class="dialog-body">
            <el-table
                    class="table-container"
                    :data="tableList"
                    border
                    style="width: 100%"
            >
                <el-table-column v-for="(item, index) in props.columnConfig" :key="index"
                                 :prop="item.prop"
                                 :label="item.label"
                                 :width="item.width"
                                 align="center"
                />
            </el-table>

            <el-pagination
                    v-model:current-page="pageParams.pageIndex"
                    v-model:page-size="pageParams.pageSize"
                    layout="total, prev, pager, next, jumper"
                    :total="16"
                    background
                    @current-change="handleGetTableList"
            />
        </div>
    </el-dialog>
</template>

<script setup>
    import { ref, reactive, defineProps, defineEmits } from 'vue';
    import API from '../api';

    const emit = defineEmits(['close'])
    const props = defineProps({
      visible:{
        required: true,
        type: Boolean
      },
      columnConfig:{
        required: true,
        type: Array
      },
      userId: {
        required: true,
      },
      sourceType: {
        required: true,
      }
    })
    const tableList = ref([{
      "rechargeAmount": 100,
      "payWay": "支付宝",
      "rechargeTime": "2023-7-21"
    }])
    const pageParams = reactive({
      pageSize:10,
      pageIndex:1
    })

    function handleGetTableList() {
      let params = {
        userId: props.userId,
        sourceType: props.sourceName,
        ...pageParams
      }

      console.log('params', params)
      return
      API.getRechargeRecordTableList(params).then(res=>{
        if (res.code === '0') {
          tableList.value = res.data.list
        }
      })
    }
    
    function handleClose() {
      emit('close', false)
    }
</script>

<style scoped lang="scss">
    .record-dialog{
        position: relative;

        ::v-deep .el-dialog__header{
            position: relative;

            .el-dialog__title{
                font-weight: bold;
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
        }

        .dialog-body{
            ::v-deep .el-pagination{
                margin: 10px 0;
                justify-content: flex-end;
            }
        }
    }
</style>