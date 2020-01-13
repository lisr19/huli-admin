<template>
  <div>
    <!--按钮部分-->
    <Card>
      <p slot="title">护士信息管理</p>
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
                 placeholder="输入护士名搜索"/>
        </Col>
      </Row>
    </Card>

    <!--表格部分-->
    <Card>
      <div>
        <Table :columns="columns" :data="tableData" border @on-selection-change="batchSelect"
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
    <Modal v-model="isAdd" :mask-closable="false" :closable="false" title="护士添加：" width="600">
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
          <FormItem label="身份证号码：" prop="idNumber">
            <Input clearable v-model="addForm.idNumber" placeholder="请填写身份证号码"/>
          </FormItem>
          <FormItem label="出声年月日：" prop="birthday">
            <DatePicker type="date" :options="disDate" format="yyyy-MM-dd" placeholder="请选择出声年月日"
                        @on-change="v=>{addForm.birth=v}"
                        style="width: 100%"></DatePicker>
          </FormItem>
          <FormItem label="评分：">
            <InputNumber v-model="addForm.grade" :max="500" :min="1"></InputNumber>
          </FormItem>
          <FormItem label="工作医院：" prop="hospital">
            <Input clearable v-model="addForm.hospital" placeholder="请填写工作医院"/>
          </FormItem>
          <FormItem label="工作科室：" prop="department">
            <Input clearable v-model="addForm.department" placeholder="请填写工作科室"/>
          </FormItem>
          <FormItem label="工作年限：" prop="workYears">
            <Input clearable v-model="addForm.workYears" placeholder="请填写工作年限">
            <span slot="append">年</span>
            </Input>
          </FormItem>
          <FormItem label="专长：" prop="speciality">
            <Input v-model="addForm.speciality" :rows="4" maxlength="1000" show-word-limit type="textarea" placeholder="请输入专长..." style="width: 300px" />
          </FormItem>
          <FormItem label="紧急联系人：" prop="emergencyContact">
            <Input clearable v-model="addForm.emergencyContact" placeholder="请填写紧急联系人"/>
          </FormItem>
          <FormItem label="紧急联系人电话：" prop="emergencyContactPhone">
            <Input clearable v-model="addForm.emergencyContactPhone" placeholder="请填写紧急联系人电话"/>
          </FormItem>
          <FormItem label="提供服务区域：" prop="serviceArea">
            <Select v-model="addForm.serviceArea" multiple style="width:260px">
              <Option v-for="item in serviceAreaData" :value="item.itemName" :key="item.id">{{ item.itemName }}</Option>
            </Select>
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
        <Button type="primary" @click="doNurseAdd">确认</Button>
      </div>
    </Modal>

    <!--编辑Modal-->
    <Modal v-model="isEdit" :mask-closable="false" :closable="false" title="护士编辑：" width="600">
      <Form :model="editForm" ref="editForm" :rules="editRules" :label-width="120">
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
          <FormItem label="身份证号码：" prop="idNumber">
            <Input clearable v-model="editForm.idNumber" placeholder="请填写身份证号码"/>
          </FormItem>
          <FormItem label="出声年月日：" prop="birthday">
            <DatePicker type="date" :options="disDate" ref="editDate" v-model="editForm.birth" format="yyyy-MM-dd"
                        placeholder="请选择出声年月日"
                        style="width: 100%"></DatePicker>
          </FormItem>
          <FormItem label="评分：">
            <InputNumber v-model="editForm.grade" :max="500" :min="1"></InputNumber>
          </FormItem>
          <FormItem label="工作医院：" prop="hospital">
            <Input clearable v-model="editForm.hospital" placeholder="请填写工作医院"/>
          </FormItem>
          <FormItem label="工作科室：" prop="department">
            <Input clearable v-model="editForm.department" placeholder="请填写工作科室"/>
          </FormItem>
          <FormItem label="工作年限：" prop="workYears">
            <Input clearable v-model="editForm.workYears" placeholder="请填写工作年限">
            <span slot="append">年</span>
            </Input>
          </FormItem>
          <FormItem label="专长：" prop="speciality">
            <Input v-model="editForm.speciality" :rows="4" maxlength="1000" show-word-limit type="textarea" placeholder="请输入专长..." style="width: 300px" />
          </FormItem>
          <FormItem label="紧急联系人：" prop="emergencyContact">
            <Input clearable v-model="editForm.emergencyContact" placeholder="请填写紧急联系人"/>
          </FormItem>
          <FormItem label="紧急联系人电话：" prop="emergencyContactPhone">
            <Input clearable v-model="editForm.emergencyContactPhone" placeholder="请填写紧急联系人电话"/>
          </FormItem>
          <FormItem label="提供服务区域：" prop="serviceArea">
            <Select v-model="editForm.serviceArea" multiple style="width:260px">
              <Option v-for="item in serviceAreaData" :value="item.itemName" :key="item.id">{{ item.itemName }}</Option>
            </Select>
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
        <Button type="primary" @click="doNurseEdit">确认</Button>
      </div>
    </Modal>

    <!--资质-->
    <Modal v-model="isDetail" :mask-closable="false" :closable="false" title="护士资质：" width="1000">
      <Credentials :detailStatus="detailStatus"></Credentials>
      <div slot="footer">
        <Button type="text" @click="cancelModal">取消</Button>
      </div>
    </Modal>
  </div>
