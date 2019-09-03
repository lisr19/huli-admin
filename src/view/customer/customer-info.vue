<template>
  <div>
    <!--按钮部分-->
    <Card>
      <p slot="title">客户基本信息</p>
      <Row>
        <Col span="2">
          <Button type="primary" class="my-btn" v-if="viewAdd" @click="isAdd = true">添加</Button>
        </Col>

        <Col span="2">
          <Button type="error" class="my-btn" v-if="viewDelMany">批量删除</Button>
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
    <Modal v-model="isAdd" :mask-closable="false" :closable="false" title="客户添加：" width="600">
      <Form :model="addForm" ref="addForm" :rules="addRules" :label-width="120">
        <Card>
          <FormItem label="头像：" prop="avatar">
            <img-upload ref="imgUpload" @imgUpload="getUploadImg" @delImg="delUploadImg"></img-upload>
          </FormItem>
          <FormItem label="昵称：" prop="username">
            <Input clearable v-model="addForm.username" placeholder="请填写昵称"/>
          </FormItem>
          <FormItem label="姓名：" prop="name">
            <Input clearable v-model="addForm.name" placeholder="请填写姓名"/>
          </FormItem>
          <FormItem label="电话：" prop="phone">
            <Input clearable v-model="addForm.phone" placeholder="请填写电话"/>
          </FormItem>
          <FormItem label="性别：" prop="gender">
            <Select clearable v-model="addForm.gender" placeholder="请选择性别" style="width: 100%">
              <Option value="0" key="0">无</Option>
              <Option value="1" key="1">男</Option>
              <Option value="2" key="2">女</Option>
            </Select>
          </FormItem>
          <FormItem label="出声年月日：" prop="birthday">
            <DatePicker type="date" placeholder="请选择出声年月日" style="width: 100%"></DatePicker>
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
        <!--<Button type="primary" @click="doAdminAdd">确认</Button>-->
      </div>
    </Modal>

    <!--编辑Modal-->
    <Modal v-model="isEdit" :mask-closable="false" :closable="false" title="客户编辑：" width="600">
      <Form :model="editForm" ref="editForm" :rules="editRules" :label-width="120">
        <Card>
          <FormItem label="头像：" prop="avatar">
            <img-upload ref="imgUploadByEdit" @imgUpload="getUploadImg" @delImg="delUploadImg"></img-upload>
          </FormItem>
          <FormItem label="昵称：" prop="username">
            <Input clearable v-model="editForm.username" placeholder="请填写昵称"/>
          </FormItem>
          <FormItem label="姓名：" prop="name">
            <Input clearable v-model="editForm.name" placeholder="请填写姓名"/>
          </FormItem>
          <FormItem label="电话：" prop="phone">
            <Input clearable v-model="editForm.phone" placeholder="请填写电话"/>
          </FormItem>
          <FormItem label="性别：" prop="gender">
            <Select clearable v-model="editForm.gender" placeholder="请选择性别" style="width: 100%">
              <Option value="0" key="0">无</Option>
              <Option value="1" key="1">男</Option>
              <Option value="2" key="2">女</Option>
            </Select>
          </FormItem>
          <FormItem label="出声年月日：" prop="birthday">
            <DatePicker type="date" placeholder="请选择出声年月日" style="width: 100%"></DatePicker>
          </FormItem>
          <FormItem label="密码：" prop="password">
            <Input clearable v-model="editForm.password" type="password" placeholder="请输入密码"/>
          </FormItem>
          <FormItem label="确认密码：" prop="rePassword">
            <Input clearable v-model="editForm.rePassword" type="password" placeholder="请确认密码"/>
          </FormItem>
        </Card>
      </Form>
      <!--自定义页脚-->
      <div slot="footer">
        <Button type="text" @click="cancelEditModal">取消</Button>
        <!--<Button type="primary" @click="doAdminAdd">确认</Button>-->
      </div>
    </Modal>

    <!--健康档案Modal-->
    <Modal v-model="isHealth" :mask-closable="false" :closable="false" title="客户-健康档案：" width="1000">
      <health></health>
      <div slot="footer">
        <Button type="text" @click="isHealth = false">取消</Button>
      </div>
    </Modal>
  </div>
</template>

