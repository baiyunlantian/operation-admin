

// 随机数
const S4 = function () {
    return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
};

// guid生成器
export function guid() {
    return (S4() + S4() + '-' + S4() + '-' + S4() + '-' + S4() + '-' + S4() + S4() + S4()
    );
}
// 后端请求
export function requestGuid() {
    let resID = ""
    for (let i = 0; i < 8; i++) {
        resID += S4()
    }
    return resID
}
