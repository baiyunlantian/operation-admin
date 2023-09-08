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
          <div class="header-edit" v-if="userIdentity == 1">
            <el-button link @click="editMsg"
              ><el-icon><EditPen color="#999" /></el-icon
            ></el-button>
          </div>
        </header>
        <main>
          <el-row :gutter="12" style="width: 100%" justify="start">
            <el-form :model="agentFormData" class="agent-form">
              <template v-for="data in agentDataArr" :key="data.name">
                <el-col :span="7" v-if="data.isPermission">
                  <el-form-item class="agent-item-container">
                    <p>{{ data.title }}&nbsp;</p>
                    <!-- <el-input
                  v-model="agentFormData[data.name]"
                ></el-input> -->
                    <el-text class="mx-1">
                      <span>{{ data.aliasName }}</span
                      >{{ agentFormData[data.name] }}</el-text
                    >
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
          @searchEvent="changeParams"
          :tableTitle="'客户列表'"
        >
        </table-detail-list>
      </div>

      <div class="order-list-container">
        <table-detail-list
          :agentDataRow="orderDataRow"
          :searchParams="orderParams"
          :searchWay="orderSearchWay"
          :sortType="sortType"
          :agentDataHead="orderDataHead"
          :agentDataTotal="orderDataTotal"
          @searchEvent="changeOrderParams"
          @resetStatus="handleStatusChange"
          :tableTitle="'订单列表'"
        >
          <template #header>
            <div class="order-status">
              <el-select
                v-model="status"
                class="m-2"
                style="width: 100px; margin-right: 10px"
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
      :msgType="msgType"
      @cancelEdit="cancelEdit"
      @changeMsgType="changeMsgType"
    >
    </edit-dialog>
  </div>
</template>

<script setup>
import { onMounted, reactive, ref, computed } from "vue";
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

// 身份确认
// 销售 10  代理 20
import { useStore } from "vuex";
const store = useStore();
const roleIdentity = computed(() => {
  return store.getters["user/agentInfo"].roleId;
});
//超管1 非超管0
const userIdentity = computed(() => {
  return store.getters["user/info"].isAdmin;
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
  bankCardId: "",
});
const agentDataArr = reactive([
  { title: "联系方式", name: "phone", isPermission: true },
  { title: "办公邮箱", name: "email", isPermission: true },
  { title: "加入时间", name: "joinDate", isPermission: true },
  { title: "所属企业", name: "company", isPermission: true },
  { title: "专属销售", name: "appertainSalesName", isPermission: true },
  { title: "销售电话", name: "appertainSalesPhone", isPermission: true },
  { title: "销售邮箱", name: "appertainSalesEmail", isPermission: true },
  { title: "待付款订单", name: "notPaymentOrderQty", isPermission: true },
  {
    title: "待付款佣金",
    name: "notPaymentCommission",
    isPermission: computed(() => {
      return userIdentity.value == 1;
    }),
  },
  { title: "实施中订单", name: "carryOutOrdersQty", isPermission: true },
  {
    title: "实施中佣金",
    name: "carryOutCommission",
    isPermission: computed(() => {
      return userIdentity.value == 1;
    }),
  },
  { title: "冻结押金", name: "agencyCashPledge", isPermission: true },
  { title: "已完成订单", name: "completedOrdersQty", isPermission: true },
  {
    title: "待提现佣金",
    name: "notWithdrawalCommission",
    isPermission: computed(() => {
      return userIdentity.value == 1;
    }),
  },
  {
    title: "共赚取佣金",
    name: "totalCommission",
    isPermission: computed(() => {
      return userIdentity.value == 1;
    }),
  },
  {
    title: "已提现佣金",
    name: "withdrawalCommission",
    isPermission: computed(() => {
      return userIdentity.value == 1;
    }),
  },
  {
    title: "银行卡信息",
    name: "cardName",
    isPermission: computed(() => {
      return userIdentity.value == 1;
    }),
    aliasName: "户主名称:",
  },
  {
    title: "",
    name: "cardNo",
    isPermission: computed(() => {
      return userIdentity.value == 1;
    }),
    aliasName: "银行卡号:",
  },
  {
    title: "",
    name: "openingBank",
    isPermission: computed(() => {
      return userIdentity.value == 1;
    }),
    aliasName: "开户行:",
  },
]);

// 获取代理个人信息
const getAgencyUser = () => {
  const params = {
    userId: route.query.userId,
  };
  console.log(params);
  const APIArr = [
    API.getAgencyUser(params),
    API.getOrderCommission(params),
    API.getBankInfo(params),
  ];
  Promise.all(APIArr).then((res) => {
    agentFormData.value = res.reduce((prev, curr) => {
      return Object.assign(prev, curr.data);
    }, {});
    if (agentFormData.value.isFreeOfCommission === true) {
      agentFormData.value.agencyCashPledge = "免佣用户";
    }
    console.log(agentFormData.value);
  });
};

// 编辑个人信息
const editMsg = () => {
  dialogOpt.dialogVisible = true;
};

//取消
const cancelEdit = () => {
  dialogOpt.dialogVisible = false;
};

// 改变消息类型
const changeMsgType = (val) => {
  console.log(val);
  const params = {
    agencyId: route.query.userId,
    agencyName: val.editParams.userName,
    phone: val.editParams.phone,
    email: val.editParams.email,
    cardName: val.editParams.cardName,
    cardNo: val.editParams.cardNo,
    bankName: val.editParams.openingBank,
  };
  console.log(params);
  API.updateAgencyUser(params).then((res) => {
    if (res.code == 0) {
      dialogOpt.dialogVisible = false;
    }
  });
};

