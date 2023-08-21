<template>
    <div class="dialog-container">
        <el-dialog
                v-model="visible"
                width="800"
                :close-on-click-modal="false"
                :show-close="false"
        >
            <template #header>
                <div class="dialog-header">
                    <div class="">推广佣金计算方式</div>
                    <div class="close-btn icon u-cursor" @click="handleCloseDialog">x</div>
                </div>
            </template>

            <div class="dialog-body">
                <el-select v-model="computeData.type" class="compute-select" @change="handleSelectChange">
                    <el-option
                            v-for="item in commissionOptions"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value"
                    />
                </el-select>

                <div class="compute-text">
                    <span>该员工的推广付费用户付款一笔订单，员工可抽取</span>
                    <el-form class="search-form" ref="formRef" :inline="true" :model="computeData" :rules="rules" @submit.prevent>
                        <el-form-item prop="amount">
                            <el-input class="compute-input" v-model="computeData.amount" @blur="handleBlur"/>
                        </el-form-item>
                    </el-form>


                    <span class="unit">{{ computeData.type == 0 ? '%' : '元' }}佣金。</span>
                </div>
            </div>

            <template #footer>
                <el-button type="primary" class="btn" size="large" @click="handleSubmit" :loading="btnLoading" :disabled="btnLoading">确认</el-button>
            </template>
        </el-dialog>
    </div>
</template>

<script setup>
  import { ref, reactive ,watch, defineProps, defineEmits, getCurrentInstance } from 'vue';
  import API from '../api';

  const { proxy } = getCurrentInstance()
  const emits = defineEmits(['update:modelValue', 'refreshTable'])
  const props = defineProps({
    modelValue: {
      required: true,
      type: Boolean,
      default: false
    },
    userIds: {
      required: false,
      type: Array,
      default: () => []
    },
    userCommission: {
      required: false,
      type: Object,
      default: () => {}
    },
  })

  const rules = reactive({
    amount:[{
      required: true,
      trigger: ['blur', 'change'],
      validator: validNumber
    }],
  })
  const computeData = ref({
    type: 0,
    amount: '0',
  })
  const commissionOptions = ref([
    {label: '百分比抽取', value: 0},
    {label: '金额抽取', value: 1},
  ])
  const visible = ref(false)
  const btnLoading = ref(false)
  const formRef = ref()

  function validNumber(rule, value, callback) {
    if ((!value && value != 0) || value == '0.') callback(new Error('请输入抽取额度'))

    const reg = /((^[1-9]\d*)|^0)(\.\d{0,2}){0,1}$/, _value = Number(value);
    if (computeData.value.type === 0) {
        if (!reg.test(value) || _value < 0 || _value >= 100) {
          callback(new Error('抽取比例须大于0并小于100，且最多保留两位小数'))
        }
    }else {
      if (!reg.test(value) || _value < 0 || _value >= 10) {
        callback(new Error('抽取比例须大于0并小于10元，且最多保留两位小数'))
      }
    }
    callback();
  }

  function handleSelectChange() {
    computeData.value.amount = '0'
  }

  function handleSubmit() {

    formRef.value.validate(valid=>{
      if (valid) {
        let length = props.userIds.length, text = '';
        let params = {
          userIds: [...props.userIds],
          type: computeData.value.type,
          amount: Number(Number(computeData.value.amount).toFixed(2))
        }

        // 判断单选、多选、全选
        if (length === 0) {
          text = '确定设置全部用户的佣金计算方式吗'
          params.isAll = true
          params.userIds = [0]
        }else if (length === 1) {
          text = '确定设置该用户的佣金计算方式吗'
        }else {
          text = '确定设置所勾选的用户的佣金计算方式吗'
        }
        proxy.$confirm(text, {
          confirmButtonText: '确认',
          cancelButtonText: '取消',
          type: 'warning',
        }).then(res=>{
          if (res === 'confirm') {
            btnLoading.value = true
            API.setCommission(params).then(res=>{
              if (res.code == 0) {
                proxy.$message({
                  type: 'success',
                  message: '设置成功'
                })

                emits('refreshTable', 'reset')
                handleCloseDialog()
              }
            }).finally(()=>{
              btnLoading.value = false
            })
          }
        }).catch(()=>{
          console.log('取消')
        })
      }
    })
  }

  function handleCloseDialog() {
    emits('update:modelValue', false)

    computeData.value = {
      type: 0,
      amount: '0'
    }
  }

  function handleBlur() {
    if (computeData.value.amount === '') computeData.value.amount = '0'
  }

  watch(
    () => props.modelValue,
    (newVal) => {
      visible.value = newVal
    }
  )

  watch(
    () => props.userCommission,
    (newVal) => {
      if (newVal) {
        computeData.value = newVal
      }
    }, {deep: true}
  )
</script>

<style scoped lang="scss">
    .dialog-container{
        :deep(.el-dialog) {
            margin-top: 35vh;

            .el-dialog__footer{
                text-align: center;

                button{
                    width: 100px;
                }
            }
        }

        .dialog-body{
            position: relative;

            .compute-select {
                position: relative;
            }

            .compute-text {
                position: relative;
                font-size: 16px;
                margin-top: 15px;
                display: flex;
                
                :deep(.el-form) {
                    width: 70px;
                    margin: 0;

                    .el-form-item__error{
                        width: 300px;
                    }
                }

                .compute-input {
                    position: relative;
                    width: 70px;
                    border-bottom: 1px solid #acacac;
                    :deep(.el-input__wrapper) {
                        box-shadow: unset;
                        font-size: 16px;
                    }
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
                font-size: 24px;
            }
        }
    }
</style>