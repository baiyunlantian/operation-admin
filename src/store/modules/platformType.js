import { getPlatformTypeList } from '@/api/platformType'


const platformType = {
  namespaced: true,
  data() {
    return {
      platformTypeList: []
    }
  },
  mutations: {
    ADD_PLATFORM_TYPE_LIST: (state, data) => {
      state.platformTypeList = data
    },
  },
  actions: {
    getPlatformTypeList({ commit }) {
      getPlatformTypeList().then(res => {
        if (res) {
          let list = []
          if (res.code == 0) {
            list = (res.data || []).map(item=>{
              return {label: item.platformName, key: item.platformType}
            })
          }
          commit('ADD_PLATFORM_TYPE_LIST', list)
        }
      })
    },
  },
  getters: {
    list: state => state.platformTypeList,
  }
}


export default platformType