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
                        style="border-bottom: 1px solid #ccc"
                        :editor="editorRef"
                        :defaultConfig="toolbarConfig"
                        mode="simple"
                />
                <Editor
                        style="height: 500px; overflow-y: hidden;"
                        v-model="contentValue"
                        :defaultConfig="editorConfig"
                        mode="simple"
                        @onCreated="handleCreated"
                        @change="onEditorChange($event)"
                />
            </div>

            <template #footer>
                <el-button type="primary" class="btn" size="large" @click="handleSubmit">确认</el-button>
            </template>
        </el-dialog>
    </div>
</template>

<script setup>
  import { ref, watch, defineProps, defineEmits, shallowRef, getCurrentInstance, onBeforeUnmount, onMounted } from 'vue';
  import '@wangeditor/editor/dist/css/style.css' // 引入 css
  import { Editor, Toolbar } from '@wangeditor/editor-for-vue';

  const { proxy } = getCurrentInstance()
  const emits = defineEmits(['update:modelValue'])
  const props = defineProps({
    modelValue: {
      required: true,
      type: Boolean,
      default: false
    },
    content: {
      required: true,
      type: String,
      default: ''
    },
  })


  const editorRef = shallowRef()
  const contentValue = ref('')
  const visible = ref(false)
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
  const editorConfig = { placeholder: '请输入内容...' }

  function onEditorChange(e) {
    console.log(e, "e");
    var reg = /<[^<>]+>/g; //去标签
    // var reg = /<(?!img).*?>/g //去除img以外的所有标签
    var value = e.replace(reg, "");
    value = value.replace(/&nbsp;/gi, ""); //将空格全部替换
    let TiLength = value.length; //文字长度显示
    console.log(TiLength, "  this.TiLength");
    // if (TiLength <= 10) {
    //   this.editorHtml = e;
    //   console.log(this.editorHtml, "this.editorHtml");
    // }
    // if (this.TiLength > 10) {
    //   //当长度大于10时,只截取10之前的内容并赋值
    //   this.$nextTick(() => {
    //     this.form.content = this.editorHtml;
    //   });
    //   this.warnShow = true;
    //   // this.$message.error("文字最多输入10字!");
    //   return false;
    // }
  }

  const handleCreated = (editor) => {
    // 记录 editor 实例，重要！
    editorRef.value = editor
    // console.log(editor.getAllMenuKeys())
  }

  function handleSubmit() {
    console.log('handleSubmit', contentValue.value)
  }

  function handleCloseDialog() {
    emits('update:modelValue', false)
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
      contentValue.value = props.content
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