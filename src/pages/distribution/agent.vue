<template>
  <div class="agent-container">
    <module-card>
      <header class="agent-data-head">
        <h1>代理数据</h1>
        <variety-date-picker
          ref="datePickerRef"
          :selectDay="daysData"
          @getBeforeDate="getBeforeDate"
        ></variety-date-picker>
      </header>
      <main class="agent-data-show">
        <el-row :gutter="16" style="width: 100%" justify="start">
          <template v-for="card in cardData" :key="card.title">
            <el-col :span="5"> <show-card :cardData="card"></show-card></el-col>
          </template>
        </el-row>
      </main>
    </module-card>
    <module-card>
      <div class="table-search-container">
        <template v-for="way in searchWay" :key="way.prefix">
          <table-search :searchWay="way">
            <template #status>
              <div class="status-container">
                <el-select
                  v-model="status"
                  @change="getStatus(way.name)"
                  class="m-2"
                  placeholder="状态"
                >
                  <el-option
                    v-for="item in statusOptions"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  />
                </el-select>
              </div>
            </template>
            <template #search>
              <el-input
                v-model="keyword"
                class="w-50 m-2"
                :style="{
                  'margin-left': '12px',
                }"
                placeholder="请输入你需要搜索的内容"
                :suffix-icon="Search"
                @keyup.enter="search(way.name, $event)"
              />
            </template>
            <template #add>
              <el-button type="primary" :style="{ 'margin-left': '12px' }"
                >添加代理</el-button
              >
            </template>
          </table-search>
        </template>
        <div class="pagesize-container">
          <el-pagination
            v-model:page-size="pageSize"
            :page-sizes="[100, 200, 300, 400]"
            layout="sizes"
            :total="1000"
            @size-change="handleSizeChange"
          />
        </div>
      </div>

      <data-table
        :selection="true"
        ref="tableRef"
        :column="agentDataHead"
        :data="agentDataRow"
        :sortable="true"
      >
        <template #totalCommission="{ row }">
          <div class="totalCommission-container">
            <div
              class="totalCommission-title"
              v-for="commission in row.totalCommission"
              :key="commission.title"
            >
              {{ commission.title }} <span>￥{{ commission.amount }}</span>
            </div>
          </div>
        </template>
        <template #operate="{ row }">
          <div class="operate-container">
            <template v-for="operate in row.operate" :key="operate.func">
              <el-link
                v-if="operate.isShow"
                type="primary"
                @click="operate.clickEvent(row.agencyId)"
                >{{ operate.func }}</el-link
              >
            </template>
          </div>
        </template>
      </data-table>

      <div class="pagination-container">
        <el-pagination background small layout="total" :total="1000" />
        <el-pagination
          background
          small
          layout="prev, pager, next"
          :total="1000"
        />
      </div>
    </module-card>
  </div>
</template>

<script setup>
import { onMounted, reactive, ref } from "vue";
import { useRouter } from "vue-router";
const router = useRouter();
import API from "./api";

// 代理数据展示组件
import ModuleCard from "@/components/Card/ModuleCard.vue";
import ShowCard from "@/components/Card/ShowCard.vue";
import VarietyDatePicker from "@/components/DatePicker/VarietyDatePicker";

// 代理列表组件
import TableSearch from "@/components/Table/TableSearch.vue";
import DataTable from "@/components/Table/DataTable.vue";

import { Search } from "@element-plus/icons-vue";

// 选择日期的数据
const daysData = [
  {
    label: "今天",
    value: 0,
  },
  {
    label: "昨天",
    value: 1,
  },
  {
    label: "最近7天",
    value: 7,
  },
  {
    label: "30天",
    value: 30,
  },
  {
    label: "90天",
    value: 90,
  },
  {
    label: "一年",
    value: 365,
  },
];

const datePickerRef = ref();
let selectedDate = null;
onMounted(() => {
  selectedDate = datePickerRef.value.getDate(7);
  getAgentData();
});

// 卡片的数值
const amount = ref({});
// 获取代理数据
const getAgentData = () => {
  const params = {
    StartTime: selectedDate.startDate,
    EndTime: selectedDate.endDate,
  };
  API.getAgentData(params).then((res) => {
    amount.value = res.data;
    updateCardData();
    console.log(amount.value);
  });
};

// 更新卡片数据
const updateCardData = () => {
  cardData.value.forEach((value) => {
    value.amount = amount.value[value.name];
  });
};

// 卡片数据
const cardData = ref([
  {
    title: "成交代理",
    name: "completeOrderAgentCount",
    amount: amount.value.agentCount,
    url: require("@/assets/images/user_count.png"),
  },
  {
    title: "订单量",
    name: "completeOrderCount",
    amount: amount.value.orderCount,
    url: require("@/assets/images/file.png"),
  },
  {
    title: "成交金额",
    name: "transactionAmount",
    amount: amount.value.transactionAmount,
    url: require("@/assets/images/bar_chart.png"),
  },
  {
    title: "平均单价",
    name: "transactionAvgAmount",
    amount: amount.value.transactionAvgAmount,
    url: require("@/assets/images/normal_chart.png"),
  },
  {
    title: "返佣金额",
    name: "brokerageCommission",
    amount: amount.value.brokerageCommission,
    url: require("@/assets/images/bar_chart.png"),
  },
]);

