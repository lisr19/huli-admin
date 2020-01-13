<template>
  <div>
    <!--按钮部分-->
    <Card>
      <p slot="title">app版本管理</p>
      <Row>
        <Col span="2">
          <Button type="primary" class="my-btn" v-if="viewAdd" @click="isAdd = true">添加</Button>
        </Col>
        <Col span="2">
          <Button type="error" class="my-btn" v-if="viewDelMany" @click="batchDel">批量删除</Button>
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
    <Modal v-model="isAdd" :mask-closable="false" :closable="false" title="app版本添加：" width="500">
      <Form :model="addForm" ref="addForm" :label-width="100" :rules="rules">
        <FormItem label="二维码：" prop="qrcodeUrl">
          <img-upload ref="imgUpload" @imgUpload="getUploadImg" @delImg="delUploadImg"></img-upload>
        </FormItem>
        <FormItem label="app类型：" prop="appType">
          <Select v-model="addForm.appType" placeholder="请选择app类型">
            <Option v-for="item in appType" :value="item.value" :key="item.value">{{item.name}}</Option>
          </Select>
        </FormItem>
        <FormItem label="主版本号：" prop="majorVersionNumber">
          <InputNumber :max="9" :min="0" v-model="addForm.majorVersionNumber"></InputNumber>
        </FormItem>
        <FormItem label="子版本号：" prop="minorVersionNumber">
          <InputNumber :max="9" :min="0" v-model="addForm.minorVersionNumber"></InputNumber>
        </FormItem>
        <FormItem label="修正版本号：" prop="revisionNumber">
          <InputNumber :min="0" v-model="addForm.revisionNumber"></InputNumber>
        </FormItem>
        <FormItem label="apk上传" v-if="addForm.appType">
          <Upload
            v-show="addForm.downloadUrl === ''"
            :show-upload-list="false"
            :before-upload="handleBeforeUpload"
            :on-success="handleSuccess"
            name="file"
            :headers="myHeader"
            :action="$config.appBaseUrl">
            <Button icon="ios-cloud-upload-outline">上传app</Button>
          </Upload>
          <span v-show="addForm.downloadUrl !== ''">上传成功</span>
        </FormItem>
      </Form>
      <!--自定义页脚-->
      <div slot="footer">
        <Button type="text" @click="cancelAddModal">取消</Button>
        <Button type="primary" @click="doApkVersionAdd">确认</Button>
      </div>
    </Modal>

    <!--编辑Modal-->
    <Modal v-model="isEdit" :mask-closable="false" :closable="false" title="app版本编辑：" width="500">
      <Form :model="editForm" ref="editForm" :label-width="100" :rules="rules">
        <FormItem label="app类型：" prop="appType">
          <Select v-model="editForm.appType" placeholder="请选择app类型">
            <Option v-for="item in appType" :value="item.value" :key="item.value">{{item.name}}</Option>
          </Select>
        </FormItem>
        <FormItem label="主版本号：" prop="majorVersionNumber">
          <InputNumber :max="9" :min="0" v-model="editForm.majorVersionNumber"></InputNumber>
        </FormItem>
        <FormItem label="子版本号：" prop="minorVersionNumber">
          <InputNumber :max="9" :min="0" v-model="editForm.minorVersionNumber"></InputNumber>
        </FormItem>
        <FormItem label="修正版本号：" prop="revisionNumber">
          <InputNumber :min="0" v-model="editForm.revisionNumber"></InputNumber>
        </FormItem>
        <FormItem label="apk上传" v-if="editForm.appType">
          <Upload
            v-show="editForm.downloadUrl === ''"
            :show-upload-list="false"
            :before-upload="handleBeforeUpload"
            :on-success="handleSuccess"
            name="file"
            :headers="myHeader"
            :action="$config.appBaseUrl">
            <Button icon="ios-cloud-upload-outline">上传app</Button>
          </Upload>
          <span v-show="editForm.downloadUrl !== ''">上传成功</span>
        </FormItem>
      </Form>
      <!--自定义页脚-->
      <div slot="footer">
        <Button type="text" @click="cancelEditModal">取消</Button>
        <Button type="primary" @click="doApkVersionEdit">确认</Button>
      </div>
    </Modal>
  </div>
