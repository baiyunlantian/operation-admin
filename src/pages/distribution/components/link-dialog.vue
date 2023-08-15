<template>
    <div class="dialog-container">
        <el-dialog
                v-model="visible"
                width="500"
                :close-on-click-modal="false"
                :show-close="true"
                @close="handleToggleDialog"
        >
<!--            <template #header>-->
<!--                <div class="dialog-header">-->
<!--                    <div class="">邀请链接</div>-->
<!--                    <div class="close-btn icon u-cursor" @click="handleToggleDialog">x</div>-->
<!--                </div>-->
<!--            </template>-->

            <div class="dialog-body">
                <div class="title">您的邀请链接已生成！</div>

                <div class="row">邀请链接：</div>
                <div class="row" v-for="(link, index) in linkList" :key="index">
                    <span class="copy-content">{{ link.name }}：{{ link.url }}</span>
                    <el-icon class="u-cursor" style="font-size: 24px;" @click="handleCopy('all')"><CopyDocument /></el-icon>
                </div>
            </div>

            <template #footer>
                <el-button type="primary" class="btn" @click="handleCopy('all')">全部复制</el-button>
            </template>
        </el-dialog>
    </div>
</template>

<script setup>
    import { ref, watch, defineProps, defineEmits } from 'vue';

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

    function handleCopy() {
      console.log('复制')
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

            .el-dialog__footer{
                text-align: center;
            }
        }


        .dialog-body{
            position: relative;

            .title{
                text-align: center;
                font-size: 18px;
                color: #404040;
                margin-bottom: 1vh;
            }

            .row{
                position: relative;
                margin-bottom: 1vh;
                font-size: 16px;
                display: flex;
                align-items: center;
                justify-content: space-between;
                color: #404040;

                span{
                    position: relative;
                }
            }
        }
    }
</style>