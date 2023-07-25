import HTTP from '@/utils/request';

export default {

  // 分页查询会员用户列表
  getMemberTableList(params) {
    return HTTP.get("/User/Product/Page", params );
  },

  // 分页查询会员用户充值记录列表
  getRechargeRecordTableList(params) {
    return HTTP.get("/User/Product/RechargeRecord", params );
  },

  // 获取会员用户详情
  getUserInfoById(userId) {
    return HTTP.get(`/User/Product/Detail?userId=${userId}` );
  },

  // 修改会员账号状态
  updateStatus(params) {
    return HTTP.post("/User/Product/EditStatus", params );
  },
}