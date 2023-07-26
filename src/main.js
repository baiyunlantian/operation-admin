import { createApp } from 'vue'
import ElementPlus from 'element-plus'
import zhCn from 'element-plus/dist/locale/zh-cn.mjs'
import { ElMessage } from 'element-plus'
// import 'element-plus/dist/index.css'
import './assets/css/index.scss'
// vuex
import store from './store/index'
// router 引入
import router from './router'

import App from './App.vue'

import Utils from './assets/js/utils'

import * as ElementPlusIconsVue from '@element-plus/icons-vue'

// import { cosUploadImage } from "./utils/cosUpload.js"
// cosUploadImage()

await store.dispatch('enumList/getEnum')

const app = createApp(App)
// 载入icons
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
    app.component(key, component)
}
// 载入element
app.use(ElementPlus, {locale: zhCn})
// 载入vuex
app.use(store)
// 路由引入
app.use(router);

app.config.globalProperties.$utils = Utils;
app.config.globalProperties.$message = ElMessage;

app.mount('#app')

