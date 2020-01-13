<template>
  <div>
    <!--按钮部分-->
    <Card>
      <p slot="title">客户基本信息</p>
      <Row>
        <Col span="2">
          <Button type="primary" class="my-btn" v-if="viewAdd" @click="isAdd = true">添加</Button>
        </Col>

        <!--<Col span="2">-->
          <!--<Button type="error" class="my-btn" v-if="viewDelMany" @click="batchDel">批量删除</Button>-->
        <!--</Col>-->
        <Col span="3" offset="15">
          <Input clearable icon="search" v-model="searchByPhone" @on-change="handleSearchByPhone"
                 placeholder="输入账号/电话搜索"/>
        </Col>
        <Col span="3" offset="1">
          <Input clearable icon="search" v-model="searchByName" @on-change="handleSearchByName"
                 placeholder="输入用户姓名搜索"/>
        </Col>
      </Row>
    </Card>

    <!--表格部分-->
    <Card>
      <div>
        <Table :columns="columns" :data="tableData" border
               disabled-hover></Table>
      </div>
      <div style="margin: 10px;overflow: hidden">
        <div style="float: right;">
          <Page show-total show-elevator :total="page.total" :current="page.currentPage"
                @on-change="handlePageTurn"></Page>
        </div>
      </div>
    </Card>

    <!--添加Modal-->
    <Modal v-model="isAdd" :mask-closable="false" :closable="false" title="客户添加：" width="600">
      <Form :model="addForm" ref="addForm" :rules="addRules" :label-width="130">
        <Card>
          <FormItem label="头像：" prop="avatar">
            <img-upload ref="imgUpload" @imgUpload="getUploadImg" @delImg="delUploadImg"></img-upload>
          </FormItem>
          <FormItem label="账号/手机：" prop="username">
            <Input clearable v-model="addForm.username" placeholder="请填写账号/手机"/>
          </FormItem>
          <FormItem label="姓名：" prop="name">
            <Input clearable v-model="addForm.name" placeholder="请填写姓名"/>
          </FormItem>
          <FormItem label="性别：" prop="gender">
            <Select clearable v-model="addForm.gender" placeholder="请选择性别" style="width: 100%">
              <Option v-for="item in gender" :value="item.value">{{item.name}}</Option>
            </Select>
          </FormItem>
          <FormItem label="邮箱：" prop="email">
            <Input clearable v-model="addForm.email" placeholder="请填写邮箱"/>
          </FormItem>
          <FormItem label="出声年月日：" prop="birthday">
            <DatePicker type="date" :options="disDate" format="yyyy-MM-dd" placeholder="请选择出声年月日"
                        @on-change="v=>{addForm.birth=v}"
                        style="width: 100%"></DatePicker>
          </FormItem>
          <FormItem label="密码：" prop="password">
            <Input clearable v-model="addForm.password" type="password" placeholder="请输入密码"/>
          </FormItem>
          <FormItem label="确认密码：" prop="rePassword">
            <Input clearable v-model="addForm.rePassword" type="password" placeholder="请确认密码"/>
          </FormItem>
        </Card>
      </Form>
      <!--自定义页脚-->
      <div slot="footer">
        <Button type="text" @click="cancelAddModal">取消</Button>
        <Button type="primary" @click="doUserAdd">确认</Button>
      </div>
    </Modal>

    <!--编辑Modal-->
    <Modal v-model="isEdit" :mask-closable="false" :closable="false" title="客户编辑：" width="600">
      <Form :model="editForm" ref="editForm" :rules="editRules" :label-width="130">
        <Card>
          <FormItem label="头像：" prop="avatar">
            <img-upload ref="imgUploadByEdit" @imgUpload="getUploadImg" @delImg="delUploadImg"></img-upload>
          </FormItem>
          <FormItem label="账号/手机：" prop="username">
            <Input clearable v-model="editForm.username" placeholder="请填写账号/手机"/>
          </FormItem>
          <FormItem label="姓名：" prop="name">
            <Input clearable v-model="editForm.name" placeholder="请填写姓名"/>
          </FormItem>
          <FormItem label="性别：" prop="gender">
            <Select clearable v-model="editForm.gender" placeholder="请选择性别" style="width: 100%">
              <Option v-for="item in gender" :value="item.value">{{item.name}}</Option>
            </Select>
          </FormItem>
          <FormItem label="邮箱：" prop="email">
            <Input clearable v-model="editForm.email" placeholder="请填写邮箱"/>
          </FormItem>
          <FormItem label="出声年月日：" prop="birthday">
            <DatePicker type="date" ref="editDate" :options="disDate" v-model="editForm.birth" format="yyyy-MM-dd" placeholder="请选择出声年月日"
                        style="width: 100%"></DatePicker>
          </FormItem>
          <FormItem label="评分：">
            <InputNumber v-model="editForm.grade" :max="500" :min="1"></InputNumber>
          </FormItem>
          <FormItem label="心脑血管疾病高危：">
            <RadioGroup v-model="editForm.highRisk">
              <Radio v-for="item in radio" :label="item.label">{{item.name}}</Radio>
            </RadioGroup>
          </FormItem>
          <FormItem label="密码：" prop="password">
            <Input clearable v-model="editForm.password" type="password" placeholder="不修改则不填"/>
          </FormItem>
          <FormItem label="确认密码：" prop="rePassword">
            <Input clearable v-model="editForm.rePassword" type="password" placeholder="请确认密码"/>
          </FormItem>
        </Card>
      </Form>
      <!--自定义页脚-->
      <div slot="footer">
        <Button type="text" @click="cancelEditModal">取消</Button>
        <Button type="primary" @click="doUserEdit">确认</Button>
      </div>
    </Modal>

    <!--健康档案Modal-->
    <Modal v-model="isHealth" :mask-closable="false" :closable="false" title="客户-健康档案：" width="1000">
      <health ref="health"></health>
      <div slot="footer">
        <Button type="text" @click="isHealth = false">返回</Button>
      </div>
    </Modal>
  </div>
