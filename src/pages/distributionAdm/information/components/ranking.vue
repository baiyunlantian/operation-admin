<template>
  <div class="ranking bg-fff" v-if="isShow">
    <div class="top-title">
      <div class="total-title fw">{{ title }}</div>
      <div class="month">月份</div>
    </div>
    <el-table :data="tableData" style="width: 100%" height="300">
      <template v-for="(item, index) in listTitle" :key="index">
        <el-table-column :prop="item.prop" :label="item.label" align="center">
          <template #default="{ row }">
            <div
              v-if="item.insertSlot && item.prop === 'ranking'"
              class="rankingCol"
              :class="{ frontRanking: row.ranking <= 3 }"
            >
              {{ row.ranking }}
            </div>
          </template>
        </el-table-column>
      </template>
    </el-table>
  </div>
</template>

<script setup>
import { ref, defineProps } from "vue";
defineProps({
  isShow: {
    type: Boolean,
    default: true,
  },
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
//  console.log(row, column, rowIndex, columnIndex);
//  let cellStyles;
//  switch (columnIndex) {
//   case 0:
//    cellStyles = {
//     color: "#fff",
//    };
//  }

//  return cellStyles;
// };
</script>

<style lang="scss" scoped>
.ranking {
  padding: 16px 24px;
  box-sizing: border-box;
  margin-bottom: 16px;
  box-shadow: 0px 1px 2px 0px rgba(0, 0, 0, 0.1);

  .top-title {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 23px;

    .month {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 60px;
      height: 32px;
      border: 1px solid #0052d9;
      color: #0052d9;
      font-size: 14px;
    }
  }

  .total-title {
    font-size: 20px;
    color: rgba(0, 0, 0, 0.9);
  }

  :deep(.el-table .cell) {
    display: flex;
    justify-content: center;
    padding: 0 7px;
    font-weight: 500;
  }

  .rankingCol {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 24px;
    height: 24px;
    border-radius: 50%;
    background-color: #bcc4d0;
    color: #ffffff;
  }

  .frontRanking {
    background-color: #3a55c0;
  }
}
</style>
