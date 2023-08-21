<template>
    <div class="dialog-container">
        <el-dialog
                v-model="visible"
                :close-on-click-modal="true"
                :show-close="true"
                @close="handleToggleDialog"
        >

            <div class="dialog-body">
                <slot name="title"></slot>

                <template v-if="linkList.length > 0">
                    <div class="row">邀请链接：</div>
                    <div class="row" v-for="(link, index) in linkList" :key="index">
                        <div class="copy-content">{{ link.name }}：{{ link.inviteLink }}</div>
                        <el-icon class="u-cursor" style="font-size: 24px;" @click="handleCopy(link)"><CopyDocument /></el-icon>
                    </div>
                </template>

                <div v-else class="empty-content">
                    <span class="icon">！</span>
                    <span class="text">暂未生成邀请链接</span>
                </div>
            </div>

            <template #footer>
                <el-button v-if="linkList.length > 0" type="primary" class="btn" @click="handleCopy('all')">全部复制</el-button>
            </template>
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
      linkList:{
        required: true,
        type: Array,
        default: () => []
      }
    })

    const visible = ref(false)

    function handleCopy(copyObj) {
      let copyText = ''
      if (copyObj === 'all') {
        props.linkList.forEach(link=>{
          copyText += `${link.name}：${link.inviteLink}\n`
        })
      }else {
        copyText = `${copyObj.name}：${copyObj.inviteLink}`
      }

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
            min-width: 700px;
            width: auto;
            max-width: 900px;

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

            .empty-content{
                height: 10vh;
                display: flex;
                align-items: center;
                justify-content: center;

                .icon{
                    color: #409EFF;
                    font-weight: bold;
                    font-size: 42px;
                }

                .text{
                    font-size: 16px;
                    color: #383838;
                }
            }
        }
    }
</style>