import Main from '@/components/main'
import parentView from '@/components/parent-view'

/**
 * iview-admin中meta除了原生参数外可配置的参数:
 * meta: {
 *  title: { String|Number|Function }
 *         显示在侧边栏、面包屑和标签栏的文字
 *         使用'{{ 多语言字段 }}'形式结合多语言使用，例子看多语言的路由配置;
 *         可以传入一个回调函数，参数是当前路由对象，例子看动态路由和带参路由
 *  hideInBread: (false) 设为true后此级路由将不会出现在面包屑中，示例看QQ群路由配置
 *  hideInMenu: (false) 设为true后在左侧菜单不会显示该页面选项
 *  showAlways:(false)设为true后在左侧菜单显示该页面选项，级别低于hideInMenu
 *  notCache: (false) 设为true后页面在切换标签后不会缓存，如果需要缓存，无需设置这个字段，而且需要设置页面组件name属性和路由配置的name一致
 *  access: (null) 可访问该页面的权限数组，当前路由设置的权限会影响子路由
 *  icon: (-) 该页面在左侧菜单、面包屑和标签导航处显示的图标，如果是自定义图标，需要在图标名称前加下划线'_'
 *  beforeCloseName: (-) 设置该字段，则在关闭当前tab页时会去'@/router/before-close.js'里寻找该字段名对应的方法，作为关闭前的钩子函数
 * }
 */

