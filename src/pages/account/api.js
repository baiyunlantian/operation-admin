import HTTP from '@/utils/request';

export default {
  // 修改用户个人资料
  updateUserInfo(params) {
    return HTTP.post("/User/Edit", params );
  },

  // 修改密码
  updatePassword(params) {
    return HTTP.post("/User/EditPwd", params );
  },
}