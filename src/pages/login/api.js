import HTTP from '@/utils/request';

export default {

  // 登录接口
  login(params) {
    return HTTP.post("/User/Login", params );
  },

  // 忘记密码
  forgetPassword(params) {
    return HTTP.post("/User/ForgetPwd", params );
  },

  // 发送手机验证码
  SendCode(params) {
    return HTTP.post("/User/SendCode", params );
  },
}