<template>
  <div class="information-container">
    <div
      class="tipsBox"
      v-if="agentInfo.isFreeOfCommission == 0 && agentInfo.isPayCashPledge == 0"
    >
      <PayMoneyTipsBox :payCallback="payCallback" @success="handleSuccessPay" />
    </div>
    <!-- <div class="top-card bg-fff">
      <el-row :span="24" :gutter="70">
        <template v-for="(item, index) in collectInformation" :key="index">
          <el-col :xl="6" :lg="8" :md="12" :sm="12" :xs="24">
            <el-card class="box-card">
              <div class="item common-item">
                <div class="top-item">
                  <div class="left-box">
                    <div class="title fw">{{ item.title }}</div>
                    <div class="money fw">¥ {{ item.money }}</div>
                  </div>
                  <el-image
                    style="width: 104px; height: 42px"
                    :src="barChart"
                    alt=""
                  />
                </div>
              </div>
            </el-card>
          </el-col>
        </template>
      </el-row>
    </div> -->

    <!-- <div class="instrument-panel bg-fff">
      <el-row>
        <el-col :xl="4" :lg="4" :md="24" :sm="24" :xs="24">
          <div class="total-title fw">分销仪表盘</div>
        </el-col>

        <el-col :xl="20" :lg="20" :md="24" :sm="24" :xs="24">
          <RightSearch @updateParams="handleUpdateParams" />
        </el-col>
      </el-row>
      <el-row :span="24" :gutter="70">
        <template v-for="(item, index) in panelInformation" :key="index">
          <el-col :xl="6" :lg="8" :md="12" :sm="12" :xs="24" v-if="item.isShow">
            <el-card class="box-card">
              <div class="item common-item">
                <div class="top-item">
                  <div class="left-box">
                    <div class="title fw">{{ item.title }}</div>
                    <div class="money fw">¥ {{ item.money }}</div>
                  </div>
                  <el-image :style="item.imageStyle" :src="item.image" alt="" />
                </div>
                <div class="describe fw">
                  <div class="text">{{ item.desc }}</div>
                  <div class="num">{{ item.descNum }}</div>
                </div>
              </div>
            </el-card>
          </el-col>
        </template>
      </el-row>
    </div> -->

    <StatisticsTitle
      :isSearch="false"
      :statisticsInformation="collectInformation"
    />

    <StatisticsTitle
      title="分销仪表盘"
      :statisticsInformation="panelInformation"
      @updateParams="handleUpdateParams"
    />

    <div class="echart">
      <!-- <el-row>
        <el-col :xl="19" :lg="19" :md="24" :sm="24" :xs="24">
          <BrokenLine />
        </el-col>
        <el-col :xl="5" :lg="5" :md="24" :sm="24" :xs="24">
          <Pie />
        </el-col>
      </el-row> -->
      <BrokenLine />
    </div>

    <el-row :gutter="28">
      <el-col
        v-if="userIdentity.isAdmin == 1"
        :xl="12"
        :lg="12"
        :md="24"
        :sm="24"
        :xs="24"
      >
        <Ranking
          :is-show="userIdentity.isAdmin == 1"
          title="销售排名"
          :listTitle="sellListTitle"
          :tableData="sellTableData"
        />
      </el-col>
      <el-col :xl="12" :lg="12" :md="24" :sm="24" :xs="24">
        <Ranking
          title="近期订单"
          :listTitle="orderListTitle"
          :tableData="orderTableData"
        />
      </el-col>
      <el-col
        v-if="userIdentity.isAdmin == 1"
        :xl="12"
        :lg="12"
        :md="24"
        :sm="24"
        :xs="24"
      >
        <Ranking
          title="客户量排名"
          :is-show="userIdentity.isAdmin == 1"
          :listTitle="customListTitle"
          :tableData="customTableData"
        />
      </el-col>
      <el-col
        v-if="roleIdentity.roleId != 20"
        :xl="12"
        :lg="12"
        :md="24"
        :sm="24"
        :xs="24"
      >
        <Ranking
          title="代理排名"
          :is-show="roleIdentity.roleId != 20"
          :listTitle="agencyListTitle"
          :tableData="agencyTableData"
        />
      </el-col>
    </el-row>
  </div>
</template>

<script setup>
import {
  onMounted,
  ref,
  getCurrentInstance,
  computed,
  watch,
  reactive,
} from "vue";
import StatisticsTitle from "../components/statisticsTitle.vue";
import BrokenLine from "./components/brokenLine";
import PayMoneyTipsBox from "@/components/payMoneyTipsBox";
// import Pie from "./components/pie.vue";
import Ranking from "./components/ranking.vue";
import barChart from "@/assets/images/bar_chart.png";
import heartbeat from "@/assets/images/heartbeat.svg";
import userCount from "@/assets/images/user_count.png";
import file from "@/assets/images/file.png";
import {
  getIncome,
  getDistributionDashboard,
  getSaleRanking,
  getOrderList,
  getCustomCountRanking,
  getAgentRanking,
} from "./api";
import { useStore, mapGetters } from "vuex";
import API from "@/pages/account/api";
import dayjs from "dayjs";
import utils from "@/assets/js/utils.js";

