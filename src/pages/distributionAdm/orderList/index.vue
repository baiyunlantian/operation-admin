<template>
  <div class="financial-system">
    <StatisticsTitle
      title="订单数据"
      :severalRow="false"
      :statisticsInformation="financialInformation"
      @updateParams="handleUpdateParams"
    />

    <div class="operate-container bg-fff">
      <div class="search-container">
        <el-form
          class="search-form"
          ref="formRef"
          :inline="true"
          :model="searchTableParams"
          :rules="rules"
        >
          <div>
            <!-- <el-form-item label="订单ID：" prop="orderId">
              <el-input
                v-model="searchTableParams.orderId"
                placeholder="请输入订单ID"
                clearable
              />
            </el-form-item>
            <el-form-item label="代理名称：" prop="agencyName">
              <el-input
                v-model="searchTableParams.agencyName"
                placeholder="请输入代理名称"
                clearable
              />
            </el-form-item>
            <el-form-item label="销售名称：" prop="salesName">
              <el-input
                v-model="searchTableParams.salesName"
                placeholder="请输入销售名称"
                clearable
              />
            </el-form-item>
            <el-form-item label="客户名称" prop="customName">
              <el-input
                v-model="searchTableParams.customName"
                placeholder="请输入客户名称"
                clearable
              />
            </el-form-item>
            <el-form-item label="创建时间" prop="orderTime">
              <el-select v-model="searchTableParams.orderTime" placeholder="">
                <el-option
                  v-for="item in orderorderTimeOptions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
            </el-form-item> -->

            <el-form-item label="状态:" prop="status">
              <el-select
                v-model="searchTableParams.status"
                placeholder=""
                @change="handleStatusChange()"
              >
                <el-option
                  v-for="item in orderStatusOptions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
            </el-form-item>

            <el-form-item
              label="订单ID/客户名称/代理名称/销售名称："
              prop="keywords"
            >
              <el-input
                v-model="searchTableParams.keywords"
                placeholder="请输入你需要搜索的内容"
                :suffix-icon="Search"
                @keyup.enter="handleStatusChange()"
              />
            </el-form-item>

            <!-- <el-form-item class="">
              <el-button
                type="primary"
                :icon="Search"
                @click="handleSearchTable('search')"
                >搜索</el-button
              >
              <el-button type="primary" @click="handleSearchTable('reset')"
                >重置</el-button
              >
            </el-form-item> -->
          </div>

          <div class="search-form-right">
            <el-form-item prop="pageSize">
              <div class="u-table-header-operate title-box">
                <div class="right-sort">
                  <el-select
                    v-model="searchTableParams.pageSize"
                    class="m-2 u-m-l-10"
                    placeholder="显示条数"
                    @change="handleGetTableList"
                  >
                    <el-option
                      v-for="item in pageSizeOptions"
                      :key="item"
                      :label="`每页显示${item}条`"
                      :value="item"
                    />
                  </el-select>
                </div>
              </div>
            </el-form-item>
          </div>
        </el-form>
      </div>

      <div class="u-table-main u-m-t-10 bg-fff u-flex-col">
        <el-table
          ref="tableRef"
          :data="tableData"
          style="width: 100%"
          @selection-change="handleSelectionChange"
          @sort-change="handleTableSort"
        >
          <el-table-column type="selection" width="35" />
          <el-table-column
            v-for="(item, index) in tableColumnConfig"
            :key="index"
            :prop="item.prop"
            :label="item.label"
            :width="item.width"
            align="center"
            :sortable="item.prop != 'operate'"
          >
            <template #default="{ row }">
              <div v-if="item.insertSlot && item.prop === 'status'">
                <el-button
                  v-if="row.status == 30 || row.status == 31"
                  size="small"
                  type="success"
                  >已完成</el-button
                >
                <el-button v-if="row.status == 0" size="small" type="warning"
                  >未成交</el-button
                >
                <el-button v-if="row.status == 20" size="small" type="info"
                  >实施中</el-button
                >
                <el-button
                  v-if="row.status == 40 || row.status == 41"
                  size="small"
                  type="danger"
                  >已取消</el-button
                >
              </div>

              <div
                class="operate-btn"
                v-if="item.insertSlot && item.prop === 'operate'"
              >
                <el-button type="primary" @click="openEditDialog(row)" link
                  >查看
                </el-button>
                <el-button
                  v-if="row.status == 0"
                  type="primary"
                  @click="editOrderOperate(row)"
                  link
                  >取消
                </el-button>
                <el-button
                  v-if="row.status != 0 || row.status != 30"
                  type="primary"
                  @click="openRemarkDialog(row)"
                  link
                  >备注
                </el-button>
                <el-button
                  v-if="row.status == 20"
                  type="primary"
                  @click="succesOrderOperate(row)"
                  link
                  >完成
                </el-button>
              </div>
            </template>
          </el-table-column>
        </el-table>

        <div class="u-pagination-container">
          <el-pagination
            v-model:current-page="searchTableParams.pageIndex"
            v-model:page-size="searchTableParams.pageSize"
            layout="total, prev, pager, next, jumper"
            :total="tableListTotal"
            background
            @current-change="handleGetTableList"
          />
        </div>
      </div>
    </div>

    <!-- 详情弹窗 -->
    <div class="detailDialog">
      <el-dialog
        title="订单详情"
        v-model="eidtDialogVisible"
        @closed="closeEditDialog"
        :width="1200"
      >
        <template #default>
          <el-form
            ref="formDialogRef"
            :rules="rules"
            :model="formData"
            :validate-on-rule-change="false"
            :label-width="120"
          >
            <el-row>
              <el-col :span="12">
                <el-form-item label="订单ID：" prop="orderId">
                  <el-input
                    v-model="formData.orderId"
                    readonly
                    style="width: 50%"
                  />
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="订单金额：" prop="orderAmount">
                  <el-input
                    v-model="formData.orderAmount"
                    readonly
                    style="width: 50%"
                  />
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="12">
                <el-form-item label="销售名称：" prop="salesName">
                  <el-input
                    v-model="formData.salesName"
                    readonly
                    style="width: 50%"
                  />
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="销售返佣：" prop="salesCommission">
                  <el-input
                    v-model="formData.salesCommission"
                    readonly
                    style="width: 50%"
                  />
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="12">
                <el-form-item label="代理名称：" prop="agencyName">
                  <el-input
                    v-model="formData.agencyName"
                    readonly
                    style="width: 50%"
                  />
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="代理返佣：" prop="agencyCommission">
                  <el-input
                    v-model="formData.agencyCommission"
                    readonly
                    style="width: 50%"
                  />
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="12">
                <el-form-item label="客户名称：" prop="customName">
                  <el-input
                    v-model="formData.customName"
                    readonly
                    style="width: 50%"
                  />
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="订单创建时间：" prop="orderTime">
                  <el-input
                    v-model="formData.orderTime"
                    readonly
                    style="width: 50%"
                  />
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="12">
                <el-form-item label="订单状态：" prop="status">
                  <!-- <el-input
                    v-model="formData.status"
                    readonly
                    style="width: 50%"
                  /> -->
                  <el-select readonly v-model="formData.status">
                    <el-option
                      v-for="item in orderStatusOptions"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value"
                    />
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="订单支付时间：" prop="paymentTime">
                  <el-input
                    v-model="formData.paymentTime"
                    readonly
                    style="width: 50%"
                  />
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="12">
                <el-form-item label="付款ID：" prop="orderCode">
                  <el-input
                    v-model="formData.orderCode"
                    readonly
                    style="width: 50%"
                  />
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="订单实施时间：" prop="carryTime">
                  <el-input
                    v-model="formData.carryTime"
                    readonly
                    style="width: 50%"
                  />
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col>
                <el-form-item label="备注：" prop="remark">
                  <el-input
                    v-model="formData.remark"
                    readonly
                    style="width: 80%"
                    :rows="4"
                    type="textarea"
                  />
                </el-form-item>
              </el-col>
            </el-row>

            <!-- 订单明细 -->
            <el-table
              border
              :data="formData.totalOrderDetail.orderDetails"
              style="width: 100%; margin-top: 20px"
              :summary-method="getSummaries"
              show-summary
            >
              <template
                v-for="(item, index) in tableDetailColumnConfig"
                :key="index"
              >
                <el-table-column
                  :prop="item.prop"
                  :label="item.label"
                  align="center"
                />
              </template>
            </el-table>
          </el-form>
        </template>
      </el-dialog>
    </div>

    <!-- 备注弹窗 -->
    <el-dialog
      title="修改备注"
      v-model="eidtRemarkDialogVisible"
      @closed="closeRemarkEditDialog"
      :width="800"
    >
      <template #default>
        <el-form
          ref="formRemarKDialogRef"
          :rules="rules"
          :model="formRemarKData"
          :validate-on-rule-change="false"
          :label-width="120"
        >
          <el-row>
            <el-col>
              <el-form-item label="备注：" prop="remark">
                <el-input
                  v-model="formRemarKData.remark"
                  style="width: 80%"
                  :rows="4"
                  type="textarea"
                />
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
      </template>

      <template #footer>
        <span class="dialog-footer">
          <el-button @click="eidtRemarkDialogVisible = false">取消</el-button>
          <el-button type="primary" @click="submitRemarKEditForm">
            确认
          </el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, reactive, getCurrentInstance, computed, onMounted } from "vue";
