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
            :total="salesDataLength"
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
        @sort-change="handleTableSort"
        v-loading="dataLoading"
      >
        <template #status="{ row }">
          <div class="status-container">
            <el-tag type="success" v-if="row.status == 1">{{
              row.statusName
            }}</el-tag>
            <el-tag type="danger" v-else-if="row.status == 2">{{
              row.statusName
            }}</el-tag>
            <el-tag type="info" v-else-if="row.status == 3">{{
              row.statusName
            }}</el-tag>
          </div>
        </template>
        <template #operate="{ row }">
          <div class="operate-container">
            <template v-for="operate in row.operate" :key="operate.func">
              <el-link
                v-if="
                  operate.isShow.includes(row.status) && operate.isPermission
                "
                type="primary"
                @click="operate.clickEvent(row.salesId, row.salesName)"
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
          :total="salesDataLength"
        />
        <el-pagination
          background
          small
          layout="prev, pager, next"
          :total="salesDataLength"
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
      @cancelCreate="cancelCreate"
      :rules="rules"
    ></form-dialog>

    <!-- 详情弹框 -->
    <edit-dialog
      :dialogOpt="dialogDetaiOpt"
      :form="salesFormData"
      :formArr="formArr"
      :show-close="false"
      :msgType="msgType"
      @changeMsgType="changeMsgType"
      @cancelEdit="cancelEdit"
    >
      <template #header>
        <div class="header-edit">
          <el-button link @click="editMsg"
            ><el-icon><EditPen color="#999" /></el-icon
          ></el-button>
        </div>
      </template>
    </edit-dialog>
  </div>
</template>

<script setup>
import { InfoFilled } from "@element-plus/icons-vue";
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

// 解密和编码
import Crypto from "@/assets/js/cryptojs";

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
  getSalesList();
});

// 卡片的数值
const amount = ref({});
// 获取代理数据
const getSalesData = () => {
  const params = {
    startTime: selectedDate.startDate,
    endTime: selectedDate.endDate,
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
    name: "completeOrderSaleCount",
    amount: amount.value.completeOrderSaleCount,
    url: require("@/assets/images/user_count.png"),
    total: {
      totalTitle: "销售总量",
      totalName: "saleTotal",
      totalAmount: amount.value.saleTotal,
    },
  },
  {
    title: "成交金额",
    name: "orderTotalAmount",
    amount: amount.value.orderTotalAmount,
    url: require("@/assets/images/bar_chart.png"),
  },
  {
    title: "平均价",
    name: "orderAvgAmount",
    amount: amount.value.orderAvgAmount,
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
    sortField: sortField.value,
    keyWords: keyword.value,
    ascending: ascending.value,
    pageIndex: pageIndex.value,
    pageSize: pageSize.value,
  });
};

// 搜索
const keyword = ref();
const search = (val, e) => {
  getSalesList({
    sortField: sortField.value,
    keyWords: keyword.value,
    ascending: ascending.value,
    pageIndex: pageIndex.value,
    pageSize: pageSize.value,
  });
};

const ascending = ref("DESC");
const sortField = ref("OrderCount");

const handleTableSort = (e) => {
  // console.log(e);
  ascending.value = e.order == "ascending" ? "ASC" : "DESC";
  sortField.value = e.prop;
  getSalesList({
    sortField: sortField.value,
    keyWords: keyword.value,
    ascending: ascending.value,
    pageIndex: pageIndex.value,
    pageSize: pageSize.value,
  });
};

// 页码
const pageIndex = ref(1);
const currentChange = (val) => {
  getSalesList({
    sortField: sortField.value,
    keyWords: keyword.value,
    ascending: ascending.value,
    pageIndex: pageIndex.value,
    pageSize: pageSize.value,
  });
};

// 获取代理列表
const salesDataRow = ref();
const salesDataLength = ref();
const dataLoading = ref(false);
const getSalesList = () => {
  dataLoading.value = true;
  const params = {
    sortField: sortField.value || "OrderCount",
    keyWords: keyword.value,
    ascending: ascending.value || "DESC",
    pageIndex: pageIndex.value || 1,
    pageSize: pageSize.value || 50,
  };
  API.getSalesList(params).then((res) => {
    console.log(res.data);
    dataLoading.value = false;
    salesDataRow.value = res.data.list;
    salesDataLength.value = res.data.total;
    salesDataRow.value.forEach((val) => {
      val.operate = operate;
    });
    // console.log('-------------',salesDataRow.value);
    // salesDataRow.value = res.data;
  });
};