const { proxy } = getCurrentInstance();
const store = useStore();

// 超管1 非超管0
const userIdentity = computed(() => {
  return store.getters["user/info"];
});

// 10:销售 20：代理
const roleIdentity = computed(() => {
  return store.getters["user/agentInfo"];
});

const payCallback = ref(API.getDepositPaymentRecord);

const agentInfo = ref({});

watch(
  () => store.getters["user/agentInfo"],
  (newVal) => {
    agentInfo.value = newVal;
  },
  { deep: true, immediate: true }
);

function handleSuccessPay() {
  // 更新用户信息
  store.dispatch("user/getAgentUserInfo");
}

// 顶部总数据
const collectInformation = ref([
  {
    title: "全部总收入",
    isMoney: true,
    money: 0,
    image: barChart,
    imageStyle: "width: 104px; height: 42px",
    isShow: true,
    propMoney: "totalIncome",
  },
  {
    title: "昨日收入",
    isMoney: true,
    money: 0,
    image: barChart,
    imageStyle: "width: 104px; height: 42px",
    isShow: true,
    propMoney: "yesterdayIncome",
  },
  {
    title: "上一周收入",
    isMoney: true,
    money: 0,
    image: barChart,
    imageStyle: "width: 104px; height: 42px",
    isShow: true,
    propMoney: "lastWeekIncome",
  },
  {
    title: "上一月收入",
    isMoney: true,
    money: 0,
    image: barChart,
    imageStyle: "width: 104px; height: 42px",
    isShow: true,
    propMoney: "lastMonthIncome",
  },
]);

