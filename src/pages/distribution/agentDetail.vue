  <template>
  <div class="agent-detail-container">
    <div class="agent-detail-header">
      <h1>代理详情</h1>
    </div>
    <div class="agent-detail">
      <div class="agent-detail-msg">
        <div class="agency-name">
          代理名称：<span>{{ agentFormData.userName }}</span>
        </div>
        <!-- <div class="agency-account">
          用户账号：<span>{{ 12 }}</span>
        </div> -->
      </div>

      <module-card>
        <header>
          <div class="header-title">
            <h1>个人信息</h1>
          </div>
          <div class="header-edit">
            <el-button link @click="editMsg"
              ><el-icon><EditPen color="#999" /></el-icon
            ></el-button>
          </div>
        </header>
        <main>
          <el-row :gutter="12" style="width: 100%" justify="start">
            <el-form :model="agentFormData" class="agent-form">
              <template v-for="data in agentDataArr" :key="data.name">
                <el-col :span="7">
                  <el-form-item class="agent-item-container">
                    <p>{{ data.title }}&nbsp;</p>
                    <!-- <el-input
                  v-model="agentFormData[data.name]"
                ></el-input> -->
                    <el-text class="mx-1">{{
                      agentFormData[data.name]
                    }}</el-text>
                  </el-form-item>
                </el-col>
              </template>
            </el-form>
          </el-row>
        </main>
      </module-card>
      <div class="customer-list-container">
        <table-detail-list
          :agentDataRow="agentDataRow"
          :searchParams="searchParams"
          :searchWay="searchWay"
          :sortType="sortType"
          :agentDataHead="agentDataHead"
          :agentDataTotal="agentDataTotal"
          @searchEvent="getCustomerList"
        >
        </table-detail-list>
      </div>

      <div class="order-list-container">
        <table-detail-list
          :agentDataRow="orderDataRow"
          :searchParams="searchParams"
          :searchWay="orderSearchWay"
          :sortType="sortType"
          :agentDataHead="orderDataHead"
          :agentDataTotal="orderDataTotal"
          @searchEvent="getOrderList"
          @resetStatus="handleStatusChange"
        >
          <template #header>
            <div class="order-status">
              <el-select
                v-model="status"
                class="m-2"
                style="width: 80px; margin-right: 10px"
                size="small"
                @change="handleStatusChange"
              >
                <el-option
                  v-for="item in statusOpt"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
            </div>
          </template>
        </table-detail-list>
      </div>
    </div>
    <!-- 信息的弹框 -->
    <edit-dialog
      :dialogOpt="dialogOpt"
      :form="agentFormData"
      :formArr="formArr"
    ></edit-dialog>
  </div>
</template>

<script setup>
import { onMounted, reactive, ref } from "vue";
import API from "./api";

import ModuleCard from "@/components/Card/ModuleCard.vue";

import EditDialog from "@/components/Dialog/EditDialog";

import TableDetailList from "@/components/Table/TableDetailList.vue";

import { useRoute } from "vue-router";
const route = useRoute();

onMounted(() => {
  getAgencyUser();
  getCustomerList();
  getOrderList();
});

const agentFormData = ref({
  userName: "",
  account: "",
  email: "",
  joinDate: "",
  company: "",
  appertainSalesName: "",
  appertainSalesPhone: "",
  appertainSalesEmail: "",
  notPaymentOrderQty: "",
  notPaymentCommission: "",
  carryOutOrdersQty: "",
  carryOutCommission: "",
  agencyCashPledge: "",
  completedOrdersQty: "",
  notWithdrawalCommission: "",
  totalCommission: "",
  withdrawalCommission: "",
  cardName: "",
  cardNo: "",
  openingBank: "",
});
const agentDataArr = reactive([
  { title: "联系方式", name: "account" },
  { title: "办公邮箱", name: "email" },
  { title: "加入时间", name: "joinDate" },
  { title: "所属企业", name: "company" },
  { title: "专属销售", name: "appertainSalesName" },
  { title: "销售电话", name: "appertainSalesPhone" },
  { title: "销售邮箱", name: "appertainSalesEmail" },
  { title: "待付款订单", name: "notPaymentOrderQty" },
  { title: "待付款佣金", name: "notPaymentCommission" },
  { title: "实施中订单", name: "carryOutOrdersQty" },
  { title: "实施中佣金", name: "carryOutCommission" },
  { title: "冻结押金", name: "agencyCashPledge" },
  { title: "已完成订单", name: "completedOrdersQty" },
  { title: "待提现佣金", name: "notWithdrawalCommission" },
  { title: "共赚取佣金", name: "totalCommission" },
  { title: "已提现佣金", name: "withdrawalCommission" },
  { title: "银行卡信息", name: "cardName" },
  { title: "", name: "cardNo" },
  { title: "", name: "openingBank" },
]);

// 获取代理个人信息
const getAgencyUser = () => {
  const params = {
    userId: route.query.userId,
  };
  const APIArr = [
    API.getAgencyUser(params),
    API.getOrderCommission(params),
    API.getBankInfo(params),
  ];
  Promise.all(APIArr).then((res) => {
    agentFormData.value = res.reduce((prev, curr) => {
      return Object.assign(prev, curr.data);
    }, {});
  });
};