<script>
  import {customerInfoColumns} from '../../libs/table'
  import {customerInfoRules} from "../../libs/rules";
  import {hasOneOf, array4tree} from '@/libs/tools'
  import ImgUpload from '../components/img-upload/img-upload'
  import Health from './customer-health'

  export default {
    name: "customer-info",
    components:{
      ImgUpload,
      Health
    },
    computed: {
      access() {
        return this.$store.state.user.access
      },
      viewAdd() {
        // return hasOneOf(['customer-add'], this.access)
        return true
      },
      viewEdit() {
        // return hasOneOf(['customer-edit'], this.access)
        return true
      },
      viewDel() {
        // return hasOneOf(['customer-del'], this.access)
        return true
      },
      viewDelMany() {
        // return hasOneOf(['customer-delMany'], this.access)
        return true
      },
      viewLabel() {
        // return hasOneOf(['customer-delMany'], this.access)
        return true
      },
      viewHealth() {
        // return hasOneOf(['customer-delMany'], this.access)
        return true
      },
    },
    data() {
      // 校验
      const validatePassCheck = (rule, value, callback) => {
        if(value){
          if ((this.addForm.password !== '' && this.addForm.password != null)||(this.editForm.password !== '' && this.editForm.password != null)) {
            if (value !== this.addForm.password) {
              if(value !== this.editForm.password){
                callback(new Error('两次密码输入不一致'))
              }else{
                callback()
              }
            } else {
              callback()
            }
          } else {
            callback()
          }
        }else{
          callback()
        }
      };
      return {
        isAdd:false,
        isEdit:false,
        isHealth:false,
        columns: [
          {
            title: '操作',
            align: 'center',
            key: 'handle',
            width:320,
            render: (h, params) => {
              if (this.viewLabel || this.viewEdit || this.viewDel || this.viewHealth) {
                return h('div', [
                  h('Button', {
                    props: {
                      type: 'success'
                    },
                    style: {
                      marginRight: '5px',
                      display: this.viewLabel ? 'inline-block' : 'none'
                    },
                    on: {
                      click: () => {
                        let data = Object.assign({}, params.row)
                      }
                    }
                  }, '标签'),
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
                        // this.formCopy = Object.assign({}, data)
                        this.openEditModal(data)
                      }
                    }
                  }, '编辑'),
                  h('Button', {
                    props: {
                      type: 'error'
                    },
                    style: {
                      display: this.viewDel ? 'inline-block' : 'none'
                    },
                    on: {
                      click: () => {
                        this.$Modal.confirm({
                          title: '请确认删除',
                          content: `<p>删除数据: ${params.row.name} 后无法恢复,确认删除?</p>`,
                          okText: '确认',
                          onOk: () => {
                            let id = {id: params.row.id}
                            // this.doAdminDel(id)
                          },
                          // 取消删除
                          onCancel: () => {
                            this.$Message.info('取消删除！')
                          }
                        })
                      }
                    }
                  }, '删除')
                ])
              } else {
                return h('span', '您没有操作该数据的权限')
              }
            }
          }
        ],
        tableData: [{}],
        addForm:{},
        editForm:{},
        addRules:{
          rePassword: [{ validator: validatePassCheck, trigger: 'blur' },
            { required: true, message: '请输入确认密码', trigger: 'blur' },],
        },
        editRules:{
          rePassword: [{ validator: validatePassCheck, trigger: 'blur' }],
        },
        // 批量选择的id对象
        delId: {
          ids: ''
        },
        page: {// 页面翻页对象
          total: 1, // 数据总数
          currentPage: 1// 当前页面
        },
        searchOption: {}, // 查询用参数
      }
    },
    created(){
      this.columns = customerInfoColumns.concat(this.columns)
      this.addRules = Object.assign(this.addRules,customerInfoRules)
      this.editRules = Object.assign(this.editRules,customerInfoRules)
    },
    methods:{
      cancelAddModal(){
        this.$refs.addForm.resetFields()// 重置表单
        this.addForm = {}
        this.$refs.imgUpload.updateImgUrl([])
        this.isAdd = false
      },
      // 编辑modal打开
      openEditModal (params) {
        this.editForm = params
        this.isEdit = true
      },
      cancelEditModal(){
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
      batchSelect(selection) {
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
      handlePageTurn(page) {
        this.searchOption.page = page
        // this.findAdminData(this.searchOption)
      },
    }
  }
</script>

<style scoped>

</style>
