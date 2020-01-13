<template>
  <div>
    <!--按钮部分-->
    <Card>
      <p slot="title">宣传教育管理</p>
      <Row>
        <Col span="2">
          <Button type="primary" class="my-btn" v-if="viewAdd" @click="isAdd = true">添加</Button>
        </Col>
        <Col span="2">
          <Button type="error" class="my-btn" v-if="viewDelMany" @click="batchDel">批量删除</Button>
        </Col>
        <Col span="3" offset="17">
          <Input clearable icon="search" v-model="searchByName" @on-change="handleSearchByName"
                 placeholder="输入宣教名搜索"/>
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
    <Modal v-model="isAdd" :mask-closable="false" :closable="false" title="宣教添加：" width="900">
      <Form :model="addForm" ref="addForm" :label-width="100" :rules="rules">
        <!--<FormItem label="宣教图片：" prop="imgUrl">-->
        <!--<img-upload ref="imgUpload" @imgUpload="getUploadImg" @delImg="delUploadImg"></img-upload>-->
        <!--</FormItem>-->
        <FormItem label="宣教名称：" prop="name">
          <Input clearable v-model="addForm.name" placeholder="宣教名称"/>
        </FormItem>
        <FormItem label="简要描述：" prop="shortDesc">
          <Input type="textarea" clearable v-model="addForm.shortDesc" placeholder="简要描述"/>
        </FormItem>
        <FormItem label="宣教内容：" prop="content">
          <editor ref="addEditor" @getContent="getContent"></editor>
        </FormItem>
      </Form>
      <!--自定义页脚-->
      <div slot="footer">
        <Button type="text" @click="cancelAddModal">取消</Button>
        <Button type="primary" @click="doHealthEducationAdd">确认</Button>
      </div>
    </Modal>

    <!--编辑Modal-->
    <Modal v-model="isEdit" :mask-closable="false" :closable="false" title="宣教编辑：" width="900">
      <Form :model="editForm" ref="editForm" :label-width="100" :rules="rules">
        <!--<FormItem label="宣教图片：" prop="imgUrl">-->
        <!--<img-upload ref="imgUploadByEdit" @imgUpload="getUploadImg" @delImg="delUploadImg"></img-upload>-->
        <!--</FormItem>-->
        <FormItem label="宣教名称：" prop="name">
          <Input clearable v-model="editForm.name" placeholder="宣教名称"/>
        </FormItem>
        <FormItem label="简要描述：" prop="shortDesc">
          <Input type="textarea" clearable v-model="editForm.shortDesc" placeholder="简要描述"/>
        </FormItem>
        <FormItem label="宣教内容：" prop="content">
          <editor ref="editEditor" @getContent="getContent"></editor>
        </FormItem>
      </Form>
      <!--自定义页脚-->
      <div slot="footer">
        <Button type="text" @click="cancelEditModal">取消</Button>
        <Button type="primary" @click="doHealthEducationEdit">确认</Button>
      </div>
    </Modal>

    <!--标签添加-->
    <Modal v-model="isLabel" :mask-closable="false" :closable="false" title="标签编辑：" width="600">
      <Card>
        <p slot="title">标签：</p>
        <Row>
          <Col span="12">
            <Cascader :data="labelData" filterable v-model="labelForm.labelCas" placeholder="选择标签"></Cascader>
          </Col>
          <Col span="4" offset="1">
            <Button type="primary" @click="doLabelAddById">添加</Button>
          </Col>
        </Row>
      </Card>
      <Card>
        <p slot="title">已有标签</p>
        <Tag type="border" closable color="default" v-for="(item,index) in labelArray" :key="item.id"
        :name="item.content" @on-close="doLabelDelById(item.id,index)">{{item.content}}
        </Tag>
      </Card>
      <!--自定义页脚-->
      <div slot="footer">
        <Button type="text" @click="cancelLabelModal">返回</Button>
      </div>
    </Modal>
  </div>
</template>

