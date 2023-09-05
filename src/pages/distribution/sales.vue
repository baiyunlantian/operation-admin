<template>
  <div class="agent-container">
    <module-card>
      <header class="agent-data-head">
        <h1>销售数据</h1>
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
              <el-button
                type="primary"
                :style="{ 'margin-left': '12px' }"
                @click="addAgent"
                >添加销售</el-button
              >
            </template>
          </table-search>
        </template>
        <div class="pagesize-container">
          <el-pagination
            v-model:page-size="pageSize"
            :page-sizes="[50, 100, 200]"
            layout="sizes"
            :total="1000"
            @size-change="handleSizeChange"
          />
        </div>
      </div>

      <data-table
        :selection="true"
        ref="tableRef"
        :column="salesDataHead"
        :data="salesDataRow"
        :sortable="true"
        v-loading="dataLoading"
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
                @click="operate.clickEvent(row.salesId)"
                >{{ operate.func }}</el-link
              >
            </template>
          </div>
        </template>
      </data-table>

      <div class="pagination-container">
        <el-pagination
          background
          small
          layout="total"
          :total="salesDataRow?.length"
        />
        <el-pagination
          background
          small
          layout="prev, pager, next"
          :total="salesDataRow?.length"
        />
      </div>
    </module-card>

    <!-- 新增销售弹框 -->
    <form-dialog
      :dialogOpt="dialogOpt"
      :formTitles="formTitles"
      :agentData="salesData"
      :form="form"
      @getNewAgentData="getNewSalesData"
    ></form-dialog>

    <!-- 详情弹框 -->
    <edit-dialog
      :dialogOpt="dialogDetaiOpt"
      :form="salesFormData"
      :formArr="formArr"
    ></edit-dialog>
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

// 搜索图标
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
  getSalesData();
  getSalesList({});
});

// 卡片的数值
const amount = ref({});
// 获取代理数据
const getSalesData = () => {
  const params = {
    StartTime: selectedDate.startDate,
    EndTime: selectedDate.endDate,
  };
  API.getSalesData(params).then((res) => {
    amount.value = res.data;
    updateCardData();
    // console.log(amount.value);
  });
};

// 更新卡片数据
const updateCardData = () => {
  cardData.value.forEach((value) => {
    value.amount = amount.value[value.name];
    if (value.total) {
      value.total.totalAmount = amount.value[value.total.totalName];
      console.log(value.total.totalAmount);
    }
  });
};

// 卡片数据
const cardData = ref([
  {
    title: "成交销售数量",
    name: "completeOrderSale",
    amount: amount.value.agentCount,
    url: require("@/assets/images/user_count.png"),
    total: {
      totalTitle: "销售总量",
      totalName: "saleTotal",
      totalAmount: amount.value.agentCount,
    },
  },
  {
    title: "成交金额",
    name: "orderTotalAmount",
    amount: amount.value.transactionAmount,
    url: require("@/assets/images/bar_chart.png"),
  },
  {
    title: "平均价",
    name: "orderAvgAmoun",
    amount: amount.value.transactionAvgAmount,
    url: require("@/assets/images/bar_chart.png"),
  },
]);

// 获取几天前的准确时间
const getBeforeDate = (date) => {
  selectedDate = date;
  // console.log(date);
  getSalesData();
  // console.log(selectedDate);
};

// -------------------------销售列表

// 筛选的方式
const searchWay = reactive([
  { name: "search", prefix: "搜索", slot: "search" },
  { name: "addSaler", prefix: "添加销售", slot: "add" },
]);

const pageSize = ref(50);
const handleSizeChange = (val) => {
  pageSize.value = val;
  getSalesList({
    keyword: keyword.value,
    status: status.value,
    pageSize: pageSize.value,
  });
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
  getSalesList({
    keyword: keyword.value,
    status: status.value,
    pageSize: pageSize.value,
  });
};

// 搜索
const keyword = ref();
const search = (val, e) => {
  // console.log(keyword.value);
  getSalesList({
    keyword: keyword.value,
    status: status.value,
    pageSize: pageSize.value,
  });
};

// 获取代理列表

