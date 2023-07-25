import HTTP from '@/utils/request';

export default {

  // 分页查询运营后台用户列表
  getOperateTableList(params) {
    return HTTP.get("/User/Page", params );
  },

  // 重置密码
  resetPassword(params) {
    return HTTP.post("/User/ResetPwd", params );
  },

  // 批量删除
  batchDelete(params) {
    return HTTP.post("/User/BatchDelete", params );
  },

  // 添加用户
  addUser(params) {
    return HTTP.post("/User/Add", params );
  },

  // 修改账号状态
  updateStatus(params) {
    return HTTP.post("/User/EditStatus", params );
  },
}