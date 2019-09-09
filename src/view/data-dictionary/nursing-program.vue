<template>
  <div>
    <!--按钮部分-->
    <Card>
      <p slot="title">护理项目管理</p>
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
    <Modal v-model="isAdd" :mask-closable="false" :closable="false" title="服务添加：" width="600">
      <Form :model="addForm" ref="addForm" :label-width="100" :rules="rules">
        <FormItem label="服务图片：" prop="imgUrl">
          <img-upload ref="imgUpload" @imgUpload="getUploadImg" @delImg="delUploadImg"></img-upload>
        </FormItem>
        <FormItem label="服务名称：" prop="name">
          <Input clearable v-model="addForm.name" placeholder="服务名称"/>
        </FormItem>
        <FormItem label="服务类型：" prop="serviceType">
          <Select clearable v-model="addForm.serviceType" placeholder="请选择服务类型" style="width: 100%">
            <Option v-for="item in types" :value="item.id" :key="item.id">{{item.name}}</Option>
          </Select>
        </FormItem>
        <FormItem label="有子服务：">
          <RadioGroup v-model="addForm.hasChild">
            <Radio v-for="item in hasChild" :label="item.label">
              <span>{{item.name}}</span>
            </Radio>
          </RadioGroup>
        </FormItem>
        <FormItem label="服务价格：" prop="price">
          <Input v-model="addForm.price" placeholder="服务价格">
          <span slot="append">元</span>
          </Input>
        </FormItem>
        <FormItem label="常用项目：">
          <RadioGroup v-model="addForm.common">
            <Radio v-for="item in common" :label="item.label">
              <span>{{item.name}}</span>
            </Radio>
          </RadioGroup>
        </FormItem>
        <FormItem label="需要护士(人)：" prop="numberOfNurse">
          <InputNumber clearable v-model="addForm.numberOfNurse" :max="10" :min="1"/>
        </FormItem>
        <FormItem label="服务内容：" prop="content">
          <Input type="textarea" v-model="addForm.content" :autosize="{minRows: 5,maxRows: 10}" placeholder="请填写服务内容"/>
        </FormItem>
      </Form>
      <!--自定义页脚-->
      <div slot="footer">
        <Button type="text" @click="cancelAddModal">取消</Button>
        <Button type="primary" @click="doNursingServiceAdd">确认</Button>
      </div>
    </Modal>

    <!--编辑Modal-->
    <Modal v-model="isEdit" :mask-closable="false" :closable="false" title="服务编辑：" width="600">
      <Form :model="editForm" ref="editForm" :label-width="100" :rules="rules">
        <FormItem label="服务图片：" prop="imgUrl">
          <img-upload ref="imgUploadByEdit" @imgUpload="getUploadImg" @delImg="delUploadImg"></img-upload>
        </FormItem>
        <FormItem label="服务名称：" prop="name">
          <Input clearable v-model="editForm.name" placeholder="服务名称"/>
        </FormItem>
        <FormItem label="服务类型：">
          <Select clearable v-model="editForm.serviceType" placeholder="请选择服务类型" style="width: 100%">
            <Option v-for="item in types" :value="item.id" :key="item.id">{{item.name}}</Option>
          </Select>
        </FormItem>
        <FormItem label="有子服务：">
          <RadioGroup v-model="editForm.hasChild">
            <Radio v-for="item in hasChild" :label="item.label">
              <span>{{item.name}}</span>
            </Radio>
          </RadioGroup>
        </FormItem>
        <FormItem label="服务价格：" prop="price">
          <Input clearable v-model="editForm.price" placeholder="服务价格">
          <span slot="append">元</span>
          </Input>
        </FormItem>
        <FormItem label="常用项目：">
          <RadioGroup v-model="editForm.common">
            <Radio v-for="item in common" :label="item.label">
              <span>{{item.name}}</span>
            </Radio>
          </RadioGroup>
        </FormItem>
        <FormItem label="需要护士(人)：" prop="numberOfNurse">
          <InputNumber v-model="editForm.numberOfNurse" :max="10" :min="1"/>
        </FormItem>
        <FormItem label="服务内容：" prop="content">
          <Input type="textarea" v-model="editForm.content" :autosize="{minRows: 5,maxRows: 10}" placeholder="请填写服务内容"/>
        </FormItem>
      </Form>
      <!--自定义页脚-->
      <div slot="footer">
        <Button type="text" @click="cancelEditModal">取消</Button>
        <Button type="primary" @click="doNursingServiceEdit">确认</Button>
      </div>
    </Modal>

    <!--子服务-->
    <Modal v-model="isDetail" :mask-closable="false" :closable="false" :title="'('+serviceName+')子服务：'" width="1000">
      <n-p-d ref="nursingDetail" ></n-p-d>
      <!--自定义页脚-->
      <div slot="footer">
        <Button type="text" @click="isDetail = false">取消</Button>
      </div>
    </Modal>
  </div>