// 代理数据的表头
const salesDataHead = [
  {
    prop: "salesName",
    label: "销售名称",
    width: "120",
    header: true,
    sortable: true,
    isPermission: true,
  },
  {
    prop: "phone",
    label: "手机号码",
    width: "110",
    header: true,
    sortable: true,
    isPermission: true,
  },
  {
    prop: "orderCount",
    label: "订单数量",
    width: "110",
    header: true,
    sortable: true,
    isPermission: true,
  },
  {
    prop: "orderAmount",
    label: "订单金额（元）",
    width: "200",
    header: true,
    sortable: true,
    isPermission: true,
  },
  {
    prop: "stayCommission",
    label: "待结佣金金额（元）",
    width: "200",
    header: true,
    sortable: true,
    isPermission: true,
  },
  {
    prop: "withdrawCommission",
    label: "已结佣金金额（元）",
    width: "200",
    header: true,
    sortable: true,
    isPermission: true,
  },
  {
    prop: "customCount",
    label: "客户数量",
    width: "120",
    header: true,
    sortable: true,
    isPermission: true,
  },
  {
    prop: "status",
    label: "销售状态",
    width: "180",
    slot: true,
    header: true,
    sortable: true,
    isPermission: true,
  },
  {
    prop: "lastPaymentTime",
    label: "最后成交时间",
    width: "200",
    header: true,
    sortable: true,
    isPermission: true,
  },
  {
    prop: "lastCommissionTime",
    label: "最后结佣时间",
    width: "180",
    header: true,
    sortable: true,
    isPermission: true,
  },

  {
    prop: "operate",
    label: "操作",
    width: "180",
    slot: true,
    placement: "right",
    isPermission: true,
  },
];