<script>
  import {educationColumns} from "../../libs/table";
  import {hasOneOf, array4tree, tools4Del, ObjectContrast} from '@/libs/tools'
  import {
    findHealthEducation,
    doHealthEducationDelMany,
    doHealthEducationAdd,
    doHealthEducationEdit,
    doHealthEducationDel,
    findLabelById,
    doLabelAddById,
    doLabelDelById
  } from "../../api/education";
  import {findLabel} from "../../api/labels";

  import Editor from '../components/editor/editor'

  export default {
    name: "publicity-education",
    components: {
      Editor
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
    },
    data() {
      return {
        isAdd: false,
        isEdit: false,
        isLabel: false,
        columns: [
          {
            title: '操作',
            align: 'center',
            width: 300,
            key: 'handle',
            render: (h, params) => {
              if (this.viewEdit || this.viewDel) {
                return h('div', [
                  h('Button', {
                    props: {
                      type: 'warning'
                    },
                    style: {
                      marginRight: '5px',
                    },
                    on: {
                      click: () => {
                        let data = Object.assign({}, params.row)
                        this.openLabelModal(data)
                      }
                    }
                  }, '标签'),
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
                            this.doHealthEducationDel(id)
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
        labelData: [],
        labelArray: [],
        addForm: {},
        editForm: {},
        labelForm: {},
        rules: {
          name: [
            {required: true, message: '宣教名称不能为空', trigger: 'blur'},
            {max: 15, message: '请输入25个以内字符', trigger: 'blur'},
          ],
          shortDesc: [
            {required: true, message: '宣教名称不能为空', trigger: 'blur'},
            {max: 100, message: '请输入100个以内字符', trigger: 'blur'},
          ]
        },
        types: [],
        // 批量选择的id对象
        delId: {
          ids: ''
        },
        searchByName: '',
        page: {// 页面翻页对象
          total: 1, // 数据总数
          currentPage: 1// 当前页面
        },
        resArray:[],//label原始数据
        formCopy: {},
        searchOption: {} // 查询用参数
      }
    },
    created() {
      this.columns = educationColumns.concat(this.columns)
    },
    mounted() {
      this.findHealthEducation()
      this.findLabel()
    },
    methods: {
      //查询
      async findHealthEducation(params) {
        let res = await findHealthEducation(params)
        if (res.code === 200) {
          this.tableData = res.data.list
          this.page = {
            total: res.data.total,
            currentPage: res.data.pageNum
          }
        } else {
          this.$Message.error(res.message)
        }
      },
      //获取标签
      async findLabel() {
        let res = await findLabel({size: 100})
        if (res.code === 200) {
          this.resArray = JSON.parse(JSON.stringify(res.data.list))
          this.labelData = array4tree(v => {
            v.label = v.content
            v.value = v.id
          }, res.data.list)
        } else {
          this.$Message.error(res.data)
        }
      },
      //获取标签关系
      async findLabelById(id) {
        let res = await findLabelById({id: id,size:100})
        if (res.code === 200) {
          this.labelArray = res.data.list
        } else {
          this.$Message.error(res.data)
        }
      },
      //添加标签
      async doLabelAddById() {
        if(this.labelForm[`labelCas`] && this.labelForm.labelCas.length >0 ){
          let labelId = this.labelForm.labelCas[this.labelForm.labelCas.length-1]
          let form = {
            labelId : labelId,
            id:this.labelForm.id,
          }
          let res = await doLabelAddById(form)
          if (res.code === 200) {
            this.$Message.success('添加成功')
            this.resArray.forEach(v => {
              if (v.id == labelId) this.labelArray.push(v)
            })
            this.labelForm.labelCas = []
          } else {
            this.$Message.error(res.message)
          }
        }
      },
      // 删除标签
      async doLabelDelById (labelId, index) {
        let data = {
          labelId : labelId ,
          id: this.labelForm.id
        }
        let res = await doLabelDelById(data)
        if (res.code === 200) {
          this.$Message.success('删除成功')
          this.labelArray.splice(index, 1)
        } else {
          this.$Message.error(res.message)
        }
      },
      //添加
      async doHealthEducationAdd() {
        this.$refs.addForm.validate(async (valid) => { // 表单校验
          if (valid) { // 表单验证成功
            let form = this.addForm
            // console.log(form)
            let res = await doHealthEducationAdd(form)
            if (res.code === 200) { // 添加成功
              this.$Message.success('添加成功')
              this.findHealthEducation(this.searchOption)
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
      async doHealthEducationEdit() {
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
              let res = await doHealthEducationEdit(data)
              if (res.code === 200) {
                this.$Message.success('编辑成功')
                this.findHealthEducation(this.searchOption)
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
      async doHealthEducationDel(params) {
        let res = await doHealthEducationDel(params)
        if (res.code === 200) {
          this.$Message.success('删除成功')
          this.findHealthEducation(this.searchOption)
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
              let res = await doHealthEducationDelMany(this.delId)
              if (res.code === 200) {
                this.$Message.success('删除成功')
                this.delId.ids = ''
                this.findHealthEducation(this.searchOption)
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
      cancelAddModal() {
        this.$refs.addForm.resetFields()// 重置表单
        this.$refs.addEditor.changeContent()
        this.addForm = {}
        this.isAdd = false
      },
      // 编辑modal打开
      openEditModal(params) {
        this.editForm = params
        this.$refs.editEditor.setContent(params.content)
        this.isEdit = true
      },
      cancelEditModal() {
        this.$refs.editForm.resetFields()// 重置表单
        this.$refs.editEditor.changeContent()
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
      openLabelModal(params) {
        this.labelForm.id = params.id
        this.findLabelById(this.labelForm.id)
        this.isLabel = true
      },
      cancelLabelModal() {
        this.isLabel = false
        this.labelArray = []
        this.labelForm = {}
      },
      //根据名查询
      handleSearchByName() {
        if (this.searchByName) { // 判断搜索条件是否为空
          this.searchOption.name = this.searchByName
        } else { // 重置搜索内容
          this.searchOption.name = ''
        }
        this.searchOption.page = 1 // 初始化页数
        this.findHealthEducation(this.searchOption)
      },
      getContent(html) {
        this.addForm.content = html
        this.editForm.content = html
      },
      // 页面翻页
      handlePageTurn(page) {
        this.searchOption.page = page
        this.findHealthEducation(this.searchOption)
      }
    }
  }
</script>

<style scoped>

</style>
