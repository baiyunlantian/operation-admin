import axios from 'axios'
import { ElLoading, ElMessage } from 'element-plus'
// import config from './index'
import router from '../router';

// 创建axios默认请求
const service = axios.create({
    baseURL: process.env.VUE_APP_BASE_API,
    // token认证
    headers: {
        // 'token': window.localStorage.getItem("authorization") || ""
    },
    timeout: 5000 // request timeout

})
// 请求拦截
service.interceptors.request.use(config => {
    // token认证
    config.headers['authorization'] = window.localStorage.getItem("token") || "";
    // // 显示加载动画
    // ElLoading.service({
    //   lock: true,
    //   text: 'Loading',
    //   background: 'rgba(0, 0, 0, 0.7)',
    // })
    console.log(config,"=================")
    return config
}, error => {
    // Do something with request error
    console.error('requestERROR', error)
})

// 响应拦截
service.interceptors.response.use(response => {
    let result = response.data;

    // 关闭加载动画
    // ElLoading.service().close();

    if (result.code == 4001) {
        window.localStorage.token = result.refsToken;
    } else if (result.code !== 200) {

        switch (result.code) {
            case '401':
                ElMessage.error('登录已过期，重新登录');
                window.localStorage.removeItem("token");
                window.localStorage.setItem('userInfo', '{}');
                router.push({
                    name: 'login'
                });
                break;
            default:
                ElMessage.error(result.msg);
        }
        return Promise.reject({ msg: result.msg })
    }
    return result;
}, error => {
    ElMessage.error(error.message);
    console.error('responseERROR', error);
    // // 关闭加载动画
    // ElLoading.service().close();
})
export default {
    //get请求
    get(url, param) {
        return new Promise((resolve, reject) => {
            service({
                method: 'get',
                url,
                params: param,
            }).then(res => {
                resolve(res)
            }).catch(error => {
                reject(error)
            })
        })
    },
    //post请求
    post(url, param) {
        return new Promise((resolve, reject) => {
            service.post(
                url,
                param,
            ).then(res => {
                resolve(res)
            }).catch(error => {
                reject(error)
            })
        })
    },
    // PUT
    put(url, param) {
        return new Promise((resolve, reject) => {
            service.put(
                url,
                param,
            ).then(res => {
                resolve(res)
            }).catch(error => {
                reject(error)
            })
        })
    },
    file(url, param) {
        return new Promise((resolve, reject) => {
            service.post(
                url,
                param
                , { responseType: 'blob' }).then(res => {
                    resolve(res)
                }).catch(error => {
                    reject(error)
                })
        })
    },
}