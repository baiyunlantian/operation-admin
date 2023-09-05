<template>
  <el-dialog v-model="dialogOpt.dialogVisible" :width="dialogOpt.width">
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
            :model="form[item.name]"
            label-width="100px"
            status-icon
            label-position="left"
          >
            <el-row :gutter="16">
              <el-col
                :span="item.col"
                v-for="val in form[item.name]"
                :key="val.name"
              >
                <el-form-item
                  :label="val.title"
                  :required="val.isRequired"
                  :style="{ 'flex-direction': item.flexDirection }"
                >
                  <el-input
                    v-if="val.type == 'input'"
                    v-model="agentData[val.name]"
                    :placeholder="val.placeholder"
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
                </el-form-item>
              </el-col>
            </el-row>
          </el-form>
        </div>
      </div>
    </template>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="dialogOpt.dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="pushFormData"> 确认 </el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script setup>
import { ref } from "vue";
const props = defineProps(["dialogOpt", "form", "formTitles", "agentData"]);
const emits = defineEmits(["getNewAgentData"]);
const formRef = ref();

const pushFormData = () => {
  props.dialogOpt.dialogVisible = false;
  emits("getNewAgentData", props.agentData);
  // console.log(props.agentData);
};
</script>

<style lang="scss" scoped>
.dialog-header {
  font-size: 16px;
  font-weight: 700;
  padding-bottom: 12px;
  border-bottom: 1px solid #ddd;
}
.dialog-body {
  width: 40vw;
  margin: 0 auto;
  h4 {
    font-size: 16px;
  }
}
</style>