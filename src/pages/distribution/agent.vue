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
            <el-col :span="5" v-if="card.isPermission">
              <show-card :cardData="card"></show-card
            ></el-col>
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
                  placeholder="全部状态"
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
              <el-button
                type="primary"
                :style="{ 'margin-left': '12px' }"
                @click="addAgent"
                >添加代理</el-button
              >
            </template>
          </table-search>
        </template>
        <div class="pagesize-container">
          <el-pagination
            v-model:page-size="pageSize"
            :page-sizes="[50, 100, 200]"
            layout="sizes"
            :total="agentDataLength"
            @size-change="handleSizeChange"
          />
        </div>
      </div>

      <data-table
        class="table"
        :selection="true"
        ref="tableRef"
        :column="agentDataHead"
        :data="agentDataRow"
        v-loading="dataLoading"
        :sortField="sortField"
        @click-header="handleTableSort"
      >
        <template #status="{ row }">
          <div>
            {{ row.statusName }}
          </div>
        </template>
        <template #operate="{ row }">
          <div class="operate-container">
            <template v-for="operate in row.operate" :key="operate.func">
              <el-link
                v-if="
                  operate.isShow.includes(`[${row.status}]`) &&
                  operate.isPermission
                "
                type="primary"
                @click="operate.clickEvent(row.agencyId, row.agencyName)"
                >{{ operate.func }}</el-link
              >
            </template>
          </div>
        </template>
      </data-table>

      <div class="pagination-container">
        <el-pagination
          v-model:page-size="pageSize"
          background
          small
          layout="total"
          :total="agentDataLength"
        />
        <el-pagination
          v-model:page-size="pageSize"
          background
          small
          layout="prev, pager, next"
          :total="agentDataLength"
          @current-change="currentChange"
        />
      </div>
    </module-card>

    <!-- 新增代理弹框 -->
    <form-dialog
      ref="formRef"
      :dialogOpt="dialogOpt"
      :formTitles="formTitles"
      :agentData="agentData"
      :form="form"
      @getNewAgentData="getNewAgentData"
      @cancelCreate="cancelCreate"
      :rules="rules"
      :options="salesOptions"
      :textName="saler"
      :destroy-on-close="true"
    >
      <template #password>
        <el-text>
          {{ agentData.password }}
        </el-text>
        <el-link style="margin-left: 20px" type="primary" @click="copyText">
          复制
        </el-link>
      </template>
    </form-dialog>
  </div>
</template>

<script setup>
import { onMounted, reactive, ref, computed, watch } from "vue";
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
  // getAgentData();
  getAgentList();
  getStatusList();
  getSalers();
});

// 卡片的数值
const amount = ref({});
// 获取代理数据
const getAgentData = () => {
  const params = {
    startTime: selectedDate.startDate,
    endTime: selectedDate.endDate,
  };
  API.getAgentData(params).then((res) => {
    amount.value = res.data;
    console.log(res.data);
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
    }
  });
};

