import HTTP from "@/utils/request";

// 收入信息
const getIncome = (params) => {
  return HTTP.get("/DistributionManage/GetIncome", params);
};

// 分析仪表盘数据
const getDistributionDashboard = (params) => {
  return HTTP.get("/DistributionManage/GetDistributionDashboard", params);
};

// 统计图
const getTotalIncomeToDay = (params) => {
  return HTTP.get(
    "/DistributionManage/GetTotalIncomeAndTotalOrderCountToDay",
    params
  );
};

// 销售排名
const getSaleRanking = (params) => {
  return HTTP.get("/DistributionManage/GetSaleRanking", params);
};

// 近期订单
const getOrderList = (params) => {
  return HTTP.get("/DistributionManage/GetOrderList", params);
};

// 客户量排名
const getCustomCountRanking = (params) => {
  return HTTP.get("/DistributionManage/GetCustomCountRanking", params);
};

// 代理排名
const getAgentRanking = (params) => {
  return HTTP.get("/DistributionManage/GetAgentRanking", params);
};

export {
  getIncome,
  getDistributionDashboard,
  getTotalIncomeToDay,
  getSaleRanking,
  getOrderList,
  getCustomCountRanking,
  getAgentRanking,
};
