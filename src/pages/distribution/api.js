import HTTP from "@/utils/request";

export default {
  // 查看邀请奖励规则
  getInvitationRewardRules(params) {
    return HTTP.get("/DistributionManage/Activity/Content", params);
  },

  // 设置邀请奖励规则
  setInvitationRewardRules(params) {
    return HTTP.post("/DistributionManage/Activity/Content", params);
  },

  // 获取邀请链接
  getInvitationLink(params) {
    return HTTP.get("/DistributionManage/GetInvitationLink", params);
  },

  // 获取分销用户分页列表
  getDistributionManageList(params) {
    return HTTP.get("/DistributionManage/User/Page", params);
  },

  // 获取分销用户详情
  getDetailByUserId(params) {
    return HTTP.get("/DistributionManage/User/Detail", params);
  },

  // 获取邀新用户分页列表
  getInviteUserList(params) {
    return HTTP.get("/DistributionManage/InviteUser/Page", params);
  },

  // 推广佣金设置
  setCommission(params) {
    return HTTP.post("/DistributionManage/Commission/Set", params);
  },

  // 获取推广佣金设置信息
  getCommission(params) {
    return HTTP.get("/DistributionManage/Commission/Info", params);
  },

  // ----------------代理管理
  // 获取代理数据
  getAgentData(params) {
    return HTTP.get("/DistributionManage/GetAgentData", params);
  },
  // 获取代理分页列表
  getAgentList(params) {
    return HTTP.get("/SalesAgency/Agency/Page", params);
  },
  // 获取代理分页列表
  addAgencyUser(params) {
    return HTTP.post("/SalesAgency/Add/AgencyUser", params);
  },
  //获取代理个人信息
  getAgencyUser(params) {
    return HTTP.get("/SalesAgency/UserInfo", params);
  },
  // 获取个人订单和佣金信息
  getOrderCommission(params) {
    return HTTP.get("/SalesAgency/OrderCommissionInfo", params);
  },
  getBankInfo(params) {
    return HTTP.get("/SalesAgency/BankCardInfo", params);
  },

  // 获取客户列表
  getCustomerList(params) {
    return HTTP.get("/SalesAgency/Customers/Page", params);
  },

  // 获取订单列表
  getOrderList(params) {
    return HTTP.get("/SalesAgency/Order/Page", params);
  },

  // ----------------销售管理
  // 获取销售数据
  getSalesData(params) {
    return HTTP.get("/SalesAgency/GetSaleData", params);
  },
  // 获取销售分页列表
  getSalesList(params) {
    return HTTP.get("/SalesAgency/GetSaleDataPageList", params);
  },
  // 获取销售个人信息
  getSalesInfo(params) {
    return HTTP.get("/SalesAgency/UserInfo", params);
  },
};
