<template>
  <el-dialog
    v-model="dialogOpt.dialogVisible"
    :width="dialogOpt.width"
    @close="cancelData(formRef)"
  >
    <template #header>
      <div class="dialog-header">
        <p>{{ dialogOpt.title }}</p>
      </div>
    </template>
    <template #default>
      <div class="dialog-body">
        <div class="dialog-form" v-for="item in formTitles" :key="item.name">
          <h4>{{ item.title }}</h4>
          <el-form
            ref="formRef"
            :model="agentData"
            label-width="100px"
            status-icon
            label-position="left"
            :rules="rules"
          >
            <el-row :gutter="16">
              <el-col
                :span="item.col"
                v-for="val in form[item.name]"
                :key="val.name"
              >
                <el-form-item
                  :label="val.title"
                  :prop="val.name"
                  :required="val.isRequired"
                  :style="{ 'flex-direction': item.flexDirection }"
                >
                  <el-input
                    v-if="val.type == 'input'"
                    v-model="agentData[val.name]"
                    :placeholder="val.placeholder"
                    @input="val.changeEvent"
                  >
                    <template #append v-if="val.append">{{
                      val.append
                    }}</template>
                  </el-input>
                  <el-text v-if="val.type == 'text'">
                    {{ agentData[val.name] }}
                  </el-text>
                  <el-input
                    v-if="val.type == 'textarea'"
                    type="textarea"
                    rows="4"
                    resize="none"
                    v-model="agentData[val.name]"
                    :placeholder="val.placeholder"
                  />

                  <el-select
                    v-if="val.type == 'select'"
                    v-model="agentData[val.name]"
                    class="m-2"
                    placeholder="全部"
                  >
                    <el-option
                      v-for="item in options"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value"
                    />
                  </el-select>
                </el-form-item>
              </el-col>
            </el-row>
          </el-form>
        </div>
      </div>
    </template>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="cancelData(formRef)">取消</el-button>
        <el-button type="primary" @click="pushFormData(formRef)">
          确认
        </el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script setup>
import { ref, watch } from "vue";
const props = defineProps([
  "dialogOpt",
  "form",
  "formTitles",
  "agentData",
  "rules",
  "options",
]);

const emits = defineEmits([
  "getNewAgentData",
  "cancelCreate",
  "changeSalesName",
]);
const formRef = ref();

const pushFormData = async (data) => {
  console.log(data);
  if (!data[0]) return;
  await data[0].validate((valid, fields) => {
    if (valid) {
      console.log("submit!");
    } else {
      console.log("error submit!", fields);
    }
  });
  if (!data[1]) return;
  await data[1].validate((valid, fields) => {
    if (valid) {
      console.log("submit!");
      emits("getNewAgentData", props.agentData);
    } else {
      console.log("error submit!", fields);
    }
  });
  // console.log(props.agentData);
};

const cancelData = (data) => {
  emits("cancelCreate");
  data[0].resetFields();
  data[1].resetFields();
};
defineExpose({ formRef });
</script>

<style lang="scss" scoped>
.dialog-header {
  font-size: 16px;
  font-weight: 700;
  padding-bottom: 12px;
  border-bottom: 1px solid #ddd;
}
.dialog-body {
  width: 50vw;
  margin: 0 auto;
  h4 {
    font-size: 16px;
  }
}
</style>