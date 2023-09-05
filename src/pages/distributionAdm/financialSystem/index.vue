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
            <el-form-item label="审核状态：" prop="orderStatus">
              <el-select v-model="searchTableParams.orderStatus" placeholder="">
                <el-option
                  v-for="item in orderStatusOptions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
            </el-form-item>

            <el-form-item label="提现备注：" prop="orderStatus">
              <el-select v-model="searchTableParams.orderStatus" placeholder="">
                <el-option
                  v-for="item in orderStatusOptions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
            </el-form-item>

            <el-form-item label="代理名称/手机号：" prop="mobilePhone">
              <el-input
                v-model="searchTableParams.mobilePhone"
                placeholder="注册手机号"
                clearable
              />
            </el-form-item>

            <el-form-item class="">
              <el-button type="primary" @click="handleSearchTable('search')"
                >搜索</el-button
              >
              <el-button type="primary" @click="handleSearchTable('reset')"
                >重置</el-button
              >
            </el-form-item>
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
          class="u-table-container"
          :data="tableData"
          border
          style="width: 100%"
          @selection-change="handleSelectionChange"
          @sort-change="handleTableSort"
        >
          <el-table-column type="selection" width="55" />
          <el-table-column
            v-for="(item, index) in tableColumnConfig"
            :key="index"
            :prop="item.prop"
            :label="item.label"
            :width="item.width"
            align="center"
            :sortable="
              item.prop == 'withdrawAmount' ||
              item.prop == 'withdrawOrderCount' ||
              item.prop == 'withdrawDatetime'
            "
          >
            <template #default="{ row, column, $index }">
              <div v-if="item.insertSlot && item.prop === 'isCheck'">
                <el-button v-if="row.status == 0" size="small" type="success"
                  >已打款</el-button
                >
                <el-button v-if="row.status == 1" size="small" type="warning"
                  >打款中</el-button
                >
                <el-button v-if="row.status == 2" size="small" type="info"
                  >待审核</el-button
                >
                <el-button v-if="row.status == 3" size="small" type="danger"
                  >已拒绝</el-button
                >
              </div>

              <div v-if="item.insertSlot && item.prop === 'operate'">
                <el-dropdown>
                  <el-button type="primary" link>审核 </el-button>
                  <template #dropdown>
                    <el-dropdown-menu>
                      <el-dropdown-item>
                        <el-button link @click="checkDispose(row, 0)">
                          审核通过
                        </el-button>
                      </el-dropdown-item>
                      <el-dropdown-item>
                        <el-button link @click="checkDispose(row, 1)">
                          打款完成
                        </el-button>
                      </el-dropdown-item>
                      <el-dropdown-item>
                        <el-button link @click="checkDispose(row, 2)">
                          不通过
                        </el-button>
                      </el-dropdown-item>
                    </el-dropdown-menu>
                  </template>
                </el-dropdown>
                <el-button
                  class="u-m-r-20"
                  type="primary"
                  @click="openEditDialog(row)"
                  link
                  >详情
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
      :width="800"
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
            <el-form-item label="代理名称/手机号：" prop="mobilePhone">
              <el-input
                v-model="searchDialogTableParams.mobilePhone"
                placeholder="请输入代理名称/手机号"
                clearable
              />
            </el-form-item>

            <el-form-item class="">
              <el-button type="primary" @click="handleSearchTable('search')"
                >搜索</el-button
              >
              <el-button type="primary" @click="handleSearchTable('reset')"
                >重置</el-button
              >
            </el-form-item>
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
          border
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
import { ref, reactive, getCurrentInstance, computed } from "vue";
import StatisticsTitle from "../components/statisticsTitle.vue";
import userCount from "@/assets/images/user_count.png";
import barChart from "@/assets/images/bar_chart .png";
import { getTopData } from "./api";
import { useStore } from "vuex";

const { proxy } = getCurrentInstance();
const store = useStore();

const userIdentity = computed(() => {
  return store.getters["user/info"].isAdmin;
});

const financialInformation = ref([
  {
    id: 1,
    title: "待审提现单",
    money: "444",
    desc: "提现总额",
    isDescMoney: true,
    descNum: "1",
    image: userCount,
    imageStyle: "width: 56px; height: 56px",
    isShow: userIdentity.value == 1 ? true : false,
  },
  {
    id: 2,
    title: "等待打款现单",
    money: "444",
    desc: "等待打款总额",
    isDescMoney: true,
    descNum: "1",
    image: barChart,
    imageStyle: "width: 104px; height: 42px",
    isShow: userIdentity.value == 1 ? true : false,
  },
  {
    id: 3,
    title: "已打款提现单",
    money: "444",
    desc: "已打款总额",
    isDescMoney: true,
    descNum: "1",
    image: barChart,
    imageStyle: "width: 104px; height: 42px",
    isShow: userIdentity.value == 1 ? true : false,
  },
  {
    id: 4,
    title: "已拒提现单",
    money: "444",
    desc: "拒绝提现总额",
    isDescMoney: true,
    descNum: "1",
    image: barChart,
    imageStyle: "width: 104px; height: 42px",
    isShow: userIdentity.value == 1 ? true : false,
  },
]);