// 获取几天前的准确时间
const getBeforeDate = (date) => {
  selectedDate = date;
  // console.log(date);
  getAgentData();
  // console.log(selectedDate);
};

// 筛选的方式
const searchWay = reactive([
  { name: "status", prefix: "状态", slot: "status" },
  { name: "search", prefix: "搜索", slot: "search" },
  { name: "addSaler", prefix: "添加销售", slot: "add" },
]);

const pageSize = ref(100);
const handleSizeChange = (val) => {
  pageSize.value = val;
  // console.log(val);
};

// 状态的选择器
const statusOptions = [
  {
    value: "Option1",
    label: "Option1",
  },
  {
    value: "Option2",
    label: "Option2",
  },
  {
    value: "Option3",
    label: "Option3",
  },
  {
    value: "Option4",
    label: "Option4",
  },
  {
    value: "Option5",
    label: "Option5",
  },
];
// 状态变化
const status = ref();
const getStatus = (val) => {
  getAgentList({
    keyword: keyword.value,
    status: status.value,
    pageSize: pageSize.value,
  });
};

// 搜索
const keyword = ref();
const search = (val, e) => {
  getAgentList({
    keyword: keyword.value,
    status: status.value,
    pageSize: pageSize.value,
  });
};

// 获取代理列表
const getAgentList = ({
  status = 1,
  sortField = "OrderQty",
  keyword = "",
  sortType = "DESC",
  pageIndex = 1,
  pageSize = 50,
}) => {
  // console.log({
  //   status,
  //   sortField,
  //   keyword,
  //   sortType,
  //   pageIndex,
  //   pageSize,
  // });
  API.getAgentList({
    status,
    sortField,
    keyword,
    sortType,
    pageIndex,
    pageSize,
  }).then((res) => {
    console.log(res.data);
    agentDataRow.value = res.data;
    agentDataRow.value.forEach((val) => {
      val.totalCommission = totalCommission
      val.operate = operate;
    });
    console.log(agentDataRow.value);
    // agentDataRow.value = res.data;
  });
};

const updateListData = () => {};

// 代理数据的表头
const agentDataHead = [
  { prop: "agencyName", label: "代理名称", width: "80" },
  { prop: "agencyPhone", label: "代理手机号", width: "110" },
  { prop: "agencyId", label: "代理ID", width: "110" },
  { prop: "salesName", label: "销售名称", width: "80" },
  { prop: "customerQty", label: "客户数量", width: "100", header: true },
  { prop: "orderQty", label: "订单量", width: "100", header: true },
  { prop: "orderAmount", label: "成交额", width: "100", header: true },
  { prop: "avgAmount", label: "平均单价", width: "100", header: true },
  {
    prop: "totalCommission",
    label: "总押金",
    width: "180",
    slot: true,
    header: true,
  },
  { prop: "status", label: "状态", width: "180" },
  { prop: "createdTime", label: "创建时间", width: "180", header: true },
  {
    prop: "operate",
    label: "操作",
    width: "180",
    slot: true,
    placement: "right",
  },
];

// 操作方式
const operate = [
  {
    func: "查看",
    isShow: true,
    clickEvent: (id) => {
      console.log(id);
      router.push("/agentDetail");
    },
  },
  { func: "禁用", isShow: true },
  { func: "恢复", isShow: true },
];

// 总押金参数
const totalCommission = [
  { title: "总押金:", amount: "76800.00" },
  { title: "已返押金:", amount: "76800.00" },
  { title: "未返押金:", amount: "76800.00" },
];

// 代理数据的数据行内容
const agentDataRow = ref();
</script>

<style lang="scss" scoped>
.agent-container {
  .agent-data-head {
    display: flex;
    justify-content: space-between;
    margin-bottom: 16px;
    h1 {
      margin: 0;
      padding: 0;
      font-size: 1.25rem;
      font-weight: 700;
    }
  }

  .agent-data-show {
    display: flex;
    // flex-wrap: wrap;
    justify-content: center;
    .el-col-5 {
      max-width: 20%;
      flex: 0 0 20%;
    }
  }
}
:deep(.el-link.el-link--primary) {
  &:nth-child(n + 2) {
    margin-left: 12px;
  }
}

.table-search-container {
  display: flex;
  margin: 12px 0;
  position: relative;
  .pagesize-container {
    position: absolute;
    top: 50%;
    right: 0;
    transform: translateY(-50%);
  }
}

.create-time-container {
  display: flex;
  p {
    font-size: 12px;
    color: #606266;
  }
}

.pagination-container {
  margin-top: 14px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}
</style>
