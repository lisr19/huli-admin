import { fetch, post, patch, del } from '../libs/http'

// 用户列表
export function getList (params) {
  return fetch('ncpQuestionnaire1/listUser', params)
}
// 用户列表
export function getRedList (params) {
	return fetch('ncpQuestionnaire1/listRedUser', params)
}
// 用户详情
export function getDetail (params) {
	return fetch('ncpQuestionnaire1/list', params)
}



// 统计列表
export function getCountList (params) {
  return fetch('ncpQuestionnaire1/countUser', params)
}

export function getCountUserByDate (params) {
  return fetch('ncpQuestionnaire1/countUserByDate', params)
}

export function getCountUserByTwoDate (params) {
  return fetch('ncpQuestionnaire1/countUserByTwoDate', params)
}



