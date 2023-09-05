import HTTP from '@/utils/request';

export default {

  // 获取销售/代理个人信息
  getAgentUserInfo(params) {
    return HTTP.get("/SalesAgency/UserInfo", params );
  },

  // 获取提现相关信息
  getOrderCommissionInfo(params) {
    return HTTP.get("/SalesAgency/OrderCommissionInfo", params );
  },

  // 获取银行卡信息
  getBankCardInfo(params) {
    return HTTP.get("/SalesAgency/BankCardInfo", params );
  },

  // 编辑银行卡信息
  editBankCardInfo(params) {
    return HTTP.post("/SalesAgency/Edit/BankCardInfo", params );
  },

  // 押金缴纳
  CashPledgePayment(params) {
    return HTTP.post("/SalesAgency/CashPledgePayment", params );
  },

  // 提现
  WithdrawalDeposit(params) {
    return HTTP.post("/SalesAgency/WithdrawalDeposit", params );
  },

  // 查询订单支付状态
  queryPayStatus(params) {
    return HTTP.post("/SalesAgency/WithdrawalDeposit", params );
  },
}