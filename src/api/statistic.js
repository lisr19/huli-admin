import { fetch, post, patch, del ,post4JSON} from '../libs/http'

// 首页数据统计
export function findStatisticByHome (params) {
  return fetch('statistic/index', params)
}

// 用户数据统计
export function findStatisticByUser (params) {
  return fetch('statistic/user', params)
}

// 护士数据统计
export function findStatisticByNurse (params) {
  return fetch('statistic/nurse', params)
}

// 订单数据统计
export function findStatisticByOrder (params) {
  return fetch('statistic/order', params)
}

// 订单数据统计1
export function findStatisticByOrder1 (params) {
  return fetch('statistic/order1', params)
}

// 金额数据统计
export function findStatisticByOrderPrice (params) {
  return fetch('statistic/orderPrice', params)
}

