import { fetch, post, patch, del ,post4JSON} from '../libs/http'

// 宣教列表
export function findHealthEducation (params) {
  return fetch('healthEducation/list', params)
}

// 宣教标签列表
export function findLabelById (params) {
  return fetch('healthEducation/getLabel', params)
}

// 宣教标签添加
export function doLabelAddById (params) {
  return post('healthEducation/addLabel', params)
}

// 宣教标签删除
export function doLabelDelById (params) {
  return del('healthEducation/deleteLabel', params)
}

// 宣教添加
export function doHealthEducationAdd (params) {
  return post('healthEducation/add', params)
}

// 宣教编辑
export function doHealthEducationEdit (params) {
  return patch('healthEducation/update', params)
}

// 宣教删除
export function doHealthEducationDel (params) {
  return del('healthEducation/del', params)
}

// 宣教删除(多个)
export function doHealthEducationDelMany (params) {
  return del('healthEducation/deleteMany', params)
}
