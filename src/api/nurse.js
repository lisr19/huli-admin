import { fetch, post, patch, del ,post4JSON} from '../libs/http'


// 护士列表
export function findNurse (params) {
  return fetch('nurse/list', params)
}

// 护士添加
export function doNurseAdd (params) {
  return post('nurse/add', params)
}

// 护士编辑
export function doNurseEdit (params) {
  return patch('nurse/update', params)
}

// 护士删除
export function doNurseDel (params) {
  return del('nurse/del', params)
}

// 护士删除(多个)
export function doNurseDelMany (params) {
  return del('nurse/deleteMany', params)
}