</template>

<script>
  import {
    findNursingService,
    doNursingServiceAdd,
    doNursingServiceEdit,
    doNursingServiceDel,
    doNursingServiceDelMany,
    findNursingServiceType
  } from "../../api/nursing";
  import {programColumns} from "../../libs/table";
  import {hasOneOf, array4tree, tools4Del, ObjectContrast} from '@/libs/tools'
  import {nursingProgramRules} from "../../libs/rules";
  import ImgUpload from '../components/img-upload/img-upload'
  import NPD from './nursing-program-detail'

  export default {
    name: "nursing-program",
    components: {
      ImgUpload,
      NPD
    },
    computed: {
      access() {
        return this.$store.state.user.access
      },
      viewAdd() {
        // return hasOneOf(['label-add'], this.access)
        return true
      },
      viewEdit() {
        // return hasOneOf(['label-edit'], this.access)
        return true
      },
      viewDel() {
        // return hasOneOf(['label-del'], this.access)
        return true
      },
      viewDelMany() {
        // return hasOneOf(['label-delMany'], this.access)
        return true
      },
      viewChild() {
        // return hasOneOf(['label-delMany'], this.access)
        return true
      },
    },
    data() {
      return {
        isAdd: false,
        isEdit: false,
        isDetail:false,
        serviceName:'',
        columns: [
          {
            title: '服务类型',
            align: 'center',
            render: (h, params) => {
              let str = ''
              this.types.forEach(v => {
                if (v.id === params.row.serviceType) {
                  str = v.name
                }
              })
              return h('span', [str])
            }
          },
          {
            title: '服务开放',
            align: 'center',
            render: (h, params) => {
              return h('div', [
                h('i-switch', {
                  props: {
                    value: params.row.flag === 1 ? true : false,
                  },
                  style: {
                    marginRight: '10px',
                    display: this.viewEdit ? 'inline-block' : 'none'
                  },
                  on: {
                    "on-change": async (v) => {
                      let data = {};
                      data.id = params.row.id ;
                      if(v){
                        data.flag = 1;
                      }else{
                        data.flag = 0;
                      }
                      let res = await doNursingServiceEdit(data)
                      if (res.code === 200) {
                        this.$Message.success('变更成功')
                        this.findNursingService(this.searchOption)
                      } else { // 添加失败
                        this.$Message.error(res.data)
                      }
                    }
                  }
                }),
                h('span', [
                  params.row.flag === 0 ? '否' : '有'
                ])
              ])
            }
          },
          {
            title: '操作',
            align: 'center',
            width: 300,
            key: 'handle',
            render: (h, params) => {
              if (this.viewChild || this.viewEdit || this.viewDel) {
                return h('div', [
                  h('Button', {
                    props: {
                      type: 'success'
                    },
                    style: {
                      marginRight: '5px',
                      display: this.viewChild && params.row.hasChild === 1 ? 'inline-block' : 'none'
                    },
                    on: {
                      click: () => {
                        this.isDetail = true
                        this.$refs.nursingDetail.serviceId = params.row.id
                        this.serviceName = params.row.name
                        this.$refs.nursingDetail.findNursingServiceDetail({serviceId:this.serviceId})
                      }
                    }
                  }, '子服务'),
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
                        params.row.price = params.row.price.toString()
                        let data = Object.assign({}, params.row)
                        this.formCopy = Object.assign({}, data)
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
                            this.doNursingServiceDel(id)
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
        addForm: {
          hasChild: 1,
          common: 1,
          numberOfNurse: 1
        },
        editForm: {},
        rules: {},
        types: [],
        hasChild: [
          {label: 1, name: '有'},
          {label: 0, name: '否'}
        ],
        common: [
          {label: 1, name: '是'},
          {label: 0, name: '否'}
        ],
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
      this.columns = programColumns.concat(this.columns)
      this.rules = nursingProgramRules
    },
    mounted() {
      this.findNursingService()
      this.findNursingServiceType()
    },
    methods: {
      //查询
      async findNursingService(params) {
        let res = await findNursingService(params)
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
      //查询
      async findNursingServiceType() {
        let res = await findNursingServiceType({size: 100})
        if (res.code === 200) {
          this.types = res.data.list
        } else {
          this.$Message.error(res.data)
        }
      },
      //添加
      async doNursingServiceAdd() {
        this.$refs.addForm.validate(async (valid) => { // 表单校验
          if (valid) { // 表单验证成功
            let form = this.addForm
            form.flag = 1
            let res = await doNursingServiceAdd(form)
            if (res.code === 200) { // 添加成功
              this.$Message.success('添加成功')
              this.findNursingService(this.searchOption)
              this.cancelAddModal()
            } else { // 添加失败
              this.$Message.error(res.message)
            }
          } else {
            this.$Message.error('请正确填写表单')
          }
        })
      },
      //编辑
      async doNursingServiceEdit() {
        this.$refs.editForm.validate(async (valid) => { // 表单校验
          if (valid) { // 表单验证成功
            let form = this.editForm
            let array = []
            array = ObjectContrast(form, this.formCopy)
            // console.log(array)
            if (array.length > 0) {
              let data = {}
              array.forEach(v => {
                data[v] = form[v]
              })
              // console.log(data)
              data.id = form.id
              let res = await doNursingServiceEdit(data)
              if (res.code === 200) {
                this.$Message.success('编辑成功')
                this.findNursingService(this.searchOption)
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
      async doNursingServiceDel(params) {
        let res = await doNursingServiceDel(params)
        if (res.code === 200) {
          this.$Message.success('删除成功')
          this.findNursingService(this.searchOption)
        } else {
          this.$Message.error(res.message)
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
              let res = await doNursingServiceDelMany(this.delId)
              if (res.code === 200) {
                this.$Message.success('删除成功')
                this.delId.ids = ''
                this.findNursingService(this.searchOption)
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
      // 获取上传图片url
      getUploadImg(url) {
        this.addForm.picUrl = url
        this.editForm.picUrl = url
      },
      delUploadImg(url) {
        this.addForm.picUrl = ''
        this.editForm.picUrl = ''
      },
      cancelAddModal() {
        this.$refs.addForm.resetFields()// 重置表单
        this.$refs.imgUpload.updateImgUrl([])
        this.addForm = {
          hasChild: 1,
          common: 1,
          numberOfNurse: 1
        }
        this.isAdd = false
      },
      // 编辑modal打开
      openEditModal(params) {
        if (params[`picUrl`] && params.picUrl !== '') {
          let list = []
          list.push({
            url: params.picUrl,
            name: '图片',
            status: 'finished'
          })
          this.$refs.imgUploadByEdit.updateImgUrl(list)
        }
        this.editForm = params
        this.isEdit = true
      },
      cancelEditModal() {
        this.$refs.editForm.resetFields()// 重置表单
        this.editForm = {}
        this.isEdit = false
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
        this.findNursingService(this.searchOption)
      },
    }
  }
</script>

<style scoped>

</style>
