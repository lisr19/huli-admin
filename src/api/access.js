import { fetch, post, patch, del } from '../libs/http'

// 功能列表
export function findFunction (params) {
  return fetch('function/list', params)
}

// 功能列表（所有）
export function findFunctionAll (params) {
  return fetch('function/listAll', params)
}

// 功能添加
export function doFunctionAdd (params) {
  return post('function/add', params)
}

// 功能编辑
export function doFunctionEdit (params) {
  return patch('function/update', params)
}

// 功能删除
export function doFunctionDel (params) {
  return del('function/del', params)
}

// 功能删除(多个)
export function doFunctionDelMany (params) {
  return del('function/deleteMany', params)
}
