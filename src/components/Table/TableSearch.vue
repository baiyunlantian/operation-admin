<template>
  <div class="table-search-container">
    <el-input
      v-model="input1"
      class="w-50 m-2"
      size="small"
      v-if="!searchWay.slot"
      :placeholder="'请输入' + searchWay.prefix"
    >
      <template #prefix>
        <div class="input-prefix">{{ searchWay.prefix }}</div>
      </template>
    </el-input>
    <template v-else>
      <slot :name="searchWay.slot"></slot>
    </template>
  </div>
</template>

<script setup>
import { ref } from "vue";
const props = defineProps(["searchWay"]);
const input1 = ref();
</script>

<style lang="scss" scoped>
:deep(.el-input--small .el-input__inner) {
  padding: 0 8px;
}
.input-prefix {
  color: #606266;
}
</style>