</template>

<script>
import { findUser, doUserAdd, doUserEdit, doUserDel, doUserDelMany } from '../../api/customer'

import { customerInfoColumns } from '../../libs/table'
import { customerInfoRules } from '../../libs/rules'
import { hasOneOf, array4tree, ObjectContrast } from '@/libs/tools'
import ImgUpload from '../components/img-upload/img-upload'
import Health from './customer-health'

export default {
  name: 'customer-info',
  components: {
    ImgUpload,
    Health
  },
  computed: {
    access () {
      return this.$store.state.user.access
    },
    viewAdd () {
      // return hasOneOf(['customer-add'], this.access)
      return true
    },
    viewEdit () {
      // return hasOneOf(['customer-edit'], this.access)
      return true
    },
    viewDel () {
      // return hasOneOf(['customer-del'], this.access)
      return true
    },
    viewDelMany () {
      // return hasOneOf(['customer-delMany'], this.access)
      return true
    },
    viewLabel () {
      // return hasOneOf(['customer-delMany'], this.access)
      return true
    },
    viewHealth () {
      // return hasOneOf(['customer-delMany'], this.access)
      return true
    }
  },
  data () {
    // 校验
    const validatePassCheck = (rule, value, callback) => {
      if (value) {
        if ((this.addForm.password !== '' && this.addForm.password != null) || (this.editForm.password !== '' && this.editForm.password != null)) {
          if (value !== this.addForm.password) {
            if (value !== this.editForm.password) {
              callback(new Error('两次密码输入不一致'))
            } else {
              callback()
            }
          } else {
            callback()
          }
        } else {
          callback()
        }
      } else {
        callback()
      }
    }
    return {
      isAdd: false,
      isEdit: false,
      isHealth: false,
      searchByName: '',
      searchByPhone: '',
      columns: [
        {
          title: '使用状态',
          align: 'center',
          render: (h, params) => {
            return h('div', [
              h('i-switch', {
                props: {
                  value: params.row.status === 1
                },
                style: {
                  marginRight: '10px',
                  display: this.viewEdit ? 'inline-block' : 'none'
                },
                on: {
                  'on-change': async (v) => {
                    let data = {}
                    data.id = params.row.id
                    if (v) {
                      data.status = 1
                    } else {
                      data.status = 0
                    }
                    let res = await doUserEdit(data)
                    if (res.code === 200) {
                      this.$Message.success('变更成功')
                      this.findUser(this.searchOption)
                    } else { // 添加失败
                      this.$Message.error(res.message)
                    }
                  }
                }
              }),
              h('span', [
                params.row.isEnable === 0 ? '禁用' : '正常'
              ])
            ])
          }
        },
        {
          title: '操作',
          align: 'center',
          key: 'handle',
          // width: 320,
          render: (h, params) => {
            if (this.viewLabel || this.viewEdit || this.viewDel || this.viewHealth) {
              return h('div', [
                // h('Button', {
                //   props: {
                //     type: 'success'
                //   },
                //   style: {
                //     marginRight: '5px',
                //     display: this.viewLabel ? 'inline-block' : 'none'
                //   },
                //   on: {
                //     click: () => {
                //       let data = Object.assign({}, params.row)
                //     }
                //   }
                // }, '标签'),
                h('Button', {
                  props: {
                    type: 'warning'
                  },
                  style: {
                    marginRight: '5px',
                    display: this.viewHealth ? 'inline-block' : 'none'
                  },
                  on: {
                    click: () => {
                      this.isHealth = true
                      this.$refs.health.healthData = {}
                      this.$refs.health.findUserHealthRecord(params.row.id)
                    }
                  }
                }, '档案'),
                h('Button', {
                  props: {
                    type: 'primary'
                  },
                  style: {
                    marginRight: '5px',
                    display: this.viewEdit ? 'inline-block' : 'none'
                  },
                  on: {
                    click: () => {
                      let data = Object.assign({}, params.row)
                      this.formCopy = Object.assign({}, data)
	                      this.openEditModal(data)
                    }
                  }
                }, '编辑')
                // h('Button', {
                //   props: {
                //     type: 'error'
                //   },
                //   style: {
                //     display: this.viewDel ? 'inline-block' : 'none'
                //   },
                //   on: {
                //     click: () => {
                //       this.$Modal.confirm({
                //         title: '请确认删除',
                //         content: `<p>删除数据: ${params.row.username} 后无法恢复,确认删除?</p>`,
                //         okText: '确认',
                //         onOk: () => {
                //           let id = {id: params.row.id}
                //           this.doUserDel(id)
                //         },
                //         // 取消删除
                //         onCancel: () => {
                //           this.$Message.info('取消删除！')
                //         }
                //       })
                //     }
                //   }
                // }, '删除')
              ])
            } else {
              return h('span', '您没有操作该数据的权限')
            }
          }
        }
      ],
      tableData: [],
      addForm: {},
      editForm: {},
      addRules: {
        rePassword: [{ validator: validatePassCheck, trigger: 'blur' },
          { required: true, message: '请输入确认密码', trigger: 'blur' }]
      },
      editRules: {
        rePassword: [{ validator: validatePassCheck, trigger: 'blur' }]
      },
      disDate: {
        disabledDate (date) {
          return date && date.valueOf() > Date.now() - 86400000
        }
      },
      gender: [
        { value: 0, name: '无' },
        { value: 1, name: '男' },
        { value: 2, name: '女' }
      ],
      radio: [
        { label: 0, name: '否' },
        { label: 1, name: '是' }
      ],
      formCopy: {},
      // 批量选择的id对象
      delId: {
        ids: ''
      },
      page: {// 页面翻页对象
        total: 1, // 数据总数
        currentPage: 1// 当前页面
      },
      searchOption: {} // 查询用参数
    }
  },
  created () {
    this.columns = customerInfoColumns.concat(this.columns)
    this.addRules = Object.assign(this.addRules, customerInfoRules)
    this.addRules.password = [
      {
        pattern: /^[^~# $……^。，；：“”‘’{}()[`%*&|+<>/,.;:'"=\]\\]{6,20}$/,
        message: '密码格式不正确,密码由6-20位大小写字母、数字、符号：?、!、@组成',
        trigger: 'blur'
      },
      { required: true, message: '密码不能为空', trigger: 'blur' }
    ]
    this.editRules = Object.assign(this.editRules, customerInfoRules)
    this.findUser()
  },
  methods: {
    // 查询
    async findUser (params) {
      let res = await findUser(params)
      if (res.code === 200) {
        this.tableData = res.data.list
        this.page = {
          total: res.data.total,
          currentPage: res.data.pageNum
        }
      } else {
        this.$Message.error(res.data)
      }
    },
    // 添加
    async doUserAdd () {
      this.$refs.addForm.validate(async (valid) => { // 表单校验
        if (valid) { // 表单验证成功
          let form = this.addForm
          if (form[`birth`] && form != null) {
            let arr = form.birth.split('-')
            form.birthYear = arr[0]
            form.birthMonth = arr[1]
            form.birthDay = arr[2]
          }
          // console.log(form)
          let res = await doUserAdd(form)
          if (res.code === 200) { // 添加成功
            this.$Message.success('添加成功')
            this.findUser(this.searchOption)
            this.cancelAddModal()
          } else { // 添加失败
            this.$Message.error(res.data)
          }
        } else {
          this.$Message.error('请正确填写表单')
        }
      })
    },
    // 编辑
    async doUserEdit () {
      this.$refs.editForm.validate(async (valid) => { // 表单校验
        if (valid) { // 表单验证成功
          let form = Object.assign({}, this.editForm)
          if (this.$refs.editDate.publicStringValue != null) {
            let arr = this.$refs.editDate.publicStringValue.split('-')
            form.birthYear = arr[0]
            form.birthMonth = arr[1]
            form.birthDay = arr[2]
          }
          delete form.birth
          let array = []
          array = ObjectContrast(form, this.formCopy)
          if (array.length > 0) {
            let data = {}
            array.forEach(v => {
              data[v] = form[v]
            })
            data.id = form.id
            // console.log(data)
            let res = await doUserEdit(data)
            if (res.code === 200) {
              this.$Message.success('编辑成功')
              this.findUser(this.searchOption)
              this.cancelEditModal()
            } else { // 添加失败
              this.$Message.error(res.data)
            }
          } else {
            this.$Message.error('表单没有修改')
          }
        } else {
          this.$Message.error('请正确填写表单')
        }
      })
    },
    // 删除
    async doUserDel (params) {
      let res = await doUserDel(params)
      if (res.code === 200) {
        this.$Message.success('删除成功')
        this.findUser(this.searchOption)
      } else {
        this.$Message.error(res.message)
      }
    },
    // 批量删除
    batchDel () {
      if (this.delId.ids) {
        this.$Modal.confirm({ // 打开确认对话框
          title: '请确认删除',
          content: `<p>删除数据后无法恢复,确认删除?</p>`,
          okText: '确认',
          // 确认删除
          onOk: async () => {
            let res = await doUserDelMany(this.delId)
            if (res.code === 200) {
              this.$Message.success('删除成功')
              this.delId.ids = ''
              this.findUser(this.searchOption)
            } else {
              this.$Message.error(res.message)
            }
          },
          // 取消删除
          onCancel: () => {
            this.$Message.info('取消删除！')
          }
        })
      } else {
        this.$Message.info('请选择需要删除的数据！')
      }
    },
    // 根据姓名查询
    handleSearchByName () {
      if (this.searchByName) { // 判断搜索条件是否为空
        this.searchOption.name = this.searchByName
      } else { // 重置搜索内容
        this.searchOption.name = ''
      }
      this.searchOption.page = 1 // 初始化页数
      this.findUser(this.searchOption)
    },
    // 根据账号/手机查询
    handleSearchByPhone () {
      if (this.searchByPhone) { // 判断搜索条件是否为空
        this.searchOption.username = this.searchByPhone
      } else { // 重置搜索内容
        this.searchOption.username = ''
      }
      this.searchOption.page = 1 // 初始化页数
      this.findUser(this.searchOption)
    },
    cancelAddModal () {
      this.$refs.addForm.resetFields()// 重置表单
      this.$refs.imgUpload.updateImgUrl([])
      this.addForm = {}
      this.isAdd = false
    },
    // 编辑modal打开
    openEditModal (params) {
      // console.log(params)
      if (params[`avatar`] && params.avatar !== '') {
        let list = []
        list.push({
          url: params.avatar,
          name: '头像',
          status: 'finished'
        })
        this.$refs.imgUploadByEdit.updateImgUrl(list)
      } else {
	      let list = []
	      let avatar = require('@/assets/images/man.png')
	      if (params[`gender`] === 2) {
		      avatar = require('@/assets/images/women.png')
	      }
	      list.push({
		      url: avatar,
		      name: '头像',
		      status: 'finished'
	      })
	      this.$refs.imgUploadByEdit.updateImgUrl(list)
      }
      params.birth = params.birthYear + '-' + params.birthMonth + '-' + params.birthDay
      this.editForm = params
	      setTimeout(() => {
		      this.isEdit = true
	      }, 300)
    },
    cancelEditModal () {
      this.$refs.editForm.resetFields()// 重置表单
      this.editForm = {}
      this.isEdit = false
    },
    // 获取上传图片url
    getUploadImg (url) {
      this.addForm.avatar = url
      this.editForm.avatar = url
    },
    delUploadImg (url) {
      this.addForm.avatar = ''
      this.editForm.avatar = ''
    },
    // 批量选择
    batchSelect (selection) {
      this.delId.ids = ''
      selection.forEach(row => {
        if (this.delId.ids === '') {
          this.delId.ids = row.id
        } else {
          this.delId.ids = this.delId.ids + ',' + row.id
        }
      })
    },
    // 页面翻页
    handlePageTurn (page) {
      this.searchOption.page = page
      this.findUser(this.searchOption)
    }
  }
}
</script>

<style scoped>

</style>
