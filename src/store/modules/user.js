// import mutations from './mutations'
import HOME from "@/pages/home/api";

const user = {
    namespaced: true,
    state() {
        return {
            token: "",
            permission: [],
            filterRouter: [],
            info: {}
        }
    },
    mutations: {
        // 设置token
        SET_USER_TOKEN(state, val) {
            state.token = val
        },
        // 删除token
        REMOVE_TOKEN(statem) {
            state.token = "" // 删除vuex的token
        },
        SET_FILTERROUTER_LIST(state, list) {
            state.filterRouterList = list;
        },
        SET_PERMISSION_LIST(state, val) {
            state.permission = val
        },
        SET_USER_INFO(state, val) {
            state.info = val
        }
    },
    actions: {
        getPermissionList({ commit }) {
            let list = [1];
            commit('SET_PERMISSION_LIST', list);
            return list;
            // return new Promise((resolve, reject) => {

            // });
        },
        getUserInfo({ commit }) {
            HOME.getUserInfo().then(res=>{
                if (res.code == '0') {
                    // res.data.isAdmin = 1
                    commit('SET_USER_INFO', res.data);
                    window.localStorage.setItem('isAdmin', res.data.isAdmin || 0)
                }else {
                    commit('SET_USER_INFO', {});
                }
            })
        }
    },
    getters: {
        permissionList: state => state.permission,
        info: state => state.info,
        filterRouter: state => state.filterRouter
    }
}



export default user