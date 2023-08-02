import { ElMessage } from 'element-plus'

export function setTimeEscalation() {
    let time = 0;
    return function (callback, handleNot, delay = 3000) {
      let startTime = new Date().getTime();
      if (startTime - time > delay) {
        if (typeof callback == 'function') {
          callback();
        }
        time = startTime;
      } else {
        if (typeof handleNot == 'function') {
          handleNot();
        }
      }
    }
  }
const utils = {
    // 格式化时间函数 'yyyy-MM-dd hh:mm:ss'
    formatTimeDate(date, fmt) {
        if (date == null || date == undefined || date == '') {
            return ''
        }
        var date = new Date(date);
        if (/(y+)/.test(fmt)) {
            fmt = fmt.replace(RegExp.$1, (date.getFullYear() + '').substr(4 - RegExp.$1.length));
        }
        let o = {
            'M+': date.getMonth() + 1,
            'd+': date.getDate(),
            'h+': date.getHours(),
            'm+': date.getMinutes(),
            's+': date.getSeconds()
        };
        for (let k in o) {
            if (new RegExp(`(${k})`).test(fmt)) {
                let str = o[k] + '';
                fmt = fmt.replace(RegExp.$1, (RegExp.$1.length === 1) ? str : ('00' + str).substr(str.length));
            }
        }
        return fmt;
    },
  
    // 格式化时间 例:format = 'YY-MM-DD hh:mm:ss'
    formatTime(time, format) {
        var date = new Date(time);
    
        var year = date.getFullYear(),
            month = date.getMonth() + 1, // 月份是从0开始的
            day = date.getDate(),
            hour = date.getHours(),
            min = date.getMinutes(),
            sec = date.getSeconds();
        var preArr = Array.apply(null, Array(10)).map(function (elem, index) {
            return '0' + index;
        }); // 开个长度为10的数组 格式为 00 01 02 03
    
        var newTime = format.replace(/YY/g, year)
            .replace(/MM/g, preArr[month] || month)
            .replace(/DD/g, preArr[day] || day)
            .replace(/hh/g, preArr[hour] || hour)
            .replace(/mm/g, preArr[min] || min)
            .replace(/ss/g, preArr[sec] || sec);
    
        return newTime;
    },
  
    // 验证是否为空
    validEmpty(val) {
        if (
            typeof(val) === 'string' && val.trim() === '' 
            || typeof(val) === 'string' && val === 'null'
            || typeof(val) === 'string' && val === 'undefined'
            || val === null
            || val === undefined 
            || val + '' === 'NaN'
            || val === false
            || Object.prototype.toString.call(val) === '[object Array]' && val.length === 0 
            || Object.prototype.toString.call(val) === '[object Object]' && Object.keys(val).length == 0
        ) {
            return true
        } else {
            return false
        }
    },
  
    // 验证手机号
    validPhone(val) {
        var exp = /^1(3|4|5|6|7|8|9)\d{9}$/;
        if (exp.test(val)) {
            return true
        } else {
            return false
        }
    },
  
    // 验证密码（数字字母下划线组合）
    validPassword(val) {
        var exp = /^[a-zA-Z0-9_]{6,16}$/
        if (exp.test(val)) {
            return true
        } else {
            return false
        }
    },
  
    // 验证长度
    validLength(min, val, max)  {
        if (val.trim().length >= min && val.trim().length <= max) {
            return true
        } else {
            return false
        }
    },
  
    // 验证两值相等
    validEqual(val1, val2) {
        if (val1 === val2) {
            return true
        } else {
            return false
        }
    },

    // 验证微信号
    vaildWechat(val) {
        var exp = /^[a-zA-Z]([-_a-zA-Z0-9]{5,19})+$/
        if (exp.test(val)) {
            return true
        } else {
            return false
        }
    },

    // 验证QQ号
    validQQ(val) {
        var exp = /^[1-9][0-9]{4,9}$/gim
        if (exp.test(val)) {
            return true
        } else {
            return false
        }
    },

    // 验证传真号
    validFax(val) {
        var exp = /^(\d{3,4}-)?\d{7,8}$/
        if (exp.test(val)) {
            return true
        } else {
            return false
        }
    },
  
    // 验证邮箱地址
    vaildEmail(val) {
        var exp = /^[a-zA-Z0-9_.-]+@[a-zA-Z0-9-]+(\.[a-zA-Z0-9-]+)*\.[a-zA-Z0-9]{2,6}$/;
        if (exp.test(val)) {
            return true
        } else {
            return false
        }
    },
  
    // 验证身份证号
    validIdCard(val)  {
        var exp = /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/;
        if (exp.test(val)) {
            return true
        } else {
            return false
        }
    },

    // 验证发票抬头
    validInvoice(val) {
        var exp = /^[0-9a-zA-Z\(\)\（\）\u4e00-\u9fa5]{0,50}$/
        if (exp.test(val)) {
            return true
        } else {
            return false
        }
    },

    // 纳税人识别号
    validTaxpayer(val) {
        var exp = /^[A-Z0-9]{15}$|^[A-Z0-9]{17}$|^[A-Z0-9]{18}$|^[A-Z0-9]{20}$/
        if (exp.test(val)) {
            return true
        } else {
            return false
        }
    },

    // 验证银行卡号
    validBankCard(val) {
        var exp = /^([1-9]{1})(\d{15}|\d{18})$/;
        if (exp.test(val)) {
            return true
        } else {
            return false
        }
    },
    
    // 验证网址
    validWeburl(val) {
        var exp = /^([hH][tT]{2}[pP]:\/\/|[hH][tT]{2}[pP][sS]:\/\/)(([A-Za-z0-9-~]+)\.)+([A-Za-z0-9-~\/])+$/
        if (exp.test(val)) {
            return true
        } else {
            return false
        }
    },
    
    // 验证价格
    validPrice(val) {
        var exp = /((^[1-9]\d*)|^0)(\.\d{0,2}){0,1}$/;
        if (exp.test(val)) {
            return true
        } else {
            return false
        }
    },

    // 价格保留两位小数
    formatPrice(val) {
        // 1、字符串类型
        // var vals = Number(val);
        // return vals.toFixed(2);
    
        return Math.round(val * 100) / 100 // 
        // return Math.floor(val * 100) / 100;
    },
  
    // 验证 0-9 整数
    validNum(val) {
        var exp = /^\+?[0-9][0-9]*$/
        if (exp.test(val)) {
            return true
        } else {
            return false
        }
    },
    
    // 验证 1-9 整数
    validNum_(val) {
        var exp = /^\+?[1-9][0-9]*$/
        if (exp.test(val)) {
            return true
        } else {
            return false
        }
    },
    // 验证计算结果
    validCount(val) {
        val += ''
        if (val < 0 || val === 'Infinity' || val === '-Infinity' || val === 'NaN') {
            ElMessage.error('计算结果为负数或值非法')
            return false
        } else {
            return true
        } 
    },

    // 验证字符串包含表情
    validString(val) {
        var exp = /(\ud83c[\udf00-\udfff])|(\ud83d[\udc00-\ude4f])|(\ud83d[\ude80-\udeff])/g;
        if (exp.test(val)) {
            return true
        } else {
            return false
        }
    },

    // 排序，真为升，假为降 例：arr.sort(this.utils.compare('id', false));
    compare(property, bool) {
        return function(a, b) {
            var val1 = a[property];
            var val2 = b[property];
            if (bool) {
                return val1 - val2
            } else {
                return val2 - val1
            }
        }
    },

    // 不改变原数据，深拷贝 ===================
    // 数组，对象
    cloneArray(val) {
        var that = this
        var newobj = Object.prototype.toString.call(val) === '[object Array]' ? [] : {};
        if (typeof val !== 'object') {
            return;
        }
        for (var i in val) {
            newobj[i] = typeof val[i] === 'object' && val[i] !== null ? that.cloneArray(val[i]) : val[i];
        }
        return newobj
    },
    // 对象，数组
    cloneObject(origin, target) {
        var that = this,
            tar = target || {}

        for (var k in origin) {
            if (origin.hasOwnProperty(k)) {
                if (typeof origin[k] === 'object' && origin[k] !== null) {
                    tar[k] = Object.prototype.toString.call(origin[k]) === '[object Array]' ? [] : {}
                    that.cloneObject(origin[k], tar[k])
                } else {
                    tar[k] = origin[k]
                }
            }
        }
        return tar
    },
    
    // // 验证图片资源
    // validImage(val) {
    //     if (val){
    //         var e1 = 'https://wx.qlogo.cn',
    //             e2 = process.env.API_DOMAIN
    //         var exp1 = new RegExp('^' + e1),
    //             exp2 = new RegExp('^' + e2),
    //             exp3 = new RegExp("[\\u4E00-\\u9FFF]+", "g")
    
    //         if (exp3.test(val)) {
    //             val = encodeURI(val);
    //         }
            
    //         if (!exp1.test(val) && !exp2.test(val)) {
    //             return process.env.API_DOMAIN + val
    //         } else {
    //             return val
    //         }
    //     } 
    // },

    validImageUrl(data) {
        var mainUrl = 'https://p16-oec-sg.ibyteimg.com/'
        var endUrl = '~tplv-aphluv4xwc-origin-jpeg.jpeg'
        var aliUrl = 'https://ae03.alicdn.com'
        if (typeof(data) === 'string') {
            if (data.indexOf(mainUrl) === -1 && data.indexOf(aliUrl) === -1) {
                data = mainUrl + data
            } 
            if (data.indexOf(endUrl) === -1 && data.indexOf(aliUrl) === -1) {
                data = data + endUrl
            } 
        } else if (Object.prototype.toString.call(data) === '[object Array]' && data.length !== 0) {
            data.forEach((item, index) => {
                if (item.id.indexOf(mainUrl) === -1) {
                    item.id = mainUrl + item.id
                } 
                if (item.id.indexOf(endUrl) === -1) {
                    item.id = item.id + endUrl
                } 
            })
        } else if (Object.prototype.toString.call(data) === '[object Object]' && Object.keys(data).length !== 0) {
            for (var i in data) {
                if (data[i].indexOf(mainUrl) === -1) {
                    data[i] = mainUrl + data[i]
                } 
                if (data[i].indexOf(endUrl) === -1) {
                    data[i] = data[i] + endUrl
                } 
            }
        }
        return data
    },
    shopeeValidImageUrl(data) {
        var mainUrl = 'https://cf.shopee.sg/file/'
        if (typeof(data) === 'string') {
            if (data.indexOf(mainUrl) === -1) {
                data = mainUrl + data
            } 
        } else if (Object.prototype.toString.call(data) === '[object Array]' && data.length !== 0) {
            data.forEach((item, index) => {
                if (item.id.indexOf(mainUrl) === -1) {
                    item.id = mainUrl + item.id
                } 
                if (item.id.indexOf(endUrl) === -1) {
                    item.id = item.id + endUrl
                } 
            })
        } 
        return data
    },
    // 处理富文本图片自适应
    validRichTextImage(data) {
        if (data) {
            return data.replace(/<img/g, '<img style="display: block; width: 100%; height: auto;"')
        }
    },
    // 处理富文本内容
    validRichTextContent(data) {
        if (data) {
            return data.replace(/<p><br><\/p>/g, '')
        }
    },
    // 获取富文本图片链接
    changeRichImage(val) {
        // var val = `
        // <img src='https://p16-oec-va.ibyteimg.com/tos-maliva-i-o3syd03w52-us/1bb8ee4a21ee46b9b14629b5b2463a04~tplv-o3syd03w52-origin-jpeg.jpeg?'>
        // <img src='https://p16-oec-va.ibyteimg.com/tos-maliva-i-o3syd03w52-us/abb005333f3f45c9803ef320d649959f~tplv-o3syd03w52-origin-jpeg.jpeg?'>
        // <img src='https://p16-oec-va.ibyteimg.com/tos-maliva-i-o3syd03w52-us/46b6ea7b86d543e1b770d50c62589fb8~tplv-o3syd03w52-origin-jpeg.jpeg?'>
        // <img src='https://p16-oec-va.ibyteimg.com/tos-maliva-i-o3syd03w52-us/a83111162e2c4cc4bd1409351a4539d2~tplv-o3syd03w52-origin-jpeg.jpeg?'>
        // <img src='https://p16-oec-va.ibyteimg.com/tos-maliva-i-o3syd03w52-us/8661cc194d0048aeaafc71fb155858b8~tplv-o3syd03w52-origin-jpeg.jpeg?'>
        // <img src='https://p16-oec-va.ibyteimg.com/tos-maliva-i-o3syd03w52-us/6bd6b72e886a4a7087b4028124537364~tplv-o3syd03w52-origin-jpeg.jpeg?'>
        // <img src='https://p16-oec-va.ibyteimg.com/tos-maliva-i-o3syd03w52-us/b40566d5ff714c55b639a20e21ccfc9e~tplv-o3syd03w52-origin-jpeg.jpeg?'>
        // <img src='https://p16-oec-va.ibyteimg.com/tos-maliva-i-o3syd03w52-us/97785adeee58424580ce49a4a4fe8a37~tplv-o3syd03w52-origin-jpeg.jpeg?'>
        // <p><strong 
        // style=\"background-color: rgb(245, 247, 250); color: rgb(96, 98, 102);\">
        // Amazon's new baby travel diaper pad multi-purpose trailer mother-baby septet 
        // pad portable baby supplies.Amazon's new baby travel diaper pad multi-purpose trailer 
        // mother-baby septet pad portable baby supplies.</strong>
        // </p>
        // <img src='https://p16-oec-va.ibyteimg.com/tos-maliva-i-o3syd03w52-us/0217d2a2f2954ced8042ac5d34ff4724~tplv-o3syd03w52-origin-jpeg.jpeg?'>
        // <p>
        // <img src='https://p16-oec-va.ibyteimg.com/tos-maliva-i-o3syd03w52-us/b56a2f5096a74bf5a344e8b6bc8e9e4f~tplv-o3syd03w52-origin-jpeg.jpeg?'>
        // </p>
        // <img src='https://p16-oec-va.ibyteimg.com/tos-maliva-i-o3syd03w52-us/d1c7b7ced0ae4f93a4fd5c2c5cbd0237~tplv-o3syd03w52-origin-jpeg.jpeg?'>
        // `
        if (!val) return
        var exp1 =/<img.*?(?:>|\/>)/gi     // /src=(\S*)>/g
        var exp2 = /src=[\'\"]?([^\'\"]*)[\'\"]?/    //  /^src=['"]|['"]>/g
        var dataArr = []
        var vals = val.match(exp1);
        if(vals ==null){

        }else{
            vals.forEach((item, index) => {
                //dataArr.push(item.replace(exp2, ''))
                dataArr.push(item.match(exp2)[1])
            })
        }
        return dataArr
    },
    // 获取富文本文案
    changeRichText(val) {
        if (!val) {
            return
        } 
        var val_ = val.replace(/<[^<>]+>/g, '+')
                      .replace(/&nbsp;/gi, '')
                      .split('+')
        var dataArr = []              
        val_.forEach((item, index) => {
            if (!utils.validEmpty(item)) {
                dataArr.push(item)
            } 
        })
        return dataArr
    },
        
    // JSEncrypt 加密
    jsEncrypt(val) {
        var publicKey = 'MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAv1SRM+mg8oUCg+qq3nW5cCj2nzMI5ppHEZWFijeBEGu5cbcN1SysU/SM/PWWP8B+N5xi11dyOcwbt3UogzWlWM3atvGKDaAy0PluMQmGBtdmcurixIYZZrut7knD/o3KPmkyhiOWcJYACNxKEbHaA3zA/YZs8nQHLIHxhIpxTGYw5QEJksjw/jR1eajgYjsIqILbKWZDkr8+EiYdGfTRcDzvbNYicP6T7rsx13atKktZJ3qvy3b5c+Pdhvu8Zcr+uifBeBeASHjWW0cuutK1OHAFff2J37NZcOyHR1Smtj9221tuxcMbjdq2QUUVYnPoM+BESL5jK92pBDuzsm26ZwIDAQAB'
        var en = new JSEncrypt();
        en.setPublicKey(publicKey);
        var password = en.encrypt(val)
        return password
    },

    // 生成skuCode
    skuCode() {
        var result = ''
        for (var i in 8) {
            result += (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1)
        }
        return result
    },
    skuProductCode() {
        return Math.random().toString().substring(2)
    },

    // 规格表格表单数据 ========================
    // 验证 input value
    validateInput(rule, value, callback) {
        if (value === '' || value === null || value === undefined) {
            return callback(new Error('此项必填！'))
        } else {
            callback()
        }
    },
    // 验证价格
    validatePrices(rule, value, callback) {
        if (rule.required === false && (value === '' || value === null || value === undefined)) {
            callback()
        }
        const isPrice = /(^[1-9]\d*(\.\d{1,2})?$)|(^0(\.\d{1,2})?$)/;
        if (isPrice.test(value)) {
            callback()
        } else {
            callback(new Error(rule.message || '请输入正确的价格，例：10, 10.00'))
        }
    },
    // 验证数字
    validateNumber(rule, value, callback) {
        if (rule.required === false && (value === '' || value === null || value === undefined)) {
            callback()
        }
        const isNumber = /^\+?[0-9][0-9]*$/;
        if (isNumber.test(value)) {
            callback()
        } else {
            callback(new Error(rule.message || '请输入正确的数字，>=0，例：10'))
        }
    },
    validateNumber_(rule, value, callback) {
        if (rule.required === false && (value === '' || value === null || value === undefined)) {
            callback()
        }
        const isNumber = /^\+?[1-9][0-9]*$/;
        if (isNumber.test(value)) {
            callback()
        } else {
            callback(new Error(rule.message || '请输入正确的数字，>=1，例：10'))
        }
    },
    validatePhone(rule, value, callback) {
        if (rule.required === false && (value === '' || value === null || value === undefined)) {
            callback()
        }
        const isPhone = /^1(3|4|5|6|7|8|9)\d{9}$/;
        if (isPhone.test(value)) {
            callback()
        } else {
            callback(new Error(rule.message || '请输入正确的手机号码'))
        }
    },
    validatePassword(rule, value, callback) {
        if (rule.required === false && (value === '' || value === null || value === undefined)) {
            callback()
        }
        var exp = /^[a-zA-Z0-9_]{6,16}$/
        if (exp.test(value)) {
            callback()
        } else {
            callback(new Error(rule.message || '请输入正确的密码'))
        }
    },
    // 复制文本
    copy(t) { 
        var input = document.createElement("input");
        input.value = t;
        document.body.appendChild(input);
        input.select();
        document.execCommand("Copy");
        document.body.removeChild(input);
    },
    // 删除数组对象下面匹配的值返回原数组   使用方式： this.utils.removeAll(array, (it) => it.id === data);
    removeAll(arr, predicate) { 
        for (let i = arr.length - 1; i >= 0; i--) {
          if (predicate(arr[i], i, arr)) {
            arr.splice(i, 1);
          }
        }
        return arr;
    },

    // 获取目标日期前多少天的具体日期
    getDateBeforeDays(beforeDays = 1, targetDate) {
        let current = targetDate || new Date()
        let currentYear = current.getFullYear(), currentMonth = current.getMonth() + 1, currentDate = current.getDate()
        let beforeYear = currentYear, beforeMonth = currentMonth, beforeDate = currentDate - beforeDays

        // 月份倒退上一月
        if (beforeDate < 1) {
            beforeMonth -= 1

            // 年份倒退上一年，月份倒退到12月份
            if (beforeMonth < 1) {
                beforeYear -= 1
                beforeMonth = 12
            }

            let _date = new Date(`${beforeYear}-${beforeMonth}`)
            _date.setMonth(_date.getMonth() + 1)
            _date.setDate(0)
            // 获取上个月份的天数
            let days = _date.getDate()
            beforeDate = days + currentDate - beforeDays
        }

        if (beforeMonth < 10) {
            beforeMonth = '0' + beforeMonth
        }

        if (beforeDate < 10) {
            beforeDate = '0' + beforeDate
        }

        return `${beforeYear}-${beforeMonth}-${beforeDate}`
    }
}
export default utils
  
  
  