<template>
    <div class="dialog-container">
        <el-dialog
                v-model="visible"
                width="800"
                :close-on-click-modal="false"
                :show-close="true"
                @close="handleCloseDialog"
        >
            <div class="dialog-body">
                <Toolbar
                        v-if="canEdit"
                        style="border-bottom: 1px solid #ccc"
                        :editor="editorRef"
                        :defaultConfig="toolbarConfig"
                        mode="simple"
                />
                <Editor
                        class="editor-container"
                        v-model="contentValue"
                        :defaultConfig="{placeholder}"
                        mode="simple"
                        @onCreated="handleCreated"
                />

                <div v-if="canEdit" class="tips content-length">{{ contentLength }}/1000字</div>
                <div class="tips error-tips" v-show="contentLength > 1000">内容长度超出1000字限制！</div>
            </div>

            <template #footer v-if="canEdit">
                <el-button v-if="contentLength > 0 && isEdit === false" type="primary" class="btn" size="large" @click="handleClickBtn('edit')">修改</el-button>

                <div v-show="isEdit === true || contentLength === 0">
                    <el-button type="primary" class="btn" size="large" @click="handleClickBtn('ok')" :loading="btnLoading" :disabled="btnLoading">确认</el-button>
                    <el-button type="default" class="btn" size="large" @click="handleClickBtn('cancel')" :loading="btnLoading" :disabled="btnLoading">取消</el-button>
                </div>
            </template>
        </el-dialog>
    </div>
</template>

<script setup>
  import { ref, watch, reactive, computed, defineProps, defineEmits, shallowRef, nextTick, getCurrentInstance, onBeforeUnmount, onMounted } from 'vue';
  import '@wangeditor/editor/dist/css/style.css' // 引入 css
  import { Editor, Toolbar } from '@wangeditor/editor-for-vue';
  import API from '../api';

  const { proxy } = getCurrentInstance()
  const emits = defineEmits(['update:modelValue', 'refreshTable'])
  const props = defineProps({
    modelValue: {
      required: true,
      type: Boolean,
      default: false
    },
    canEdit: {
      required: false,
      type: Boolean,
      default: true
    },
    placeholder: {
      required: false,
      type: String,
      default: '请输入内容...'
    }
  })


  const editorRef = shallowRef()
  const contentValue = ref('')
  const contentValueCopy = ref('')
  const visible = ref(false)
  const btnLoading = ref(false)
  const isEdit = ref(false)
  const toolbarConfig = {
    toolbarKeys:[
      "bold",
      "underline",
      "italic",
      "through",
      "code",
      "sub",
      "sup",
      "clearStyle",
      "color",
      "fontSize",
      "indent",
      "delIndent",
      "justifyLeft",
      "justifyRight",
      "justifyCenter",
      "justifyJustify",
      "lineHeight",
      "divider",
      "codeBlock",
      "blockquote",
      "headerSelect",
      "header1",
      "header2",
      "header3",
      "todo",
      "redo",
      "undo",
    ],
  }

  const contentLength = computed(() => {
    const reg = /<[^<>]+>/g; //去标签
    // var reg = /<(?!img).*?>/g //去除img以外的所有标签
    let value = contentValue.value.replace(reg, "");
    value = value.replace(/&nbsp;/gi, ""); //将空格全部替换
    return value.length; //文字长度显示
  })

  const handleCreated = (editor) => {
    // 记录 editor 实例，重要！
    editorRef.value = editor
    // console.log(editor.getAllMenuKeys())
  }

  function handleClickBtn(eventType) {
    switch (eventType) {
      case 'edit':
        isEdit.value = true;
        editorRef.value.enable()
        break;
      case 'cancel':
        isEdit.value = false;
        editorRef.value.disable()
        contentValue.value = contentValueCopy.value
        break;
      case 'ok':
        if (contentLength.value <= 1000) {
          let params = { content: contentValue.value }

          btnLoading.value = true
          API.setInvitationRewardRules(params).then(res=>{
            if (res.code == 0) {
              proxy.$message({
                type: 'success',
                message: '修改成功'
              })

              emits('refreshTable', 'reset')
              handleCloseDialog()
            }
          }).finally(() => {
            btnLoading.value = false
          })
        }
        break;
    }
  }

  function handleCloseDialog() {
    isEdit.value = false
    editorRef.value.disable()
    emits('update:modelValue', false)
  }

  function handleGetRulesContent() {
    API.getInvitationRewardRules().then(res=>{
      if (res.code == 0) {
        contentValue.value = res.data || ''
        contentValueCopy.value = res.data || ''

          /***
           * 邀新列表进来 只读
           * 分销列表进来 ：
           *    无内容时处于编辑状态
           *    有内容时处于禁用状态
           *
           */
        nextTick(()=>{
          if (props.canEdit === false) {
            editorRef.value.disable()
          }else {
            if (contentLength.value > 0) {
              editorRef.value.disable()
            }else {
              isEdit.value = true
            }
          }
        })
      }
    })
  }


  // 组件销毁时，也及时销毁编辑器
  onBeforeUnmount(() => {
    const editor = editorRef.value
    if (editor == null) return
    editor.destroy()
  })

  watch(
    () => props.modelValue,
    (newVal) => {
      visible.value = newVal
      if (newVal) {
        handleGetRulesContent()
      }
    }
  )

</script>

<style scoped lang="scss">
    .dialog-container{
        :deep(.el-dialog) {
            margin-top: 20vh;

            .el-dialog__footer{
                text-align: center;

                button{
                    width: 100px;
                }
            }
        }

        .dialog-body{
            position: relative;

            .editor-container{
                height: 500px !important;

                :deep(.w-e-text-container) {
                    .w-e-scroll::-webkit-scrollbar {
                        width: 5px;
                    }

                    .w-e-scroll::-webkit-scrollbar-track {
                        background-color: #f5f5f5;
                        border-radius: 10px;
                    }

                    .w-e-scroll::-webkit-scrollbar-thumb {
                        background-color: #c1c1c1;
                        border-radius: 10px;
                    }
                }
            }


            .tips{
                font-size: 15px;
                text-align: end;
            }

            .error-tips{
                color: #f32f2f;
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