</template>

<script>
  import {
    findApkVersion,
    doApkVersionAdd,
    doApkVersionEdit,
    doApkVersionDel,
    doApkVersionDelMany
  } from "../../api/version";
  import {ObjectContrast} from "../../libs/tools";
  import {apkVersionColumns} from "../../libs/table";
  import Config from '../../config/index'
  import ImgUpload from '../components/img-upload/img-upload'


  export default {
    name: "version",
    components: {
      ImgUpload
    },
    computed: {
      access() {
        return this.$store.state.user.access
      },
      viewAdd() { // 该用户是否拥有用户添加权限
        // return hasOneOf(['role-add'], this.access)
        return true
      },
      viewEdit() { // 该用户是否拥有用户信息编辑权限
        // return hasOneOf(['role-edit'], this.access)
        return true
      },
      viewDel() { // 该用户是否拥有用户删除权限
        // return hasOneOf(['role-del'], this.access)
        return true
      },
      viewDelMany() { // 该用户是否拥有用户删除权限
        // return hasOneOf(['role-delMany'], this.access)
        return true
      },
      viewAccess() {
        // if (hasOneOf(['role-access-add'], this.access) && hasOneOf(['role-access-del'], this.access)) {
        //   return true
        // } else {
        //   return false
        // }
        return true
      }
    },
    data() {
      return {
        myHeader: {authorization: localStorage.getItem(Config.tokenName)},
        isAdd: false,
        isEdit: false,
        columns: [
          {
            title: '操作',
            align: 'center',
            key: 'handle',
            render: (h, params) => {
              if (this.viewEdit || this.viewDel) {
                return h('div', [
                  // h('Button', {
                  //   props: {
                  //     type: 'primary'
                  //   },
                  //   style: {
                  //     marginRight: '5px',
                  //     display: this.viewEdit ? 'inline-block' : 'none'
                  //   },
                  //   on: {
                  //     click: () => {
                  //       let data = Object.assign({}, params.row)
                  //       this.formCopy = Object.assign({}, data)
                  //       this.openEditModal(data)
                  //     }
                  //   }
                  // }, '编辑'),
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
                          content: `<p>删除数据后无法恢复,确认删除?</p>`,
                          okText: '确认',
                          onOk: () => {
                            let id = {id: params.row.id}
                            this.doApkVersionDel(id)
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
        tableData: [],
        accessData: [],
        addForm: {
          majorVersionNumber: 0,
          minorVersionNumber: 0,
          revisionNumber: 0,
          downloadUrl: ''
        },
        editForm: {},
        appType: [
          {
            value: 1,
            name: '安卓用户端'
          },
          {
            value: 2,
            name: '安卓护士端'
          }
        ],
        rules: {
          appType: [
            {required: true, type: 'number', message: 'app类型不能为空', trigger: 'blur'}
          ],
          majorVersionNumber: [{required: true, type: 'number', message: '主版本号不能为空', trigger: 'blur'}]
        },
        // 批量选择的id对象
        delId: {
          ids: ''
        },
        page: {// 页面翻页对象
          total: 1, // 数据总数
          currentPage: 1// 当前页面
        },
        formCopy: {},
        searchOption: {}, // 查询用参数
      }
    },
    created() {
      this.columns = apkVersionColumns.concat(this.columns)
    },
    mounted() {
      this.findApkVersion()
    },
    methods: {
      //查询
      async findApkVersion(params) {
        let res = await findApkVersion(params)
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
      //添加
      async doApkVersionAdd() {
        this.$refs.addForm.validate(async (valid) => { // 表单校验
          if (valid) { // 表单验证成功
            let form = this.addForm
            // console.log(form)
            let res = await doApkVersionAdd(form)
            if (res.code === 200) { // 添加成功
              this.$Message.success('添加成功')
              this.findApkVersion(this.searchOption)
              this.cancelAddModal()
            } else { // 添加失败
              this.$Message.error(res.data)
            }
          } else {
            this.$Message.error('请正确填写表单')
          }
        })
      },
      //编辑
      async doApkVersionEdit() {
        this.$refs.editForm.validate(async (valid) => { // 表单校验
          if (valid) { // 表单验证成功
            let form = this.editForm
            let array = []
            array = ObjectContrast(form, this.formCopy)
            // console.log(array)
            if (array.length > 0 && form.downloadUrl !== '') {
              let data = {}
              array.forEach(v => {
                data[v] = form[v]
              })
              data.id = form.id
              let res = await doApkVersionEdit(data)
              if (res.code === 200) {
                this.$Message.success('编辑成功')
                this.findApkVersion(this.searchOption)
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
      async doApkVersionDel(params) {
        let res = await doApkVersionDel(params)
        if (res.code === 200) {
          this.$Message.success('删除成功')
          this.findApkVersion(this.searchOption)
        } else {
          this.$Message.error(res.data)
        }
      },
      // 批量删除
      batchDel() {
        if (this.delId.ids) {
          this.$Modal.confirm({ // 打开确认对话框
            title: '请确认删除',
            content: `<p>删除数据后无法恢复,确认删除?</p>`,
            okText: '确认',
            // 确认删除
            onOk: async () => {
              let res = await doApkVersionDelMany(this.delId)
              if (res.code === 200) {
                this.$Message.success('删除成功')
                this.delId.ids = ''
                this.findApkVersion(this.searchOption)
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
      cancelAddModal() {
        this.$refs.addForm.resetFields()// 重置表单
        this.addForm = {
          majorVersionNumber: 0,
          minorVersionNumber: 0,
          revisionNumber: 0,
          downloadUrl: ''
        }
        this.$refs.imgUpload.updateImgUrl([])
        this.isAdd = false
      },
      // 编辑modal打开
      openEditModal(params) {
        this.editForm = params
        this.editForm.downloadUrl = ''
        this.isEdit = true
      },
      cancelEditModal() {
        this.$refs.editForm.resetFields()// 重置表单
        this.editForm = {}
        this.isEdit = false
      },
      //校验文件上传
      handleBeforeUpload(file) {
        const fullName = file.name
        let array = fullName.split('.')
        const txt = array[array.length - 1]
        array.pop()
        const name = array.join('.')
        console.log(txt)
        console.log(name)
        let check = true
        let msg = ''
        if (txt === 'apk') {
          let form = {}
          if (this.isAdd) {
            form = this.addForm
          } else {
            form = this.editForm
          }
          switch (form.appType) {
            case 1://安卓用户端
              let userApk = 'app_user_' + form.majorVersionNumber + '.' + form.minorVersionNumber + '.' + form.revisionNumber
              name === userApk ? msg = '' : msg = '上传文件名称与填写信息不匹配'
              break;
            case 2://安卓用户端
              let nurseApk = 'app_nurse_' + form.majorVersionNumber + '.' + form.minorVersionNumber + '.' + form.revisionNumber
              name === nurseApk ? msg = '' : msg = '上传文件名称与填写信息不匹配'
              break;
          }
        } else {
          msg = '上传文件类型需为.apk'
        }
        if (msg !== '') {
          this.$Message.error(msg)
          check = false
        }
        return check
      },
      handleSuccess(res, file) {
        // console.log(file)
        let rtn = file.response
        if (rtn.code === 200) {
          this.$Message.success('上传成功')
          if (this.isAdd) {
            this.addForm.downloadUrl = res.data
          } else {
            this.editForm.downloadUrl = res.data
          }
        } else {
          this.$Message.error(rtn.message)
        }
      },
      // 获取上传图片url
      getUploadImg(url) {
        this.addForm.qrcodeUrl = url
        this.editForm.qrcodeUrl = url
      },
      delUploadImg(url) {
        this.addForm.qrcodeUrl = ''
        this.editForm.qrcodeUrl = ''
      },
      // 页面翻页
      handlePageTurn(page) {
        this.searchOption.page = page
        this.findApkVersion(this.searchOption)
      }
    }
  }
</script>

<style scoped>

</style>
