import { fetch, post, patch, del ,post4JSON} from '../libs/http'

// 标签列表
export function findLabel (params) {
  return fetch('label/list', params)
}

// 标签添加
export function doLabelAdd (params) {
  return post('label/add', params)
}

// 标签编辑
export function doLabelEdit (params) {
  return patch('label/update', params)
}

// 标签删除
export function doLabelDel (params) {
  return del('label/del', params)
}

// 标签删除(多个)
export function doLabelDelMany (params) {
  return del('label/deleteMany', params)
}

// 标签关联列表
export function findLabelRel (params) {
  return fetch('labelRel/list', params)
}

// 标签关联添加
export function doLabelRelAdd (params) {
  return post('labelRel/add', params)
}

// 标签关联编辑
export function doLabelRelEdit (params) {
  return patch('labelRel/update', params)
}

// 标签关联删除
export function doLabelRelDel (params) {
  return del('labelRel/del', params)
}

// 标签关联删除(多个)
export function doLabelRelDelMany (params) {
  return del('labelRel/deleteMany', params)
}
