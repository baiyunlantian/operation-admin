<template>
  <div class="table-list-container">
    <div class="agent-table-container" style="width: 100%">
      <div class="select-way">
        <template v-for="way in searchWay" :key="way.prefix">
          <table-search
            ref="tableSearchRef"
            :searchWay="way"
            style="marginright: 8px"
            @searchValue="searchData"
          >
            <template #createTime>
              <div class="create-time-container">
                <p :style="{ width: way.prefixWidth }">{{ way.prefix }}</p>
                <variety-date-picker
                  ref="datePickerRef"
                  @getBeforeDate="getBeforeDate"
                ></variety-date-picker>
              </div>
            </template>
          </table-search>
        </template>
      </div>

      <div class="select-btns">
        <slot name="header"></slot>
        <el-button type="primary" size="small" @click="getList">查询</el-button>
        <el-button type="primary" size="small" @click="resetSearchData"
          >重置</el-button
        >
      </div>
    </div>

    <div class="table-title-header">
      <div class="table-title">{{ tableTitle }}</div>
      <div class="pagesize-container">
        <el-pagination
          v-model:page-size="pageSize"
          :page-sizes="[50, 100, 200]"
          layout="sizes"
          :total="agentDataTotal"
          @size-change="handleSizeChange"
          small
        />
        <el-select
          v-model="sortVal"
          class="m-2"
          style="width: 160px; margin-left: 10px"
          size="small"
          @change="handleSortChange"
        >
          <el-option
            v-for="item in sortType"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </div>
    </div>

    <data-table
      ref="tableRef"
      :column="agentDataHead"
      :data="agentDataRow"
      :sortable="true"
      border
    >
    </data-table>

    <div class="pagination-container">
      <el-pagination
        v-model:page-size="pageSize"
        :key="tableTitle"
        background
        small
        layout="total"
        :total="agentDataTotal"
      />
      <el-pagination
        v-model:page-size="pageSize"
        v-model:current-page="pageIndex"
        background
        small
        layout="prev, pager, next"
        :total="agentDataTotal"
        @current-change="getPageIndex"
      />
    </div>
  </div>
</template>

<script setup>
import { ref, reactive } from "vue";
import TableSearch from "@/components/Table/TableSearch.vue";
import VarietyDatePicker from "@/components/DatePicker/VarietyDatePicker";
import DataTable from "@/components/Table/DataTable.vue";

const props = defineProps([
  "searchParams",
  "agentDataRow",
  "searchWay",
  "sortType",
  "agentDataHead",
  "agentDataTotal",
  "tableTitle",
]);
const emits = defineEmits(["searchEvent", "resetStatus"]);

let selectedDate = null;
// 获取几天前的准确时间
const getBeforeDate = (date) => {
  selectedDate = date;
  props.searchParams.startTime = selectedDate.startDate;
  props.searchParams.endTime = selectedDate.endDate;
};

// 搜索
const searchData = (val) => {
  props.searchParams[val.name] = val.input;
};

// 重置
const tableSearchRef = ref();
const datePickerRef = ref();
const resetSearchData = () => {
  props.searchParams.customerName = "";
  props.searchParams.orderId = "";
  props.searchParams.status = "-1";
  props.searchParams.customerId = "";
  props.searchParams.phone = "";
  props.searchParams.startTime = "";
  props.searchParams.endTime = "";
  tableSearchRef.value.forEach((val) => {
    val.input = "";
  });
  datePickerRef.value[0].datePick = "";
  sortVal.value = "DESC";
  pageIndex.value = 1;
  pageSize.value = 50;

  emits("resetStatus", "1");
};

const sortVal = ref("DESC");
const handleSortChange = (val) => {
  sortVal.value = val;
  const listParams = {
    ...props.searchParams,
    sortField: "CreatedTime",
    sortType: sortVal.value,
    pageIndex: pageIndex.value,
    pageSize: pageSize.value,
  };
  emits("searchEvent", listParams);
};

const pageSize = ref(50);
const handleSizeChange = (val) => {
  pageSize.value = val;
  const listParams = {
    ...props.searchParams,
    sortField: "CreatedTime",
    sortType: sortVal.value,
    pageIndex: pageIndex.value,
    pageSize: pageSize.value,
  };
  console.log(listParams);
  emits("searchEvent", listParams);
};

const pageIndex = ref(1);
const getPageIndex = (val) => {
  console.log(val);
  pageIndex.value = val;
  const listParams = {
    ...props.searchParams,
    sortField: "CreatedTime",
    sortType: sortVal.value,
    pageIndex: pageIndex.value,
    pageSize: pageSize.value,
  };
  emits("searchEvent", listParams);
};

const getList = () => {
  const listParams = {
    ...props.searchParams,
    sortField: "CreatedTime",
    sortType: sortVal.value,
    pageIndex: pageIndex.value,
    pageSize: pageSize.value,
  };
  emits("searchEvent", listParams);
};
</script>

<style lang="scss" scoped>
.agent-table-container {
  display: flex;
  justify-content: space-between;
  margin-bottom: 12px;
  .select-way {
    display: flex;
    .table-search-container {
      margin-right: 8px;
    }
    .create-time-container {
      display: flex;
      align-items: center;
      p {
        font-size: 12px;
        color: #606266;
      }
      :deep(.el-range-input) {
        padding: 0 12px;
      }
    }
  }
}

.table-title-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  background-color: #f3f3f3;
  padding: 12px;
  .table-title {
    font-size: 16px;
    font-weight: 700;
    padding: 0;
    margin: 0;
  }
  .pagesize-container {
    display: flex;
  }
}

.pagination-container {
  margin-top: 14px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.order-list-container {
  margin-top: 72px;
}
.select-btns {
  display: flex;
}
</style>