<template>
  <div class="financial-system">
    <StatisticsTitle
      title="财务数据"
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
            <el-form-item label="审核状态：" prop="status">
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

            <!-- <el-form-item label="提现备注：" prop="notes">
              <el-select v-model="searchTableParams.notes" placeholder="">
                <el-option
                  v-for="item in orderNotesOptions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
            </el-form-item> -->

            <el-form-item label="代理名称/手机号：" prop="keywords">
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
          height="630"
        >
          <el-table-column type="selection" width="55" />
          <el-table-column
            v-for="(item, index) in tableColumnConfig"
            :key="index"
            :prop="item.prop"
            :label="item.label"
            :width="item.width"
            align="center"
            :sortable="item.prop != 'operate'"
          >
            <template #default="{ row, column, $index }">
              <div v-if="item.insertSlot && item.prop === 'status'">
                <el-tag v-if="row.status == 20" size="small" type="success"
                  >已打款</el-tag
                >
                <el-tag v-if="row.status == 10" size="small" type="warning"
                  >打款中</el-tag
                >
                <el-tag v-if="row.status == 0" size="small" type="info"
                  >待审核</el-tag
                >
                <el-tag v-if="row.status == 30" size="small" type="danger"
                  >已拒绝</el-tag
                >
              </div>

              <div
                class="operate-btn"
                v-if="item.insertSlot && item.prop === 'operate'"
              >
                <el-dropdown v-if="row.status == 0">
                  <el-button type="primary" link>审核 </el-button>
                  <template #dropdown>
                    <el-dropdown-menu>
                      <el-dropdown-item>
                        <el-button link @click="checkDispose(row, 10)">
                          同意
                        </el-button>
                      </el-dropdown-item>
                      <el-dropdown-item>
                        <el-button link @click="checkDispose(row, 30)">
                          拒绝
                        </el-button>
                      </el-dropdown-item>
                    </el-dropdown-menu>
                  </template>
                </el-dropdown>
                <el-button type="primary" @click="openEditDialog(row)" link
                  >详情
                </el-button>
                <el-button
                  v-if="row.status == 10"
                  type="primary"
                  @click="checkDispose(row, 20)"
                  link
                  >打款
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

    <!-- 弹窗 -->
    <el-dialog
      v-model="eidtDialogVisible"
      @closed="closeEditDialog"
      :width="1500"
    >
      <div class="search-container">
        <el-form
          class="search-form"
          ref="formDialogRef"
          :inline="true"
          :model="searchDialogTableParams"
          :rules="rules"
        >
          <div>
            <el-form-item label="代理名称/手机号：" prop="keyWords">
              <el-input
                v-model="searchDialogTableParams.keyWords"
                placeholder="请输入你需要搜索的内容"
                :suffix-icon="Search"
                @keyup.enter="handleDialogStatusChange()"
              />
            </el-form-item>

            <!-- <el-form-item class="">
              <el-button
                type="primary"
                :icon="Search"
                @click="handleDialogSearchTable('search')"
                >搜索</el-button
              >
              <el-button
                type="primary"
                @click="handleDialogSearchTable('reset')"
                >重置</el-button
              >
            </el-form-item> -->
          </div>

          <div class="search-form-right">
            <el-form-item prop="pageSize">
              <div class="u-table-header-operate title-box">
                <div class="right-sort">
                  <el-select
                    v-model="searchDialogTableParams.pageSize"
                    class="m-2 u-m-l-10"
                    placeholder="显示条数"
                    @change="handleGetDialogTableList"
                  >
                    <el-option
                      v-for="item in pageDialogSizeOptions"
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
          ref="tableDialogRef"
          class="u-table-container"
          :data="tableDialogData"
          style="width: 100%"
          @selection-change="handleSelectionChange"
        >
          <el-table-column
            v-for="(item, index) in tableDialogColumnConfig"
            :key="index"
            :prop="item.prop"
            :label="item.label"
            :width="item.width"
            align="center"
          >
            <template #default="{ row, column, $index }">
              <div v-if="item.insertSlot && item.prop === 'operate'">
                <el-button type="danger" link @click="deleteOrder(row)"
                  >删除
                </el-button>
              </div>
            </template>
          </el-table-column>
        </el-table>

        <div class="u-pagination-container">
          <el-pagination
            v-model:current-page="searchDialogTableParams.pageIndex"
            v-model:page-size="searchDialogTableParams.pageSize"
            layout="total, prev, pager, next, jumper"
            :total="tableDialogListTotal"
            background
            @current-change="handleGetDialogTableList"
          />
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, reactive, getCurrentInstance, computed, onMounted } from "vue";
import StatisticsTitle from "../components/statisticsTitle.vue";
import userCount from "@/assets/images/user_count.png";
import barChart from "@/assets/images/bar_chart.png";
import {
  getFinanceData,
  getFinanceDataPageList,
  getFinanceOrderDataPageList,
  getFinanceOrderAudit,
  getFinanceOrderDelete,
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

const financialInformation = ref([
  {
    id: 1,
    title: "待审提现单",
    money: 0,
    desc: "提现总额",
    isDescMoney: true,
    descNum: 0,
    image: userCount,
    imageStyle: "width: 56px; height: 56px",
    isShow: [1, 10, 20],
    propMoney: "waitVerifyWithdrawOrderCount",
    propDescNum: "waitVerifyWithdrawOrderAmount",
  },
  {
    id: 2,
    title: "等待打款现单",
    money: 0,
    desc: "等待打款总额",
    isDescMoney: true,
    descNum: 0,
    image: barChart,
    imageStyle: "width: 104px; height: 42px",
    isShow: [1, 10, 20],
    propMoney: "waitPaymentWithdrawOrderCount",
    propDescNum: "waitPaymentWithdrawOrderAmount",
  },
  {
    id: 3,
    title: "已打款提现单",
    money: 0,
    desc: "已打款总额",
    isDescMoney: true,
    descNum: 0,
    image: barChart,
    imageStyle: "width: 104px; height: 42px",
    isShow: [1, 10, 20],
    propMoney: "paidWithdrawOrderCount",
    propDescNum: "paidWithdrawOrderAmount",
  },
  {
    id: 4,
    title: "已拒提现单",
    money: 0,
    desc: "拒绝提现总额",
    isDescMoney: true,
    descNum: 0,
    image: barChart,
    imageStyle: "width: 104px; height: 42px",
    isShow: [1, 10, 20],
    propMoney: "rejectedWithdrawOrderCount",
    propDescNum: "rejectedWithdrawOrderAmount",
  },
]);

// 财务数据汇总
const searchParams = ref({
  startTime: utils.getNextDate(-7) + " " + "00:00:00",
  endTime: dayjs().subtract(1, "day").format("YYYY-MM-DD") + " " + "23:59:59",
});
// 财务数据汇总接口
const getFinanceInformation = () => {
  getFinanceData(searchParams.value).then((res) => {
    const { code, data, msg } = res || {};
    if (code == 0) {
      financialInformation.value.forEach((item) => {
        item.money = data[item.propMoney] || 0;
        if (item.descNum != null) {
          item.descNum = data[item.propDescNum] || 0;
        }
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
  getFinanceInformation();
};

// 表格
// 下拉框选项
const orderStatusOptions = ref([
  { label: "已打款", value: 20 },
  { label: "打款中", value: 10 },
  { label: "待审核", value: 0 },
  { label: "已拒绝", value: 30 },
]);

// const orderNotesOptions = ref([
//   { label: "有备注", value: 0 },
//   { label: "无备注", value: 1 },
// ]);
// 搜索
let searchTableParams = reactive({
  pageSize: 50,
  pageIndex: 1,
  status: undefined,
  keywords: undefined,
  sortField: undefined,
  ascending: undefined,
});

const formRef = ref(null);
const tableRef = ref();
const pageSizeOptions = ref([50, 100, 200]);
const tableListTotal = ref(0);
const tableData = ref([{}]);
const tableColumnConfig = ref([
  { label: "提现代理名称", prop: "agentName" },
  { label: "手机号码", prop: "phone" },
  { label: "提现单号", prop: "withdrawId" },
  { label: "提现金额（元）", prop: "withdrawAmount" },
  { label: "审核状态", prop: "status", insertSlot: "isCheck" },
  { label: "提现订单量", prop: "withdrawOrderCount" },
  { label: "提现时间", prop: "withdrawDatetime" },
  { label: "操作", prop: "operate", insertSlot: "operate" },
]);

// 列表接口
const handleGetTableList = (setScrollTop = true) => {
  return new Promise((resolve, reject) => {
    getFinanceDataPageList(searchTableParams).then((res) => {
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

// 下拉搜索触发搜索
const handleStatusChange = () => {
  handleGetTableList().then((res) => {
    proxy.$message({
      type: "success",
      message: "查询成功",
    });
  });
};

// 审核
const checkDispose = (row, status) => {
  return new Promise((resolve, reject) => {
    proxy
      .$confirm(
        `确认${status == 10 ? "同意" : status == 30 ? "拒绝" : "打款"}吗?`,
        {
          confirmButtonText: "确认",
          cancelButtonText: "取消",
          type: "warning",
        }
      )
      .then(() => {
        getFinanceOrderAudit({ withdrawId: row.withdrawId, status }).then(
          (res) => {
            const { code, msg } = res || {};
            if (code == 0) {
              proxy.$message({
                type: "success",
                message: "审核状态修改成功",
              });
              handleGetTableList(false);
              return resolve(true);
            } else {
              proxy.$message({
                type: "error",
                message: msg,
              });
              return reject(false);
            }
          }
        );
      })
      .catch(() => {});
  });
};

// 排序
const handleTableSort = (column, prop, order) => {
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
let searchDialogTableParams = reactive({
  pageSize: 50,
  pageIndex: 1,
  keyWords: undefined,
});
const formDialogRef = ref(null);
const tableDialogRef = ref();
const tableDialogData = ref([]);
const tableDialogListTotal = ref(0);
const pageDialogSizeOptions = ref([50, 100, 200]);
const tableDialogColumnConfig = ref([
  { label: "订单号", prop: "orderId" },
  { label: "付款编号", prop: "paymentCode" },
  { label: "客户名称", prop: "customName" },
  { label: "订单金额", prop: "orderAmount" },
  { label: "结算佣金", prop: "orderCommission" },
  { label: "操作", prop: "operate", insertSlot: "operate" },
]);

const openEditDialog = (row) => {
  eidtDialogVisible.value = true;
  currentDialogId.value = row.withdrawId;
  handleGetDialogTableList(row.withdrawId);
};

const closeEditDialog = () => {
  eidtDialogVisible.value = false;
};

// 弹框接口
const handleGetDialogTableList = (withdrawId) => {
  return new Promise((resolve, reject) => {
    getFinanceOrderDataPageList({
      ...searchDialogTableParams,
      withdrawId,
    }).then((res) => {
      const { code, msg, data } = res || {};
      if (code == 0) {
        tableDialogData.value = data.list;
        tableDialogListTotal.value = data.total;
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

// 弹窗搜索重置
// const handleDialogSearchTable = (type) => {
//   if (type === "search") {
//     formDialogRef.value.validate((valid) => {
//       if (valid) {
//         searchDialogTableParams.pageIndex = 1;
//         handleGetDialogTableList(currentDialogId.value);
//       }
//     });
//   } else if (type === "reset") {
//     searchDialogTableParams.pageSize = 50;
//     searchDialogTableParams.pageIndex = 1;
//     searchDialogTableParams.keyWords = undefined;
//     handleGetDialogTableList(currentDialogId.value);
//     formDialogRef.value.clearValidate();
//   }
// };

const handleDialogStatusChange = () => {
  handleGetDialogTableList().then((res) => {
    proxy.$message({
      type: "success",
      message: "查询成功",
    });
  });
};

// 删除
const deleteOrder = (row) => {
  proxy
    .$confirm("确认删除吗?", {
      confirmButtonText: "确认",
      cancelButtonText: "取消",
      type: "warning",
    })
    .then(() => {
      getFinanceOrderDelete({ orderId: row.orderId }).then((res) => {
        const { code, msg } = res;
        if (code == 0) {
          proxy.$message({
            type: "success",
            message: "删除成功",
          });
          handleGetDialogTableList(currentDialogId.value);
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

onMounted(() => {
  getFinanceInformation();
  handleGetTableList();
});
</script>

<style lang="scss" scoped>
.financial-system {
  padding-bottom: 10px;
  display: flex;
  flex-direction: column;
  height: 100%;
  box-sizing: border-box;
  .search-form {
    display: flex;
    align-items: center;
    justify-content: space-between;

    .search-form-right {
      .asterisk-left {
        margin-right: 0;
      }
      .title-box {
        padding: 10px 0;
      }
    }
  }
  .operate-container {
    flex: 1;
    padding: 34px 58px;
    box-shadow: 0px 2px 3px 0px rgba(0, 0, 0, 0.1);

    :deep(.el-table__cell) {
      background-color: #fff !important;
      font-weight: 500;
    }

    .header-container {
      display: flex;
      align-items: center;
      justify-content: center;

      .header-title {
        margin-right: 5px;
      }

      .icon-arrow {
        display: flex;
        flex-direction: column;
        justify-content: center;
      }
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
}
</style>