// 操作方式
import { ElMessageBox, ElMessage } from "element-plus";
// 状态变化  0 展示  1 状态正常时展示  2 状态封禁时展示  3 状态不为离职时展示
const operate = reactive([
  {
    func: "详情",
    isShow: "1,0,3",
    isPermission: true,
    clickEvent: (id, name) => {
      console.log(id);
      dialogDetaiOpt.dialogVisible = true;
      getSalesInfo(id);
    },
  },
  {
    func: "封禁",
    isShow: "1",
    isPermission: true,
    clickEvent: (id, name) => {
      console.log(id);
      ElMessageBox.confirm(`是否确定给 ${name} 销售ID ${id} 办理封禁`, "提示", {
        confirmButtonText: "确认",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          const params = {
            userId: id,
            status: 0, //0 禁用
          };
          API.disabledSales(params).then((res) => {
            if (res.code === 0) {
              getSalesList();
              ElMessage({
                type: "success",
                message: "操作成功",
              });
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
    func: "恢复",
    isShow: "0",
    isPermission: true,
    clickEvent: (id, name) => {
      console.log(id);
      ElMessageBox.confirm(`是否确定给 ${name} 销售ID ${id} 办理恢复`, "提示", {
        confirmButtonText: "确认",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          const params = {
            userId: id,
            status: 1, //0 禁用 1 启用
          };
          API.disabledSales(params).then((res) => {
            if (res.code === 0) {
              getSalesList();
              ElMessage({
                type: "success",
                message: "操作成功",
              });
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
    func: "离职",
    isShow: "1,0",
    isPermission: true,
    clickEvent: (id, name) => {
      console.log(id);
      ElMessageBox.confirm(`是否确定给 ${name} 销售ID ${id} 办理恢复`, "提示", {
        confirmButtonText: "确认",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          const params = {
            userId: id,
          };
          API.dimissionSales(params).then((res) => {
            if (res.code === 0) {
              getSalesList();
              ElMessage({
                type: "success",
                message: "操作成功",
              });
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
    func: "结算佣金",
    isShow: "1,0,3",
    isPermission: true,
    clickEvent: (id, name) => {
      const params = {
        userId: id,
      };
      API.clearingCommission(params).then((res) => {
        if (res.code === 0) {
          getSalesList();
          ElMessage({
            type: "success",
            message: "操作成功",
          });
        }
      });
    },
  },
]);

// -------------------------新增代理
// 弹框组件
import FormDialog from "@/components/Dialog/FormDialog.vue";

const rules = reactive({
  userName: [
    {
      required: true,
      message: "销售名称不能为空!",
      trigger: "blur",
    },
  ],
  account: [
    {
      required: true,
      message: "销售账号不能为空!",
      trigger: "blur",
    },
    {
      pattern: /^[0-9A-Za-z]{4,16}$/,
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
  weChat: [
    {
      required: true,
      message: "微信号不能为空!",
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
});
const dialogOpt = reactive({
  dialogVisible: false,
  title: "创建销售",
  width: "80vw",
});
const addAgent = () => {
  dialogOpt.dialogVisible = true;
  API.generatePassword().then((res) => {
    console.log(res.data);
    salesData.password = res.data;
  });
};

const formTitles = [
  { title: "基本信息", name: "baseForm", col: 12, flexDirection: "column" },
  { title: "其他信息", name: "otherForm", flexDirection: "column" },
];

//表单上传数据
const salesData = reactive({
  account: "",
  userName: "",
  phone: "",
  weChat: "",
  email: "" + "@maliyaka.com",
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
      name: "account",
      type: "input",
      placeholder: "请输入销售账号",
      isRequired: true,
    },
    {
      title: "账号密码",
      name: "password",
      type: "text",
      placeholder: "请输入账号密码",
    },
    {
      title: "职位",
      name: "roleName",
      type: "text",
      placeholder: "请输入职位",
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
  // console.log(data);
  const params = {
    ...data,
    password: Crypto.encrypt(data.password),
    email: data.email,
  };
  API.createSaler(params).then((res) => {
    console.log(res);
    if (res.code == 0) {
      salesData.account = "";
      salesData.userName = "";
      salesData.phone = "";
      salesData.weChat = "";
      salesData.email = "";
      salesData.notes = "";
      salesData.password = "";
      getSalesList();
      dialogOpt.dialogVisible = false;
    } else {
      dialogOpt.dialogVisible = true;
    }
  });
};

const cancelCreate = () => {
  salesData.account = "";
  salesData.userName = "";
  salesData.phone = "";
  salesData.weChat = "";
  salesData.email = "" + "@maliyaka.com";
  salesData.notes = "";
  salesData.password = "";
  dialogOpt.dialogVisible = false;
};

// -------------------销售信息

// 销售信息组件
import EditDialog from "@/components/Dialog/EditDialog.vue";
//  :dialogOpt="dialogDetaiOpt"
// :form="salesFormData"
// :formArr="formArr"

const dialogDetaiOpt = reactive({
  dialogVisible: false,
  title: "销售信息",
  width: "60vw",
  col: 6,
});

const formArr = ref([
  { title: "手机", name: "phone", isChange: true },
  { title: "微信", name: "weChat", isChange: true },
  { title: "办公邮箱", name: "email", isChange: true },
  { title: "入职时间", name: "entryTime", isChange: false },
  { title: "管理主体", name: "companyName", isChange: false },
  { title: "直属上级", name: "superiorsEmail", isChange: false },
  { title: "职位", name: "roleName", isChange: false },
  { title: "离职时间", name: "dimissionTime", isChange: false },
]);
const salesFormData = ref();

const getSalesInfo = (id) => {
  const params = {
    userId: id,
  };
  API.getSalesInfo(params).then((res) => {
    console.log(res.data);
    salesFormData.value = res.data;
  });
};

// 编辑个人信息
const msgType = ref("text");
const editMsg = () => {
  msgType.value = "input";
};

const changeMsgType = (val) => {
  msgType.value = val.msgType;
  editSalesInfo(val);
  console.log(val);
};

const cancelEdit = (val) => {
  msgType.value = "text";
};

const editSalesInfo = (msg) => {
  console.log(msg);
  const params = {
    phone: msg.editParams.phone,
    weChat: msg.editParams.weChat,
    email: msg.editParams.email,
  };
  API.editSalesInfo(params).then((res) => {
    console.log(res);
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

.header-edit {
  position: absolute;
  padding: 20px;
  right: 0px;
  top: 0px;
}
</style>
