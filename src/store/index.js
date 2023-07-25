import { createStore } from 'vuex'

// 获取modules下所有的js文件
const modulesFiles = require.context('./modules', true, /\.js$/)


const modules = modulesFiles.keys().reduce((modules, modulePath) => {
    // 获取每个文件的名称
    const moduleName = modulePath.replace(/^\.\/(.*)\.\w+$/, '$1')
    // 获取文件的内容
    const value = modulesFiles(modulePath)
    // 文件名称:内容信息
    modules[moduleName] = value.default
    return modules
}, {})


const store = new createStore({
    modules,
    state() {

    },
    mutations: {

    },
    actions: {
        
    },

})


export default store