const salesDataRow = ref();
const dataLoading = ref(false);
const getSalesList = ({
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
  dataLoading.value = true;
  API.getSalesList({
    status,
    sortField,
    keyword,
    sortType,
    pageIndex,
    pageSize,
  }).then((res) => {
    // console.log(res.data);
    dataLoading.value = false;
    salesDataRow.value = res.data.list;
    salesDataRow.value.forEach((val) => {
      val.totalCommission = totalCommission;
      val.operate = operate;
    });
    // console.log('-------------',salesDataRow.value);
    // salesDataRow.value = res.data;
  });
};

// 代理数据的表头
const salesDataHead = [
  { prop: "salesName", label: "销售名称", width: "100", header: true },
  { prop: "phone", label: "手机号码", width: "110", header: true },
  { prop: "orderCount", label: "订单数量", width: "110", header: true },
  { prop: "orderAmount", label: "订单金额（元）", width: "200", header: true },
  {
    prop: "stayCommission",
    label: "待结佣金金额（元）",
    width: "200",
    header: true,
  },
  {
    prop: "withdrawCommission",
    label: "已结佣金金额（元）",
    width: "200",
    header: true,
  },
  { prop: "customCount", label: "客户数量", width: "100", header: true },
  { prop: "status", label: "销售状态", width: "180", header: true },
  {
    prop: "lastPaymentTime",
    label: "最后成交时间",
    width: "200",
    header: true,
  },
  {
    prop: "lastCommissionTime",
    label: "最后结佣时间",
    width: "180",
    slot: true,
    header: true,
  },

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
    func: "详情",
    isShow: true,
    clickEvent: (id) => {
      console.log(id);
      dialogDetaiOpt.dialogVisible = true;
      getSalesInfo(id);
    },
  },
  { func: "封禁", isShow: true },
  { func: "恢复", isShow: true },
  { func: "离职", isShow: true },
  { func: "结算佣金", isShow: true },
];

// 总押金参数
const totalCommission = [
  { title: "总押金:", amount: "76800.00" },
  { title: "已返押金:", amount: "76800.00" },
  { title: "未返押金:", amount: "76800.00" },
];

// -------------------------新增代理
// 弹框组件
import FormDialog from "@/components/Dialog/FormDialog.vue";
const dialogOpt = reactive({
  dialogVisible: false,
  title: "创建销售",
  width: "80vw",
});
const addAgent = () => {
  dialogOpt.dialogVisible = true;
};

const formTitles = [
  { title: "基本信息", name: "baseForm", col: 12, flexDirection: "column" },
  { title: "其他信息", name: "otherForm", flexDirection: "column" },
];

//表单上传数据
const salesData = reactive({
  userName: "",
  phone: "",
  weChat: "",
  email: "",
  notes: "",
  password: "",
  roleName: "销售",
  creator: "超级管理员",
});

// 表单数据
const form = reactive({
  baseForm: [
    {
      title: "销售名称",
      name: "userName",
      type: "input",
      placeholder: "请输入销售名称",
      isRequired: true,
    },
    {
      title: "联系电话",
      name: "phone",
      type: "input",
      placeholder: "请输入手机号",
      isRequired: true,
    },
    {
      title: "销售账号",
      name: "email",
      type: "input",
      placeholder: "请输入销售账号",
      isRequired: true,
    },
    {
      title: "账号密码",
      name: "password",
      type: "input",
      placeholder: "请输入账号密码",
      isRequired: true,
    },
    {
      title: "职位",
      name: "roleName",
      type: "text",
      placeholder: "请输入职位",
      isRequired: true,
    },
    {
      title: "微信号",
      name: "weChat",
      type: "input",
      placeholder: "请输入微信号",
      isRequired: true,
    },
    {
      title: "邮箱",
      name: "email",
      type: "input",
      placeholder: "请输入邮箱",
      isRequired: true,
      append: "@maliyaka.com",
    },
  ],
  otherForm: [
    {
      title: "备注",
      name: "notes",
      type: "textarea",
      placeholder: "请输入备注",
      isRequired: false,
    },
    {
      title: "创建人",
      name: "creator",
      type: "text",
      placeholder: "超级管理员",
      isRequired: false,
    },
  ],
});

const getNewSalesData = (data) => {
  console.log(data);
  API.addAgencyUser(data).then((res) => {
    console.log(res);
    getSalesList({
      status: 1,
      sortField: "OrderQty",
      keyword: "",
      sortType: "DESC",
      pageIndex: 1,
      pageSize: 50,
    });
  });
};

// 销售信息组件
import EditDialog from "@/components/Dialog/EditDialog.vue";
//  :dialogOpt="dialogDetaiOpt"
// :form="salesFormData"
// :formArr="formArr"

const dialogDetaiOpt = reactive({
  dialogVisible: false,
  title: "销售信息",
  width: "60vw",
});

const formArr = ref([
  { title: "手机", name: "account" },
  { title: "微信", name: "weChat" },
  { title: "办公邮箱", name: "email" },
  { title: "入职时间", name: "joinDate" },
  { title: "管理主体", name: "company" },
  { title: "直属上级", name: "appertainSalesName" },
  { title: "职位", name: "roleName" },
  { title: "离职时间", name: "resignationDate" },
]);
const salesFormData = ref({
  userName: " ",
  account: "",
  email: "",
  joinDate: "",
  resignationDate: "",
  company: "",
  roleId: "",
  roleName: "",
  appertainSalesId: "",
  appertainSalesName: "",
  appertainSalesPhone: "",
  appertainSalesEmail: "",
  weChat: "",
  joinDays: "",
  agencyCashPledge: "",
  agencyWithdrawstatus: "",
});

const getSalesInfo = (id) => {
  API.getSalesInfo(id).then((res) => {
    console.log(res.data);
    salesFormData.value = res.data;
  });
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