import StatisticsTitle from "../components/statisticsTitle.vue";
import barChart from "@/assets/images/bar_chart.png";
import heartbeat from "@/assets/images/heartbeat.svg";
import file from "@/assets/images/file.png";
import {
  getOrderData,
  getOrderPage,
  editOrderCancel,
  editOrderCarry,
  getOrderDetails,
  getRemark,
} from "./api";
import { useStore } from "vuex";
import dayjs from "dayjs";
import utils from "@/assets/js/utils.js";
import { Search } from "@element-plus/icons-vue";

const { proxy } = getCurrentInstance();
const store = useStore();

const userIdentity = computed(() => {
  return store.getters["user/info"].isAdmin;
});

// 订单数据汇总
const financialInformation = ref([
  {
    id: 1,
    title: "订单总量",
    money: 0,
    isMoney: false,
    image: file,
    imageStyle: "width: 56px; height: 56px",
    isShow: true,
    propMoney: "totalOrderCount",
  },
  {
    id: 2,
    title: "取消订单",
    money: 0,
    isMoney: false,
    image: file,
    imageStyle: "width: 56px; height: 56px",
    isShow: true,
    propMoney: "cacanOrderCount",
  },
  {
    id: 3,
    title: "成交金额",
    money: 0,
    isMoney: true,
    image: barChart,
    imageStyle: "width: 104px; height: 42px",
    isShow: true,
    propMoney: "concludeAmount",
  },
  {
    id: 4,
    title: "平均单价",
    money: 0,
    isMoney: true,
    image: heartbeat,
    imageStyle: "width: 96px; height: 40px",
    isShow: true,
    propMoney: "averageAmount",
  },
  {
    id: 5,
    title: "返佣金额",
    money: 0,
    isMoney: true,
    image: barChart,
    imageStyle: "width: 104px; height: 42px",
    isShow: true,
    propMoney: "commissionAmount",
  },
]);

