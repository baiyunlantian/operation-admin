<template>
  <el-dialog v-model="dialogOpt.dialogVisible" :width="dialogOpt.width">
    <template #header>
      <div class="dialog-header">
        <p>{{ dialogOpt.title }}</p>
      </div>
    </template>
    <template #default>
      <div class="dialog-body">
        <el-row :gutter="12" style="width: 100%" justify="start">
          <el-form :model="form" class="agent-form">
            <template v-for="data in formArr" :key="data.name">
              <el-col :span="8">
                <el-form-item class="agent-item-container">
                  <p>{{ data.title }}&nbsp;</p>
                  <!-- <el-input
                  v-model="agentFormData[data.name]"
                ></el-input> -->
                  <el-input class="mx-1" v-model="form[data.name]"></el-input>
                </el-form-item>
              </el-col>
            </template>
          </el-form>
        </el-row>
      </div>
    </template>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="dialogOpt.dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="editFormData"> 确认 </el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script setup>
import { ref } from "vue";
const props = defineProps(["dialogOpt", "formArr", "form"]);

const editFormData = () => {
  console.log("edit");
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
</style>