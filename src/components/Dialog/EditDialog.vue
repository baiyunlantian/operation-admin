<template>
  <el-dialog v-model="dialogOpt.dialogVisible" :width="dialogOpt.width">
    <template #header>
      <div class="dialog-header">
        <p>{{ dialogOpt.title }}</p>
      </div>
      <slot name="header"></slot>
    </template>
    <template #default>
      <div class="dialog-body">
        <el-row :gutter="12" style="width: 100%" justify="start">
          <el-form :model="form" class="agent-form">
            <template v-for="data in formArr" :key="data.name">
              <el-col :span="dialogOpt.col">
                <el-form-item class="agent-item-container">
                  <p>{{ data.title }}&nbsp;</p>
                  <!-- <el-input
                  v-model="agentFormData[data.name]"
                ></el-input> -->
                  <slot :name="data.name" v-if="data.slot" :form="form"></slot>
                  <el-text v-if="msgType === 'text' || !data.isChange">{{
                    form && form[data.name]
                  }}</el-text>
                  <el-input
                    class="mx-1"
                    v-model="editParams[data.name]"
                    v-else-if="msgType === 'input' && data.isChange"
                    :class="{ 'is-invalid': isInputInvalid && data.validate }"
                    @blur="validateInput(data)"
                  >
                    <template #prepend v-if="data.prepend">
                      {{ data.prepend }}
                    </template>
                  </el-input>
                  <span v-if="data.validate" class="error-message">{{
                    inputErrorMessage
                  }}</span>
                </el-form-item>
              </el-col>
            </template>
          </el-form>
        </el-row>
      </div>
    </template>
    <template #footer>
      <span class="dialog-footer">
        <el-button
          @click="dialogOpt.dialogVisible = false"
          v-if="msgType === 'text'"
          >关闭</el-button
        >
        <el-button @click="cancelEvent" v-if="msgType === 'input'"
          >取消</el-button
        >
        <el-button
          type="primary"
          @click="editFormData"
          v-if="msgType === 'input'"
        >
          确认
        </el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script setup>
import { ref, watch, computed } from "vue";
const props = defineProps(["dialogOpt", "formArr", "form", "msgType"]);
const emits = defineEmits(["changeMsgType", "cancelEdit"]);

const editParams = ref();
watch(
  () => props.form,
  () => {
    editParams.value = { ...props.form };
  },
  { immediate: true }
);

const cancelEvent = () => {
  console.log("cancel");
  editParams.value = { ...props.form };
  emits("cancelEdit");
};

const editFormData = () => {
  // console.log("edit");
  console.log(editParams.value);
  if (!isInputInvalid.value) {
    emits("changeMsgType", { msgType: "text", editParams: editParams.value });
  }
};

const isInputInvalid = ref(false);
const inputErrorMessage = ref();
const validateInput = (data) => {
  console.log(111);
  const reg = /^1(3|4|5|6|7|8|9)\d{9}$/;
  console.log(editParams.value[data.name]);
  // 根据自定义的校验规则进行校验
  if (!editParams.value[data.name]) {
    isInputInvalid.value = true;
    inputErrorMessage.value = "内容不能为空!";
  } else if (!reg.test(editParams.value[data.name])) {
    isInputInvalid.value = true;
    inputErrorMessage.value = "请输入正确的手机号码!";
  } else {
    isInputInvalid.value = false;
    inputErrorMessage.value = "";
  }
};
</script>

<style lang="scss" scoped>
.dialog-header {
  font-size: 16px;
  font-weight: 700;
  padding-bottom: 12px;
  border-bottom: 1px solid #ddd;
}
.agent-form {
  display: flex;
  flex-wrap: wrap;
  width: 100%;
  .el-col-7 {
    flex: 0 0 14.285%;
  }
  .agent-item-container {
    margin-bottom: 8px;

    :deep(.el-form-item__content) {
      display: flex;
      flex-direction: column;
      align-items: flex-start;
    }
    p {
      font-size: 12px;
      color: #999;
    }
    .el-text {
      align-self: flex-start;
      font-weight: 700;
      color: #2a2a2a;
    }
  }
}
.error-message {
  color: rgb(255, 89, 89);
  position: absolute;
  top: 58px;
  left: 4px;
  font-size: 12px;
}
.is-invalid {
  :deep(.el-input__wrapper) {
    box-shadow: 0 0 0 1px rgb(254, 136, 136) inset;
  }
}
</style>