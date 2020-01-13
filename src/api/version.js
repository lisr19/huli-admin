import { fetch, post, patch, del} from '../libs/http'

// app版本列表
export function findApkVersion (params) {
  return fetch('apkVersion/list', params)
}

// app版本添加
export function doApkVersionAdd (params) {
  return post('apkVersion/add', params)
}

// app版本编辑
export function doApkVersionEdit (params) {
  return patch('apkVersion/update', params)
}

// app版本删除
export function doApkVersionDel (params) {
  return del('apkVersion/del', params)
}

// app版本删除(多个)
export function doApkVersionDelMany (params) {
  return del('apkVersion/deleteMany', params)
}
