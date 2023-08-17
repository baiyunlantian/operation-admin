import HTTP from '@/utils/request';

export default {

  // 课程用户列表
  getCourseUserList(params) {
    return HTTP.get("/RedemptionCode/Page", params );
  },

  // 批量导入手机号
  batchAddPhone(params) {
    return HTTP.post("/RedemptionCode/BatchAdd", params );
  },

  // 批量删除手机号
  batchDeletePhone(params) {
    return HTTP.post("/RedemptionCode/BatchDelete", params );
  },
}