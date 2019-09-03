//页面列表头

//管理员列表
export const adminColumns = [
  {
    type: 'selection',
    width: 60,
    align: 'center'
  },
  {
    title: '用户名',
    align: 'center',
    key: 'username'
  },
  {
    title: '姓名',
    align: 'center',
    key: 'name'
  },
  {
    title: '电话',
    align: 'center',
    key: 'phone'
  },
  {
    title: '邮箱',
    align: 'center',
    key: 'mail'
  },
  {
    title: '性别',
    align: 'center',
    key: 'gender',
    render: (h, params) => {
      return h('span', [
        params.row.gender === 0 ? '无' : (params.row.gender === 1 ? '男' : '女')
      ])
    }
  },
  {
    title: '使用状态',
    align: 'center',
    key: 'status',
    render: (h, params) => {
      return h('span', [
        params.row.status === 0 ? '禁用' : '正常'
      ])
    }
  },
]

//角色
export const roleColumns = [
  {
    title: '角色名称',
    key: 'name'
  },
  {
    title: '层级',
    key: 'level'
  },
  {
    title: '操作',
    key: 'action',
    type: 'template',
    template: 'action'
  }
]

//权限
export const accessColumns = [
  {
    title: '权限名称',
    key: 'name'
  },
  {
    title: '对应url',
    key: 'url'
  },
  {
    title: '对应前端组件',
    key: 'front'
  },
  {
    title: '操作',
    key: 'action',
    type: 'template',
    template: 'action'
  }
]

//客户基本信息
export const customerInfoColumns = [
  {
    type: 'selection',
    width: 60,
    align: 'center'
  },
  {
    title: '客户头像',
    align: 'center',
    key: 'avatar',
    render: (h, params) => {
      return h('img', {
        style: {
          margin: '5px',
          display: 'inline-block',
          height: '40px',
          width: '40px',
          borderRadius: '5px'
        },
        attrs: {
          src: params.row['avatar']
            ? params.row['avatar'] + '?imageView2/1/w/45/h/45'
            : 'http://sdcmi.halohealth.cn/images/1552373693998.jpg'
        }
      })
    }
  },
  {
    title: '昵称',
    align: 'center',
    key: 'username'
  },
  {
    title: '姓名',
    align: 'center',
    key: 'name'
  },
  {
    title: '电话',
    align: 'center',
    key: 'phone'
  },
  {
    title: '出生年月',
    align: 'center',
    key: 'birthday'
  },
  {
    title: '性别',
    align: 'center',
    key: 'gender',
    render: (h, params) => {
      return h('span', [
        params.row.gender === 0 ? '无' : (params.row.gender === 1 ? '男' : '女')
      ])
    }
  },
  {
    title: '使用状态',
    align: 'center',
    key: 'status',
    render: (h, params) => {
      return h('span', [
        params.row.status === 0 ? '禁用' : '正常'
      ])
    }
  },
]

//标签
export const labelsColumns = [
  {
    title: '标签名称',
    key: 'name'
  },
  {
    title: '层级',
    key: 'level'
  },
  {
    title: '操作',
    key: 'action',
    type: 'template',
    template: 'action'
  }
]

//健康档案相关类型
export const healthTypesColumns = [
  {
    title: '类型名称',
    key: 'name'
  },
  {
    title: '层级',
    key: 'level'
  },
  {
    title: '操作',
    key: 'action',
    type: 'template',
    template: 'action'
  }
]

//护理项目相关类型
export const programTypesColumns = [
  {
    title: '类型名称',
    key: 'name'
  },
]

//护理项目
export const programColumns = [
  {
    title: '项目名称',
    key: 'name'
  },
  {
    title: '项目图片',
    key: 'imgUrl',
    render: (h, params) => {
      return h('img', {
        style: {
          margin: '5px',
          display: 'inline-block',
          height: '40px',
          width: '40px',
          borderRadius: '5px'
        },
        attrs: {
          src: params.row['imgUrl']
            ? params.row['imgUrl'] + '?imageView2/1/w/45/h/45'
            : 'http://sdcmi.halohealth.cn/images/1552373693998.jpg'
        }
      })
    }
  },
  {
    title: '项目类型',
    key: 'type'
  },
  {
    title: '价格（¥）',
    key: 'price'
  },
  {
    title: '层级',
    key: 'level'
  },
  {
    title: '操作',
    key: 'action',
    type: 'template',
    template: 'action'
  }
]

//宣传教育相关类型
export const educationTypesColumns = [
  {
    title: '类型名称',
    key: 'name'
  },
]

//宣传教育
export const educationColumns = [
  {
    title: '宣教名称',
    key: 'name'
  },
  {
    title: '宣教类型',
    key: 'type'
  },
  {
    title: '层级',
    key: 'level'
  },
  {
    title: '操作',
    key: 'action',
    type: 'template',
    template: 'action'
  }
]
