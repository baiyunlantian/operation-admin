import request from '@/utils/request'

// 获取平台类型
export function getPlatformTypeList(data) {
  return request.get("/Dic/PlatformTypeList", data)
}