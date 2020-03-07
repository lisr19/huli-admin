// import {
//   login,
//   logout,
//   getUserInfo,
//   getMessage,
//   getContentByMsgId,
//   hasRead,
//   removeReaded,
//   restoreTrash,
//   getUnreadCount
// } from '@/api/user'
import { login } from '@/api/manager'
// import { setToken, getToken } from '@/libs/util'

export default {
  state: {
	  roleName: [],
    userName: '',
    userId: '',
    avatarImgPath: '',
    // token: getToken(),
    nursingAdminToken: localStorage.getItem('nursingAdminToken'),
    nursingAdminInfo: null,
    access: '',
    role: [],
    phone: '',
    name: '',
    hasGetInfo: false
    // unreadCount: 0,
    // messageUnreadList: [],
    // messageReadedList: [],
    // messageTrashList: [],
    // messageContentStore: {}
  },
  mutations: {
    // setAvatar(state, avatarPath) {
    //   state.avatarImgPath = avatarPath
    // },
	  setRoleName (state, rolename) {
		  state.roleName = rolename
	  },
    setUserId (state, id) {
      state.userId = id
    },
    setUserName (state, username) {
      state.userName = username
    },
    setName (state, name) {
      state.name = name
    },
    setAccess (state, access) {
      state.access = access
    },
    setUserPhone (state, phone) {
      state.phone = phone
    },
    setUserRole (state, role) {
      state.role = role
    },
    setNursingAdminToken (state, nursingAdminToken) {
      state.nursingAdminToken = nursingAdminToken
      localStorage.setItem('nursingAdminToken', nursingAdminToken)
    },
    setNursingAdminInfo (state, nursingAdminInfo) {
      state.nursingAdminInfo = nursingAdminInfo
      localStorage.setItem('nursingAdminInfo', JSON.stringify(nursingAdminInfo))
    },
    // setToken (state, token) {
    //   state.token = token
    //   setToken(token)
    // },
    setHasGetInfo (state, status) {
      state.hasGetInfo = status
    }
    // setMessageCount (state, count) {
    //   state.unreadCount = count
    // },
    // setMessageUnreadList (state, list) {
    //   state.messageUnreadList = list
    // },
    // setMessageReadedList (state, list) {
    //   state.messageReadedList = list
    // },
    // setMessageTrashList (state, list) {
    //   state.messageTrashList = list
    // },
    // updateMessageContentStore (state, { msg_id, content }) {
    //   state.messageContentStore[msg_id] = content
    // },
    // moveMsg (state, { from, to, msg_id }) {
    //   const index = state[from].findIndex(_ => _.msg_id === msg_id)
    //   const msgItem = state[from].splice(index, 1)[0]
    //   msgItem.loading = false
    //   state[to].unshift(msgItem)
    // }
  },
  getters: {
    // messageUnreadCount: state => state.messageUnreadList.length,
    // messageReadedCount: state => state.messageReadedList.length,
    // messageTrashCount: state => state.messageTrashList.length
  },
  actions: {
    // 登录
    handleLogin ({ commit }, { userName, password }) {
      userName = userName.trim()
      let params = {
        username: userName,
        password: password
      }
      return new Promise((resolve, reject) => {
        login(params).then((res) => {
          if (res.code === 200) {
            // 登录成功
            const data = res.data
	            // console.log(data)
	            // 权限设置
	            let access = []
	            if (data['functions']) {
		            data.functions.forEach(v => {
			            access.push(v.front)
		            })
	            }
	            let roles = []
	            if (data.managerInfo.roles.length > 0) {
		            data.managerInfo.roles.forEach(v => {
			            roles.push(v.name)
		            })
	            }
	          if(data.managerInfo.hospital){
		          localStorage.setItem('hospital', data.managerInfo.hospital)
	          }
	          console.log(access)
	            // let roles = data.managerInfo.roles
	            console.log(roles)
	            localStorage.setItem('access', access)
	            localStorage.setItem('role_name', roles)
            const info = data.managerInfo
            if (info.isEnable === 1) {
              // console.log(data)
	              commit('setRoleName', roles)
	              commit('setAccess', access)
              commit('setUserName', info.username)
              commit('setName', info.name)
              commit('setUserId', info.id)
              commit('setUserPhone', info.phone)
              commit('setUserRole', info.role)
              commit('setNursingAdminToken', data.token)
              commit('setNursingAdminInfo', info)
              commit('setHasGetInfo', true)
              localStorage.setItem('userId', info.id)
            }
          }
          resolve(res)
        }).catch((err) => {
          reject(err)
        })
      })
    },
    // 退出登录
    handleLogOut ({ state, commit }) {
      //   如果你的退出登录无需请求接口，则可以直接使用下面三行代码而无需使用logout调用接口
      commit('setNursingAdminToken', '')
      commit('setNursingAdminInfo', null)
      commit('setAccess', [])
      localStorage.clear()


      // resolve()
      // })
    },
    // 获取用户相关信息
    getUserInfo ({ state, commit }) {
      const obj = JSON.parse(localStorage.getItem('nursingAdminInfo'))
      const roles = localStorage.getItem('role_name')
      const access = localStorage.getItem('access')
      commit('setUserName', obj.username)
      commit('setName', obj.name)
      commit('setUserId', obj.id)
      commit('setUserPhone', obj.phone)
      commit('setUserRole', obj.role)
      commit('setNursingAdminInfo', obj)
      commit('setHasGetInfo', true)
      commit('setRoleName', roles)
      commit('setAccess', access)
    }
    // 此方法用来获取未读消息条数，接口只返回数值，不返回消息列表
    // getUnreadMessageCount ({ state, commit }) {
    //   getUnreadCount().then(res => {
    //     const { data } = res
    //     commit('setMessageCount', data)
    //   })
    // },
    // 获取消息列表，其中包含未读、已读、回收站三个列表
    // getMessageList ({ state, commit }) {
    //   return new Promise((resolve, reject) => {
    //     getMessage().then(res => {
    //       const { unread, readed, trash } = res.data
    //       commit('setMessageUnreadList', unread.sort((a, b) => new Date(b.create_time) - new Date(a.create_time)))
    //       commit('setMessageReadedList', readed.map(_ => {
    //         _.loading = false
    //         return _
    //       }).sort((a, b) => new Date(b.create_time) - new Date(a.create_time)))
    //       commit('setMessageTrashList', trash.map(_ => {
    //         _.loading = false
    //         return _
    //       }).sort((a, b) => new Date(b.create_time) - new Date(a.create_time)))
    //       resolve()
    //     }).catch(error => {
    //       reject(error)
    //     })
    //   })
    // },
    // 根据当前点击的消息的id获取内容
    // getContentByMsgId ({ state, commit }, { msg_id }) {
    //   return new Promise((resolve, reject) => {
    //     let contentItem = state.messageContentStore[msg_id]
    //     if (contentItem) {
    //       resolve(contentItem)
    //     } else {
    //       getContentByMsgId(msg_id).then(res => {
    //         const content = res.data
    //         commit('updateMessageContentStore', { msg_id, content })
    //         resolve(content)
    //       })
    //     }
    //   })
    // },
    // 把一个未读消息标记为已读
    // hasRead ({ state, commit }, { msg_id }) {
    //   return new Promise((resolve, reject) => {
    //     hasRead(msg_id).then(() => {
    //       commit('moveMsg', {
    //         from: 'messageUnreadList',
    //         to: 'messageReadedList',
    //         msg_id
    //       })
    //       commit('setMessageCount', state.unreadCount - 1)
    //       resolve()
    //     }).catch(error => {
    //       reject(error)
    //     })
    //   })
    // },
    // 删除一个已读消息到回收站
    // removeReaded ({ commit }, { msg_id }) {
    //   return new Promise((resolve, reject) => {
    //     removeReaded(msg_id).then(() => {
    //       commit('moveMsg', {
    //         from: 'messageReadedList',
    //         to: 'messageTrashList',
    //         msg_id
    //       })
    //       resolve()
    //     }).catch(error => {
    //       reject(error)
    //     })
    //   })
    // },
    // 还原一个已删除消息到已读消息
    // restoreTrash ({ commit }, { msg_id }) {
    //   return new Promise((resolve, reject) => {
    //     restoreTrash(msg_id).then(() => {
    //       commit('moveMsg', {
    //         from: 'messageTrashList',
    //         to: 'messageReadedList',
    //         msg_id
    //       })
    //       resolve()
    //     }).catch(error => {
    //       reject(error)
    //     })
    //   })
    // }
  }
}
