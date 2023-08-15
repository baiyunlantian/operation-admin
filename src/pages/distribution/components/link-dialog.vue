<template>
    <el-dialog
            v-model="dialogVisible"
            class="dialog-container"
            width="700"
            :close-on-click-modal="false"
            :show-close="false"
    >
        <template #header>
            <div class="dialog-header">
                <div class="">邀请链接</div>
                <div class="close-btn icon u-cursor" @click="handleToggleDialog(false)">x</div>
            </div>
        </template>

        <div class="dialog-body">
            <el-input v-model="phoneList" class="textarea" type="textarea" placeholder="请输入手机号" @input="handleChangePhoneList"/>
        </div>

        <template #footer>
            <el-button type="primary" class="btn" @click="handleClickDialogBtn('ok')">全部复制</el-button>
        </template>
    </el-dialog>
</template>

<script>
    import { ref, watch, defineProps, defineEmits } from 'vue';

    const props = defineProps({

    })

    const visible = ref(false)



</script>

<style scoped lang="scss">
    .dialog-container{
        .dialog-body{
            position: relative;

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
            }
        }
    }
</style>