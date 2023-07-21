// import mutations from './mutations'


const user = {
    namespaced: true,
    state() {
        return {
            token: "",
            permission: [],
            filterRouter: []
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
            state.filterRouter = list;
        },
        SET_PERMISSION_LIST(state, val) {
            state.permission = val
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
        filterRouter: state => state.filterRouter
    }
}



export default user