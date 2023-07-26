// import mutations from './mutations'


const user = {
    namespaced: true,
    state() {
        return {
            token: "",
            permission: [],
            filterRouter: [],
            info: {
                account:'13765756753',
                email:'23464',
                userName:'wovovo',
                createdTime: "须确方界",
                lastLoginTime: "",
                userImage: ""
            }
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
        }
    },
    getters: {
        permissionList: state => state.permission,
        info: state => state.info,
        filterRouter: state => state.filterRouter
    }
}



export default user