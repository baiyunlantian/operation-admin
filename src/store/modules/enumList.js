import { getEnum } from '@/api/enum.js'


const enumList = {
    namespaced: true,
    data() {
        return {
            enumList: {
                key1: {
                    default: '123',
                    type: "SELECT", // 单选有选项值
                    list: [{
                        id: "",
                        value: ""
                    }]
                },
                key2: {
                    default: "xxx",
                    type: "SELECT_MULTIPLE", //多选选项值
                    list: [{
                        id: "",
                        value: ""
                    }]
                },
                key3: {
                    default: "xxx",
                    type: "STRING", // 输入框
                },
                key3: {
                    default: 0,
                    type: "STEPE",
                    max: 100,
                    min: 10
                }
            }
        }
    },
    mutations: {
        ADD_ENUM: (state, data) => {
            state.enumList = data
        },
    },
    actions: {
        getEnum(commit) {
            getEnum().then(res => {
                // console.log(res)
                if (res) {
                    commit('ADD_ENUM', res.data)
                }
            })
        },
    }
}


export default enumList