import { getEnum } from '@/api/enum.js'


const enumList = {
    namespaced: true,
    data() {
        return {
            enumList: {

            }
        }
    },
    mutations: {
        ADD_ENUM: (state, data) => {
            state.enumList = data
        },
    },
    actions: {
        getEnum({ commit }) {
            getEnum().then(res => {
                // console.log(res)
                if (res) {
                    commit('ADD_ENUM', res.data),
                        console.log(res.data)
                }
            })
        },
    }
}


export default enumList