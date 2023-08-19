import HTTP from '@/utils/request';

export default {

  // 查看邀请奖励规则
  getInvitationRewardRules(params) {
    return HTTP.get("/DistributionManage/Activity/Content", params );
  },

  // 设置邀请奖励规则
  setInvitationRewardRules(params) {
    return HTTP.post("/DistributionManage/Activity/Content", params );
  },

  // 获取邀请链接
  getInvitationLink(params) {
    return HTTP.get("/DistributionManage/GetInvitationLink", params );
  },

  // 获取分销用户分页列表
  getDistributionManageList(params) {
    return HTTP.get("/DistributionManage/User/Page", params );
  },

  // 获取分销用户详情
  getDetailByUserId(params) {
    return HTTP.get("/DistributionManage/User/Detail", params );
  },

  // 获取邀新用户分页列表
  getInviteUserList(params) {
    return HTTP.get("/DistributionManage/InviteUser/Page", params );
  },

  // 推广佣金设置
  setCommission(params) {
    return HTTP.post("/DistributionManage/Commission/Set", params );
  },

  // 获取推广佣金设置信息
  getCommission(params) {
    return HTTP.get("/DistributionManage/Commission/Info", params );
  },
}