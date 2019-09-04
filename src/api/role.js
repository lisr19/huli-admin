import { fetch, post, patch, del } from '../libs/http'

// 角色列表
export function findRole (params) {
  return fetch('role/list', params)
}

// 角色列表（所有）
export function findRoleAll (params) {
  return fetch('role/listAll', params)
}

// 角色添加
export function doRoleAdd (params) {
  return post('role/add', params)
}

// 角色编辑
export function doRoleEdit (params) {
  return patch('role/update', params)
}

// 角色删除
export function doRoleDel (params) {
  return del('role/del', params)
}

// 角色删除(多个)
export function doRoleDelMany (params) {
  return del('role/deleteMany', params)
}
