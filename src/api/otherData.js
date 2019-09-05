import { fetch, post, patch, del ,post4JSON} from '../libs/http'

//隶属区域列表
export function findSubordinateAreaList (params) {
  return fetch('subordinateAreaList/list', params)
}