const searchParams = ref({
  startTime: utils.getNextDate(-7) + " " + "00:00:00",
  endTime: dayjs().subtract(1, "day").format("YYYY-MM-DD") + " " + "23:59:59",
});
// 订单数据汇总接口
const getOrderInformation = () => {
  getOrderData(searchParams.value).then((res) => {
    const { code, data, msg } = res || {};
    if (code == 0) {
      financialInformation.value.forEach((item) => {
        item.money = data[item.propMoney] || 0;
      });
    } else {
      proxy.$message({
        type: "error",
        message: msg,
      });
    }
  });
};

const handleUpdateParams = (params) => {
  searchParams.value = params;
  getOrderInformation();
};

// 表格
// 下拉框选项
const orderStatusOptions = ref([
  { label: "全部", value: null },
  { label: "未成交", value: 0 },
  { label: "实施中", value: 20 },
  { label: "已完成", value: 30 },
  { label: "已取消", value: 40 },
]);
// 搜索
let searchTableParams = reactive({
  pageSize: 50,
  pageIndex: 1,
  status: undefined,
  sortField: undefined,
  ascending: undefined,
});

const formRef = ref(null);
const tableRef = ref();
const pageSizeOptions = ref([50, 100, 200]);
const tableListTotal = ref(0);
const tableData = ref([{}]);
const tableColumnConfig = ref([
  { label: "订单ID", prop: "orderId" },
  { label: "客户名称", prop: "customName" },
  { label: "代理名称", prop: "agencyName" },
  { label: "销售名称", prop: "salesName" },
  { label: "状态", prop: "status", insertSlot: "status" },
  { label: "订单金额", prop: "orderAmount" },
  { label: "销售返佣", prop: "salesCommission" },
  { label: "代理返佣", prop: "agencyCommission" },
  { label: "创建时间", prop: "orderTime" },
  { label: "付款时间", prop: "paymentTime" },
  { label: "操作", prop: "operate", insertSlot: "operate" },
]);

