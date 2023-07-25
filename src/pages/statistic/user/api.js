import HTTP from '@/utils/request';

export default {
  // 查询用户总览信息
  getTotalUserNumber(params) {
    return HTTP.get("/Statistics/UserNumber/Overview", params );
  },

  // 用户增长情况统计
  getUserIncreaseStatistic(params) {
    return HTTP.get("/Statistics/UserNumber", params );
  },

  // 用户来源统计
  getUserSourceStatistic(params) {
    return HTTP.get("/Statistics/UserNumber/DataSource", params );
  },
}