// 卡片数据
const cardData = ref([
  {
    title: "成交代理",
    name: "completeOrderAgentCount",
    amount: amount.value.completeOrderAgentCount,
    url: require("@/assets/images/user_count.png"),
    isPermission: true,
    total: {
      totalTitle: "代理总量",
      totalName: "agentTotalCount",
      totalAmount: amount.value.agentTotalCount,
    },
  },
  {
    title: "订单总量",
    name: "completeOrderCount",
    amount: amount.value.completeOrderCount,
    url: require("@/assets/images/file.png"),
    isPermission: true,
  },
  {
    title: "成交金额",
    name: "transactionAmount",
    amount: amount.value.transactionAmount,
    url: require("@/assets/images/bar_chart.png"),
    isPermission: true,
  },
  {
    title: "平均单价",
    name: "transactionAvgAmount",
    amount: amount.value.transactionAvgAmount,
    url: require("@/assets/images/normal_chart.png"),
    isPermission: true,
  },
  {
    title: "返佣金额",
    name: "brokerageCommission",
    amount: amount.value.brokerageCommission,
    url: require("@/assets/images/bar_chart.png"),
    isPermission: computed(() => {
      return userIdentity.value == 1;
    }),
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

const pageSize = ref(50);
const handleSizeChange = (val) => {
  pageSize.value = val;
  pageIndex.value = 1;
  getAgentList({
    keyWord: keyword.value,
    status: status.value,
    pageSize: pageSize.value,
    sortType: sortType.value,
    sortField: sortField.value,
  });
};

// 状态的选择器
let statusOptions = [];
const getStatusList = () => {
  const params = {
    type: "agencyUserStatus",
  };
  API.getStatusList(params).then((res) => {
    statusOptions = res.data.map((val) => {
      return {
        value: val.key,
        label: val.value,
      };
    });
    statusOptions.unshift({
      value: "-1",
      label: "全部",
    });
    console.log(statusOptions);
    status.value = "-1";
  });
};

// 状态变化
const status = ref();
const getStatus = (val) => {
  pageIndex.value = 1;
  getAgentList({
    keyWord: keyword.value,
    status: status.value,
    pageSize: pageSize.value,
    sortType: sortType.value,
    sortField: sortField.value,
  });
};

// 搜索
const keyword = ref();
const search = (val, e) => {
  pageIndex.value = 1;
  getAgentList({
    keyWord: keyword.value,
    status: status.value,
    pageSize: pageSize.value,
    sortType: sortType.value,
    sortField: sortField.value,
  });
};

const sortType = ref("DESC");
const sortField = ref("orderQty");

const handleTableSort = (e) => {
  console.log(e);
  sortType.value = e.order;
  sortField.value = e.salesName;
  pageIndex.value = 1;
  getAgentList({
    keyWord: keyword.value,
    status: status.value,
    pageSize: pageSize.value,
    sortType: sortType.value,
    sortField: sortField.value,
  });
};

// 页码
const pageIndex = ref(1);
const currentChange = (val) => {
  pageIndex.value = val;
  getAgentList({
    keyWord: keyword.value,
    status: status.value,
    pageSize: pageSize.value,
    sortType: sortType.value,
    sortField: sortField.value,
  });
};

// 获取代理列表
const dataLoading = ref(false);
const agentDataLength = ref();
const getAgentList = () => {
  dataLoading.value = true;
  const params = {
    status: status.value || "-1",
    sortField: sortField.value || "OrderQty",
    keyWord: keyword.value,
    sortType: sortType.value || "DESC",
    pageIndex: pageIndex.value || 1,
    pageSize: pageSize.value || 50,
  };
  API.getAgentList(params).then((res) => {
    dataLoading.value = false;
    if (res.code == 0) {
      agentDataRow.value = res.data.list;
      agentDataLength.value = res.data.total;
      agentDataRow.value?.forEach((val) => {
        val.operate = operate.value;
      });
    }

    // console.log('-------------',agentDataRow.value);
    // agentDataRow.value = res.data;
  });
};

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

//获取销售名称
const saler = computed(() => {
  return {
    roleId: store.getters["user/agentInfo"].roleId,
    userName: store.getters["user/agentInfo"].userName,
    userId: store.getters["user/agentInfo"].userId,
  };
});

// 代理数据的表头
const agentDataHead = reactive([
  {
    prop: "agencyName",
    label: "代理名称",
    width: "120",
    header: true,
    sortable: true,
    isPermission: true,
    arrowDown: true,
  },
  {
    prop: "agencyPhone",
    label: "代理手机号",
    width: "130",
    header: true,
    sortable: true,
    isPermission: true,
    arrowDown: true,
  },
  {
    prop: "agencyId",
    label: "代理ID",
    width: "110",
    header: true,
    sortable: true,
    isPermission: true,
    arrowDown: true,
  },
  {
    prop: "salesName",
    label: "销售名称",
    width: "120",
    header: true,
    sortable: true,
    isPermission: true,
    arrowDown: true,
  },
  {
    prop: "customerQty",
    label: "客户数量",
    width: "120",
    header: true,
    sortable: true,
    isPermission: true,
    arrowDown: true,
  },
  {
    prop: "orderQty",
    label: "订单量",
    width: "100",
    header: true,
    sortable: true,
    isPermission: true,
    arrowDown: true,
  },
  {
    prop: "orderAmount",
    label: "成交额",
    width: "100",
    header: true,
    sortable: true,
    isPermission: true,
    arrowDown: true,
  },
  {
    prop: "avgAmount",
    label: "平均单价",
    width: "120",
    header: true,
    sortable: true,
    isPermission: true,
    arrowDown: true,
  },
  {
    prop: "totalCommission",
    label: "总佣金",
    width: "180",
    header: true,
    sortable: true,
    isPermission: computed(() => {
      return userIdentity.value == 1;
    }),
    arrowDown: true,
  },
  {
    prop: "status",
    label: "状态",
    width: "180",
    header: true,
    sortable: true,
    isPermission: true,
    slot: true,
    arrowDown: true,
  },
  {
    prop: "createdTime",
    label: "创建时间",
    width: "180",
    header: true,
    sortable: true,
    isPermission: true,
    arrowDown: true,
  },
  {
    prop: "operate",
    label: "操作",
    width: "180",
    slot: true,
    isPermission: true,
    placement: "right",
    arrowDown: true,
  },
]);

// 操作方式
import { ElMessage, ElMessageBox } from "element-plus";
const operate = ref([
  {
    func: "详情",
    isShow: "[1],[10],[20],[30]",
    isPermission: true,
    clickEvent: (id) => {
      router.push({ path: "/agentDetail", query: { userId: id } });
    },
  },
  {
    func: "禁用",
    isShow: "[1]",
    isPermission: computed(() => {
      return roleIdentity.value == 20 || userIdentity.value == 1;
    }),
    clickEvent: (id, name) => {
      ElMessageBox.confirm(`是否确定禁用 ${name} 代理ID ${id} `, "提示", {
        confirmButtonText: "确认",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          const params = {
            userId: id,
          };
          API.disabledAgent(params).then((res) => {
            if (res.code == 0) {
              ElMessage({
                type: "success",
                message: "操作成功",
              });
              getAgentList();
            }
          });
        })
        .catch(() => {
          ElMessage({
            type: "warning",
            message: "取消操作",
          });
        });
    },
  },
  {
    func: "退款",
    isShow: "[10]",
    isPermission: computed(() => {
      return roleIdentity.value == 20 || userIdentity.value == 1;
    }),
    clickEvent: (id, name) => {
      console.log(id);
      ElMessageBox.confirm(`是否确定给 ${name} 代理ID ${id} 退款`, "提示", {
        confirmButtonText: "确认",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          const params = {
            userId: id,
          };
          API.refunDeposit(params).then((res) => {
            if (res.code == 0) {
              ElMessage({
                type: "success",
                message: "操作成功",
              });
              getAgentList();
            }
          });
        })
        .catch(() => {
          ElMessage({
            type: "warning",
            message: "取消操作",
          });
        });
    },
  },
  {
    func: "免佣",
    isShow: "[30]",
    isPermission: computed(() => {
      return userIdentity.value == 1;
    }),
    clickEvent: (id, name) => {
      console.log(id);
      ElMessageBox.confirm(`是否确定给 ${name} 代理ID ${id} 免佣`, "提示", {
        confirmButtonText: "确认",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          const params = {
            userId: id,
          };
          API.agentFreeOfCommission(params).then((res) => {
            if (res.code == 0) {
              ElMessage({
                type: "success",
                message: "操作成功",
              });
              getAgentList();
            }
          });
        })
        .catch(() => {
          ElMessage({
            type: "warning",
            message: "取消操作",
          });
        });
    },
    clickEvent: (id) => {},
  },
]);

// 总押金参数
// const totalCommission = [
//   { title: "总押金:", amount: "76800.00" },
//   { title: "已返押金:", amount: "76800.00" },
//   { title: "未返押金:", amount: "76800.00" },
// ];

// 代理数据的数据行内容
const agentDataRow = ref();
const salesOptions = ref([]);
// -------------------------新增代理

const getSalers = (val) => {
  API.getSalers().then((res) => {
    const salesOptionsArr = res.data.map((item) => {
      return {
        value: item.userId,
        label: item.userName,
      };
    });
    salesOptions.value = [...salesOptions.value, ...salesOptionsArr];
    console.log(salesOptions.value);
  });
};
// 弹框组件
import FormDialog from "@/components/Dialog/FormDialog.vue";
const dialogOpt = reactive({
  dialogVisible: false,
  title: "创建代理",
  width: "80vw",
});
const addAgent = () => {
  dialogOpt.dialogVisible = true;
  API.generatePassword().then((res) => {
    console.log(res.data);
    agentData.password = res.data;
  });
};

const copyText = () => {
  const content = agentData.password;
  navigator.clipboard
    .writeText(content)
    .then(() => {
      ElMessage.success("内容已经复制到剪贴板");
    })
    .catch((err) => {
      ElMessage.error("复制失败");
    });
};

const formTitles = [
  { title: "基本信息", name: "baseForm" },
  { title: "提现信息", name: "cashForm" },
];

//表单上传数据
const agentData = reactive({
  agencyName: "",
  account: "",
  phone: "",
  email: "",
  password: "",
  salesId: "",
  cardName: "",
  cardNo: "",
  openingBank: "",
  bankName: "",
});

const cancelCreate = () => {
  agentData.agencyName = "";
  agentData.account = "";
  agentData.phone = "";
  agentData.salesId = "";
  agentData.password = "";
  agentData.email = "";
  agentData.cardName = "";
  agentData.cardNo = "";
  agentData.openingBank = "";
  agentData.bankName = "";
  dialogOpt.dialogVisible = false;
};

// 规则
const rules = reactive({
  agencyName: [
    {
      required: true,
      message: "代理名称不能为空!",
      trigger: "blur",
    },
  ],
  account: [
    {
      required: true,
      message: "代理账号不能为空!",
      trigger: "blur",
    },
    {
      pattern: /^(?=.{4,16}$)(?:[A-Za-z0-9]+|[A-Za-z]+|[0-9]+)$/,
      message: "请输入4-16位的数字和字母!",
      trigger: "blur",
    },
  ],
  phone: [
    {
      required: true,
      message: "手机号码不能为空!",
      trigger: "blur",
    },
    {
      pattern: /^1(3|4|5|6|7|8|9)\d{9}$/,
      message: "请输入正确的手机号!",
      trigger: "blur",
    },
  ],
  email: [
    {
      required: true,
      message: "邮箱不能为空!",
      trigger: "blur",
    },
    {
      pattern: /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/,
      message: "请输入正确的邮箱!",
      trigger: "blur",
    },
  ],
  salesId: [
    {
      required: true,
      message: "请选择销售!",
      trigger: "blur",
    },
  ],
  cardName: [
    {
      required: true,
      message: "开户名称不能为空!",
      trigger: "blur",
    },
  ],
  cardNo: [
    {
      required: true,
      message: "开户账号不能为空!",
      trigger: "blur",
    },
  ],
  openingBank: [
    {
      required: true,
      message: "开户支行不能为空!",
      trigger: "blur",
    },
  ],
  bankName: [
    {
      required: true,
      message: "开户银行不能为空!",
      trigger: "blur",
    },
  ],
});

// 表单数据
// 解密和编码
import Crypto from "@/assets/js/cryptojs";
const form = reactive({
  baseForm: [
    {
      title: "代理名称",
      name: "agencyName",
      type: "input",
      placeholder: "请输入代理名称",
    },
    {
      title: "代理账号",
      name: "account",
      type: "input",
      placeholder: "请输入代理名称",
      isRequired: true,
    },
    {
      title: "代理手机号",
      name: "phone",
      type: "input",
      placeholder: "请输入手机号",
      isRequired: true,
    },
    {
      title: "邮箱",
      name: "email",
      type: "input",
      placeholder: "请输入邮箱",
      isRequired: true,
    },
    {
      title: "账号密码",
      name: "password",
      placeholder: "请输入账号密码",
      slot: true,
    },
    {
      title: "绑定销售",
      name: "salesId",
      type: computed(() => {
        return userIdentity.value == 1 ? "select" : "text";
      }),
      placeholder: "请输入绑定销售",
      isRequired: computed(() => {
        return userIdentity.value == 1 ? true : false;
      }),
    },
  ],
  cashForm: [
    {
      title: "开户名称",
      name: "cardName",
      type: "input",
      placeholder: "请输入开户名称",
      isRequired: true,
    },
    {
      title: "开户账号",
      name: "cardNo",
      type: "input",
      placeholder: "请输入开户账号",
      isRequired: true,
    },
    {
      title: "开户银行",
      name: "openingBank",
      type: "input",
      placeholder: "请输入开户银行",
      isRequired: true,
    },
    {
      title: "开户支行",
      name: "bankName",
      type: "input",
      placeholder: "请输入开户支行",
      isRequired: true,
    },
  ],
});

const formRef = ref();

const getNewAgentData = (data) => {
  console.log(data);
  const params = {
    ...data,
    password: Crypto.encrypt(data.password),
  };
  API.addAgencyUser(params).then((res) => {
    if (res.code == 0) {
      agentData.agencyName = "";
      agentData.account = "";
      agentData.phone = "";
      agentData.salesId = "";
      agentData.password = "";
      agentData.email = "";
      agentData.cardName = "";
      agentData.cardNo = "";
      agentData.openingBank = "";
      agentData.bankName = "";
      dialogOpt.dialogVisible = false;
      console.log(res);
      ElMessage({
        type: "success",
        message: "操作成功",
      });
      getAgentList();
      formRef.value.formRef[0].resetFields();
      formRef.value.formRef[1].resetFields();
    }
  });
};
</script>

<style lang="scss" scoped>
.table {
  width: 100%;
  height: calc(100vh - 540px);
  min-height: 200px;
}
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
