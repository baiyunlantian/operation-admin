// import mutations from './mutations'


const user = {
    state: {
        token: ""
    },
    mutations: {
        // 设置token
        SET_USER_TOKEN(state, val) {
            state.token = val
        },
        // 删除token
        REMOVE_TOKEN(state) {
            state.token = "" // 删除vuex的token
        },

    },
    action: {
        login(commit) {
            commit("SET_USER_TOKEN", true)
        }
    },
    getter: {}
}



export default user