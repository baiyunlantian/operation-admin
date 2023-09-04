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
            <el-form-item
              :label="val.title"
              v-for="val in form[item.name]"
              :key="val.name"
              :required="val.isRequired"
            >
              <el-input
                v-model="agentData[val.name]"
                :placeholder="val.placeholder"
              />
            </el-form-item>
          </el-form>
        </div>
      </div>
    </template>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="dialogOpt.dialogVisible = false">Cancel</el-button>
        <el-button type="primary" @click="pushFormData"> Confirm </el-button>
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