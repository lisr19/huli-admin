import { fetch, post, patch, del } from '../libs/http'

// 管理员登录
export function login (params) {
  return post('manager/login', params)
}

// 管理员列表
export function findManager (params) {
  return fetch('manager/list', params)
}

// 管理员添加
export function doManagerAdd (params) {
  return post('manager/add', params)
}

// 管理员编辑
export function doManagerEdit (params) {
  return patch('manager/update', params)
}

// 管理员删除
export function doManagerDel (params) {
  return del('manager/del', params)
}

// 管理员删除(多个)
export function doManagerDelMany (params) {
  return del('manager/deleteMany', params)
}
