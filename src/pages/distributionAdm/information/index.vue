<template>
  <div class="information-container">
    <div class="top-card bg-fff">
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
    </div>

    <div class="instrument-panel bg-fff">
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
    </div>

    <BrokenLine />
  </div>
</template>

<script setup>
import { onMounted, ref, getCurrentInstance, computed } from "vue";
import RightSearch from "./components/rightSearch";
import BrokenLine from "./components/brokenLine";
import barChart from "@/assets/images/bar_chart .png";
import heartbeat from "@/assets/images/heartbeat.svg";
import userCount from "@/assets/images/user_count.png";
import file from "@/assets/images/file.png";
import { getTopData } from "./api";
import { useStore } from "vuex";

const { proxy } = getCurrentInstance();
const store = useStore();

const userIdentity = computed(() => {
  return store.getters["user/info"].isAdmin;
});

const collectInformation = ref([
  {
    title: "全部总收入",
    money: "111",
  },
  {
    title: "昨日收入",
    money: "222",
  },
  {
    title: "昨周收入",
    money: "333",
  },
  {
    title: "昨月收入",
    money: "444",
  },
]);

const panelInformation = ref([
  {
    id: 1,
    title: "总收入",
    money: "111",
    image: barChart,
    imageStyle: "width: 104px; height: 42px",
    isShow: userIdentity.value == 1 ? true : false,
  },
  {
    id: 2,
    title: "返佣金额",
    money: "222",
    image: barChart,
    imageStyle: "width: 104px; height: 42px",
    isShow: userIdentity.value == 1 ? true : false,
  },
  {
    id: 3,
    title: "冻结金额",
    money: "333",
    image: heartbeat,
    imageStyle: "width: 96px; height: 40px",
    isShow: userIdentity.value == 1 ? true : false,
  },
  {
    id: 4,
    title: "成交销售数量",
    money: "444",
    desc: "销售总量",
    descNum: "1",
    image: userCount,
    imageStyle: "width: 56px; height: 56px",
    isShow: userIdentity.value == 1 ? true : false,
  },
  {
    id: 5,
    title: "产生订单 (个)",
    money: "444",
    image: file,
    imageStyle: "width: 56px; height: 56px",
    isShow: userIdentity.value == 1 ? true : false,
  },
  {
    id: 6,
    title: "取消订单",
    money: "444",
    desc: "订单取消率",
    descNum: "2",
    image: userCount,
    imageStyle: "width: 56px; height: 56px",
    isShow: userIdentity.value == 1 ? true : false,
  },
  {
    id: 7,
    title: "成交客户数量",
    money: "444",
    desc: "客户总量",
    descNum: "3",
    image: userCount,
    imageStyle: "width: 56px; height: 56px",
    isShow: userIdentity.value == 1 ? true : false,
  },
  {
    id: 8,
    title: "成交代理数量",
    money: "444",
    desc: "代理总量",
    descNum: "1",
    image: userCount,
    imageStyle: "width: 56px; height: 56px",
    isShow: userIdentity.value == 1 ? true : false,
  },
]);

// 顶部总数据
const getTopInformation = () => {
  getTopData().then((res) => {
    const { code, data, msg } = res || {};
    if (code == 0) {
      collectInformation.value.forEach((item) => {
        data.forEach((iten) => {
          item.money = iten.money;
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

// 仪表盘参数
const searchParams = ref({
  dateScopeType: 1,
});
// 分销仪表盘
const getPanelInformation = () => {
  getTopData(searchParams.value).then((res) => {
    const { code, data, msg } = res || {};
    if (code == 0) {
      panelInformation.value.forEach((item) => {
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

onMounted(() => {
  // getTopInformation();
  // getPanelInformation()
});
</script>

<style lang="scss" scoped>
.information-container {
  .el-card {
    --el-card-padding: 0 !important;
  }

  .el-card {
    border: none;
  }

  .box-card {
    box-shadow: 0px 2px 3px 0px rgba(0, 0, 0, 0.1);
  }

  .common-item {
    height: 168px;
    padding: 24px 32px 0 32px;
    box-sizing: border-box;

    .top-item {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .left-box {
      display: flex;
      flex-direction: column;
      .title {
        margin-bottom: 9px;
        font-size: 14px;
      }
      .money {
        font-size: 36px;
      }
    }
  }

  .top-card {
    padding: 24px 24px 0 24px;
    margin-bottom: 16px;
    box-shadow: 0px 1px 2px 0px rgba(0, 0, 0, 0.1);
    color: #1a1a1a;

    .box-card {
      margin-bottom: 24px;
    }
  }

  .instrument-panel {
    padding: 16px 24px 0 24px;
    margin-bottom: 16px;
    box-shadow: 0px 1px 2px 0px rgba(0, 0, 0, 0.1);
    color: #1a1a1a;

    .box-card {
      margin-bottom: 16px;
    }

    .total-title {
      font-size: 20px;
      color: rgba(0, 0, 0, 0.9);
      margin-bottom: 16px;
    }

    .describe {
      display: flex;
      align-items: center;
      margin-top: 23px;
      color: rgba(0, 0, 0, 0.4);
      font-size: 14px;

      .text {
        margin-right: 16px;
      }
    }
  }
}
</style>
