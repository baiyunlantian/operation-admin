import COS from 'cos-js-sdk-v5';


// const cos = new COS({
//     getAuthorization: (options, callback) => {
//         callback({
//             TmpSecretId: headers.TmpSecretId,
//             TmpSecretKey: headers.TmpSecretKey,
//             SecurityToken: headers.SecurityToken,
//             ExpiredTime: headers.ExpiredTime,
//         })

//     }
// });


// let headers = {
//     TmpSecretId: "",
//     TmpSecretKey: "",
//     SecurityToken: "",
//     StartTime: "",
//     ExpiredTime: "",
// };

// function getHeadersKeys(obj) {
//     let keyList = Object.keys(obj)
//     for (let key of keyList) {
//         headers[key] = obj[key];
//     }
// }



/**
 * 
 * 
 * @param {桶位置} cosBucket 
 * @param {桶key} cosRegion 
 * @param {文件名称} fileName 
 * @param {文件} file 
 * @param {文件上传回调} callBack 
 * ******************非必填************************
 * @param {做切片的上传的最小值} fileSize  kb为单位
 * @param {进度条回调} onProgressCallBack 
 * @param {文件上传完的回调} onFileFinishCallBack 
 * @returns 
 */
export function cosUploadImage(headers, cosBucket, cosRegion, fileName, file, callBack, fileSize = 0, onProgressCallBack = "", onFileFinishCallBack = "") {



    const cos = new COS({
        getAuthorization: (options, callback) => {
            callback({
                TmpSecretId: headers.TmpSecretId,
                TmpSecretKey: headers.TmpSecretKey,
                SecurityToken: headers.SecurityToken,
                ExpiredTime: headers.ExpiredTime,
            })

        }
    });


    return cos.uploadFile({
        Bucket: cosBucket,
        Region: cosRegion,
        Key: fileName,
        Body: file,
        SliceSize: fileSize,
        onProgress: function (info) {
            onProgressCallBack(info)
        },
        onFileFinish: function (err, data, options) {
            if (onFileFinishCallBack) {
                onFileFinishCallBack(err, data, options)

            }
        },
    }, (err, data) => {
        callBack(err, data)
    })
}

/**
 * 
 * @param {文件集合} fileList 
 * @param {默认的回调} callBack 
 * ****************非必填*******************
 * @param {做切片的上传的最小值} fileSize 
 * @param {进度条的回调} onProgressCallBack 
 * @param {上传完的回调} onFileFinishCallBack 
*/
export function cosBatchUploadImage(headers, fileList, callBack, fileSize, onProgressCallBack, onFileFinishCallBack) {


    const cos = new COS({
        getAuthorization: (options, callback) => {
            callback({
                TmpSecretId: headers.TmpSecretId,
                TmpSecretKey: headers.TmpSecretKey,
                SecurityToken: headers.SecurityToken,
                ExpiredTime: headers.ExpiredTime,
            })

        }
    });

    // getHeadersKeys(headers);
    return cos.uploadFiles({
        files: fileList,
        SliceSize: fileSize,    /* 设置大于10MB采用分块上传 */
        onProgress: function (info) {
            onProgressCallBack(info)
        },
        onFileFinish: function (err, data, options) {
            onFileFinishCallBack(err, data, options)
        },
    }, (err, data) => {
        callBack(err || data)
    });

}