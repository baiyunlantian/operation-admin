import HTTP from "@/utils/request";

// 财务数据
const getFinanceData = (params) => {
  return HTTP.get("/Finance/GetFinanceData", params);
};

// 获取财务分页
const getFinanceDataPageList = (params) => {
  return HTTP.get("/Finance/GetFinanceDataPageList", params);
};

// 获取财务详情数据
const getFinanceOrderDataPageList = (params) => {
  return HTTP.get("/Finance/GetFinanceOrderDataPageList", params);
};

// 财务审核
const getFinanceOrderAudit = (params) => {
  return HTTP.post("/Finance/Audit", params);
};

// 删除详情订单
const getFinanceOrderDelete = (params) => {
  return HTTP.post("/Finance/Order/Delete", params);
};

export {
  getFinanceData,
  getFinanceDataPageList,
  getFinanceOrderDataPageList,
  getFinanceOrderAudit,
  getFinanceOrderDelete,
};
