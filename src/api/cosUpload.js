
import request from '@/utils/request'


/** 获取cosToken */
export function getAuthorization(data) {
    return request.get("MJ/Common/GetUploadKey", data)
}