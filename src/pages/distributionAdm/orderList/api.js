import HTTP from "@/utils/request";

// 订单数据
const getOrderData = (params) => {
  return HTTP.get("/DistributionManage/GetOrderData", params);
};

// 获取订单分页
const getOrderPage = (params) => {
  return HTTP.get("/AgencyOrder/GetAgencyOrderDataPageList", params);
};

// 订单操作-取消
const editOrderCancel = (params) => {
  return HTTP.post("/AgencyOrder/Order/Cancel", params);
};

// 订单完成
const editOrderCarry = (params) => {
  return HTTP.post("/AgencyOrder/Order/Carry", params);
};

// 订单详情
const getOrderDetails = (params) => {
  return HTTP.get("/AgencyOrder/GetAgencyOrderDetailData", params);
};

// 修改备注
const getRemark = (params) => {
  return HTTP.get("/Order/Remark", params);
};

export {
  getOrderData,
  getOrderPage,
  editOrderCancel,
  editOrderCarry,
  getOrderDetails,
  getRemark,
};
