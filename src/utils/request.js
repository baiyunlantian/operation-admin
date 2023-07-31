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
    console.log(config)
    config.headers['authorization'] = window.localStorage.getItem("token") || "";
    // // 显示加载动画
    // ElLoading.service({
    //   lock: true,
    //   text: 'Loading',
    //   background: 'rgba(0, 0, 0, 0.7)',
    // })
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
    } else if (result.code !== 0) {
        switch (result.code) {
            case 401:
                ElMessage.error('登录已过期，重新登录');
                window.localStorage.removeItem("token");
                window.localStorage.removeItem('userInfo');
                router.push({
                    path: 'login'
                });
                break;
            case 101:
                ElMessage.error('接口错误ParamError');
                break;
            case 201:
                ElMessage.error('操作失败OperateFail');
                break;
            case 301:
                ElMessage.error('数据错误DataNotExist');
                break;
            case 501:
                ElMessage.error('权限错误，请联系管理员');
                break;
            case 601:
                ElMessage.error('会员权限错误');
                break;
            case 999:
                ElMessage.error('系统错误，请稍后再试');
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
    post(url, param, headers = "", onDownloadProgress = () => { }) {
        return service.post(
            url,
            param,
            { headers, onDownloadProgress }
        )
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