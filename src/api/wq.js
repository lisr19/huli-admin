import { fetch, post, patch, del } from '../libs/http'

// 用户列表
export function getList (params) {
  return fetch('ncpQuestionnaire/listUser', params)
}
// 用户列表
export function getRedList (params) {
	return fetch('ncpQuestionnaire/listRedUser', params)
}
// 用户详情
export function getDetail (params) {
	return fetch('ncpQuestionnaire/list', params)
}
// 核酸检测列表
export function getnakList (params) {
  return fetch('natCheck/list', params)
}
// 导入
export function batchImport (params) {
  return post('natCheck/batchImport', params)
}
// 统计列表
export function getCountList (params) {
  return fetch('ncpQuestionnaire/countUser', params)
}


// 添加
export function pushMessage (params) {
  return post('pushMessage/add', params)
}

// 已经发送消息
export function isSendMsg (params) {
  return patch('ncpQuestionnaire/update', params)
}


