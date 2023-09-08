<template>
  <el-table ref="tableRef" v-bind="$attrs" class="common-table-component" style="width: 100%">
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
            class="header-container u-cursor"
            @click="handleClickColumnHeader(column)"
          >
            <div class="header-title">{{ column.label }}</div>
            <div :class="[column.prop === sortField ? 'current-sort-field' : '', 'icon-arrow']">
              <el-icon v-if="column.prop === sortField">
                <CaretBottom v-if="arrowDown"/>
                <CaretTop v-else/>
              </el-icon>

                <el-icon v-else>
                  <CaretBottom />
                </el-icon>
              </div>
          </div>
        </template>
      </el-table-column>
    </template>
  </el-table>
</template>

<script setup>
import { ref, defineEmits, defineOptions } from "vue";

defineOptions({
  inheritAttrs: false
})

// 升序和降序
const arrowDown = ref(true);

const emits = defineEmits(["click-header"]);
const props = defineProps({
  selection: {
    required: false,
    type: Boolean,
    default: () => false,
  },
  sortField: {
    required: false,
    type: String,
    default: () => ''
  },
  
});
const tableRef = ref(null);

const getTableRef = () => {
  return tableRef;
};
const handleClickColumnHeader = (column) => {
  const { prop } = column;
  if (prop === props.sortField) {
    arrowDown.value = !arrowDown.value;
  } else {
    arrowDown.value = true;
  }
  console.log(arrowDown);
  emits("click-header", {
    sortField: prop,
    order: arrowDown.value ? "desc" : "asc",
  });
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

  .current-sort-field{
    color: #409eff;
  }
}
:deep(.cell ){
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
}

</style>
