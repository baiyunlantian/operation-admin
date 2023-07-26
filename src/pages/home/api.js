import HTTP from '@/utils/request';

export default {

  // 获取用户个人资料
  getUserInfo(params) {
    return HTTP.get("/User/Info", params );
  },

 // 首页数据总览
  getBoardInfo(params) {
    return HTTP.get("/Home/BoardInfo ", params );
  },

  // 用户统计数据
  getUserStatistic(params) {
    return HTTP.get("/Home/UserStatistics", params );
  },

  // 收益统计数据
  getIncomeStatistics(params) {
    return HTTP.get("/Home/IncomeStatistics", params );
  },
}