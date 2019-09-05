import { fetch, post, patch, del ,post4JSON} from '../libs/http'


// 客户列表
export function findUser (params) {
  return fetch('user/list', params)
}

// 客户添加
export function doUserAdd (params) {
  return post('user/add', params)
}

// 客户编辑
export function doUserEdit (params) {
  return patch('user/update', params)
}

// 客户删除
export function doUserDel (params) {
  return del('user/del', params)
}

// 客户删除(多个)
export function doUserDelMany (params) {
  return del('user/deleteMany', params)
}
