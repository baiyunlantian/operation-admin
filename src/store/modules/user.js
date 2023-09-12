// import mutations from './mutations'
import HOME from "@/pages/home/api";
import ACCOUNT_API from "@/pages/account/api";

const user = {
  namespaced: true,
  state() {
    return {
      token: "",
      permission: [],
      filterRouter: [],
      info: {},
      agentInfo: {},
      roleId: '',
    };
  },
  mutations: {
    // 设置token
    SET_USER_TOKEN(state, val) {
      state.token = val;
    },
    // 删除token
    REMOVE_TOKEN(statem) {
      state.token = ""; // 删除vuex的token
    },
    SET_FILTERROUTER_LIST(state, list) {
      state.filterRouterList = list;
    },
    SET_PERMISSION_LIST(state, val) {
      state.permission = val;
    },
    SET_USER_INFO(state, val) {
      state.info = val;
    },
    SET_AGENT_USER_INFO(state, val) {
      state.agentInfo = val;
    },
    SET_ROLE_ID(state, val) {
      state.roleId = val;
    },
  },
  actions: {
    getPermissionList({ commit }) {
      let list = [1];
      commit("SET_PERMISSION_LIST", list);
      return list;
      // return new Promise((resolve, reject) => {

      // });
    },
    getUserInfo({ commit }) {
      HOME.getUserInfo().then((res) => {
        if (res.code == "0") {
          commit("SET_USER_INFO", res.data);
        } else {
          commit("SET_USER_INFO", {});
        }
      });
    },
    getAgentUserInfo({ commit }) {
      ACCOUNT_API.getAgentUserInfo().then((res) => {
        if (res.code == "0") {
          commit("SET_AGENT_USER_INFO", res.data);
        } else {
          commit("SET_AGENT_USER_INFO", {});
        }
      });
    },
    getRoleId({commit}) {
      return Promise.all([HOME.getUserInfo(), ACCOUNT_API.getAgentUserInfo()]).then(resArr=>{
        const userInfo = resArr[0].data, agentInfo = resArr[1].data;
        let roleId = 0;
        if (userInfo.isAdmin == 1) {
          roleId = 1;
        } else {
          roleId = agentInfo.roleId;
        }

        window.localStorage.setItem("roleId", roleId);
        commit("SET_ROLE_ID", roleId)
        commit("SET_AGENT_USER_INFO", agentInfo || {});
        commit("SET_USER_INFO", userInfo || {});
      })
    }
  },
  getters: {
    permissionList: (state) => state.permission,
    info: (state) => state.info,
    filterRouter: (state) => state.filterRouter,
    agentInfo: (state) => state.agentInfo,
    roleId: (state) => state.roleId,
  },
};

export default user;
