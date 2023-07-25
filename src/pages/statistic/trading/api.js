import HTTP from '@/utils/request';

export default {
  // 查询收益总览信息
  getTotalUserIncome(params) {
    return HTTP.get("/Statistics/UserIncome/Overview", params );
  },

  // 交易收益金额统计
  getUserIncomeStatistic(params) {
    return HTTP.get("/Statistics/UserIncome", params );
  },

  // 新老客户交易构成统计
  getNewAndOldStatistic(params) {
    return HTTP.get("/Statistics/UserIncome/NewAndOldStat", params );
  },

  // 用户收益分布统计
  getDistributionStatistic(params) {
    return HTTP.get("/Statistics/UserIncome/Distribution", params );
  },

  // 用户收益来源构成
  getDataSourcesStatistic(params) {
    return HTTP.get("/Statistics/UserIncome/DataSources", params );
  },
}