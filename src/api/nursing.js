import { fetch, post, patch, del ,post4JSON} from '../libs/http'


// 护理服务类型列表
export function findNursingServiceType (params) {
  return fetch('nursingServiceType/list', params)
}

// 护理服务类型添加
export function doNursingServiceTypeAdd (params) {
  return post('nursingServiceType/add', params)
}

// 护理服务类型编辑
export function doNursingServiceTypeEdit (params) {
  return patch('nursingServiceType/update', params)
}

// 护理服务类型删除
export function doNursingServiceTypeDel (params) {
  return del('nursingServiceType/del', params)
}

// 护理服务类型删除(多个)
export function doNursingServiceTypeDelMany (params) {
  return del('nursingServiceType/deleteMany', params)
}




// 护理服务列表
export function findNursingService(params) {
  return fetch('nursingService/list', params)
}

// 护理服务添加
export function doNursingServiceAdd (params) {
  return post('nursingService/add', params)
}

// 护理服务编辑
export function doNursingServiceEdit (params) {
  return patch('nursingService/update', params)
}

// 护理服务删除
export function doNursingServiceDel (params) {
  return del('nursingService/del', params)
}

// 护理服务删除(多个)
export function doNursingServiceDelMany (params) {
  return del('nursingService/deleteMany', params)
}



// 子护理服务列表
export function findNursingServiceDetail(params) {
  return fetch('nursingServiceDetail/list', params)
}

// 子护理服务添加
export function doNursingServiceDetailAdd (params) {
  return post('nursingServiceDetail/add', params)
}

// 子护理服务编辑
export function doNursingServiceDetailEdit (params) {
  return patch('nursingServiceDetail/update', params)
}

// 子护理服务删除
export function doNursingServiceDetailDel (params) {
  return del('nursingServiceDetail/del', params)
}

// 子护理服务删除(多个)
export function doNursingServiceDetailDelMany (params) {
  return del('nursingServiceDetail/deleteMany', params)
}