// 列表接口
const handleGetTableList = (setScrollTop = true) => {
  return new Promise((resolve, reject) => {
    getOrderPage(searchTableParams).then((res) => {
      const { code, msg, data } = res || {};
      if (code == 0) {
        setScrollTop && tableRef.value.setScrollTop(0);
        tableData.value = data.list;
        tableListTotal.value = data.total;
        return resolve(res);
      } else {
        proxy.$message({
          type: "error",
          message: msg,
        });
      }
    });
  });
};

// 搜索重置
// const handleSearchTable = (type) => {
//   if (type === "search") {
//     formRef.value.validate((valid) => {
//       if (valid) {
//         searchTableParams.pageIndex = 1;
//         handleGetTableList().then((res) => {
//           proxy.$message({
//             type: "success",
//             message: "查询成功",
//           });
//         });
//       }
//     });
//   } else if (type === "reset") {
//     for (let key in searchTableParams) {
//       searchTableParams[key] = undefined;
//       searchTableParams.pageSize = 50;
//       searchTableParams.pageIndex = 1;
//     }
//     handleGetTableList().then((res) => {
//       proxy.$message({
//         type: "success",
//         message: "重置成功",
//       });
//     });
//     formRef.value.clearValidate();
//   }
// };

// 下拉触发搜索
const handleStatusChange = () => {
  handleGetTableList().then((res) => {
    proxy.$message({
      type: "success",
      message: "查询成功",
    });
  });
};

// 取消操作
const editOrderOperate = (row) => {
  proxy
    .$confirm("确认取消吗?", {
      confirmButtonText: "确认",
      cancelButtonText: "取消",
      type: "warning",
    })
    .then(() => {
      editOrderCancel({ orderId: row.orderId }).then((res) => {
        const { code, msg } = res || {};
        if (code == 0) {
          proxy.$message({
            type: "success",
            message: "操作成功",
          });
          handleGetTableList(false);
        } else {
          proxy.$message({
            type: "error",
            message: msg,
          });
        }
      });
    })
    .catch(() => {});
};

// 完成操作
const succesOrderOperate = (row) => {
  proxy
    .$confirm("确认完成吗?", {
      confirmButtonText: "确认",
      cancelButtonText: "取消",
      type: "warning",
    })
    .then(() => {
      editOrderCarry({ orderId: row.orderId }).then((res) => {
        const { code, msg } = res || {};
        if (code == 0) {
          proxy.$message({
            type: "success",
            message: "操作成功",
          });
          handleGetTableList(false);
        } else {
          proxy.$message({
            type: "error",
            message: msg,
          });
        }
      });
    })
    .catch(() => {});
};

// 排序
const handleTableSort = (column, prop, order) => {
  console.log(column, prop, order);
  searchTableParams.sortField = column.prop;
  if (column.order == "ascending") {
    searchTableParams.ascending = "asc";
  } else if (column.order == "descending") {
    searchTableParams.ascending = "desc";
  }
  handleGetTableList();
};

// 查看详情 弹窗
const currentDialogId = ref();
const eidtDialogVisible = ref(false);