export default [
  {
    path: '/login',
    name: 'login',
    meta: {
      title: 'Login - 登录',
      hideInMenu: true
    },
    component: () => import('@/view/login/login.vue')
  },
  {
    path: '/',
    name: '_home',
    redirect: '/home',
    component: Main,
    meta: {
      hideInMenu: true,
      notCache: true
    },
    children: [
      {
        path: '/home',
        name: 'home',
        meta: {
          hideInMenu: true,
          title: '首页',
          notCache: true,
          icon: 'md-home'
        },
        component: () => import('@/view/single-page/home')
      }
    ]
  },
  {
    path: '/customer',
    name: 'customer',
    component: Main,
    meta: {
      title: '客户管理',
      showAlways: true
    },
    children: [
      {
        path: '/customer_info',
        name: 'customer_info',
        meta: {
          title: '基本信息',
          icon: 'md-home'
        },
        component: () => import('@/view/customer/customer-info')
      }
      // {
      //   path: '/customer_health',
      //   name: 'customer_health',
      //   meta: {
      //     title: '健康档案',
      //     icon: 'md-home'
      //   },
      //   component: () => import('@/view/customer/customer-health')
      // },
    ]
  },
  {
    path: '/nurse',
    name: 'nurse',
    component: Main,
    meta: {
      title: '护士管理',
      showAlways: true
    },
    children: [
      {
        path: '/nurse_info',
        name: 'nurse_info',
        meta: {
          title: '护士信息',
          icon: 'md-home'
        },
        component: () => import('@/view/nurse/nurse-info')
      },
      {
        path: '/nurse_pending',
        name: 'nurse_pending',
        meta: {
          title: '资格审核',
          icon: 'md-home'
        },
        component: () => import('@/view/nurse/nurse-pending')
      }
    ]
  },
  {
    path: '/orders',
    name: 'orders',
    component: Main,
    meta: {
      title: '订单管理',
      showAlways: true
    },
    children: [
      {
        path: '/orders_info',
        name: 'orders_info',
        meta: {
          title: '订单信息',
          icon: 'md-home'
        },
        component: () => import('@/view/orders/orders-info')
      },
      {
        path: '/orders_pending',
        name: 'orders_pending',
        meta: {
          title: '待审订单',
          icon: 'md-home'
        },
        component: () => import('@/view/orders/orders-pending')
      },
      {
        path: '/orders_refund',
        name: 'orders_refund',
        meta: {
          title: '订单退款',
          icon: 'md-home'
        },
        component: () => import('@/view/orders/orders-refund')
      }
    ]
  },
  {
    path: '/data_dictionary',
    name: 'data_dictionary',
    component: Main,
    meta: {
      title: '数据字典',
      showAlways: true
    },
    children: [
      {
        path: '/labels',
        name: 'labels',
        meta: {
          title: '标签管理',
          icon: 'md-home'
        },
        component: () => import('@/view/data-dictionary/labels')
      },
      {
        path: '/health',
        name: 'health',
        meta: {
          title: '健康档案',
          showAlways: true,
          icon: 'md-home'
        },
        component: parentView,
        children: [
          {
            path: 'health_types',
            name: 'health_types',
            meta: {
              title: '相关类型',
              icon: 'md-funnel'
            },
            component: () => import('@/view/data-dictionary/health-types')
          }
        ]
      },
      {
        path: '/education',
        name: 'education',
        meta: {
          title: '宣传教育',
          showAlways: true,
          icon: 'md-home'
        },
        component: parentView,
        children: [
          // {
          //   path: 'education_types',
          //   name: 'education_types',
          //   meta: {
          //     title: '相关类型',
          //     icon: 'md-funnel'
          //   },
          //   component: () => import('@/view/data-dictionary/education-types')
          // },
          {
            path: 'publicity_education',
            name: 'publicity_education',
            meta: {
              title: '宣教管理',
              icon: 'md-funnel'
            },
            component: () => import('@/view/data-dictionary/publicity-education')
          }
        ]
      },
      {
        path: '/program',
        name: 'program',
        meta: {
          title: '护理项目',
          showAlways: true,
          icon: 'md-home'
        },
        component: parentView,
        children: [
          {
            path: 'program_types',
            name: 'program_types',
            meta: {
              title: '相关类型',
              icon: 'md-funnel'
            },
            component: () => import('@/view/data-dictionary/program-types')
          },
          {
            path: 'nursing_program',
            name: 'nursing_program',
            meta: {
              title: '项目管理',
              icon: 'md-funnel'
            },
            component: () => import('@/view/data-dictionary/nursing-program')
          }
        ]
      }
    ]
  },
  {
    path: '/data_analysis',
    name: 'data-analysis',
    component: Main,
    meta: {
      title: '健康护理数据分析与管理',
      showAlways: true,
      access: [
        'health'
      ]
    },
    children: [
      {
        path: '/drug_effect',
        name: 'drug-effect',
        meta: {
          title: '用药效果数据管理',
          icon: 'md-home'
        },
        component: () => import('@/view/data-analysis/drug-effect')
      },
      {
        path: '/compliance',
        name: 'compliance',
        meta: {
          title: '治疗依从性管理',
          icon: 'md-home'
        },
        component: () => import('@/view/data-analysis/compliance')
      },
      {
        path: '/personalized_sports',
        name: 'personalized-sports',
        meta: {
          title: '个性运动处方管理',
          icon: 'md-home'
        },
        component: () => import('@/view/data-analysis/personalized-sports')
      },
      {
        path: '/rehabilitation_exercise',
        name: 'rehabilitation-exercise',
        meta: {
          title: '康复运动预测预警',
          icon: 'md-home'
        },
        component: () => import('@/view/data-analysis/rehabilitation-exercise')
      },
      {
        path: '/body_medicine',
        name: 'body-medicine',
        meta: {
          title: '体医结合饮食推荐',
          icon: 'md-home'
        },
        component: () => import('@/view/data-analysis/body-medicine')
      },
      {
        path: '/mental_health',
        name: 'mental-health',
        meta: {
          title: 'AI远程心理健康',
          icon: 'md-home'
        },
        component: () => import('@/view/data-analysis/mental-health')
      },
      {
        path: '/prognosis_decision',
        name: 'prognosis-decision',
        meta: {
          title: '预后决策辅助',
          icon: 'md-home'
        },
        component: () => import('@/view/data-analysis/prognosis-decision')
      }
    ]
  },
  {
    path: '/basic',
    name: 'basic',
    component: Main,
    meta: {
      title: '基础管理',
      showAlways: true,
      access: ['manage']
    },
    children: [
      {
        path: '/admin',
        name: 'admin',
        meta: {
          title: '管理员管理',
          icon: 'md-home'
        },
        component: () => import('@/view/basic/admin')
      },
      {
        path: '/role',
        name: 'role',
        meta: {
          title: '角色管理',
          icon: 'md-home'
        },
        component: () => import('@/view/basic/role')
      },
      {
        path: '/access',
        name: 'access',
        meta: {
          title: '权限管理',
          icon: 'md-home'
        },
        component: () => import('@/view/basic/access')
      }
    ]
  },
  {
    path: '/version',
    name: 'version',
    component: Main,
    meta: {
      title: '版本管理',
      showAlways: true,
      access: ['apk_version']
    },
    children: [
      {
        path: '/apk_version',
        name: 'apk-version',
        meta: {
          title: 'app版本管理',
          icon: 'md-home'
        },
        component: () => import('@/view/version/apk-version')
      }
    ]
  },
  {
		path: '/sos_index',
		name: 'sos_index',
		component: Main,
		meta: {
			title: '紧急求助',
			showAlways: true
		},
		children: [
			{
				path: '/sos',
				name: 'sos',
				meta: {
					title: '求助列表',
					icon: 'md-home'
				},
				component: () => import('@/view/sos/sos')
			}
		]
	},
	{
		path: '/wq_index',
		name: 'wq_index',
		component: Main,
		meta: {
			title: '抗疫登记',
			showAlways: true
		},
		children: [
			{
				path: '/wq',
				name: 'wq',
				meta: {
					title: '登记列表',
					icon: 'md-home'
				},
				component: () => import('@/view/wq/wq')
			},
      {
        path: '/nakcheck',
        name: 'nakcheck',
        meta: {
          title: '核酸检测结果',
          icon: 'md-home'
        },
        component: () => import('@/view/wq/nakcheck')
      }
		]
	},
  // {
  //   path: '',
  //   name: 'doc',
  //   meta: {
  //     title: '文档',
  //     href: 'https://lison16.github.io/iview-admin-doc/#/',
  //     icon: 'ios-book'
  //   }
  // },
  // {
  //   path: '/join',
  //   name: 'join',
  //   component: Main,
  //   meta: {
  //     hideInBread: true
  //   },
  //   children: [
  //     {
  //       path: 'join_page',
  //       name: 'join_page',
  //       meta: {
  //         icon: '_qq',
  //         title: 'QQ群'
  //       },
  //       component: () => import('@/view/join-page.vue')
  //     }
  //   ]
  // },
  // {
  //   path: '/message',
  //   name: 'message',
  //   component: Main,
  //   meta: {
  //     hideInBread: true,
  //     hideInMenu: true
  //   },
  //   children: [
  //     {
  //       path: 'message_page',
  //       name: 'message_page',
  //       meta: {
  //         icon: 'md-notifications',
  //         title: '消息中心'
  //       },
  //       component: () => import('@/view/single-page/message/index.vue')
  //     }
  //   ]
  // },
  // {
  //   path: '/components',
  //   name: 'components',
  //   meta: {
  //     icon: 'logo-buffer',
  //     title: '组件'
  //   },
  //   component: Main,
  //   children: [
  //     {
  //       path: 'tree_select_page',
  //       name: 'tree_select_page',
  //       meta: {
  //         icon: 'md-arrow-dropdown-circle',
  //         title: '树状下拉选择器'
  //       },
  //       component: () => import('@/view/components/tree-select/index.vue')
  //     },
  //     {
  //       path: 'count_to_page',
  //       name: 'count_to_page',
  //       meta: {
  //         icon: 'md-trending-up',
  //         title: '数字渐变'
  //       },
  //       component: () => import('@/view/components/count-to/count-to.vue')
  //     },
  //     {
  //       path: 'drag_list_page',
  //       name: 'drag_list_page',
  //       meta: {
  //         icon: 'ios-infinite',
  //         title: '拖拽列表'
  //       },
  //       component: () => import('@/view/components/drag-list/drag-list.vue')
  //     },
  //     {
  //       path: 'drag_drawer_page',
  //       name: 'drag_drawer_page',
  //       meta: {
  //         icon: 'md-list',
  //         title: '可拖拽抽屉'
  //       },
  //       component: () => import('@/view/components/drag-drawer')
  //     },
  //     {
  //       path: 'org_tree_page',
  //       name: 'org_tree_page',
  //       meta: {
  //         icon: 'ios-people',
  //         title: '组织结构树'
  //       },
  //       component: () => import('@/view/components/org-tree')
  //     },
  //     {
  //       path: 'tree_table_page',
  //       name: 'tree_table_page',
  //       meta: {
  //         icon: 'md-git-branch',
  //         title: '树状表格'
  //       },
  //       component: () => import('@/view/components/tree-table/index.vue')
  //     },
  //     {
  //       path: 'cropper_page',
  //       name: 'cropper_page',
  //       meta: {
  //         icon: 'md-crop',
  //         title: '图片裁剪'
  //       },
  //       component: () => import('@/view/components/cropper/cropper.vue')
  //     },
  //     {
  //       path: 'tables_page',
  //       name: 'tables_page',
  //       meta: {
  //         icon: 'md-grid',
  //         title: '多功能表格'
  //       },
  //       component: () => import('@/view/components/tables/tables.vue')
  //     },
  //     {
  //       path: 'split_pane_page',
  //       name: 'split_pane_page',
  //       meta: {
  //         icon: 'md-pause',
  //         title: '分割窗口'
  //       },
  //       component: () => import('@/view/components/split-pane/split-pane.vue')
  //     },
  //     {
  //       path: 'markdown_page',
  //       name: 'markdown_page',
  //       meta: {
  //         icon: 'logo-markdown',
  //         title: 'Markdown编辑器'
  //       },
  //       component: () => import('@/view/components/markdown/markdown.vue')
  //     },
  //     {
  //       path: 'editor_page',
  //       name: 'editor_page',
  //       meta: {
  //         icon: 'ios-create',
  //         title: '富文本编辑器'
  //       },
  //       component: () => import('@/view/components/editor/editor.vue')
  //     },
  //     {
  //       path: 'icons_page',
  //       name: 'icons_page',
  //       meta: {
  //         icon: '_bear',
  //         title: '自定义图标'
  //       },
  //       component: () => import('@/view/components/icons/icons.vue')
  //     }
  //   ]
  // },
  // {
  //   path: '/update',
  //   name: 'update',
  //   meta: {
  //     icon: 'md-cloud-upload',
  //     title: '数据上传'
  //   },
  //   component: Main,
  //   children: [
  //     {
  //       path: 'update_table_page',
  //       name: 'update_table_page',
  //       meta: {
  //         icon: 'ios-document',
  //         title: '上传Csv'
  //       },
  //       component: () => import('@/view/update/update-table.vue')
  //     },
  //     {
  //       path: 'update_paste_page',
  //       name: 'update_paste_page',
  //       meta: {
  //         icon: 'md-clipboard',
  //         title: '粘贴表格数据'
  //       },
  //       component: () => import('@/view/update/update-paste.vue')
  //     }
  //   ]
  // },
  // {
  //   path: '/excel',
  //   name: 'excel',
  //   meta: {
  //     icon: 'ios-stats',
  //     title: 'EXCEL导入导出'
  //   },
  //   component: Main,
  //   children: [
  //     {
  //       path: 'upload-excel',
  //       name: 'upload-excel',
  //       meta: {
  //         icon: 'md-add',
  //         title: '导入EXCEL'
  //       },
  //       component: () => import('@/view/excel/upload-excel.vue')
  //     },
  //     {
  //       path: 'export-excel',
  //       name: 'export-excel',
  //       meta: {
  //         icon: 'md-download',
  //         title: '导出EXCEL'
  //       },
  //       component: () => import('@/view/excel/export-excel.vue')
  //     }
  //   ]
  // },
  // {
  //   path: '/tools_methods',
  //   name: 'tools_methods',
  //   meta: {
  //     hideInBread: true
  //   },
  //   component: Main,
  //   children: [
  //     {
  //       path: 'tools_methods_page',
  //       name: 'tools_methods_page',
  //       meta: {
  //         icon: 'ios-hammer',
  //         title: '工具方法',
  //         beforeCloseName: 'before_close_normal'
  //       },
  //       component: () => import('@/view/tools-methods/tools-methods.vue')
  //     }
  //   ]
  // },
  // {
  //   path: '/i18n',
  //   name: 'i18n',
  //   meta: {
  //     hideInBread: true
  //   },
  //   component: Main,
  //   children: [
  //     {
  //       path: 'i18n_page',
  //       name: 'i18n_page',
  //       meta: {
  //         icon: 'md-planet',
  //         title: 'i18n - {{ i18n_page }}'
  //       },
  //       component: () => import('@/view/i18n/i18n-page.vue')
  //     }
  //   ]
  // },
  // {
  //   path: '/error_store',
  //   name: 'error_store',
  //   meta: {
  //     hideInBread: true
  //   },
  //   component: Main,
  //   children: [
  //     {
  //       path: 'error_store_page',
  //       name: 'error_store_page',
  //       meta: {
  //         icon: 'ios-bug',
  //         title: '错误收集'
  //       },
  //       component: () => import('@/view/error-store/error-store.vue')
  //     }
  //   ]
  // },
  // {
  //   path: '/error_logger',
  //   name: 'error_logger',
  //   meta: {
  //     hideInBread: true,
  //     hideInMenu: true
  //   },
  //   component: Main,
  //   children: [
  //     {
  //       path: 'error_logger_page',
  //       name: 'error_logger_page',
  //       meta: {
  //         icon: 'ios-bug',
  //         title: '错误收集'
  //       },
  //       component: () => import('@/view/single-page/error-logger.vue')
  //     }
  //   ]
  // },
  // {
  //   path: '/directive',
  //   name: 'directive',
  //   meta: {
  //     hideInBread: true
  //   },
  //   component: Main,
  //   children: [
  //     {
  //       path: 'directive_page',
  //       name: 'directive_page',
  //       meta: {
  //         icon: 'ios-navigate',
  //         title: '指令'
  //       },
  //       component: () => import('@/view/directive/directive.vue')
  //     }
  //   ]
  // },
  // {
  //   path: '/multilevel',
  //   name: 'multilevel',
  //   meta: {
  //     icon: 'md-menu',
  //     title: '多级菜单'
  //   },
  //   component: Main,
  //   children: [
  //     {
  //       path: 'level_2_1',
  //       name: 'level_2_1',
  //       meta: {
  //         icon: 'md-funnel',
  //         title: '二级-1'
  //       },
  //       component: () => import('@/view/multilevel/level-2-1.vue')
  //     },
  //     {
  //       path: 'level_2_2',
  //       name: 'level_2_2',
  //       meta: {
  //         access: ['super_admin'],
  //         icon: 'md-funnel',
  //         showAlways: true,
  //         title: '二级-2'
  //       },
  //       component: parentView,
  //       children: [
  //         {
  //           path: 'level_2_2_1',
  //           name: 'level_2_2_1',
  //           meta: {
  //             icon: 'md-funnel',
  //             title: '三级'
  //           },
  //           component: () => import('@/view/multilevel/level-2-2/level-2-2-1.vue')
  //         },
  //         {
  //           path: 'level_2_2_2',
  //           name: 'level_2_2_2',
  //           meta: {
  //             icon: 'md-funnel',
  //             title: '三级'
  //           },
  //           component: () => import('@/view/multilevel/level-2-2/level-2-2-2.vue')
  //         }
  //       ]
  //     },
  //     {
  //       path: 'level_2_3',
  //       name: 'level_2_3',
  //       meta: {
  //         icon: 'md-funnel',
  //         title: '二级-3'
  //       },
  //       component: () => import('@/view/multilevel/level-2-3.vue')
  //     }
  //   ]
  // },
  // {
  //   path: '/argu',
  //   name: 'argu',
  //   meta: {
  //     hideInMenu: true
  //   },
  //   component: Main,
  //   children: [
  //     {
  //       path: 'params/:id',
  //       name: 'params',
  //       meta: {
  //         icon: 'md-flower',
  //         title: route => `{{ params }}-${route.params.id}`,
  //         notCache: true,
  //         beforeCloseName: 'before_close_normal'
  //       },
  //       component: () => import('@/view/argu-page/params.vue')
  //     },
  //     {
  //       path: 'query',
  //       name: 'query',
  //       meta: {
  //         icon: 'md-flower',
  //         title: route => `{{ query }}-${route.query.id}`,
  //         notCache: true
  //       },
  //       component: () => import('@/view/argu-page/query.vue')
  //     }
  //   ]
  // },
  {
    path: '/401',
    name: 'error_401',
    meta: {
      hideInMenu: true
    },
    component: () => import('@/view/error-page/401.vue')
  },
  {
    path: '/500',
    name: 'error_500',
    meta: {
      hideInMenu: true
    },
    component: () => import('@/view/error-page/500.vue')
  },
  {
    path: '*',
    name: 'error_404',
    meta: {
      hideInMenu: true
    },
    component: () => import('@/view/error-page/404.vue')
  }
]
