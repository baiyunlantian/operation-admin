<template>
    <div class="dialog-container">
        <el-dialog
                v-model="visible"
                :close-on-click-modal="false"
                :show-close="true"
                title="生成密码"
                @close="handleToggleDialog"
        >

            <div class="dialog-body">
                <div class="row">
                    <div class="copy-content">随机密码：{{ pwd }}</div>
                    <el-icon class="u-cursor" style="font-size: 24px;" @click="handleCopy"><CopyDocument /></el-icon>
                </div>
            </div>
        </el-dialog>
    </div>
</template>

<script setup>
  import { ref, watch, defineProps, defineEmits, getCurrentInstance } from 'vue';

  const { proxy } = getCurrentInstance()
  const emits = defineEmits(['update:modelValue'])
  const props = defineProps({
    modelValue: {
      required: true,
      type: Boolean,
      default: false
    },
    pwd:{
      required: true,
      type: String,
      default: ''
    }
  })

  const visible = ref(false)

  function handleCopy() {
    let copyText = props.pwd

    // 如果当前浏览器版本不兼容navigator.clipboard
    if (!navigator.clipboard) {
      const ele = document.createElement("input");
      ele.value = copyText;
      document.body.appendChild(ele);
      ele.select();
      document.execCommand("copy");
      document.body.removeChild(ele);
      if (document.execCommand("copy")) {
        proxy.$message({
          type: 'success',
          message: '复制成功',
        })
      } else {
        proxy.$message({
          type: 'error',
          message: '复制失败',
        })
      }
    } else {
      navigator.clipboard.writeText(copyText).then(function () {
        proxy.$message({
          type: 'success',
          message: '复制成功',
        })
      }).catch(function () {
        proxy.$message({
          type: 'error',
          message: '复制失败',
        })
      })
    }
  }

  function handleToggleDialog() {
    emits('update:modelValue', false)
  }

  watch(
    () => props.modelValue,
    (newVal) => {
      visible.value = newVal
    }
  )
</script>

<style scoped lang="scss">
    .dialog-container{

        :deep(.el-dialog) {
            margin-top: 30vh;
            width: 400px;

            .el-dialog__footer{
                text-align: center;
            }
        }


        .dialog-body{
            position: relative;

            .row{
                position: relative;
                margin-bottom: 2vh;
                font-size: 16px;
                display: flex;
                align-items: center;
                justify-content: space-between;
                color: #404040;

                .copy-content{
                    position: relative;
                }
            }

        }

        .dialog-header{
            display: flex;
            align-items: center;
            justify-content: flex-end;
        }
    }
</style>