<template>
  <div class="agent-detail-container">
    <div class="agent-detail-header">
      <h1>代理详情</h1>
    </div>
    <div class="agent-detail">
      <div class="agent-detail-msg">
        <div class="agency-name">
          代理名称：<span>{{ 12 }}</span>
        </div>
        <div class="agency-account">
          用户账号：<span>{{ 12 }}</span>
        </div>
      </div>

      <module-card>
        <header>
          <div class="header-title">
            <h1>个人信息</h1>
          </div>
          <div class="header-edit">
            <el-button link
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
                    <p>{{ data.title }}</p>
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

      <div class="agent-table-container" style="width: 100%">
        <div class="select-way">
          <template v-for="way in searchWay" :key="way.prefix">
            <table-search :searchWay="way" style="marginright: 8px">
              <template #createTime>
                <div class="create-time-container">
                  <p>创建时间：</p>
                  <variety-date-picker
                    @getBeforeDate="getBeforeDate"
                  ></variety-date-picker>
                </div>
              </template>
            </table-search>
          </template>
        </div>
        <div class="select-btns">
          <el-button type="primary" size="small">查询</el-button>
          <el-button type="primary" size="small">重置</el-button>
        </div>
      </div>

      <div class="table-title-header">
        <div class="table-title">客户列表</div>
        <div class="pagesize-container">
          <el-pagination
            v-model:page-size="pageSize"
            :page-sizes="[100, 200, 300, 400]"
            layout="sizes"
            :total="1000"
            @size-change="handleSizeChange"
            small
          />
          <el-select
            v-model="value"
            class="m-2"
            placeholder="Select"
            style="width: 140px; margin-left: 10px"
            size="small"
          >
            <el-option
              v-for="item in options"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </div>
      </div>

      <data-table
        ref="tableRef"
        :column="agentDataHead"
        :data="agentDataRow"
        :sortable="true"
        border
      >
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
    </div>
  </div>
</template>

<script setup>
import { reactive, ref } from "vue";
import ModuleCard from "@/components/Card/ModuleCard.vue";
import TableSearch from "@/components/Table/TableSearch.vue";
import VarietyDatePicker from "@/components/DatePicker/VarietyDatePicker";
import DataTable from "@/components/Table/DataTable.vue";

const agentFormData = reactive({
  contact: "",
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
  WithdrawalCommission: "",
  cardName: "",
  cardNo: "",
  openingBank: "",
});
const agentDataArr = reactive([
  { title: "联系方式", name: "contact" },
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
  { title: "已提现佣金", name: "WithdrawalCommission" },
  { title: "银行卡信息", name: "cardName" },
  { title: "", name: "cardNo" },
  { title: "", name: "openingBank" },
]);

// 筛选的方式
const searchWay = [
  { prefix: "代理名称" },
  { prefix: "代理手机号" },
  { prefix: "创建时间:", slot: "createTime" },
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

// 代理数据的数据行内容
const agentDataRow = [
  {
    customerName: "1679989217626",
    phone: "13100000001",
    orderQty: "13100000001",
    orderAmount: "13100000001",
    paymentTime: "13100000001",
    registerTime: "13100000001",
  },
  {
    customerName: "1679989217626",
    phone: "13100000001",
    orderQty: "13100000001",
    orderAmount: "13100000001",
    paymentTime: "13100000001",
    registerTime: "13100000001",
  },
  {
    customerName: "1679989217626",
    phone: "13100000001",
    orderQty: "13100000001",
    orderAmount: "13100000001",
    paymentTime: "13100000001",
    registerTime: "13100000001",
  },
  {
    customerName: "1679989217626",
    phone: "13100000001",
    orderQty: "13100000001",
    orderAmount: "13100000001",
    paymentTime: "13100000001",
    registerTime: "13100000001",
  },
];
</script>

<style lang="scss" scoped>
.agent-detail-container {
  .agent-detail-header {
    background-color: #6ea3ff;
    border-radius: 4px 4px 0 0;
    padding: 12px 20px;
    h1 {
      color: #fff;
      font-size: 20px;
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
            width: 60px;
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
}
</style>