</template>

<script>
import { findNurse, doNurseAdd, doNurseEdit, doNurseDel, doNurseDelMany } from '../../api/nurse'
import { findSubordinateAreaList } from '../../api/otherData'
import { nurseInfoColumns } from '../../libs/table'
import { nurseInfoRules } from '../../libs/rules'
import { hasOneOf, array4tree, ObjectContrast } from '@/libs/tools'
import ImgUpload from '../components/img-upload/img-upload'
import Credentials from './nurse-credentials'

export default {
  name: 'nurse-info',
  components: {
    ImgUpload,
    Credentials
  },
  computed: {
    access () {
      return this.$store.state.user.access
    },
    viewAdd () {
      // return hasOneOf(['nurse-add'], this.access)
      return true
    },
    viewEdit () {
      // return hasOneOf(['nurse-edit'], this.access)
      return true
    },
    viewDel () {
      // return hasOneOf(['nurse-del'], this.access)
      return true
    },
    viewDelMany () {
      // return hasOneOf(['nurse-delMany'], this.access)
      return true
    },
    viewLabel () {
      // return hasOneOf(['nurse-label'], this.access)
      return true
    },
    viewDetail () {
      // return hasOneOf(['nurse-detail'], this.access)
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
    const validateServiceArea = (rule, value, callback) => {
      if (value != null && value.length > 0) {
        callback()
      } else {
        callback(new Error('服务区域不能为空'))
      }
    }
    return {
      isAdd: false,
      isEdit: false,
      isDetail: false,
      detailStatus: true,
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
                    let res = await doNurseEdit(data)
                    if (res.code === 200) {
                      this.$Message.success('变更成功')
                      this.findNurse(this.searchOption)
                    } else { // 添加失败
                      this.$Message.error(res.message)
                    }
                  }
                }
              }),
              h('span', [
                params.row.status === 0 ? '禁用' : '正常'
              ])
            ])
          }
        },
        {
          title: '操作',
          align: 'center',
          key: 'handle',
          width: 200,
          render: (h, params) => {
            if (this.viewEdit || this.viewDel || this.viewDetail) {
              return h('div', [
                h('Button', {
                  props: {
                    type: 'warning'
                  },
                  style: {
                    marginRight: '5px',
                    display: this.viewDetail ? 'inline-block' : 'none'
                  },
                  on: {
                    click: () => {
                      // this.isHealth = true
                      this.openModal()
                    }
                  }
                }, '资质'),
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
                //           this.doNurseDel(id)
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
      serviceAreaData: [],
      addForm: {},
      editForm: {},
      detailData: {},
      addRules: {
        rePassword: [{ validator: validatePassCheck, trigger: 'blur' },
          { required: true, message: '请输入确认密码', trigger: 'blur' }],
        serviceArea: [
          { validator: validateServiceArea, trigger: 'blur' }
        ]
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
    this.columns = nurseInfoColumns.concat(this.columns)
    this.addRules = Object.assign(this.addRules, nurseInfoRules)
    this.addRules.password = [
      {
        pattern: /^[^~# $……^。，；：“”‘’{}()[`%*&|+<>/,.;:'"=\]\\]{6,20}$/,
        message: '密码格式不正确,密码由6-20位大小写字母、数字、符号：?、!、@组成',
        trigger: 'blur'
      },
      { required: true, message: '密码不能为空', trigger: 'blur' }
    ]
    this.editRules = Object.assign(this.editRules, nurseInfoRules)
    this.findNurse()
    this.findSubordinateAreaList()
  },
  methods: {
    // 查询
    async findNurse (params) {
      let res = await findNurse(params)
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
    // 查询
    async findSubordinateAreaList () {
      let res = await findSubordinateAreaList({ size: 100 })
      if (res.code === 200) {
        this.serviceAreaData = res.data.list
      } else {
        this.$Message.error(res.data)
      }
    },
    // 添加
    async doNurseAdd () {
      this.$refs.addForm.validate(async (valid) => { // 表单校验
        if (valid) { // 表单验证成功
          let form = Object.assign({}, this.addForm)
          form.serviceArea = form.serviceArea.join(',')
          if (form[`birth`] && form != null) {
            let arr = form.birth.split('-')
            form.birthYear = arr[0]
            form.birthMonth = arr[1]
            form.birthDay = arr[2]
          }
          delete form.birth
          delete form.rePassword
          // console.log(form)
          let res = await doNurseAdd(form)
          if (res.code === 200) { // 添加成功
            this.$Message.success('添加成功')
            this.findNurse(this.searchOption)
            this.cancelAddModal()
          } else { // 添加失败
            this.$Message.error(res.message)
          }
        } else {
          this.$Message.error('请正确填写表单')
        }
      })
    },
    // 编辑
    async doNurseEdit () {
      this.$refs.editForm.validate(async (valid) => { // 表单校验
        if (valid) { // 表单验证成功
          let form = Object.assign({}, this.editForm)
          if (this.$refs.editDate.publicStringValue && this.$refs.editDate.publicStringValue != null) {
            let arr = this.$refs.editDate.publicStringValue.split('-')
            form.birthYear = arr[0]
            form.birthMonth = arr[1]
            form.birthDay = arr[2]
          }
          delete form.birth
          let array = []
          form.serviceArea = form.serviceArea.join(',')
          array = ObjectContrast(form, this.formCopy)
          if (array.length > 0) {
            let data = {}
            array.forEach(v => {
              data[v] = form[v]
            })
            // data.avatar = 'http://sdcmi.halohealth.cn/images/1552373693998.jpg'
            data.id = form.id
            // console.log(data)
            let res = await doNurseEdit(data)
            if (res.code === 200) {
              this.$Message.success('编辑成功')
              this.findNurse(this.searchOption)
              this.cancelEditModal()
            } else { // 添加失败
              this.$Message.error(res.message)
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
    async doNurseDel (params) {
      let res = await doNurseDel(params)
      if (res.code === 200) {
        this.$Message.success('删除成功')
        this.findNurse(this.searchOption)
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
            let res = await doNurseDelMany(this.delId)
            if (res.code === 200) {
              this.$Message.success('删除成功')
              this.delId.ids = ''
              this.findNurse(this.searchOption)
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
      this.findNurse(this.searchOption)
    },
    // 根据账号/手机查询
    handleSearchByPhone () {
      if (this.searchByPhone) { // 判断搜索条件是否为空
        this.searchOption.username = this.searchByPhone
      } else { // 重置搜索内容
        this.searchOption.username = ''
      }
      this.searchOption.page = 1 // 初始化页数
      this.findNurse(this.searchOption)
    },
    // modal打开
    openModal (params) {
      this.detailData = params
      this.isDetail = true
    },
    cancelModal () {
      this.detailData = {}
      this.isDetail = false
    },
    cancelAddModal () {
      this.$refs.addForm.resetFields()// 重置表单
      this.$refs.imgUpload.updateImgUrl([])
      this.addForm = {}
      this.isAdd = false
    },
    // 编辑modal打开
    openEditModal (params) {
      if (params[`avatar`] && params.avatar !== '') {
        let list = []
        list.push({
          url: params.avatar,
          name: '图片',
          status: 'finished'
        })
        this.$refs.imgUploadByEdit.updateImgUrl(list)
      } else {
	      let list = []
	      let avatar = require('@/assets/images/nurse1.png')
	      if (params[`gender`] === 1) {
		      avatar = require('@/assets/images/nurse2.png')
	      }
	      list.push({
		      url: avatar,
		      name: '图片',
		      status: 'finished'
	      })
	      this.$refs.imgUploadByEdit.updateImgUrl(list)
      }
      params.birth = params.birthYear + '-' + params.birthMonth + '-' + params.birthDay
      let array = params.serviceArea.split(',')
      params.serviceArea = []
      array.forEach(v => {
        params.serviceArea.push(v)
      })
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
      this.findNurse(this.searchOption)
    }
  }
}
</script>

<style scoped>

</style>
