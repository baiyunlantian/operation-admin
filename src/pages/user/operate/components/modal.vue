<template>
    <el-dialog
            v-model="dialogVisible"
            title="添加用户"
            class="add-user-modal"
            width="500"
            :close-on-click-modal="false"
            @close="handleClose"
    >
        <el-form ref="form" :model="formData" :rules="rules" label-width="90">
            <el-form-item v-for="(item, index) in formConfig" :prop="item.prop" :label="item.label" :key="item.prop"
                          label-position="right">

                <el-input v-model="formData[item.prop]" :placeholder="item.placeholder"/>

            </el-form-item>
        </el-form>
        <template #footer>
      <span class="dialog-footer">
        <el-button style="width: 100%" type="primary" @click="handleAdd">添加</el-button>
      </span>
        </template>
    </el-dialog>
</template>

<script setup>
  import {reactive, ref, defineEmits} from 'vue';

  const emit = defineEmits(['close'])

  const formConfig = ref([
    {label:'账号：', prop:'account', placeholder:'请输入手机号'},
    {label:'用户名：', prop:'userName', placeholder:'请输入用户名'},
    {label:'邮箱：', prop:'email', placeholder:'请输入邮箱'},
  ])
  const formData = reactive({
    account: '',
    userName: '',
    email: '',
  })
  const rules = {
    account: [
      {
        required: true,
        message: '手机号不能为空!',
        trigger: 'blur',
      },
      {
        message: '手机号不合法!',
        trigger: 'blur',
        pattern: /^1(3|4|5|6|7|8|9)\d{9}$/
      }
    ],
    email: [{
        pattern: /^[a-zA-Z0-9_.-]+@[a-zA-Z0-9-]+(\.[a-zA-Z0-9-]+)*\.[a-zA-Z0-9]{2,6}$/,
        message: '邮箱不合法!',
        trigger: 'blur'
    }],
    userName: [{
      required: true,
      message: '用户名不能为空!',
      trigger: 'blur'
    }]
  }
  const dialogVisible = ref(true)
  const form = ref(null)

  function handleClose() {
    emit('close', false)
  }

  function handleAdd() {
    form.value.validate(valid=>{
      console.log('valid', valid)
      if (valid) {
        handleClose()
      }
    })
  }
</script>

<style scoped lang="scss">
    .add-user-modal{
        position: relative;

        ::v-deep .el-dialog__header{
            position: relative;

            .el-dialog__title{
                font-weight: bold;
            }
        }
    }
</style>