// 编辑个人信息
const editMsg = () => {
  dialogOpt.dialogVisible = true;
};

const dialogOpt = reactive({
  dialogVisible: false,
  title: "代理信息",
  width: "60vw",
});

const formArr = ref([
  { title: "代理名称", name: "userName" },
  { title: "联系方式", name: "account" },
  { title: "办公邮箱", name: "email" },
  { title: "银行卡信息", name: "cardName" },
  { title: "", name: "cardNo" },
  { title: "", name: "openingBank" },
]);

// 筛选的方式
const searchWay = [
  { prefix: "代理名称", name: "customerId" },
  { prefix: "代理手机号", name: "phone" },
  {
    prefix: "最后成交时间：",
    prefixWidth: "90px",
    name: "creatTime",
    slot: "createTime",
  },
];
const orderSearchWay = [
  { prefix: "订单ID", name: "customerId" },
  { prefix: "客户名称", name: "phone" },
  {
    prefix: "创建时间:",
    prefixWidth: "60px",
    name: "creatTime",
    slot: "createTime",
  },
];

const statusOpt = [
  { value: "-1", label: "已取消" },
  { value: "0", label: "未支付" },
  { value: "1", label: "已支付" },
  { value: "2", label: "已完成" },
  { value: "3", label: "待提现" },
  { value: "4", label: "已提现" },
];
const status = ref("1");
const handleStatusChange = (val) => {
  status.value = val;
  getOrderList();
};
const sortType = [
  { label: "最后成交时间从晚到早", value: "DESC" },
  { label: "最后成交时间从早到晚", value: "ASC" },
];

// 代理数据的表头
const agentDataHead = [
  { prop: "customerName", label: "客户名称", width: "80" },
  { prop: "phone", label: "手机号", width: "110" },
  { prop: "orderQty", label: "订单量", width: "110" },
  { prop: "orderAmount", label: "订单金额", width: "80" },
  { prop: "paymentTime", label: "最后成交时间", width: "100" },
  { prop: "registerTime", label: "注册时间", width: "100" },
];
const orderDataHead = [
  { prop: "orderId", label: "订单ID", width: "80" },
  { prop: "customerName", label: "客户名称", width: "110" },
  { prop: "orderAmount", label: "订单金额", width: "110" },
  { prop: "salesCommission", label: "销售返佣", width: "80" },
  { prop: "agencyCommission", label: "代理返佣", width: "100" },
  { prop: "paymentTime", label: "付款时间", width: "100" },
  { prop: "statusName", label: "状态", width: "100" },
  { prop: "createdTime", label: "创建时间", width: "100" },
];

// 搜索
const searchParams = reactive({
  customerId: "",
  phone: "",
  startTime: "",
  endTime: "",
});
const searchData = (val) => {
  searchParams[val.name] = val.input;
};
// 代理数据的数据行内容
const agentDataRow = ref([]);
const agentDataTotal = ref();
const getCustomerList = (params) => {
  console.log(params);
  API.getCustomerList(params).then((res) => {
    agentDataRow.value = res.data.list;
    agentDataTotal.value = res.data.total;
  });
};

const orderDataRow = ref([]);
const orderDataTotal = ref();
const getOrderList = (params) => {
  const orderParams = {
    ...params,
    status: status.value,
  };
  API.getOrderList(orderParams).then((res) => {
    console.log(res);
    orderDataRow.value = res.data.list;
    orderDataTotal.value = res.data.total;
  });
};
</script>

<style lang="scss" scoped>
.agent-detail-container {
  .agent-detail-header {
    background-color: #6ea3ff;
    border-radius: 4px 4px 0 0;
    padding: 12px 20px;
    h1 {
      color: #fff;
      font-size: 18px;
      margin: 0;
    }
  }
  .agent-detail {
    background-color: #fff;
    border-radius: 0 0 4px 4px;
    padding: 20px;
    .agent-detail-msg {
      margin-bottom: 12px;
      display: flex;
      font-weight: 700;
      .agency-account {
        margin-left: 12px;
      }
    }
    header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      .header-title {
        h1 {
          font-size: 16px;
          font-weight: 700;
          padding: 0;
          margin: 0;
          margin-bottom: 20px;
        }
      }
      .header-edit {
      }
    }
    main {
      .agent-form {
        display: flex;
        flex-wrap: wrap;
        width: 100%;
        .el-col-7 {
          flex: 0 0 14.285%;
        }
        .agent-item-container {
          margin-bottom: 8px;

          :deep(.el-form-item__content) {
            display: flex;
            flex-direction: column;
            align-items: flex-start;
          }
          p {
            font-size: 12px;
            color: #999;
          }
          .el-text {
            align-self: flex-start;
            font-weight: 700;
            color: #2a2a2a;
          }
        }
      }
    }
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
            width: 80px;
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
  }
  .order-list-container {
    margin-top: 72px;
  }
}
</style>