const getTopInformation = () => {
  getIncome().then((res) => {
    const { code, data, msg } = res || {};
    if (code == 0) {
      collectInformation.value.forEach((item) => {
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

// 仪表盘参数
let panelInformation = computed(() => {
  let _roleIdentity = store.getters["user/agentInfo"];
  let _userIdentity = store.getters["user/info"];
  return [
    {
      id: 1,
      title: "总收入",
      isMoney: true,
      money: 0,
      image: barChart,
      imageStyle: "width: 104px; height: 42px",
      isShow: true,
      propMoney: "totalIncome",
    },
    {
      id: 2,
      title: "返佣金额",
      isMoney: true,
      money: 0,
      desc: "待返金额",
      descNum: 0,
      isDescMoney: true,
      descO: "已返金额",
      descNumO: 0,
      isDescOMoney: true,
      image: barChart,
      imageStyle: "width: 104px; height: 42px",
      isShow: true,
      propMoney: "brokerageCommission",
      propDescNum: "totalWaitBrokerageCommission",
      proDescNumO: "totalBrokerageCommission",
    },
    {
      id: 3,
      title: "冻结金额",
      isMoney: true,
      money: 0,
      image: heartbeat,
      imageStyle: "width: 96px; height: 40px",
      isShow: _roleIdentity.roleId != 10 ? true : false, //销售不显示
      propMoney: "freezeAmount",
    },
    {
      id: 4,
      title: "成交销售数量",
      isMoney: false,
      money: 0,
      desc: "销售总量",
      descNum: 0,
      image: userCount,
      imageStyle: "width: 56px; height: 56px",
      isShow: _userIdentity.isAdmin == 1 ? true : false, //销售和代理不显示
      propMoney: "transactionSalesCount",
      propDescNum: "salesTotalCount",
    },
    {
      id: 5,
      title: "产生订单 (个)",
      isMoney: false,
      money: 0,
      image: file,
      imageStyle: "width: 56px; height: 56px",
      isShow: true,
      propMoney: "createOrderCount",
    },
    {
      id: 6,
      title: "取消订单",
      isMoney: false,
      money: 0,
      image: userCount,
      imageStyle: "width: 56px; height: 56px",
      isShow: true,
      propMoney: "cancellationOrderCount",
    },
    {
      id: 7,
      title: "成交客户数量",
      isMoney: false,
      money: 0,
      desc: "客户总量",
      descNum: 0,
      image: userCount,
      imageStyle: "width: 56px; height: 56px",
      isShow: true,
      propMoney: "transactionCustomCount",
      propDescNum: "customTotalCount",
    },
    {
      id: 8,
      title: "成交代理数量",
      isMoney: false,
      money: 0,
      desc: "代理总量",
      descNum: 0,
      image: userCount,
      imageStyle: "width: 56px; height: 56px",
      isShow: _roleIdentity.roleId != 20 ? true : false, //代理不显示
      propMoney: "transactionAgentCount",
      propDescNum: "agentTotalCount",
    },
  ];
});

const searchParams = ref({
  startTime: utils.getNextDate(-7) + " " + "00:00:00",
  endTime: dayjs().subtract(1, "day").format("YYYY-MM-DD") + " " + "23:59:59",
});

// 分销仪表盘
const getPanelInformation = () => {
  getDistributionDashboard(searchParams.value).then((res) => {
    const { code, data, msg } = res || {};
    if (code == 0) {
      panelInformation.value.forEach((item) => {
        item.money = data[item.propMoney] || 0;
        if (item.descNum) {
          item.descNum = data[item.propDescNum] || 0;
        }
        if (item.descNumO) {
          item.descNumO = data[item.proDescNumO] || 0;
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
  getPanelInformation();
};

// 销售排名
const sellListTitle = ref([
  {
    prop: "ranking",
    label: "排名",
    insertSlot: "ranking",
  },
  {
    prop: "saleName",
    label: "销售名称",
  },
  {
    prop: "completeOrderCount",
    label: "订单量",
  },
  {
    prop: "orderAmount",
    label: "订单金额",
  },
]);
const sellTableData = ref([]);

const handleGetSaleRanking = () => {
  getSaleRanking().then((res) => {
    const { code, data, msg } = res || {};
    if (code == 0) {
      const processData = ref([]);
      data.forEach((item, index) => {
        processData.value.push({ ...item, ranking: index + 1 });
      });
      sellTableData.value = processData.value;
    } else {
      proxy.$message({
        type: "error",
        message: msg,
      });
    }
  });
};

// 近期订单
const orderListTitle = ref([
  {
    prop: "orderId",
    label: "订单号",
  },
  {
    prop: "orderCompleteTime",
    label: "成交时间",
  },
  {
    prop: "agentName",
    label: "代理名称",
  },
  {
    prop: "saleName",
    label: "销售名称",
  },
  {
    prop: "orderAmount",
    label: "订单金额",
  },
  {
    prop: "customName",
    label: "客户名称",
  },
]);
const orderTableData = ref([]);

const handleGetOrderList = () => {
  getOrderList().then((res) => {
    const { code, data, msg } = res || {};
    if (code == 0) {
      orderTableData.value = data;
    } else {
      proxy.$message({
        type: "error",
        message: msg,
      });
    }
  });
};

// 客户量排名
const customListTitle = ref([
  {
    prop: "ranking",
    label: "排名",
    insertSlot: "ranking",
  },
  {
    prop: "saleName",
    label: "销售名称",
  },
  {
    prop: "completeOrderCount",
    label: "订单量",
  },
  {
    prop: "orderAmount",
    label: "订单金额",
  },
  {
    prop: "transactionCustomCount",
    label: "客户数量",
  },
]);
const customTableData = ref([]);

const handleGetCustomCountRanking = () => {
  getCustomCountRanking().then((res) => {
    const { code, data, msg } = res || {};
    if (code == 0) {
      const processData = ref([]);
      data.forEach((item, index) => {
        processData.value.push({ ...item, ranking: index + 1 });
      });
      customTableData.value = processData.value;
    } else {
      proxy.$message({
        type: "error",
        message: msg,
      });
    }
  });
};

// 代理排名
const agencyListTitle = ref([
  {
    prop: "ranking",
    label: "排名",
    insertSlot: "ranking",
  },
  {
    prop: "agentName",
    label: "代理名称",
  },
  {
    prop: "completeOrderCount",
    label: "订单量",
  },
  {
    prop: "orderAmount",
    label: "订单金额",
  },
  {
    prop: "transactionCustomCount",
    label: "客户数量",
  },
]);
const agencyTableData = ref([]);

const handleGetAgentRanking = () => {
  getAgentRanking().then((res) => {
    const { code, data, msg } = res || {};
    if (code == 0) {
      const processData = ref([]);
      data.forEach((item, index) => {
        processData.value.push({ ...item, ranking: index + 1 });
      });
      agencyTableData.value = processData.value;
    } else {
      proxy.$message({
        type: "error",
        message: msg,
      });
    }
  });
};

onMounted(() => {
  getTopInformation();
  getPanelInformation();
  handleGetSaleRanking();
  handleGetOrderList();
  handleGetCustomCountRanking();
  handleGetAgentRanking();
});
</script>

<style lang="scss" scoped>
.information-container {
  .tipsBox {
    margin-bottom: 16px;
  }
  .echart {
    margin-bottom: 16px;
  }
}
</style>
