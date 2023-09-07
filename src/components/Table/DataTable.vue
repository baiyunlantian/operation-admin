<template>
  <el-table
    ref="tableRef"
    v-bind="$attrs"
    class="table"
    style="width: 100%"
  >
    <!-- 复选框列，会根据 selection 的值来动态渲染 -->
    <el-table-column v-if="selection" type="selection"></el-table-column>
    <template v-for="column in $attrs.column" :key="column.label">
      <el-table-column
        :sortable="column.sortable"
        :prop="column.prop"
        :label="column.label"
        :min-width="column.width"
        :fixed="column.placement ? column.placement : false"
        v-if="column.isPermission"
      >
        <!-- 根据传递进来的 slot 判断是否需要开启插槽功能 -->
        <template v-if="column.slot" v-slot="data">
          <!-- 插槽必须是具名插槽，保证每列中的插槽不会冲突，名字与 prop 对应即可 -->
          <slot :name="column.prop" v-bind="data"></slot>
        </template>

        <template v-if="column.header" #header>
          <div class="header-container">
            <div class="header-title">{{ column.label }}</div>
            <!-- <div class="icon-arrow">
                <el-icon v-if="!arrowDown"><ArrowUp /></el-icon>
                <el-icon v-else><ArrowDown /></el-icon>
              </div> -->
          </div>
        </template>
      </el-table-column>
    </template>
  </el-table>
</template>

<script setup>
import { ref } from "vue";
// 升序和降序
const arrowDown = ref(true);

const props = defineProps(["selection"]);
const tableRef = ref(null);
const getTableRef = () => {
  return tableRef;
};
defineExpose({ getTableRef });
</script>

<style lang="scss">

.header-container {
  display: flex;
  align-items: center;
  justify-content: center;
  .icon-arrow {
    display: flex;
    align-items: center;
  }
}
.cell {
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
}
.el-table__row {
  font-weight: 700 !important;
}
</style>
