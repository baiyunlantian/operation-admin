
import request from '@/utils/request'

/** 按类型获取枚举 */
export function getEnum(data) {
    return request.get("MJ/ParamterAttribute/GetNoPageList", data)
}