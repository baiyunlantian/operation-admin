import HTTP from '@/utils/request';

export default {

  // 获取产品目录
  getProductMenu(params) {
    return HTTP.get("/SalesAgency/Product", params );
  },

  // 获取产品选配
  getProductSelection(params) {
    return HTTP.get("/SalesAgency/ProductSelection", params );
  },

  // 结算
  SettlementOrder(params) {
    return HTTP.post("/SalesAgency/Settlement", params );
  },

  // 获取订单支付状态
  getPaymentRecord(params) {
    return HTTP.get("/SalesAgency/GetPaymentRecord", params );
  },
}