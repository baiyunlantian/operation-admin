<template>
  <div class="agent-container">
    <module-card>
      <header class="agent-data-head">
        <h1>客户数据</h1>
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
            <template #notes>
              <div
                class="notes-container"
                :style="{
                  'margin-left': '12px',
                }"
              >
                <el-select
                  v-model="notes"
                  @change="getNotes"
                  class="m-2"
                  placeholder="有备注"
                >
                  <el-option
                    v-for="item in notesOptions"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  />
                  <template #prefix>
                    {{ way.prefix }}
                  </template>
                </el-select>
              </div>
            </template>
            <template #salesName>
              <div
                class="salesName-container"
                :style="{
                  'margin-left': '12px',
                }"
              >
                <el-select
                  v-model="salesName"
                  @change="getSalesName"
                  @focus="getSalers"
                  class="m-2"
                  placeholder="全部"
                >
                  <template #prefix>
                    {{ way.prefix }}
                  </template>
                  <el-option
                    v-for="item in salesOptions"
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
                @keyup.enter="search"
              />
            </template>
          </table-search>
        </template>
        <div class="pagesize-container">
          <el-pagination
            v-model:page-size="pageSize"
            :page-sizes="[50, 100, 200]"
            layout="sizes"
            :total="customDataLength"
            @size-change="handleSizeChange"
          />
        </div>
      </div>

      <data-table
        :selection="true"
        ref="tableRef"
        :column="customDataHead"
        :data="customDataRow"
        @sort-change="handleTableSort"
        v-loading="dataLoading"
      >
        <template #status="{ row }">
          <div class="status-container">
            <el-tag>{{ row.status }}</el-tag>
          </div>
        </template>
        <template #operate="{ row }">
          <div class="operate-container">
            <template v-for="operate in row.operate" :key="operate.func">
              <el-link
                type="primary"
                @click="operate.clickEvent(row.customId, row.salesName)"
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
          :total="customDataLength"
        />
        <el-pagination
          v-model:current-page="pageIndex"
          background
          small
          layout="prev, pager, next"
          :total="customDataLength"
          @current-change="currentChange"
        />
      </div>
    </module-card>

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
        <div class="header-edit" v-if="userIdentity == 1">
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
import { onMounted, reactive, ref, computed, nextTick } from "vue";
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

// 身份确认
// 销售 10  代理 20
import { useStore } from "vuex";
const store = useStore();
const roleIdentity = computed(() => {
  return store.getters["user/info"].roleId;
});
//超管1 非超管0
const userIdentity = computed(() => {
  return store.getters["user/info"].isAdmin;
});

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
  getCustomData();
  getCustomList();
  getSalers();
});

// 卡片的数值
const amount = ref({});
// 获取代理数据
const getCustomData = () => {
  const params = {
    StartTime: selectedDate.startDate,
    EndTime: selectedDate.endDate,
  };
  API.getCustomData(params).then((res) => {
    amount.value = res.data;
    updateCardData();
    console.log(amount.value);
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
    title: "成交客户",
    name: "paymentCustomCount",
    amount: amount.value.paymentCustomCount,
    url: require("@/assets/images/user_count.png"),
    total: {
      totalTitle: "客户总量",
      totalName: "customTotal",
      totalAmount: amount.value.customTotal,
    },
  },
  {
    title: "成交金额",
    name: "paymentTotalAmount",
    amount: amount.value.paymentTotalAmount,
    url: require("@/assets/images/bar_chart.png"),
  },
  {
    title: "客单价",
    name: "paymentAvgAmount",
    amount: amount.value.paymentAvgAmount,
    url: require("@/assets/images/bar_chart.png"),
  },
]);

// 获取几天前的准确时间
const getBeforeDate = (date) => {
  selectedDate = date;
  // console.log(date);
  getCustomData();
  // console.log(selectedDate);
};

// -------------------------客户列表

const tableRef = ref();
const table = tableRef.value?.getTableRef();

// 筛选的方式
const searchWay = reactive([
  { name: "notes", prefix: "客户备注", slot: "notes" },
  { name: "salesName", prefix: "销售名称", slot: "salesName" },
  { name: "search", prefix: "搜索", slot: "search" },
]);

const ascending = ref("DESC");
const sortField = ref("OrderCount");

const handleTableSort = (e) => {
  console.log(e);
  ascending.value = e.order == "ascending" ? "ASC" : "DESC";
  sortField.value = e.prop;
  getCustomList({
    keyWords: keyword.value,
    isRemark: isRemark.value,
    salesId: salesName.value,
    pageSize: pageSize.value,
    ascending: ascending.value,
    sortField: sortField.value,
  });
};

const notes = ref("1");
const isRemark = ref();
const notesOptions = [
  {
    label: "有备注",
    value: "1",
  },
  { label: "无备注", value: "0" },
];
const getNotes = (val) => {
  pageIndex.value = 1;
  notes.value = val;
  isRemark.value = notes.value;
  getCustomList({
    keyWords: keyword.value,
    isRemark: isRemark.value,
    salesId: salesName.value,
    pageSize: pageSize.value,
    ascending: ascending.value,
    sortField: sortField.value,
  });
};

