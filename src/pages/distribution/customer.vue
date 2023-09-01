<template>
  <div class="agent-container">
    <module-card>
      <header class="agent-data-head">
        <h1>财务数据</h1>
        <variety-date-picker
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
      <el-row :gutter="8">
        <div class="table-search-container">
          <template v-for="way in searchWay" :key="way.prefix">
            <el-col :span="24 / searchWay.length">
              <table-search :searchWay="way">
                <template #status>
                  <div class="status-container">
                    <el-select
                      v-model="value"
                      class="m-2"
                      placeholder="状态"
                      size="small"
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
                <template #createTime>
                  <div class="create-time-container">
                    <p>创建时间：</p>
                    <variety-date-picker
                      @getBeforeDate="getBeforeDate"
                    ></variety-date-picker>
                  </div>
                </template>
                <template #search>
                  <el-button>查询</el-button>
                </template>
                <template #reset>
                  <el-button>重置</el-button>
                </template>
              </table-search>
            </el-col>
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
      </el-row>
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
              <el-link v-if="operate.isShow" type="primary">{{
                operate.func
              }}</el-link>
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
// 代理数据展示组件
import ModuleCard from "@/components/Card/ModuleCard.vue";
import ShowCard from "@/components/Card/ShowCard.vue";
import VarietyDatePicker from "@/components/DatePicker/VarietyDatePicker";

// 代理列表组件
import TableSearch from "@/components/Table/TableSearch.vue";
import DataTable from "@/components/Table/DataTable.vue";

// 卡片数据
const cardData = [
  {
    title: "代理总量",
    amount: 1126,
    url: require("@/assets/images/user_count.png"),
    total: {
      totalTitle: "提现总额",
      totalAmount: "￥76800.00",
    },
  },
  {
    title: "订单总量",
    amount: 1126,
    url: require("@/assets/images/file.png"),
    total: {
      totalTitle: "提现总额",
      totalAmount: "￥76800.00",
    },
  },
  {
    title: "成交金额",
    amount: 1126,
    url: require("@/assets/images/bar_chart.png"),
    total: {
      totalTitle: "提现总额",
      totalAmount: "￥76800.00",
    },
  },
  {
    title: "平均单价",
    amount: 1126,
    url: require("@/assets/images/normal_chart.png"),
    total: {
      totalTitle: "提现总额",
      totalAmount: "￥76800.00",
    },
  },
  {
    title: "返佣金额",
    amount: 1126,
    url: require("@/assets/images/bar_chart.png"),
    total: {
      totalTitle: "提现总额",
      totalAmount: "￥76800.00",
    },
  },
];
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

// 筛选的方式
const searchWay = [
  { prefix: "代理名称" },
  { prefix: "代理手机号" },
  { prefix: "代理ID" },
  { prefix: "销售名称" },
  { prefix: "状态", slot: "status" },
  { prefix: "创建时间:", slot: "createTime" },
  { prefix: "搜索", slot: "search" },
  { prefix: "重置", slot: "reset" },
];

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
  { func: "查看", isShow: true },
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
const agentDataRow = [
  {
    agencyName: "1679989217626",
    agencyPhone: "13100000001",
    agencyId: "13100000001",
    salesName: "13100000001",
    customerQty: "13100000001",
    orderQty: "13100000001",
    orderAmount: "13100000001",
    avgAmount: "13100000001",
    totalCommission,
    status: "13100000001",
    createdTime: "13100000001",
    operate,
  },
  {
    agencyName: "1679989217626",
    agencyPhone: "王小虎",
    agencyId: "上海市普陀区金沙江路 1518 弄",
    salesName: "13100000001",
    customerQty: "13100000001",
    orderQty: "13100000001",
    orderAmount: "13100000001",
    avgAmount: "13100000001",
    totalCommission,
    status: "13100000001",
    createdTime: "13100000001",
    operate,
  },
  {
    agencyName: "1679989217626",
    agencyPhone: "王小虎",
    agencyId: "上海市普陀区金沙江路 1518 弄",
    salesName: "13100000001",
    customerQty: "13100000001",
    orderQty: "13100000001",
    orderAmount: "13100000001",
    avgAmount: "13100000001",
    totalCommission,
    status: "13100000001",
    createdTime: "13100000001",
    operate,
  },
  {
    agencyName: "1679989217626",
    agencyPhone: "王小虎",
    agencyId: "上海市普陀区金沙江路 1518 弄",
    salesName: "13100000001",
    customerQty: "13100000001",
    orderQty: "13100000001",
    orderAmount: "13100000001",
    avgAmount: "13100000001",
    totalCommission,
    status: "13100000001",
    createdTime: "13100000001",
    operate,
  },
];

// 获取几天前的准确时间
const getBeforeDate = (date) => {
  console.log(date);
};
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
  flex: 1;
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