// 财务数据汇总
const searchParams = ref({
  dateScopeType: 1,
});
// 财务数据汇总接口
const getPanelInformation = () => {
  getTopData(searchParams.value).then((res) => {
    const { code, data, msg } = res || {};
    if (code == 0) {
      financialInformation.value.forEach((item) => {
        data.forEach((iten) => {
          item.money = iten.money;
          item.descNum = iten.descNum;
        });
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
  // getPanelInformation(params);
  console.log(params);
};
// 表格
// 搜索
let searchTableParams = reactive({
  pageSize: 50,
  pageIndex: 1,
  status: undefined,
  withdrawNotes: undefined,
  phone: undefined,
});

const formRef = ref(null);
const tableRef = ref();
const pageSizeOptions = ref([50, 100, 200]);
const tableListTotal = ref(0);
const tableData = ref([]);
const tableColumnConfig = ref([
  { label: "提现代理名称", prop: "agentName" },
  { label: "手机号码", prop: "phone" },
  { label: "提现单号", prop: "withdrawOrderId" },
  { label: "提现金额（元）", prop: "withdrawAmount" },
  { label: "审核状态", prop: "status", insertSlot: "isCheck" },
  { label: "提现订单量", prop: "withdrawOrderCount" },
  { label: "提现时间", prop: "withdrawDatetime" },
  { label: "提现备注", prop: "withdrawNotes" },
  { label: "操作", prop: "operate", insertSlot: "operate" },
]);

// 列表接口
function handleGetTableList(setScrollTop = true) {
  let params = {
    ...searchTableParams.value,
  };

  formRef.value.validate((valid) => {
    if (valid) {
      getMemberTableList(params).then((res) => {
        if (res.code == "0") {
          setScrollTop && tableRef.value.setScrollTop(0);
          tableData.value = res.data.list;
          tableListTotal.value = res.data.total;
        }
      });
    }
  });
}

// 搜索重置
function handleSearchTable(type) {
  if (type === "search") {
    formRef.value.validate((valid) => {
      if (valid) {
        searchTableParams.pageIndex = 1;
        handleGetTableList();
      }
    });
  } else if (type === "reset") {
    searchTableParams = reactive({
      pageSize: 50,
      pageIndex: 1,
      status: undefined,
      withdrawNotes: undefined,
      phone: undefined,
    });
    formRef.value.clearValidate();
  }
}

// 审核
const checkDispose = (row, state) => {
  return new Promise((resolve, reject) => {
    proxy
      .$confirm(
        `确认${state == 0 ? "审核通过" : state == 1 ? "打款完成" : "不通过"}吗`,
        {
          confirmButtonText: "确认",
          cancelButtonText: "取消",
          type: "warning",
        }
      )
      .then(() => {
        updateStatus({ id: row.id, state }).then((res) => {
          if (res.code == "0") {
            proxy.$message({
              type: "success",
              message: "审核状态修改成功",
            });
            handleGetTableList(false);
            return resolve(true);
          } else {
            return reject(false);
          }
        });
      })
      .catch(() => {
        console.log("取消");
        return reject(false);
      });
  });
};

// 排序
const handleTableSort = (column, prop, order) => {
  console.log(column, prop, order);
};

// 查看详情 弹窗
const currentDialogId = ref();
const eidtDialogVisible = ref(false);
const isFullscreen = ref(false);
const searchDialogTableParams = reactive({
  pageSize: 50,
  pageIndex: 1,
  phone: undefined,
});
const formDialogRef = ref(null);
const tableDialogRef = ref();
const tableDialogData = ref([]);
const tableDialogListTotal = ref(0);
const pageDialogSizeOptions = ref([50, 100, 200]);
const tableDialogColumnConfig = ref([
  { label: "订单号", prop: "agentName" },
  { label: "付款编号", prop: "phone" },
  { label: "客户名称", prop: "withdrawOrderId" },
  { label: "订单金额", prop: "withdrawAmount" },
  { label: "结算佣金", prop: "source" },
  { label: "操作", prop: "operate", insertSlot: "operate" },
]);

const openEditDialog = (row) => {
  eidtDialogVisible.value = true;
  isFullscreen.value = false;
  currentDialogId.value = row.userId;
  handleGetDialogTableList(row.userId);
};

const closeEditDialog = () => {
  eidtDialogVisible.value = false;
};

// 弹框接口
const handleGetDialogTableList = (userId) => {
  let params = {
    ...searchTableParams.value,
    userId,
  };

  formDialogRef.value.validate((valid) => {
    if (valid) {
      getMemberTableList(params).then((res) => {
        if (res.code == "0") {
          tableDialogData.value = res.data.list;
          tableDialogListTotal.value = res.data.total;
        }
      });
    }
  });
};

// 删除
const deleteOrder = (row) => {
  getMemberTableList(row.id).then((res) => {
    const { code, msg } = res;
    if (code == "0") {
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
};
</script>

<style lang="scss" scoped>
.financial-system {
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
    padding: 34px 58px;
    box-shadow: 0px 2px 3px 0px rgba(0, 0, 0, 0.1);

    :deep(.el-table__cell) {
      background-color: #fff !important;
      color: rgba(0, 0, 0, 0.4) !important;
    }
  }
}
</style>