const salesName = ref("-1");
const salesOptions = ref([
  {
    label: "全部",
    value: "-1",
  },
]);
const getSalesName = (val) => {
  pageIndex.value = 1;
  salesName.value = val;
  getCustomList({
    keyWords: keyword.value,
    isRemark: isRemark.value,
    salesId: salesName.value,
    pageSize: pageSize.value,
    ascending: ascending.value,
    sortField: sortField.value,
  });
};
const getSalers = (val) => {
  API.getSalers().then((res) => {
    const salesOptionsArr = res.data.map((item) => {
      return {
        value: item.UserId,
        label: item.UserName,
      };
    });
    salesOptions.value = [...salesOptions.value, ...salesOptionsArr];
    console.log(salesOptions.value);
  });
};

const pageSize = ref(50);
const handleSizeChange = (val) => {
  pageIndex.value = 1;
  pageSize.value = val;
  getCustomList({
    keyWords: keyword.value,
    isRemark: isRemark.value,
    salesId: salesName.value,
    pageSize: pageSize.value,
    ascending: ascending.value,
    sortField: sortField.value,
  });
};

// 搜索
const keyword = ref();
const search = () => {
  pageIndex.value = 1;
  // console.log(keyword.value);
  getCustomList({
    keyWords: keyword.value,
    isRemark: isRemark.value,
    salesId: salesName.value,
    pageSize: pageSize.value,
    ascending: ascending.value,
    sortField: sortField.value,
  });
};

// 页码
const pageIndex = ref(1);
const currentChange = (val) => {
  getCustomList({
    keyWords: keyword.value,
    isRemark: isRemark.value,
    salesId: salesName.value,
    pageSize: pageSize.value,
    ascending: ascending.value,
    sortField: sortField.value,
  });
};

// 获取代理列表
const customDataRow = ref();
const customDataLength = ref();
const dataLoading = ref(false);
const getCustomList = () => {
  dataLoading.value = true;
  const params = {
    keyWords: keyword.value || "",
    ascending: ascending.value || "DESC",
    sortField: sortField.value || "OrderCount",
    isRemark: isRemark.value || "-1",
    salesId: salesName.value || "-1",
    pageSize: pageSize.value || 50,
    pageIndex: pageIndex.value || 1,
  };
  API.getCustomList(params).then((res) => {
    // console.log(res.data);
    dataLoading.value = false;
    customDataLength.value = res.data.total;
    customDataRow.value = res.data.list;
    customDataRow.value.forEach((val) => {
      val.operate = operate;
    });
    // console.log('-------------',customDataRow.value);
    // customDataRow.value = res.data;
  });
};

// 代理数据的表头
const customDataHead = [
  {
    prop: "customName",
    label: "客户名称",
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
    prop: "agencyName",
    label: "代理名称",
    width: "110",
    header: true,
    sortable: true,
    isPermission: true,
  },
  {
    prop: "salesName",
    label: "销售名称",
    width: "200",
    header: true,
    sortable: true,
    isPermission: true,
  },
  {
    prop: "orderCount",
    label: "订单量",
    width: "200",
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
    prop: "lastPaymentTime",
    label: "最后成交时间",
    width: "200",
    header: true,
    sortable: true,
    isPermission: true,
  },
  {
    prop: "remark",
    label: "客户备注",
    width: "180",
    slot: true,
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

import { ElMessageBox, ElMessage } from "element-plus";
// 操作方式
const operate = [
  {
    func: "详情",
    isShow: true,
    clickEvent: (id, name) => {
      console.log(id);
      dialogDetaiOpt.dialogVisible = true;
      getCustomInfo(id);
    },
  },
  {
    func: "删除",
    isShow: true,
    clickEvent: (id, name) => {
      ElMessageBox.confirm(`是否确定删除 ${name} 销售ID ${id} `, "提示", {
        confirmButtonText: "确认",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          const params = {
            customId: id,
          };
          API.deleteCustomInfo(params).then((res) => {
            if (res.code === 0) {
              ElMessage({
                type: "success",
                message: "操作成功",
              });
              getCustomList();
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
];

const getCustomInfo = (id) => {
  const params = {
    customId: id,
  };
  API.getCustomInfo(params).then((res) => {
    salesFormData.value = res.data;
  });
};

// -------------------销售信息

// 销售信息组件
import EditDialog from "@/components/Dialog/EditDialog.vue";
//  :dialogOpt="dialogDetaiOpt"
// :form="salesFormData"
// :formArr="formArr"

const dialogDetaiOpt = reactive({
  dialogVisible: false,
  title: "客户信息",
  width: "80vw",
  col: 6,
});

const formArr = ref([
  { title: "手机", name: "phone", isChange: true, prepend:'+86' },
  { title: "微信", name: "wechat", isChange: true },
  { title: "客户邮箱", name: "email", isChange: true },
  { title: "注册时间", name: "createdTime", isChange: false },
  { title: "管理主体", name: "companyName", isChange: false },
  { title: "直属代理/销售", name: "agencyName", isChange: false },
]);
const salesFormData = ref({});

// 编辑个人信息
const msgType = ref("text");
const editMsg = () => {
  msgType.value = "input";
};

const changeMsgType = (val) => {
  updateCustomInfo(val);
  console.log(val);
};
const cancelEdit = (val) => {
  msgType.value = "text";
};

const updateCustomInfo = (msg) => {
  const params = {
    customId: msg.editParams.agencyCustomId,
    phone: msg.editParams.phone,
    weChat: msg.editParams.wechat,
    email: msg.editParams.email,
  };
  API.updateCustomInfo(params).then((res) => {
    if (res.code == 0) {
      getCustomInfo(msg.editParams.agencyCustomId);
      nextTick(() => {
        msgType.value = msg.msgType;
      });

      console.log(res);
    }
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
