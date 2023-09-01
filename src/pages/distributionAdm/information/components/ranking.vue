<template>
  <div class="ranking bg-fff">
    <div class="top-title">
      <div class="total-title fw">{{ title }}</div>
    </div>
    <el-table :data="tableData" style="width: 100%" :cell-style="cellStyle">
      <template v-for="(item, index) in listTitle" :key="index">
        <el-table-column :prop="item.prop" :label="item.label" />
      </template>
    </el-table>
  </div>
</template>

<script setup>
import { ref, defineProps } from "vue";
defineProps({
  title: {
    type: String,
    default: "",
  },
  listTitle: {
    type: Array,
    default: () => [
      {
        prop: "",
        label: "",
      },
    ],
  },
  tableData: {
    type: Array,
    default: () => [],
  },
});

// const cellStyle = ({ row, column, rowIndex, columnIndex }) => {
//   console.log(row, column, rowIndex, columnIndex);
//   let cellStyles;
//   switch (columnIndex) {
//     case 0:
//       cellStyles = {
//         color: "#fff",
//       };
//   }

//   return cellStyles;
// };
</script>

<style lang="scss" scoped>
.ranking {
  padding: 16px 24px;
  box-shadow: 0px 1px 2px 0px rgba(0, 0, 0, 0.1);

  .total-title {
    margin-bottom: 23px;
    font-size: 20px;
    color: rgba(0, 0, 0, 0.9);
    // width: 24px;
    // height: 24px;
    // background-color: #bcc4d0;
  }
}
</style>