// 订单明细
const tableDetailColumnConfig = ref([
  { label: "下单商品", prop: "productName" },
  { label: "数量", prop: "count" },
  { label: "版本", prop: "versionsName" },
  { label: "售卖单价（元）", prop: "price" },
  { label: "总价（MYR）", prop: "totalPrice" },
]);

const formData = ref({
  orderId: "",
  orderAmount: "",
  salesName: "",
  salesCommission: "",
  agencyName: "",
  agencyCommission: "",
  customName: "",
  orderTime: "",
  status: "",
  paymentTime: "",
  orderCode: "",
  carryTime: "",
  remark: "",
  totalOrderDetail: {
    totalCount: "",
    totalPrice: "",
    orderDetails: [],
  },
});

const openEditDialog = (row) => {
  eidtDialogVisible.value = true;
  currentDialogId.value = row.orderId;
  console.log(row);
  handleGetOrderDetails(row.orderId);
};

const closeEditDialog = () => {
  eidtDialogVisible.value = false;
};

// 查看详情接口
const handleGetOrderDetails = (orderId) => {
  getOrderDetails({ orderId }).then((res) => {
    const { code, data, msg } = res || {};
    if (code == 0) {
      formData.value = data;
      console.log(formData.value);
    } else {
      proxy.$message({
        type: "error",
        message: msg,
      });
    }
  });
};

// 合计
const getSummaries = (param) => {
  const { columns, data } = param;
  const sums = [];
  columns.forEach((column, index) => {
    if (index === 0) {
      sums[index] = "合计";
      return;
    }
    const values = data.map((item) => Number(item[column.property]));
    if (!values.every((value) => Number.isNaN(value))) {
      sums[1] = `${values.reduce((prev, curr) => {
        const value = Number(curr);
        if (!Number.isNaN(value)) {
          return prev + curr;
        } else {
          return prev;
        }
      }, 0)}`;

      sums[4] = `共计: ${values.reduce((prev, curr) => {
        const value = Number(curr);
        if (!Number.isNaN(value)) {
          return prev + curr;
        } else {
          return prev;
        }
      }, 0)}元`;
    } else {
      sums[index] = "";
    }
  });

  return sums;
};

// 备注弹窗
const formRemarKDialogRef = ref();
const formRemarKData = reactive({
  orderId: "",
  remark: "",
});

const eidtRemarkDialogVisible = ref(false);
const openRemarkDialog = (row) => {
  eidtRemarkDialogVisible.value = true;
  formRemarKData.orderId = row.orderId;
  formRemarKData.remark = row.remark;
};

const closeRemarkEditDialog = () => {
  eidtRemarkDialogVisible.value = false;
};

// 提交备注信息
const submitRemarKEditForm = () => {
  formRemarKDialogRef.value.validate((valid) => {
    if (valid) {
      getRemark({ ...formRemarKData }).then((res) => {
        const { code, msg } = res || {};
        if (code == 0) {
          proxy.$message({
            type: "success",
            message: "备注修改成功",
          });
          eidtRemarkDialogVisible.value = false;
          handleGetTableList(false);
        } else {
          proxy.$message({
            type: "error",
            message: msg,
          });
        }
      });
    }
  });
};

onMounted(() => {
  getOrderInformation();
  handleGetTableList();
});
</script>

<style lang="scss" scoped>
.financial-system {
  .search-form {
    display: flex;
    align-items: flex-end;
    justify-content: space-between;

    .search-form-right {
      height: 100%;
      display: flex;
      align-items: flex-end;
      .asterisk-left {
        margin-right: 0;
        margin-bottom: 8px;
      }
      .title-box {
        padding: 10px 0;
      }
    }
  }
  .operate-container {
    padding: 34px 58px;
    box-shadow: 0px 2px 3px 0px rgba(0, 0, 0, 0.1);

    :deep(.el-table__cell) {
      background-color: #fff !important;
      color: rgba(0, 0, 0, 0.4) !important;
    }

    .operate-btn {
      display: flex;
      justify-content: center;
      align-items: center;

      .el-dropdown {
        margin-right: 20px;
      }
    }
  }

  .detailDialog {
    :deep(.el-form-item__label) {
      font-weight: 700 !important;
    }
  }
}
</style>
