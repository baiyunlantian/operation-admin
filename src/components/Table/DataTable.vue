<template>
  <el-table ref="tableRef" v-bind="$attrs" class="table" style="width: 100%">
    <!-- 复选框列，会根据 selection 的值来动态渲染 -->
    <el-table-column v-if="selection" type="selection"></el-table-column>
    <template v-for="column in $attrs.column" :key="column.label">
      <el-table-column
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
          <div
            class="header-container"
            @click="column.sortable ? changeSort(column.prop) : ''"
          >
            <div class="header-title">{{ column.label }}</div>
            <div class="icon-arrow" style="margin-left: 4px">
              <el-icon v-if="!column.arrowDown" :class="{ active: active }"
                ><ArrowUp
              /></el-icon>
              <el-icon v-else :class="{ active: active }"
                ><ArrowDown
              /></el-icon>
            </div>
          </div>
        </template>
      </el-table-column>
    </template>
  </el-table>
</template>

<script setup>
import { ref, useAttrs, computed } from "vue";

const attrs = useAttrs();
const props = defineProps(["selection"]);
const tableRef = ref(null);

const active = computed(() => {
  return;
});

const getTableRef = () => {
  return tableRef;
};

const changeSort = (prop) => {
  attrs.column.forEach((val) => {
    if (val.prop == prop) {
      val.arrowDown = !val.arrowDown;
    }
  });
  const order = attrs.column.arrowDown ? "descending" : "ascending";

  
  console.log({
    order: order,
    prop: prop,
  });
  return {
    order: order,
    prop: prop,
  };
};

defineExpose({ getTableRef });
</script>

<style lang="scss">
.header-container {
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  .icon-arrow {
    display: flex;
    align-items: center;
    font-weight: 700;
  }
}
.cell {
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
}
.active {
  color: #409eff;
}
.el-table__row {
  font-weight: 700 !important;
}
</style>