const dialogOpt = reactive({
  dialogVisible: false,
  title: "代理信息",
  width: "80vw",
  col: 8,
});

const formArr = ref([
  { title: "代理名称", name: "userName", isChange: true },
  { title: "联系方式", name: "phone", isChange: true },
  { title: "办公邮箱", name: "email", isChange: true },
  {
    title: "银行卡信息",
    name: "cardName",
    isChange: true,
    prepend: "户主名称",
  },
  { title: "", name: "cardNo", isChange: true, prepend: "银行卡号" },
  { title: "", name: "openingBank", isChange: true, prepend: "开户行" },
]);

// ------------------------------------------------------------筛选的方式
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
  { prefix: "订单ID", name: "orderId" },
  { prefix: "客户名称", name: "customerName" },
  {
    prefix: "创建时间:",
    prefixWidth: "60px",
    name: "creatTime",
    slot: "createTime",
  },
];

const statusOpt = [
  { value: "-1", label: "全部状态" },
  { value: "0", label: "未提交" },
  { value: "20", label: "实施中" },
  { value: "30", label: "已完成" },
  { value: "31", label: "已提现" },
  { value: "40", label: "订单超时取消" },
  { value: "41", label: "已取消" },
];
const status = ref("-1");
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
  { prop: "customerName", label: "客户名称", width: "80", isPermission: true },
  { prop: "phone", label: "手机号", width: "110", isPermission: true },
  { prop: "orderQty", label: "订单量", width: "110", isPermission: true },
  { prop: "orderAmount", label: "订单金额", width: "80", isPermission: true },
  {
    prop: "paymentTime",
    label: "最后成交时间",
    width: "100",
    isPermission: true,
  },
  { prop: "registerTime", label: "注册时间", width: "100", isPermission: true },
];
const orderDataHead = [
  { prop: "orderId", label: "订单ID", width: "80", isPermission: true },
  { prop: "customName", label: "客户名称", width: "110", isPermission: true },
  { prop: "orderAmount", label: "订单金额", width: "110", isPermission: true },
  {
    prop: "salesCommission",
    label: "销售返佣",
    width: "80",
    isPermission: true,
  },
  {
    prop: "agencyCommission",
    label: "代理返佣",
    width: "100",
    isPermission: true,
  },
  { prop: "paymentTime", label: "付款时间", width: "100", isPermission: true },
  { prop: "statusName", label: "状态", width: "100", isPermission: true },
  { prop: "orderTime", label: "创建时间", width: "100", isPermission: true },
];

// 搜索
const searchParams = reactive({
  customerId: "",
  phone: "",
  startTime: "",
  endTime: "",
  sortType: "",
  pageIndex: "",
  pageSize: "",
});
const searchData = (val) => {
  searchParams[val.name] = val.input;
};

const changeParams = (val) => {
  searchParams.customerId = val.customerId;
  searchParams.phone = val.phone;
  searchParams.startTime = val.startTime;
  searchParams.endTime = val.endTime;
  searchParams.sortType = val.sortType;
  searchParams.pageIndex = val.pageIndex;
  searchParams.pageSize = val.pageSize;
  getCustomerList();
};

// 代理数据的数据行内容
const agentDataRow = ref([]);
const agentDataTotal = ref();
const getCustomerList = () => {
  const params = {
    agencyId: route.query.userId,
    customName: searchParams.customerId || "",
    phone: searchParams.phone || "",
    startTime: searchParams.startTime || "",
    endTime: searchParams.endTime || "",
    sortField: "PaymentTime",
    sortType: searchParams.sortType || "DESC",
    pageIndex: searchParams.pageIndex || 1,
    pageSize: searchParams.pageSize || 50,
  };
  API.getCustomerList(params).then((res) => {
    if (res.code == 0) {
      // agentDataRow.value = res.data.list;
      agentDataRow.value = res.data.list;
      agentDataTotal.value = res.data.total;
      console.log(res);
    }
  });
};

// 搜索
const orderParams = reactive({
  orderId: "",
  customerName: "",
  startTime: "",
  endTime: "",
  status: "",
  ascending: "",
  pageIndex: "",
  pageSize: "",
});

const changeOrderParams = (val) => {
  console.log(val);
  orderParams.orderId = val.orderId;
  orderParams.customerName = val.customerName;
  orderParams.startTime = val.startTime;
  orderParams.endTime = val.endTime;
  orderParams.ascending = val.sortType;
  orderParams.pageIndex = val.pageIndex;
  orderParams.pageSize = val.pageSize;
  getOrderList();
};

const orderDataRow = ref([]);
const orderDataTotal = ref();
const getOrderList = () => {
  const params = {
    agencyId: route.query.userId,
    orderId: orderParams.orderId || 0,
    customerName: orderParams.customerName || "",
    startTime: orderParams.startTime || "",
    endTime: orderParams.endTime || "",
    sortField: "OrderTime",
    ascending: orderParams.ascending || "DESC",
    pageIndex: orderParams.pageIndex || 1,
    pageSize: orderParams.pageSize || 50,
    status: status.value || "-1",
  };
  API.getOrderList(params).then((res) => {
    if (res.code == 0) {
      orderDataRow.value = res.data.list;
      orderDataTotal.value = res.data.total;
      console.log(res);
    }
  });
};

const msgType = ref("input");
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
